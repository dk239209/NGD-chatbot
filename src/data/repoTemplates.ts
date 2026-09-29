/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RepoConfig, LicenseInfo, ScaffoldingFile } from '../types/repo';

export const DEFAULT_REPO_CONFIG: RepoConfig = {
  repoName: 'ngd-multi-task-bot',
  ownerName: 'ngd-ai',
  tagline: 'Ambient, low-latency conversational AI voice assistant & multi-task chatbot for smart workspaces',
  description:
    'NGD is a high-performance, open-source AI voice assistant and multi-modal chatbot featuring ultra-fast streaming speech-to-text, neural TTS, Google Search & Maps Grounding, live voice conversations, image studio, and Google Chat integration.',
  version: '1.0.0',
  licenseType: 'Apache-2.0',
  authorName: 'NGD AI Open Source Contributors',
  authorEmail: 'maintainers@ngdvoice.io',
  year: '2026',
  primaryLanguage: 'Python',
  wakeWord: 'Hey NGD',
  latencyGoal: '< 150ms',
  features: [
    'Multi-turn Gemini 3 Chatbot with customizable reasoning & system instructions',
    'Google Search Grounding for real-time web verification & citations',
    'Google Maps Grounding for live geospatial discovery & place routing',
    'High-accuracy audio transcription via Gemini 3.5 Transcribe',
    'Live bidirectional voice conversations powered by Gemini 3.8 Live API',
    'Creative image generation & editing with Gemini 3.1 Flash Image',
    'AI music generation powered by Lyria Audio Core',
    'Bi-directional Google Chat workspace broadcast with confirmation dialogs',
  ],
  topics: [
    'ngd',
    'voice-assistant',
    'gemini-chatbot',
    'search-grounding',
    'maps-grounding',
    'audio-transcribe',
    'live-api',
    'image-generation',
    'lyria-music',
    'google-chat',
    'python',
    'webrtc',
  ],
};

export const LICENSES: Record<string, LicenseInfo> = {
  'Apache-2.0': {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    badgeUrl: 'https://img.shields.io/badge/License-Apache_2.0-blue.svg',
    summary:
      'A permissive license that also provides an express grant of patent rights from contributors to users, trademark protection, and clear commercial usage terms.',
    permissions: [
      'Commercial use',
      'Modification and adaptation',
      'Distribution of source and binaries',
      'Patent grant protection for all users and contributors',
      'Private/internal deployment',
    ],
    conditions: [
      'License and copyright notice must be retained',
      'State changes made to modified files',
      'Include copy of the Apache-2.0 license',
      'Include NOTICE file if present in original code',
    ],
    limitations: [
      'No liability or warranty provided',
      'No trademark rights granted (names/logos protected)',
    ],
    whyRecommendedForAura:
      'Apache 2.0 is the gold standard for modern AI and voice software. Because voice assistants often interact with proprietary audio hardware, neural codecs, and enterprise systems, Apache 2.0 provides critical explicit patent grants preventing IP trolling while protecting your trademark names.',
    fullTextTemplate: (author: string, year: string, repoName: string) => `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      shall any Contributor be liable to You for damages, including any
      direct, indirect, special, incidental, or exemplary damages of any
      character arising as a result of this License or out of the use or
      inability to use the Work.

   Copyright ${year} ${author}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`,
  },

  MIT: {
    id: 'MIT',
    name: 'MIT License',
    badgeUrl: 'https://img.shields.io/badge/License-MIT-yellow.svg',
    summary:
      'A short, simple permissive license with very few restrictions. Anyone can use, modify, distribute, or sell the software.',
    permissions: [
      'Commercial use',
      'Modification',
      'Distribution',
      'Private use',
      'Sublicensing',
    ],
    conditions: ['Include copyright notice and this permission notice in all copies'],
    limitations: ['No liability', 'No warranty'],
    whyRecommendedForAura:
      'Great for maximum community adoption and effortless integration into third-party libraries and npm/PyPI packages.',
    fullTextTemplate: (author: string, year: string, _repo: string) => `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
  },

  'GPL-3.0': {
    id: 'GPL-3.0',
    name: 'GNU General Public License v3.0',
    badgeUrl: 'https://img.shields.io/badge/License-GPLv3-blue.svg',
    summary:
      'A strong copyleft license that guarantees the freedom to share and change all versions of a program, ensuring derivatives remain open source.',
    permissions: [
      'Commercial use',
      'Modification',
      'Distribution',
      'Patent grant protection',
    ],
    conditions: [
      'Disclose source code of modifications',
      'Same license (GPLv3) on derivatives',
      'State changes made',
      'Installation information provided on hardware',
    ],
    limitations: ['No liability', 'No warranty'],
    whyRecommendedForAura:
      'Ensures that any company or individual who extends Aura must contribute back their improvements to the open source community.',
    fullTextTemplate: (author: string, year: string, repo: string) => `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) ${year} ${author} <maintainers@${repo}.org>

Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.

Preamble
The GNU General Public License is a free, copyleft license for
software and other kinds of works.

When we speak of free software, we are referring to freedom, not
price. Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
`,
  },

  'BSD-3-Clause': {
    id: 'BSD-3-Clause',
    name: 'BSD 3-Clause "New" or "Revised" License',
    badgeUrl: 'https://img.shields.io/badge/License-BSD_3--Clause-blue.svg',
    summary:
      'A permissive license similar to MIT with a specific non-endorsement clause prohibiting the use of author names for marketing without permission.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: [
      'Include original copyright notice',
      'Do not use author name to endorse or promote derived products without written consent',
    ],
    limitations: ['No liability', 'No warranty'],
    whyRecommendedForAura:
      'Protects the identity and brand of the Aura project maintainers from unauthorized commercial endorsements.',
    fullTextTemplate: (author: string, year: string, _repo: string) => `BSD 3-Clause License

Copyright (c) ${year}, ${author}
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
`,
  },
};

export function generateReadme(config: RepoConfig): string {
  const licenseBadge = LICENSES[config.licenseType]?.badgeUrl || 'https://img.shields.io/badge/License-Apache_2.0-blue.svg';

  return `# 🎙️ ${config.repoName}

> **${config.tagline}**

[![License: ${config.licenseType}](${licenseBadge})](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/${config.ownerName}/${config.repoName}?style=flat&color=6366f1)](https://github.com/${config.ownerName}/${config.repoName}/stargazers)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://python.org)
[![Version](https://img.shields.io/badge/version-v${config.version}-emerald.svg)](https://github.com/${config.ownerName}/${config.repoName}/releases)
[![Latency](https://img.shields.io/badge/voice_latency-${encodeURIComponent(config.latencyGoal)}-orange.svg)](https://github.com/${config.ownerName}/${config.repoName})
[![Google Chat Enabled](https://img.shields.io/badge/Google_Chat-Connected-4285F4.svg?logo=googlechat&logoColor=white)](https://workspace.google.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🌟 Overview

**${config.repoName}** (Aura) is an ambient, intelligent voice assistant built for developers, power users, and enterprise workspaces. It combines continuous streaming audio capture, local voice activity detection (VAD), lightning-fast speech-to-text, reasoning models, and expressive neural speech synthesis to deliver a hands-free conversational experience with sub-second turnaround times.

Whether orchestrating workspace actions, dispatching Google Chat updates, controlling smart peripherals, or coding via voice commands, Aura blends seamlessly into your workflow.

---

## ✨ Key Capabilities

${config.features.map((f) => `- **${f.split('(')[0].trim()}**: ${f}`).join('\n')}

---

## 🏗️ Architecture & Voice Pipeline

\`\`\`
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
\`\`\`

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10 or higher
- System audio libraries (\`portaudio\`, \`ffmpeg\`)
- A working microphone and speaker setup

### 2. Instant Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Configure your environment
cp .env.example .env
# Edit .env and insert your API keys (GEMINI_API_KEY, etc.)
\`\`\`

### 3. Launch Aura Assistant

\`\`\`bash
# Test microphone and sound pipeline
python -m aura.cli test-audio

# Start interactive voice mode
python -m aura.cli start --wake-word "${config.wakeWord}"
\`\`\`

Say **"${config.wakeWord}"** aloud, followed by your command!

---

## 💻 Python SDK Usage

You can also embed Aura directly into your own applications:

\`\`\`python
import asyncio
from aura import AuraAssistant, VoicePipelineConfig

async def main():
    config = VoicePipelineConfig(
        wake_word="${config.wakeWord}",
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
\`\`\`

---

## 🔧 Configuration (\`aura.config.yaml\`)

\`\`\`yaml
assistant:
  name: "Aura"
  wake_word: "${config.wakeWord}"
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
\`\`\`

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
2. Create your Feature Branch (\`git checkout -b feature/AmazingSkill\`)
3. Commit your Changes (\`git commit -m 'Add AmazingSkill'\`)
4. Push to the Branch (\`git push origin feature/AmazingSkill\`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **${config.licenseType}** License - see the [LICENSE](LICENSE) file for complete terms, conditions, and patent grants.

Copyright (c) ${config.year} ${config.authorName}.
`;
}

export function generateInstallationGuide(config: RepoConfig): string {
  return `# 📦 Installation Guide for ${config.repoName}

This document provides step-by-step instructions for setting up **${config.repoName}** across macOS, Linux, Windows, and containerized Docker environments.

---

## 📋 System Requirements

| Component | Minimum | Recommended |
| :--- | :--- | :--- |
| **Operating System** | macOS 12+, Ubuntu 20.04+, Windows 10/11 | macOS Sonoma / Ubuntu 24.04 LTS |
| **Python** | 3.10.x | 3.11.x or 3.12.x |
| **RAM** | 4 GB | 8 GB+ (16 GB for offline local LLMs) |
| **Audio Hardware** | Standard USB/Built-in Mic & Speaker | Cardioid USB Mic + Headset/Noise-cancelling mic |
| **Disk Space** | 1.5 GB | 5 GB (with pre-downloaded neural voice models) |

---

## 🍎 1. macOS Setup (Apple Silicon & Intel)

### Step 1.1: Install System Dependencies via Homebrew
Ensure [Homebrew](https://brew.sh) is installed, then run:

\`\`\`bash
brew update
brew install portaudio ffmpeg git
\`\`\`

*Note for Apple Silicon (M1/M2/M3/M4):*
Ensure your environment compiler flags locate Homebrew's \`portaudio\`:

\`\`\`bash
export CFLAGS="-I$(brew --prefix portaudio)/include"
export LDFLAGS="-L$(brew --prefix portaudio)/lib"
\`\`\`

### Step 1.2: Clone & Configure Python Environment

\`\`\`bash
git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Upgrade packaging tools
pip install --upgrade pip setuptools wheel

# Install Aura core and audio bindings
pip install -r requirements.txt
\`\`\`

### Step 1.3: Grant Microphone Permissions
On macOS, your terminal application (Terminal.app, iTerm2, or VS Code) requires microphone permissions:
1. Open **System Settings** > **Privacy & Security** > **Microphone**.
2. Toggle on permission for your terminal.

---

## 🐧 2. Linux Setup (Ubuntu / Debian / Fedora / Arch)

### Step 2.1: Install Audio Development Libraries

**On Ubuntu / Debian / Pop!_OS:**
\`\`\`bash
sudo apt update
sudo apt install -y \\
  python3-dev \\
  python3-venv \\
  python3-pip \\
  build-essential \\
  libasound2-dev \\
  portaudio19-dev \\
  libportaudio2 \\
  libportaudiocpp0 \\
  ffmpeg \\
  git
\`\`\`

**On Fedora / RHEL:**
\`\`\`bash
sudo dnf install -y \\
  python3-devel \\
  gcc \\
  gcc-c++ \\
  alsa-lib-devel \\
  portaudio-devel \\
  ffmpeg \\
  git
\`\`\`

**On Arch Linux:**
\`\`\`bash
sudo pacman -S --needed base-devel portaudio ffmpeg python
\`\`\`

### Step 2.2: Add User to Audio Group
Ensure your user account has direct access to ALSA / PulseAudio / PipeWire devices:

\`\`\`bash
sudo usermod -aG audio $USER
# Log out and log back in for changes to take effect!
\`\`\`

### Step 2.3: Python Environment & Dependencies

\`\`\`bash
git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}

python3 -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

---

## 🪟 3. Windows Setup (Windows 10 / 11)

### Step 3.1: Install Visual C++ Build Tools
PyAudio and fast-whisper require C++ compilation components during installation:
1. Download and install **Visual Studio Build Tools** (choose "Desktop development with C++").
2. Alternatively, install via [Chocolatey](https://chocolatey.org):
   \`\`\`powershell
   choco install -y visualstudio2022buildtools visualstudio2022-workload-vctools ffmpeg git
   \`\`\`

### Step 3.2: Clone & Virtual Environment

\`\`\`powershell
git clone https://github.com/${config.ownerName}/${config.repoName}.git
cd ${config.repoName}

# Create virtual environment
python -m venv .venv
.venv\\Scripts\\Activate.ps1

# Install requirements
python -m pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

*If PyAudio wheel fails on Windows:*
\`\`\`powershell
pip install pipwin
pipwin install pyaudio
\`\`\`

---

## 🐳 4. Docker Deployment

Aura can run in a container with audio passthrough:

### \`docker-compose.yml\` Example:
\`\`\`yaml
version: '3.8'

services:
  aura:
    build: .
    container_name: aura-assistant
    restart: unless-stopped
    devices:
      - "/dev/snd:/dev/snd"  # Expose host sound card
    group_add:
      - audio
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - WAKE_WORD=${config.wakeWord}
      - PULSE_SERVER=unix:/tmp/pulseaudio.socket
    volumes:
      - /tmp/pulseaudio.socket:/tmp/pulseaudio.socket
      - ./data:/app/data
\`\`\`

Run via:
\`\`\`bash
docker compose up -d
\`\`\`

---

## 📱 5. Native Windows Desktop & Android Mobile App Setup

You can run NGD directly as an installed native app on both Windows (Desktop) and Android (Mobile/Tablet):

### Option A: 1-Click Progressive Web App (Windows & Android)
- **Windows 10/11**: Open in Edge or Chrome -> Click the **Install** icon in the address bar (or Menu > Apps > Install NGD Multi-Task Bot). It gains a Start Menu tile, standalone window, and desktop shortcut.
- **Android**: Open in Chrome -> Tap **⋮ (Menu)** -> Tap **"Install app"** or **"Add to Home screen"**. It generates a native WebAPK with app drawer integration and offline support.

### Option B: Standalone Windows .EXE / MSIX (Electron & PWABuilder)
\`\`\`bash
# Run with Electron
npm install electron --save-dev
npm run app:windows

# Package as Windows MSIX / EXE using PWABuilder
npx @pwabuilder/cli build -d windows
\`\`\`

### Option C: Standalone Android APK (Capacitor)
\`\`\`bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android

# 2. Build assets & sync Android project
npm run build
npx cap add android
npx cap sync android

# 3. Open in Android Studio to compile APK/AAB
npx cap open android
\`\`\`

---

## 🧪 6. Testing & Verification

Run the built-in diagnostic tool to ensure your audio devices and wake word model are functioning:

\`\`\`bash
# 1. Enumerate audio devices
python -m aura.cli list-devices

# 2. Test microphone input levels (speaks back what you say)
python -m aura.cli loopback-test

# 3. Test wake word sensitivity
python -m aura.cli test-wake --threshold 0.75

# 4. Test Google Chat connection (if enabled)
python -m aura.cli test-workspace
\`\`\`

---

## ❓ Troubleshooting

### Error: \`ALSA lib pcm.c: No such file or directory\`
This is benign noise from ALSA scanning unavailable cards. Suppress with:
\`\`\`bash
export PYTHONWARNINGS="ignore"
export AUDIODEV="default"
\`\`\`

### Error: \`Microphone Not Found / PortAudio Error -9996\`
1. Verify another application (Zoom, Teams, Web browser) is not locking the audio interface exclusively.
2. Run \`python -m aura.cli list-devices\` and pass \`--device-index <ID>\` explicitly.

### Model Download Stalling
If you are behind a corporate proxy or slow connection, pre-download the models:
\`\`\`bash
python -m aura.models.download --all
\`\`\`
`;
}

export const SCAFFOLDING_FILES: ScaffoldingFile[] = [
  {
    filename: '.gitignore',
    path: '/.gitignore',
    description: 'Excludes virtual environments, audio cache files, temporary voice buffers, and API keys.',
    language: 'plaintext',
    content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual Environments
.venv/
venv/
ENV/
env/
.conda/

# Environment Variables & Secrets
.env
.env.local
.env.*.local
*.pem
*.key
google-credentials.json

# Audio Recording & Model Caches
audio_cache/
recordings/
*.wav
*.mp3
*.flac
*.pcm
models/cache/
*.onnx
*.bin

# IDE & OS Files
.DS_Store
Thumbs.db
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Testing & Coverage
.coverage
htmlcov/
.pytest_cache/
`,
  },
  {
    filename: 'requirements.txt',
    path: '/requirements.txt',
    description: 'Production Python dependencies for voice processing, AI reasoning, and Google Workspace integration.',
    language: 'plaintext',
    content: `# Core Voice Pipeline & Audio
pyaudio>=0.2.14
sounddevice>=0.4.6
numpy>=1.26.0
webrtcvad>=2.0.10
scipy>=1.11.0

# Speech-to-Text & Wake Word
faster-whisper>=1.0.0
openwakeword>=0.6.0
onnxruntime>=1.17.0

# Neural Text-to-Speech
piper-tts>=1.2.0

# AI Reasoning & Google APIs
google-genai>=0.1.1
google-auth>=2.28.0
google-auth-oauthlib>=1.2.0
requests>=2.31.0
pydantic>=2.6.0

# CLI & Configuration
click>=8.1.7
rich>=13.7.0
pyyaml>=6.0.1
python-dotenv>=1.0.1
`,
  },
  {
    filename: 'CONTRIBUTING.md',
    path: '/CONTRIBUTING.md',
    description: 'Contributor guidelines, development setup, code formatting standards, and PR process.',
    language: 'markdown',
    content: `# Contributing to Aura AI Voice Assistant

Thank you for your interest in making Aura better! We welcome contributions from developers, researchers, designers, and voice technology enthusiasts.

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct.

## How Can I Contribute?
- **Reporting Bugs**: Open an issue describing the bug, steps to reproduce, and audio hardware setup.
- **Suggesting Features**: Propose new voice skills, audio pipeline optimizers, or UI integrations.
- **Improving Documentation**: Fix typos, add OS-specific audio driver guides, or write tutorials.
- **Submitting Code**: Bug fixes, performance enhancements, and new integration modules.

## Development Workflow
1. Fork the repo and clone your fork locally.
2. Create a virtual environment and install dev dependencies:
   \`\`\`bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   pip install pytest black flake8 mypy
   \`\`\`
3. Create a feature branch (\`git checkout -b feature/my-new-skill\`).
4. Format code using \`black\`:
   \`\`\`bash
   black aura/ tests/
   \`\`\`
5. Run tests:
   \`\`\`bash
   pytest tests/
   \`\`\`
6. Commit your changes with clear semantic messages (\`feat: add noise suppression filter\`).
7. Push and open a Pull Request.

## Pull Request Guidelines
- Ensure all tests pass.
- Maintain high code coverage for audio buffer processors.
- Update the README and INSTALLATION guide if adding new hardware requirements.
`,
  },
  {
    filename: 'CODE_OF_CONDUCT.md',
    path: '/CODE_OF_CONDUCT.md',
    description: 'Contributor Covenant Code of Conduct for an open, welcoming, and inclusive community.',
    language: 'markdown',
    content: `# Contributor Covenant Code of Conduct

## Our Pledge
We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

## Our Standards
Examples of behavior that contributes to a positive environment:
- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes

Examples of unacceptable behavior:
- The use of sexualized language or imagery, and sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission

## Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leadership at maintainers@auravoice.io. All complaints will be reviewed and investigated promptly and fairly.
`,
  },
  {
    filename: '.github/workflows/ci.yml',
    path: '/.github/workflows/ci.yml',
    description: 'GitHub Actions Continuous Integration workflow testing multi-OS audio compilation and linting.',
    language: 'yaml',
    content: `name: Aura CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        python-version: ["3.10", "3.11", "3.12"]

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: \${{ matrix.python-version }}
        cache: 'pip'

    - name: Install System Audio Libraries (Linux)
      if: runner.os == 'Linux'
      run: |
        sudo apt-get update
        sudo apt-get install -y libasound2-dev portaudio19-dev ffmpeg

    - name: Install System Audio Libraries (macOS)
      if: runner.os == 'macOS'
      run: |
        brew install portaudio ffmpeg

    - name: Install Dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-asyncio flake8 black

    - name: Code Quality & Linting
      run: |
        flake8 aura --count --select=E9,F63,F7,F82 --show-source --statistics
        black --check aura tests

    - name: Run Unit Tests
      run: |
        pytest tests/ -v
`,
  },
  {
    filename: 'aura.config.yaml',
    path: '/aura.config.yaml',
    description: 'Default YAML runtime configuration for audio hardware, wake word, models, and integrations.',
    language: 'yaml',
    content: `# Aura AI Voice Assistant - Runtime Configuration

app:
  name: "Aura"
  version: "1.0.0"
  log_level: "INFO"

voice:
  wake_word: "Hey Aura"
  wake_word_sensitivity: 0.75
  language: "en-US"
  continuous_listening: true
  silence_timeout_ms: 1200

audio:
  input_device_id: null       # null = auto-detect default microphone
  output_device_id: null      # null = auto-detect default speaker
  sample_rate: 48000
  channels: 1
  chunk_size: 1024
  vad_mode: 3                 # 0 (least aggressive) to 3 (most aggressive)
  echo_cancellation: true
  noise_reduction: true

tts:
  engine: "piper"             # Options: piper, kokoro, system
  voice: "en_US-lessac-medium"
  speed: 1.05
  pitch: 1.0

integrations:
  google_chat:
    enabled: true
    post_transcripts: false
    notify_on_wake: false
`,
  },
  {
    filename: 'capacitor.config.json',
    path: '/capacitor.config.json',
    description: 'Capacitor Android configuration for packaging NGD into a native Android APK / AAB.',
    language: 'json',
    content: `{
  "appId": "com.ngd.multitaskbot",
  "appName": "NGD Multi-Task Bot",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true
  }
}`,
  },
  {
    filename: 'electron-main.cjs',
    path: '/electron-main.cjs',
    description: 'Electron Windows desktop launcher for running NGD in an isolated native desktop window.',
    language: 'javascript',
    content: `const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'NGD Multi-Task Bot',
    icon: path.join(__dirname, 'public/pwa-512x512.png'),
    backgroundColor: '#09090b',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = ['media', 'geolocation', 'notifications'];
    if (allowed.includes(permission)) return callback(true);
    callback(false);
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`,
  },
];
