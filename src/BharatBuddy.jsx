import { useState, useRef, useEffect } from "react";

const FEATURES = [
  { id: "reminder", emoji: "💊", label: "दवाई Reminder", color: "#FF6B6B" },
  { id: "expense", emoji: "💰", label: "खर्च Tracker", color: "#4ECDC4" },
  { id: "govt", emoji: "🏛️", label: "सरकारी योजना", color: "#45B7D1" },
  { id: "legal", emoji: "⚖️", label: "Legal Rights", color: "#96CEB4" },
  { id: "service", emoji: "🔧", label: "Local Service", color: "#FFEAA7" },
  { id: "health", emoji: "🏥", label: "Health Guide", color: "#DDA0DD" },
  { id: "homework", emoji: "📚", label: "Homework Help", color: "#F0A500" },
  { id: "support", emoji: "💙", label: "Emotional Support", color: "#74B9FF" },
];

const QUICK_REPLIES = {
  default: [
    "💊 दवाई reminder set करो",
    "💰 आज का खर्च track करो",
    "🏛️ PM Kisan scheme check करो",
    "🔧 Plumber चाहिए",
    "⚖️ मेरे rights बताओ",
    "💙 बात करनी है",
  ],
  reminder: ["⏰ सुबह 8 बजे", "🌙 रात 9 बजे", "🍽️ खाने के बाद", "⬅️ वापस जाओ"],
  expense: ["🛒 किराना ₹500", "🚗 Auto ₹80", "💊 दवाई ₹200", "⬅️ वापस जाओ"],
  govt: ["👨‍🌾 PM Kisan", "🏠 PM Awas Yojana", "👩 Beti Bachao", "⬅️ वापस जाओ"],
};

export default function BharatBuddy() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "नमस्ते! 🙏 मैं BharatBuddy हूँ — आपका AI दोस्त!\n\nमैं आपकी daily life में help करता हूँ:\n💊 दवाई reminders • 💰 खर्च tracking\n🏛️ सरकारी योजनाएं • ⚖️ Legal rights\n🔧 Local services • 💙 बात करनी हो\n\nआज मैं आपकी कैसे help कर सकता हूँ? 😊",
      time: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState("default");
  const [lifeScore, setLifeScore] = useState(72);
  const [showSidebar, setShowSidebar] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationHistory = useRef([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Responsive: track window width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') setInstallPrompt(null);
  };

  // 🎤 Voice Recording (STT)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Try webm first, fallback to ogg
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result.split(',')[1];
          setLoading(true);
          try {
            const res = await fetch("/api/stt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64, mimeType }),
            });
            const data = await res.json();
            if (data.text && data.text.trim()) {
              sendMessage(data.text.trim());
            } else {
              setLoading(false);
            }
          } catch {
            setLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.log("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 🔊 Text-to-Speech (TTS)
  const playTTS = async (text, msgId) => {
    if (playingId) return;
    setPlayingId(msgId);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.onended = () => setPlayingId(null);
        audio.onerror = () => setPlayingId(null);
        audio.play();
      } else {
        setPlayingId(null);
      }
    } catch {
      setPlayingId(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      from: "user",
      text,
      time: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    conversationHistory.current.push({ role: "user", content: text });

    // Determine active feature for quick replies
    const lowerText = text.toLowerCase();
    if (lowerText.includes("दवाई") || lowerText.includes("reminder") || lowerText.includes("medicine")) setActiveFeature("reminder");
    else if (lowerText.includes("खर्च") || lowerText.includes("expense") || lowerText.includes("पैसे")) setActiveFeature("expense");
    else if (lowerText.includes("योजना") || lowerText.includes("scheme") || lowerText.includes("सरकार")) setActiveFeature("govt");
    else if (lowerText.includes("वापस") || lowerText.includes("back")) setActiveFeature("default");

    // Close sidebar on mobile after sending
    if (isMobile) setShowSidebar(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory.current }),
      });

      const data = await response.json();
      const botText = data.reply || "माफ़ करें, कुछ गड़बड़ हो गई। फिर से try करें! 🙏";

      conversationHistory.current.push({ role: "assistant", content: botText });

      // Update life score randomly for demo
      setLifeScore((prev) => Math.min(100, Math.max(30, prev + Math.floor(Math.random() * 6) - 2)));

      const botMsg = {
        id: Date.now() + 1,
        from: "bot",
        text: botText,
        time: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        from: "bot",
        text: "अरे! Network problem लग रही है। थोड़ी देर बाद फिर try करें! 🙏",
        time: new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const scoreColor = lifeScore >= 70 ? "#25D366" : lifeScore >= 50 ? "#FFA500" : "#FF6B6B";

  return (
    <div style={{
      fontFamily: "'Noto Sans Devanagari', 'Segoe UI', sans-serif",
      display: "flex",
      height: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      overflow: "hidden",
      position: "relative",
    }}>

      {/* Mobile overlay */}
      {showSidebar && isMobile && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)", zIndex: 9,
          }}
        />
      )}

      {/* LEFT PANEL - Sidebar */}
      <div style={{
        width: "280px",
        background: "rgba(10,10,10,0.98)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (showSidebar ? 0 : "-290px") : 0,
        top: 0, bottom: 0,
        zIndex: 10,
        transition: "left 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "48px", height: "48px",
              background: "linear-gradient(135deg, #FF6B35, #F7C59F)",
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 4px 15px rgba(255,107,53,0.4)",
            }}>🇮🇳</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>BharatBuddy</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>आपका AI दोस्त</div>
            </div>
          </div>

          {/* Life Score */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "12px",
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>🌟 Life Score</span>
              <span style={{ color: scoreColor, fontWeight: 800, fontSize: "20px" }}>{lifeScore}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px" }}>
              <div style={{
                width: `${lifeScore}%`, height: "100%",
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                borderRadius: "4px",
                transition: "width 0.5s ease",
              }} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", marginTop: "6px" }}>
              {lifeScore >= 70 ? "बढ़िया चल रहा है! 💪" : lifeScore >= 50 ? "और बेहतर हो सकते हैं 💡" : "आज थोड़ा ध्यान दें 🙏"}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: "16px 14px", flex: 1, overflowY: "auto" }}>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", paddingLeft: "6px" }}>
            Features
          </div>
          {FEATURES.map((f) => (
            <div
              key={f.id}
              onClick={() => { sendMessage(f.label + " के बारे में बताओ"); if (isMobile) setShowSidebar(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "4px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: "32px", height: "32px",
                background: f.color + "22",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0,
              }}>{f.emoji}</div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.25)",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: 1.6,
        }}>
          {installPrompt && (
            <button onClick={handleInstall} style={{
              width: "100%", padding: "10px",
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              border: "none", borderRadius: "10px",
              color: "#fff", fontWeight: 700, fontSize: "13px",
              cursor: "pointer", marginBottom: "10px",
              fontFamily: "inherit",
              boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
            }}>
              📲 App Install करें
            </button>
          )}
          🔒 आपकी बातें safe हैं<br />
          Made with ❤️ for Bharat
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>

        {/* Chat Header */}
        <div style={{
          padding: "12px 16px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}>
          {/* Hamburger for mobile */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                background: "none", border: "none",
                color: "#fff", fontSize: "22px",
                cursor: "pointer", padding: "4px 8px",
              }}
            >☰</button>
          )}
          <div style={{ position: "relative" }}>
            <div style={{
              width: "44px", height: "44px",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
            }}>🤖</div>
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: "12px", height: "12px",
              background: "#25D366",
              borderRadius: "50%",
              border: "2px solid #1a1a2e",
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>BharatBuddy</div>
            <div style={{ color: "#25D366", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", background: "#25D366", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
              {loading ? "सोच रहा हूँ..." : "Online • हमेशा available"}
            </div>
          </div>
          {installPrompt && (
            <button onClick={handleInstall} style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              border: "none", borderRadius: "20px",
              padding: "8px 16px",
              color: "#fff", fontSize: "12px", fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              fontFamily: "inherit",
              boxShadow: "0 4px 15px rgba(37,211,102,0.3)",
              flexShrink: 0,
            }}>📲 Install</button>
          )}
        </div>

        {/* WhatsApp-style background pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
          zIndex: 1,
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                animation: "fadeSlideIn 0.3s ease",
              }}
            >
              {msg.from === "bot" && (
                <div style={{
                  width: "32px", height: "32px",
                  background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                  marginRight: "8px",
                  flexShrink: 0,
                  alignSelf: "flex-end",
                  marginBottom: "2px",
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "72%",
                background: msg.from === "user"
                  ? "linear-gradient(135deg, #FF6B35, #F7931E)"
                  : "rgba(255,255,255,0.08)",
                borderRadius: msg.from === "user"
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                padding: "12px 16px",
                backdropFilter: "blur(10px)",
                border: msg.from === "bot" ? "1px solid rgba(255,255,255,0.1)" : "none",
                boxShadow: msg.from === "user"
                  ? "0 4px 15px rgba(255,107,53,0.3)"
                  : "0 2px 10px rgba(0,0,0,0.2)",
              }}>
                <div style={{
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>{msg.text}</div>
                <div style={{
                  color: msg.from === "user" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                  fontSize: "10px",
                  marginTop: "6px",
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "4px",
                }}>
                  {msg.from === "bot" && (
                    <button
                      onClick={() => playTTS(msg.text, msg.id)}
                      disabled={playingId !== null}
                      style={{
                        background: "none", border: "none",
                        color: playingId === msg.id ? "#25D366" : "rgba(255,255,255,0.4)",
                        cursor: playingId ? "not-allowed" : "pointer",
                        padding: "2px 4px", fontSize: "14px",
                        marginRight: "auto",
                        animation: playingId === msg.id ? "pulse 1s ease-in-out infinite" : "none",
                      }}
                      title="🔊 सुनें"
                    >{playingId === msg.id ? "🔊" : "🔈"}</button>
                  )}
                  {msg.time}
                  {msg.from === "user" && <span style={{ color: "#4FC3F7" }}>✓✓</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
              <div style={{
                width: "32px", height: "32px",
                background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
              }}>🤖</div>
              <div style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 18px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", gap: "5px", alignItems: "center",
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} style={{
                    width: "7px", height: "7px",
                    background: "#FF6B35",
                    borderRadius: "50%",
                    animation: `bounce 1s ${delay}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div style={{
          padding: "10px 16px 6px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          zIndex: 1,
          scrollbarWidth: "none",
          flexShrink: 0,
        }}>
          {(QUICK_REPLIES[activeFeature] || QUICK_REPLIES.default).map((reply, i) => (
            <button
              key={i}
              onClick={() => sendMessage(reply)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "7px 14px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,107,53,0.2)";
                e.target.style.borderColor = "rgba(255,107,53,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.07)";
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 16px 16px",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          zIndex: 1,
          flexShrink: 0,
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              padding: "4px 6px 4px 16px",
              transition: "border-color 0.2s",
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hindi या English में लिखें... 🙏"
                disabled={loading}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  padding: "8px 0",
                  minWidth: 0,
                }}
              />
              <button
                type="button"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                style={{
                  background: isRecording ? "rgba(255,50,50,0.3)" : "transparent",
                  border: "none",
                  color: isRecording ? "#FF4444" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  padding: "8px",
                  fontSize: "18px",
                  lineHeight: 1,
                  borderRadius: "50%",
                  animation: isRecording ? "pulse 1s ease-in-out infinite" : "none",
                  flexShrink: 0,
                }}
                title={isRecording ? "बोलिए... 🎤" : "दबा के बोलें (Hold to speak)"}
              >{isRecording ? "⏺️" : "🎤"}</button>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: "48px", height: "48px",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #FF6B35, #F7931E)"
                  : "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
                transition: "all 0.2s ease",
                boxShadow: input.trim() && !loading ? "0 4px 15px rgba(255,107,53,0.4)" : "none",
                flexShrink: 0,
              }}
            >
              {loading ? "⏳" : "➤"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @media (display-mode: standalone) {
          body { padding-top: env(safe-area-inset-top); }
        }
      `}</style>
    </div>
  );
}
