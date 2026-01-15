"""Core automation runner using Gemini CLI."""

import json
import os
import signal
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Iterator, Optional

from rich.console import Console
from rich.panel import Panel
from rich.spinner import Spinner

from chronos.config import CHRONOS_TASK_COMPLETE_GEMINI
from chronos.session import Session, SessionManager
from chronos.transcript import TranscriptWriter

console = Console()

# System prompt appended for completion detection (if supported)
SYSTEM_PROMPT_APPEND = f"""

CRITICAL INSTRUCTION: When you have fully completed ALL tasks and there is absolutely nothing left to do, you MUST output this exact completion marker on its own line:

{CHRONOS_TASK_COMPLETE_GEMINI}

Output this marker ONLY when you are 100% finished with everything requested.
"""


class TokenBucket:
    """
    Token Bucket implementation for rate limiting.
    Capacity: 60 tokens (burst size)
    Refill Rate: 1 token/second (60 RPM)
    """
    def __init__(self, capacity: int = 60, refill_rate: float = 1.0):
        self.capacity = capacity
        self.tokens = float(capacity)
        self.refill_rate = refill_rate
        self.last_update = time.time()
    
    def _refill(self):
        now = time.time()
        delta = now - self.last_update
        self.tokens = min(self.capacity, self.tokens + delta * self.refill_rate)
        self.last_update = now
    
    def acquire(self, tokens: int = 1) -> bool:
        """Attempt to acquire tokens. Blocks if necessary."""
        while True:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            
            # Wait for enough tokens
            needed = tokens - self.tokens
            wait_time = needed / self.refill_rate
            time.sleep(min(wait_time, 1.0))  # Sleep but check periodically


class ChronosRunner:
    """
    Main runner that orchestrates Gemini Code automation.
    """
    
    def __init__(
        self,
        project_dir: str,
        yolo: bool = False,
        verbose: bool = False,
    ):
        self.project_dir = Path(project_dir).resolve()
        self.yolo = yolo
        self.verbose = verbose
        
        self.session_manager = SessionManager(str(self.project_dir))
        self.session: Optional[Session] = None
        self.transcript: Optional[TranscriptWriter] = None
        
        # Token bucket for 60 RPM
        self.rate_limiter = TokenBucket(capacity=60, refill_rate=1.0)
        
        # Buffer for accumulating output text
        self.output_buffer = ""
        
        # Flag for graceful shutdown
        self._shutdown_requested = False
    
    def _setup_signal_handlers(self) -> None:
        """Set up signal handlers for graceful shutdown."""
        def handle_signal(signum, frame):
            self._shutdown_requested = True
            console.print("\n[yellow]Shutdown requested, saving session...[/yellow]")
            self._save_session()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, handle_signal)
        signal.signal(signal.SIGTERM, handle_signal)
    
    def _build_command(self, prompt: str) -> list:
        """Build the Gemini CLI command."""
        # Assuming 'gemini' is the command.
        # If --yolo is set, we might want to pass some auto-confirm flag if it existed.
        # For now, we'll just construct the basic command.
        
        cmd = ["gemini"]
        
        # If there's a specific flag for completion or system prompt, we'd add it here.
        # Assuming we just append the system prompt to the user prompt for now.
        full_promt = prompt + SYSTEM_PROMPT_APPEND
        
        cmd.append(full_promt)
        
        return cmd
    
    def _run_gemini(self, prompt: str) -> tuple[str, bool]:
        """
        Run Gemini CLI and process output.
        
        Returns:
            (output_text, is_complete)
        """
        # Acquire rate limit token
        self.rate_limiter.acquire()
        
        cmd = self._build_command(prompt)
        
        if self.verbose:
            console.print(f"[dim]Running Gemini...[/dim]")
        
        self.output_buffer = ""
        is_complete = False
        
        try:
            process = subprocess.Popen(
                cmd,
                cwd=str(self.project_dir),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                encoding='utf-8',
                shell=(os.name == 'nt') # Fix for Windows resolving .cmd/.ps1
            )
            
            # Process streaming output
            for line in iter(process.stdout.readline, ''):
                if self._shutdown_requested:
                    process.terminate()
                    break
                
                if not line:
                    continue
                
                # Print output directly
                try:
                    # Try rich first
                    console.print(line, end="")
                except:
                    # Fallback to absolute basics
                    try:
                        sys.stdout.write(line)
                        sys.stdout.flush()
                    except:
                        # Even if that fails, just continue so we don't crash the loop
                        pass
                self.output_buffer += line
            
            process.wait()
            
            # Check for completion
            if CHRONOS_TASK_COMPLETE_GEMINI in self.output_buffer:
                is_complete = True
            
        except Exception as e:
            console.print(f"\n[red]Error running Gemini: {e}[/red]")
            if self.verbose:
                import traceback
                console.print(traceback.format_exc())
        
        return self.output_buffer, is_complete
    
    def _save_session(self) -> None:
        """Save current session state."""
        if self.session:
            self.session.last_output_chunk = self.output_buffer[-2000:] if self.output_buffer else ""
            self.session_manager.save(self.session)
    
    def run(
        self,
        prompt: Optional[str] = None,
        resume: bool = False,
    ) -> bool:
        """
        Run the automation loop.
        """
        self._setup_signal_handlers()
        
        # Load or create session
        if resume:
            self.session = self.session_manager.load()
            if not self.session:
                console.print("[red]No existing session found to resume.[/red]")
                return False
            console.print(f"[green]Resuming session {self.session.session_id}...[/green]")
            prompt = self.session.get_current_prompt()
        else:
            if not prompt:
                console.print("[red]No prompt provided.[/red]")
                return False
            
            # Check for existing session
            if self.session_manager.exists():
                existing = self.session_manager.load()
                if existing and existing.status not in ("completed", "failed"):
                    if not self.yolo: # Skip check if YOLO
                        console.print(
                            f"[yellow]Existing session found ({existing.session_id}). "
                            f"Use --resume to continue or --force to start fresh.[/yellow]"
                        )
                        return False
            
            self.session = self.session_manager.create_new(prompt=prompt)
            console.print(f"[green]Created session {self.session.session_id}[/green]")
        
        # Create transcript
        self.transcript = TranscriptWriter(str(self.project_dir), self.session.session_id)
        
        # Print banner
        console.print(
            Panel(
                f"[bold]Chronos[/bold] - Autonomous Gemini Runner\n\n"
                f"Session: {self.session.session_id}\n"
                f"Project: {self.project_dir}\n"
                f"Mode: {'YOLO (Autonomous)' if self.yolo else 'Safe'}",
                title="Starting",
                border_style="blue",
            )
        )
        
        original_prompt = self.session.get_current_prompt()
        is_continuation = self.session.cycle_count > 0 or resume
        
        # Main automation loop
        while not self._shutdown_requested:
            self.session.status = "running"
            self._save_session()
            
            if self.transcript:
                self.transcript.log_prompt(
                    original_prompt,
                    self.session.get_current_prompt_name(),
                )
            
            console.print(f"\n[blue]{'Continuing' if is_continuation else 'Sending'} prompt...[/blue]\n")
            console.print("─" * 60)
            
            # Run Gemini
            output, is_complete = self._run_gemini(original_prompt)
            
            console.print("\n" + "─" * 60)
            
            # Log output
            if self.transcript:
                self.transcript.log_output(output)
            
            # Handle result
            if is_complete:
                has_more = self.session.mark_current_complete()
                self._save_session()
                
                if self.transcript:
                    self.transcript.log_complete(self.session.get_current_prompt_name())
                
                if has_more:
                    console.print(
                        f"\n[green]✓ Task complete. Moving to next prompt...[/green]"
                    )
                    is_continuation = False
                    original_prompt = self.session.get_current_prompt()
                    continue
                else:
                    console.print(
                        Panel(
                            "[bold green]All tasks completed![/bold green]\n\n"
                            f"Session: {self.session.session_id}\n"
                            f"Transcript: {self.transcript.get_path()}",
                            title="✅ Complete",
                            border_style="green",
                        )
                    )
                    if self.transcript:
                        self.transcript.log_session_end("completed")
                    return True
            
            else:
                # Process exited without completion marker
                # In YOLO mode, we might just loop? But we don't know *why* it exited.
                # It might have just answered the question without the marker.
                # Or it crashed.
                console.print(
                    "\n[yellow]Gemini exited without completion marker.[/yellow]"
                )
                
                self.session.status = "uncertain"
                self._save_session()
                
                if self.transcript:
                    self.transcript.log_error("Exited without completion marker")
                    self.transcript.log_session_end("uncertain")
                
                if self.yolo:
                    console.print("[red]YOLO mode: Terminating as completion was not detected.[/red]")
                    # For safety, even in YOLO, if we don't know what happened, we stop.
                    # Unless we want to auto-retry? But retry with what prompt?
                    # "Continue"?
                    # Let's try to Auto-Continue ONCE if YOLO?
                    # No, user didn't ask for auto-retry loop logic, just 'autonomous execution' which often implies skipping confirmations.
                
                return False
        
        return False
    
    def run_sequence(self, prompts: list) -> bool:
        """Run a sequence of prompts."""
        self._setup_signal_handlers()
        
        self.session = self.session_manager.create_new(prompts=prompts)
        console.print(f"[green]Created sequence session {self.session.session_id}[/green]")
        
        self.transcript = TranscriptWriter(str(self.project_dir), self.session.session_id)
        
        return self.run(prompt=self.session.get_current_prompt())
