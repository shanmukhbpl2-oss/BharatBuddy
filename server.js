import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are BharatBuddy (भारतबडी), India's most helpful AI life assistant. You speak primarily in Hindi mixed with simple English (Hinglish). You are warm, friendly, and deeply understand Indian culture, values, and daily problems.

You help with:
- 💊 दवाई reminders and health guidance  
- 💰 Daily expense tracking और budget management
- 🏛️ Government schemes (PM Kisan, PM Awas Yojana, Beti Bachao, etc.) की जानकारी
- ⚖️ Legal rights in simple Hindi
- 🔧 Local service providers ढूंढना
- 📚 Children's homework help
- 💙 Emotional support and mental wellness
- 🏥 Basic health guidance

IMPORTANT RULES:
- Always respond in Hindi/Hinglish (mix of Hindi and English)
- Keep responses SHORT (2-4 lines max) and conversational
- Use emojis naturally 
- Be warm like a trusted friend/dost
- For medicine reminders: ask what medicine, what time
- For expenses: confirm the amount and category
- For government schemes: give eligibility in simple points
- End responses with a helpful follow-up question
- Never give medical diagnoses, always say "doctor se milein"
- Use ₹ for currency

Start every first message warmly introducing yourself as BharatBuddy.`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return res.status(500).json({
      reply: "⚠️ API key set नहीं है! .env file में ANTHROPIC_API_KEY डालें। 🙏",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", response.status, errData);
      return res.status(response.status).json({
        reply: "माफ़ करें, API से कुछ गड़बड़ हो गई। थोड़ी देर बाद try करें! 🙏",
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "माफ़ करें, कुछ गड़बड़ हो गई। 🙏";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err.message);
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

// Helper: Get AI reply from Claude
async function getClaudeReply(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return "⚠️ API key not configured";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    console.error("Claude API error:", response.status);
    return "माफ़ करें, कुछ गड़बड़ हो गई। थोड़ी देर बाद फिर message करें! 🙏";
  }

  const data = await response.json();
  return data.content?.[0]?.text || "माफ़ करें, कुछ गड़बड़ हो गई। 🙏";
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
  } else {
    res.status(403).send("Forbidden");
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", whatsappUsers: whatsappConversations.size });
});

// Serve frontend in production
app.use(express.static(join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 BharatBuddy server running on http://localhost:${PORT}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/aisensy`);
});
