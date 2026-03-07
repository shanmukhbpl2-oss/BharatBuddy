# 🇮🇳 BharatBuddy — आपका AI दोस्त

India's Hinglish AI life assistant — PWA + WhatsApp bot powered by Claude & Sarvam AI.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💊 दवाई Reminder | Set medicine reminders in Hindi |
| 💰 खर्च Tracker | Track daily expenses in ₹ |
| 🏛️ सरकारी योजना | PM Kisan, PM Awas Yojana, Beti Bachao info |
| ⚖️ Legal Rights | Know your rights in simple Hindi |
| 🔧 Local Services | Find plumbers, electricians nearby |
| 🏥 Health Guide | Basic health guidance (not diagnosis) |
| 📚 Homework Help | Kids' homework in Hindi/English |
| 💙 Emotional Support | Chat when feeling low |
| 🎤 Voice Input | Speak in Hindi via Sarvam AI STT |
| 🔊 Voice Output | Bot replies read aloud via Sarvam AI TTS |
| 📱 WhatsApp Bot | Chat via WhatsApp through AiSensy |
| 📲 PWA | Install on mobile — works offline |

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and add your API keys
```

Required keys:
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com/)
- `SARVAM_API_KEY` — from [app.sarvam.ai](https://app.sarvam.ai/) *(for voice features)*
- `AISENSY_API_KEY` — from [aisensy.com](https://aisensy.com/) *(for WhatsApp bot)*

### 3. Run in development mode

```bash
npm run dev:all
```

This starts both:
- Express backend on `http://localhost:3001`
- Vite dev server on `http://localhost:5173`

### 4. Build for production

```bash
npm run build
npm start
```

The server serves the built frontend from `dist/` and all API routes at `http://localhost:3001`.

## 📁 Project Structure

```
BharatBuddy/
├── src/
│   ├── BharatBuddy.jsx   # Main React UI component
│   └── main.jsx          # Entry point + PWA service worker registration
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service worker (offline caching)
│   └── icons/            # App icons (192×192, 512×512)
├── server.js             # Express backend (Claude chat, Sarvam TTS/STT, WhatsApp webhook)
├── index.html            # HTML entry point
├── vite.config.js        # Vite config (proxies /api, /webhook to backend)
├── .env.example          # Environment variable template
└── package.json
```

## 🌐 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Send chat messages to Claude |
| `POST` | `/api/tts` | Text-to-speech (Sarvam AI) |
| `POST` | `/api/stt` | Speech-to-text (Sarvam AI) |
| `POST` | `/webhook/aisensy` | Receive WhatsApp messages from AiSensy |
| `GET`  | `/webhook/aisensy` | Webhook verification (Meta/AiSensy) |
| `GET`  | `/health` | Health check + active WhatsApp users count |

## 📱 WhatsApp Bot Setup

1. Create an account at [AiSensy](https://aisensy.com/)
2. Set your webhook URL to: `https://your-domain.com/webhook/aisensy`
3. Set `WEBHOOK_VERIFY_TOKEN` in `.env` to match AiSensy's verify token
4. Add `AISENSY_API_KEY` to your `.env`

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 6 (PWA)
- **Backend**: Node.js + Express 4
- **AI Chat**: Anthropic Claude (claude-sonnet-4)
- **Voice**: Sarvam AI (bulbul:v2 TTS, saarika:v2 STT)
- **WhatsApp**: AiSensy API
- **Fonts**: Noto Sans Devanagari (Google Fonts)

## 📄 License

MIT — Made with ❤️ for Bharat 🇮🇳
