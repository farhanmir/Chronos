"""Configuration constants for Chronos."""

# The unique completion code that Gemini will output when done
# This is injected via --append-system-prompt (if supported) or manually
CHRONOS_TASK_COMPLETE_GEMINI = "<<<CHRONOS_TASK_COMPLETE_GEMINI>>>"

# Session file location (relative to project directory)
SESSION_DIR = ".chronos"
SESSION_FILE = "session.json"
TRANSCRIPT_DIR = "transcripts"
