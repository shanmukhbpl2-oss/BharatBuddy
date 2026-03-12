process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB } from "./db.js";
import dataRoutes from "./routes/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are BharatBuddy (भारतबडी), India's most trusted AI life assistant. You speak in warm Hinglish (Hindi + English mix). Be like a caring elder sibling - kind, helpful, and understanding.

You help with:
- 💊 Medicine reminders and health guidance (always say "Doctor se zaroor milein 🙏" for serious concerns)
- 💸 Daily expense tracking और budget management
- 🏛️ Government schemes (PM Kisan, PM Awas Yojana, Ayushman Bharat, etc.)
- ⚖️ Legal rights और basic legal guidance in simple Hindi
- 🌾 Kisan help - mandi rates, fasal tips, farming schemes
- 🏦 Finance - EMI calculation, loan advice, savings tips
- 🛒 Shopping - price comparison, best deals (Amazon, Flipkart, Meesho)
- 👨‍👩‍👧 Family management - reminders for all family members
- 📍 Location services - nearby hospitals, pharmacies, CSC
- 📚 Homework help for Class 1-12 (Hindi medium)
- 💙 Emotional support and mental wellness
- 🏥 Basic health guidance

CRITICAL RULES:
- Keep responses SHORT (3-5 lines max) and conversational
- Always respond in Hindi/Hinglish - never pure English
- Use emojis naturally but don't overdo it
- Be warm, friendly, and respectful like a trusted dost
- Use ₹ for all currency/money
- For medical issues: give basic info but always say "Doctor se zaroor milein 🙏"
- For government schemes: explain eligibility simply
- Format important info with *bold* (using asterisks)
- End with a helpful follow-up question when relevant
- If you don't know something, say so honestly

RESPONSE STYLE:
✅ Good: "Haan! PM Kisan में registration ke liye Aadhaar और bank account chahiye। Online apply kar sakte ho pmkisan.gov.in पर। Kya aapka Aadhaar bank se linked hai? 🏛️"
❌ Bad: Long paragraphs, pure English, formal tone`;

// ==========================================
// 💬 Main Chat API - Supports text and images
// ==========================================
app.post("/api/chat", async (req, res) => {
  const { message, image, history, messages } = req.body;

  // Support both old format (messages array) and new format (message + history)
  let conversationMessages = messages || history || [];
  
  // If using new format, add the current message
  if (message) {
    const userMessage = {
      role: "user",
      content: message
    };
    
    // If image is provided, format as multimodal message
    if (image) {
      userMessage.content = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: image
          }
        },
        {
          type: "text",
          text: message
        }
      ];
    }
    
    conversationMessages = [...conversationMessages, userMessage];
  }

  if (!Array.isArray(conversationMessages) || conversationMessages.length === 0) {
    return res.status(400).json({ 
      error: "Messages array is required",
      reply: "कोई message नहीं आया! 🙏"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    console.error("⚠️ OPENAI_API_KEY not configured");
    return res.status(500).json({
      reply: "⚠️ API key set नहीं है! .env file में OPENAI_API_KEY डालें। 🙏",
    });
  }

  try {
    console.log(`💬 Chat request - Messages: ${conversationMessages.length}, Has image: ${!!image}`);
    
    // Prepend system prompt as first message for OpenAI format
    const messagesWithSystem = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationMessages
    ];
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: messagesWithSystem,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("❌ OpenAI API error:", response.status, errData);
      return res.status(response.status).json({
        reply: "माफ़ करें, API से कुछ गड़बड़ हो गई। थोड़ी देर बाद try करें! 🙏",
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "माफ़ करें, कुछ गड़बड़ हो गई। 🙏";

    console.log(`✅ Chat reply sent - Length: ${reply.length} chars`);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
      reply: "अरे! Server में कुछ problem आ गई। 🙏",
    });
  }
});

// ==========================================
// 📱 AiSensy WhatsApp Integration
// ==========================================

// Store conversation history per phone number (in-memory, resets on restart)
const whatsappConversations = new Map();

// Helper: Get AI reply from OpenAI
async function getClaudeReply(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "⚠️ API key not configured";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI API error:", response.status);
    return "माफ़ करें, कुछ गड़बड़ हो गई। थोड़ी देर बाद फिर message करें! 🙏";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "माफ़ करें, कुछ गड़बड़ हो गई। 🙏";
}

// Helper: Send reply back via AiSensy
async function sendWhatsAppReply(phoneNumber, message) {
  const aiSensyKey = process.env.AISENSY_API_KEY;
  if (!aiSensyKey) {
    console.error("AISENSY_API_KEY not set");
    return;
  }

  try {
    const response = await fetch("https://backend.aisensy.com/direct-apis/t1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AiSensy-Project-API-Pwd": aiSensyKey,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: { body: message },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("AiSensy send error:", response.status, err);
    } else {
      console.log(`✅ WhatsApp reply sent to ${phoneNumber}`);
    }
  } catch (err) {
    console.error("AiSensy send failed:", err.message);
  }
}

// Webhook: Receive messages from AiSensy
app.post("/webhook/aisensy", async (req, res) => {
  // Respond quickly to AiSensy (they expect 200 within seconds)
  res.status(200).json({ status: "received" });

  try {
    const body = req.body;

    // AiSensy webhook payload structure
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return;

    const phoneNumber = message.from;
    const userText = message.text?.body || message.button?.text || "";

    if (!userText.trim()) return;

    console.log(`📱 WhatsApp from ${phoneNumber}: ${userText}`);

    // Get or create conversation history for this phone number
    if (!whatsappConversations.has(phoneNumber)) {
      whatsappConversations.set(phoneNumber, []);
    }
    const history = whatsappConversations.get(phoneNumber);

    // Keep last 20 messages to stay within token limits
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    history.push({ role: "user", content: userText });

    // Get AI reply
    const reply = await getClaudeReply(history);
    history.push({ role: "assistant", content: reply });

    // Send reply back via WhatsApp
    await sendWhatsAppReply(phoneNumber, reply);
  } catch (err) {
    console.error("Webhook processing error:", err.message);
  }
});

// Webhook verification (GET) - AiSensy/Meta may ping this
app.get("/webhook/aisensy", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "bharatbuddy_verify";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else if (!mode) {
    // Browser access - show friendly message
    res.status(200).json({ status: "BharatBuddy WhatsApp Webhook is active! 🚀" });
  } else {
    res.status(403).send("Forbidden");
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", whatsappUsers: whatsappConversations.size });
});

// ==========================================
// 🎤 Sarvam AI Voice Integration (TTS + STT)
// ==========================================

// Text-to-Speech: Convert bot reply to Hindi audio
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  const sarvamKey = process.env.SARVAM_API_KEY;
  if (!sarvamKey) return res.status(500).json({ error: "Sarvam API key not configured" });

  try {
    console.log("🔊 TTS Request received - Text:", text.substring(0, 50));
    
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamKey,
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)],
        target_language_code: "hi-IN",
        speaker: "priya",
        model: "bulbul:v3",
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("❌ Sarvam TTS error:", response.status, err);
      return res.status(response.status).json({ error: "TTS failed", details: err });
    }

    const data = await response.json();
    const audioBase64 = data.audios?.[0];
    if (!audioBase64) return res.status(500).json({ error: "No audio returned" });

    console.log("✅ TTS Success - Audio length:", audioBase64.length);
    res.json({ audio: audioBase64 });
  } catch (err) {
    console.error("❌ TTS error:", err.message);
    res.status(500).json({ error: "TTS request failed" });
  }
});

// Speech-to-Text: Convert user's voice to text
// Sarvam STT expects multipart/form-data with a file field
app.post("/api/stt", async (req, res) => {
  const { audio, mimeType } = req.body; // base64 encoded audio + mime type
  if (!audio) return res.status(400).json({ error: "audio (base64) is required" });

  const sarvamKey = process.env.SARVAM_API_KEY;
  if (!sarvamKey) return res.status(500).json({ error: "Sarvam API key not configured" });

  try {
    console.log("🎤 STT Request received - Audio size:", audio.length, "bytes, MimeType:", mimeType);
    
    // Convert base64 back to a Buffer and build FormData
    const audioBuffer = Buffer.from(audio, "base64");
    console.log("📦 Audio buffer size:", audioBuffer.length, "bytes");
    
    const ext = (mimeType || "audio/webm").includes("ogg") ? "ogg" : "webm";
    const filename = `recording.${ext}`;

    // Build multipart form using Node built-ins (no extra deps)
    const boundary = `----BharatBuddyBoundary${Date.now()}`;
    const CRLF = "\r\n";

    const partHeader = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${filename}"`,
      `Content-Type: ${mimeType || "audio/webm"}`,
      "",
      "",
    ].join(CRLF);

    const partFooter = `${CRLF}--${boundary}--${CRLF}`;

    const modelPart = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="model"`,
      "",
      "saarika:v2.5",
      "",
    ].join(CRLF);

    const langPart = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="language_code"`,
      "",
      "hi-IN",
      "",
    ].join(CRLF);

    const body = Buffer.concat([
      Buffer.from(modelPart + CRLF, "utf-8"),
      Buffer.from(langPart + CRLF, "utf-8"),
      Buffer.from(partHeader, "utf-8"),
      audioBuffer,
      Buffer.from(partFooter, "utf-8"),
    ]);

    console.log("📤 Sending to Sarvam STT API with boundary:", boundary, "- Total size:", body.length, "bytes");

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "api-subscription-key": sarvamKey,
        "Content-Length": body.length,
      },
      body,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("❌ Sarvam STT error:", response.status, err);
      console.error("Response headers:", response.headers);
      return res.status(response.status).json({ error: "STT failed", details: err });
    }

    const data = await response.json();
    const transcript = data.transcript || "";
    console.log("✅ STT Success:", transcript);
    res.json({ text: transcript });
  } catch (err) {
    console.error("❌ STT error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "STT request failed", message: err.message });
  }
});

// Serve frontend in production
app.use(
  express.static(join(__dirname, "dist"), {
    setHeaders: (res, filePath) => {
      // Always fetch fresh app shell and service worker on deploys.
      if (filePath.endsWith("index.html") || filePath.endsWith("sw.js")) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      }
    },
  })
);

// ==========================================
// 📊 Data Storage Routes (MongoDB)
// ==========================================
app.use("/api/data", dataRoutes);

app.get("*", (req, res) => {
  // Don't serve index.html for API/webhook routes
  if (req.path.startsWith("/api") || req.path.startsWith("/webhook") || req.path === "/health") {
    return res.status(404).json({ error: "Not found" });
  }
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;

// Connect to MongoDB and start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 BharatBuddy server running on http://localhost:${PORT}`);
      console.log(`📊 Database routes: /api/data/*`);
      console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/aisensy`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();
