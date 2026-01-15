# Chronos: Autonomous Gemini Code Runner

**Chronos** allows you to run **Google Gemini** tasks autonomously. It handles rate limits (using a Token Bucket algorithm) and waits for credit resets, so your tasks continue running while you sleep—no intervention needed.

![Logo](website/public/logo.png)

## Features

- **Autonomous Execution**: Run long-lived coding tasks without babysitting.
- **Token Bucket Rate Limiting**: Smart compliance with Gemini's 60 RPM limit.
- **Resumable Sessions**: Pick up exactly where you left off.
- **YOLO Mode**: Skip permissions and run fully autonomously.
- **Full Transcripts**: Every session is logged for later review.

## Installation

### macOS / Linux / WSL

```bash
curl -fsSL https://raw.githubusercontent.com/farhanmir/Chronos/main/install.sh | bash
```

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/farhanmir/Chronos/main/install.ps1 | iex
```

### Direct Download

You can also download binaries directly from the [releases page](https://github.com/farhanmir/Chronos/releases):

- `chronos-windows-x64.exe` — Windows
- `chronos-macos-arm64` — macOS Apple Silicon
- `chronos-macos-x64` — macOS Intel
- `chronos-linux-x64` — Linux x64

## Quick Start

### Single Prompt

Run a single large task:

```bash
chronos run "Build a full-stack todo app with React, Express, PostgreSQL, and authentication" --yolo
```

### Specify Project Directory

```bash
chronos run "Add dark mode support" --dir ./my-project --yolo
```

### Check Session Status

```bash
chronos status
```

### Clear Session (Start Fresh)

```bash
chronos clear
```

## CLI Reference

```
Usage: chronos [OPTIONS] COMMAND [ARGS]...

Commands:
  run     Run a task with Gemini (main command)
  status  Show the status of the current session
  clear   Clear the current session
  resume  Resume after crash (emergency recovery only)

Run Options:
  PROMPT                    The prompt to send to Gemini
  --yolo                    Autonomous mode (skip permissions, auto-continue)
  -f, --file PATH           Read prompt from a file
  -d, --dir PATH            Project directory (default: current)
  -v, --verbose             Verbose output
```

## Requirements

- **Google Gemini CLI** installed and authenticated.
- A Gemini API key (or appropriate authentication).

## Authentication

Chronos uses your existing Gemini authentication. Before using Chronos:

1. Ensure the Gemini CLI is installed.
2. Run `gemini` once to verify authentication.

## License

MIT
