[README.md](https://github.com/user-attachments/files/32816636/README.md)
# 🎙️ ngd-voice-assistant

> **Ambient, low-latency conversational AI voice assistant & multi-modal chatbot for smart workspaces**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ngd-ai/ngd-voice-assistant?style=flat&color=6366f1)](https://github.com/ngd-ai/ngd-voice-assistant/stargazers)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://python.org)
[![Version](https://img.shields.io/badge/version-v1.0.0-emerald.svg)](https://github.com/ngd-ai/ngd-voice-assistant/releases)
[![Latency](https://img.shields.io/badge/voice_latency-%3C%20150ms-orange.svg)](https://github.com/ngd-ai/ngd-voice-assistant)
[![Google Chat Enabled](https://img.shields.io/badge/Google_Chat-Connected-4285F4.svg?logo=googlechat&logoColor=white)](https://workspace.google.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🌟 Overview

**ngd-voice-assistant** (Aura) is an ambient, intelligent voice assistant built for developers, power users, and enterprise workspaces. It combines continuous streaming audio capture, local voice activity detection (VAD), lightning-fast speech-to-text, reasoning models, and expressive neural speech synthesis to deliver a hands-free conversational experience with sub-second turnaround times.

Whether orchestrating workspace actions, dispatching Google Chat updates, controlling smart peripherals, or coding via voice commands, Aura blends seamlessly into your workflow.

---

## ✨ Key Capabilities

- **Multi-turn Gemini 3 Chatbot with customizable reasoning & system instructions**: Multi-turn Gemini 3 Chatbot with customizable reasoning & system instructions
- **Google Search Grounding for real-time web verification & citations**: Google Search Grounding for real-time web verification & citations
- **Google Maps Grounding for live geospatial discovery & place routing**: Google Maps Grounding for live geospatial discovery & place routing
- **High-accuracy audio transcription via Gemini 3.5 Transcribe**: High-accuracy audio transcription via Gemini 3.5 Transcribe
- **Live bidirectional voice conversations powered by Gemini 3.8 Live API**: Live bidirectional voice conversations powered by Gemini 3.8 Live API
- **Creative image generation & editing with Gemini 3.1 Flash Image**: Creative image generation & editing with Gemini 3.1 Flash Image
- **AI music generation powered by Lyria Audio Core**: AI music generation powered by Lyria Audio Core
- **Bi-directional Google Chat workspace broadcast with confirmation dialogs**: Bi-directional Google Chat workspace broadcast with confirmation dialogs

---

## 🏗️ Architecture & Voice Pipeline

```
+------------------+      +-------------------+      +-----------------------+
|  Microphone In   | ---> |  Silero VAD 4.0   | ---> | Streaming Whisper STT |
|  (48kHz / 16-bit)|      |  Voice Detection  |      | Chunked Audio Stream  |
+------------------+      +-------------------+      +-----------------------+
                                                                 |
                                                                 v
+------------------+      +-------------------+      +-----------------------+
|  Neural Speaker  | <--- | Fast Neural TTS   | <--- |   Orchestration Core  |
|  Audio Playback  |      | Piper / Kokoro    |      | Context Memory + LLM  |
+------------------+      +-------------------+      +-----------------------+
                                                                 |
                                                                 v
                                                     +-----------------------+
                                                     | Google Chat & Actions |
                                                     | Webhooks, Workspace   |
                                                     +-----------------------+
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10 or higher
- System audio libraries (`portaudio`, `ffmpeg`)
- A working microphone and speaker setup

### 2. Instant Setup

```bash
# Clone the repository
git clone https://github.com/ngd-ai/ngd-voice-assistant.git
cd ngd-voice-assistant

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure your environment
cp .env.example .env
# Edit .env and insert your API keys (GEMINI_API_KEY, etc.)
```

### 3. Launch Aura Assistant

```bash
# Test microphone and sound pipeline
python -m aura.cli test-audio

# Start interactive voice mode
python -m aura.cli start --wake-word "Hey NGD"
```

Say **"Hey NGD"** aloud, followed by your command!

---

## 💻 Python SDK Usage

You can also embed Aura directly into your own applications:

```python
import asyncio
from aura import AuraAssistant, VoicePipelineConfig

async def main():
    config = VoicePipelineConfig(
        wake_word="Hey NGD",
        voice_preset="nova-expressive",
        enable_workspace_sync=True,
    )
    
    assistant = AuraAssistant(config=config)
    
    # Register a custom voice skill
    @assistant.on_intent("post_to_chat")
    async def handle_chat_post(intent):
        print(f"Sharing message to Google Chat: {intent.text}")
        await assistant.integrations.google_chat.send_message(
            space_id="spaces/YOUR_SPACE",
            text=intent.text
        )

    print("🎙️ Aura is listening...")
    await assistant.listen_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 🔧 Configuration (`aura.config.yaml`)

```yaml
assistant:
  name: "Aura"
  wake_word: "Hey NGD"
  sensitivity: 0.75
  language: "en-US"

audio:
  sample_rate: 48000
  channels: 1
  vad_threshold: 0.5
  noise_suppression: true

models:
  stt: "whisper-base.en"       # options: whisper-tiny, base, small, cloud-stt
  tts: "piper-neural-v2"       # options: piper, kokoro, cloud-tts
  llm: "gemini-2.5-flash"      # options: gemini-2.5-flash, gemini-2.5-pro, local-ollama

integrations:
  google_chat:
    enabled: true
    default_space: "spaces/WORKSPACE_DEFAULT"
```

---

## 📖 Documentation
- [Comprehensive Installation Manual](INSTALLATION.md) (macOS, Linux, Windows, Docker)
- [Voice Skill Development Guide](docs/SKILLS.md)
- [Google Chat Integration Setup](docs/GOOGLE_CHAT.md)
- [Audio Benchmarks & Latency Tuning](docs/BENCHMARKS.md)

---

## 🤝 Contributing

Contributions are warmly welcomed! Please see our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingSkill`)
3. Commit your Changes (`git commit -m 'Add AmazingSkill'`)
4. Push to the Branch (`git push origin feature/AmazingSkill`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **Apache-2.0** License - see the [LICENSE](LICENSE) file for complete terms, conditions, and patent grants.

Copyright (c) 2026 NGD AI Open Source Contributors.
