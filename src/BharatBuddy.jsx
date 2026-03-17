import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   BHARATBUDDY — ABSOLUTE BEST UI [Updated with translations]
   Theme: Midnight India — Deep space + Saffron + Emerald
   Font: Plus Jakarta Sans + Noto Sans Devanagari
═══════════════════════════════════════════════════════ */

const SVCS = [
  { id:"medicine",  icon:"💊", label:"दवाई",      sub:"Smart Reminders",   col:"#FF4E6A", grd:"135deg,#FF4E6A,#C0392B", free:true  },
  { id:"expense",   icon:"💸", label:"खर्च",       sub:"Daily Tracker",    col:"#FF8C42", grd:"135deg,#FF8C42,#D4650C", free:true  },
  { id:"schemes",   icon:"🏛", label:"Schemes",    sub:"28+ Yojana",       col:"#00D09C", grd:"135deg,#00D09C,#00916E", free:true  },
  { id:"weather",   icon:"🌤", label:"मौसम",       sub:"Live Forecast",    col:"#4E9FFF", grd:"135deg,#4E9FFF,#1A6FD4", free:true  },
  { id:"whatsapp",  icon:"💬", label:"WhatsApp",   sub:"AI Bot Connect",   col:"#25D366", grd:"135deg,#25D366,#128C7E", free:true  },
  { id:"emergency", icon:"🚨", label:"Emergency",  sub:"108 • 112 • 100",  col:"#FF3B3B", grd:"135deg,#FF3B3B,#A00000", free:true  },
  { id:"news",      icon:"📰", label:"News",       sub:"Hindi Headlines",  col:"#5B9BFF", grd:"135deg,#5B9BFF,#1D4ED8", free:true  },
  { id:"family",    icon:"👨‍👩‍👧",label:"Family",    sub:"5 Members",        col:"#FF6BB5", grd:"135deg,#FF6BB5,#C2185B", free:false },
  { id:"finance",   icon:"🏦", label:"Finance",    sub:"EMI • Credit",     col:"#A78BFF", grd:"135deg,#A78BFF,#6D28D9", free:false },
  { id:"shopping",  icon:"🛒", label:"Shopping",   sub:"Best Deals",       col:"#FFD60A", grd:"135deg,#FFD60A,#D97706", free:false },
  { id:"kisan",     icon:"🌾", label:"Kisan",      sub:"Mandi • Fasal",    col:"#7EE787", grd:"135deg,#7EE787,#16A34A", free:false },
  { id:"legal",     icon:"⚖",  label:"Legal",      sub:"RTI • Rights",     col:"#94A3B8", grd:"135deg,#94A3B8,#475569", free:false },
  { id:"location",  icon:"📍", label:"Near Me",    sub:"Hospital • CSC",   col:"#22D3EE", grd:"135deg,#22D3EE,#0E7490", free:false },
  { id:"homework",  icon:"📚", label:"Homework",   sub:"Class 1-12",       col:"#818CF8", grd:"135deg,#818CF8,#4338CA", free:false },
  { id:"report",    icon:"📊", label:"Report",     sub:"Monthly PDF",      col:"#FBBF24", grd:"135deg,#FBBF24,#B45309", free:false },
  { id:"document",  icon:"📄", label:"Docs",       sub:"Aadhaar • PAN",    col:"#78909C", grd:"135deg,#78909C,#37474F", free:false },
  { id:"chat",      icon:"💬", label:"AI Chat",    sub:"Baat Karo",        col:"#34D399", grd:"135deg,#34D399,#059669", free:true  },
];

const MANDI=[{c:"🌾 गेहूँ",p:"₹2,180",d:"+₹20",u:true},{c:"🌽 मक्का",p:"₹1,850",d:"-₹15",u:false},{c:"🧅 प्याज़",p:"₹1,200",d:"+₹80",u:true},{c:"🥔 आलू",p:"₹900",d:"+₹30",u:true},{c:"🍅 टमाटर",p:"₹2,400",d:"-₹100",u:false}];
const DEALS=[{item:"Realme 12 Pro",a:"₹24,999",f:"₹23,499",m:"₹22,800",save:"₹2,199"},{item:"Pressure Cooker",a:"₹1,299",f:"₹1,199",m:"₹999",save:"₹300"},{item:"Bluetooth Earbuds",a:"₹4,999",f:"₹4,499",m:"₹4,199",save:"₹800"}];
const FAM=[{name:"दादाजी",age:72,e:"👴",c:"#FF8C42",r:["BP tablet 7AM","Sugar tab 8AM"]},{name:"माँ",age:48,e:"👩",c:"#FF6BB5",r:["Vitamin D 1PM","Iron 9PM"]},{name:"Rahul",age:16,e:"👦",c:"#4E9FFF",r:["Study 6PM","Sleep 10PM"]}];

const T = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

const THEMES = {
  dark: {
    bg:"#05080F", hdrBg:"rgba(8,13,24,0.97)", sidebarBg:"#080E1C", chatBg:"#050810",
    text:"#E2E8F0", subText:"rgba(255,255,255,0.35)", border:"rgba(255,255,255,0.07)",
    bubble:"#0C1524", ubble:"linear-gradient(135deg,#092D20,#061A12)",
  },
  light: {
    bg:"#FFFFFF", hdrBg:"rgba(255,255,255,0.99)", sidebarBg:"#F0F4F8", chatBg:"#FAFBFC",
    text:"#0F172A", subText:"rgba(0,0,0,0.6)", border:"rgba(0,0,0,0.1)",
    bubble:"#F3F4F6", ubble:"linear-gradient(135deg,#DCFCE7,#F3F4F6)",
  }
};

const TRANS = {
  hi: {
    welcome: "🙏 *नमस्ते! BharatBuddy में आपका स्वागत है!*\nमैं आपका AI दोस्त हूँ — हर रोज़ की ज़रूरत में मदद!\n💊 दवाई • 💸 खर्च • 🏛 Schemes • 🛒 Shopping\nनीचे से service चुनें या message करें 👇",
    services: "🇮🇳 सेवाएं",
    free: "मुफ्त",
    premium: "प्रीमियम",
    online: "ऑनलाइन • AI सहायक",
    hiMein: "Hindi में बोलें...",
    noService: "error loading service",
    getPremium: "Premium लें",
    premiumPrice: "सिर्फ ₹99/month",
    promoText: "6 free services • ",
    promoHighlight: "₹99 में सब 16 unlock करें",
    upgrade: "Upgrade →",
    placeholder: "Hindi में message करें...",
    listening: "🎤 सुन रहा हूँ...",
    chromeError: "🎤 Chrome browser use करें!",
    voiceError: "🎤 Voice error!",
    apiError: "❌ API error हो गई। फिर से try करें! 🙏",
  },
  en: {
    welcome: "🙏 *Hello! Welcome to BharatBuddy!*\nI'm your AI friend — here to help with everyday needs!\n💊 Medicine • 💸 Expenses • 🏛 Schemes • 🛒 Shopping\nChoose a service below or message me 👇",
    services: "🌍 Services",
    free: "Free",
    premium: "Premium",
    online: "Online • AI Powered",
    hiMein: "Speak in English...",
    noService: "error loading service",
    getPremium: "Get Premium",
    premiumPrice: "Only ₹99/month",
    promoText: "6 free services • ",
    promoHighlight: "Unlock all 16 for ₹99",
    upgrade: "Upgrade →",
    placeholder: "Message in English...",
    listening: "🎤 Listening...",
    chromeError: "🎤 Use Chrome browser!",
    voiceError: "🎤 Voice error!",
    apiError: "❌ API error occurred. Try again! 🙏",
  }
};

const SVC_TEXT = {
  hi: {
    medicine: { label: "दवाई", sub: "स्मार्ट रिमाइंडर" },
    expense: { label: "खर्च", sub: "रोज़ का हिसाब" },
    schemes: { label: "योजनाएं", sub: "28+ योजना" },
    weather: { label: "मौसम", sub: "लाइव पूर्वानुमान" },
    whatsapp: { label: "व्हाट्सऐप", sub: "AI बॉट कनेक्ट" },
    emergency: { label: "इमरजेंसी", sub: "108 • 112 • 100" },
    news: { label: "समाचार", sub: "हिंदी हेडलाइंस" },
    family: { label: "परिवार", sub: "5 सदस्य" },
    finance: { label: "फाइनेंस", sub: "EMI • क्रेडिट" },
    shopping: { label: "शॉपिंग", sub: "बेस्ट डील्स" },
    kisan: { label: "किसान", sub: "मंडी • फसल" },
    legal: { label: "कानूनी", sub: "RTI • अधिकार" },
    location: { label: "आसपास", sub: "अस्पताल • CSC" },
    homework: { label: "होमवर्क", sub: "क्लास 1-12" },
    report: { label: "रिपोर्ट", sub: "मासिक PDF" },
    document: { label: "दस्तावेज", sub: "आधार • PAN" },
    chat: { label: "AI चैट", sub: "बात करो" },
  },
  en: {
    medicine: { label: "Medicine", sub: "Smart Reminders" },
    expense: { label: "Expenses", sub: "Daily Tracker" },
    schemes: { label: "Schemes", sub: "28+ Yojanas" },
    weather: { label: "Weather", sub: "Live Forecast" },
    whatsapp: { label: "WhatsApp", sub: "AI Bot Connect" },
    emergency: { label: "Emergency", sub: "108 • 112 • 100" },
    news: { label: "News", sub: "Hindi Headlines" },
    family: { label: "Family", sub: "5 Members" },
    finance: { label: "Finance", sub: "EMI • Credit" },
    shopping: { label: "Shopping", sub: "Best Deals" },
    kisan: { label: "Farmer", sub: "Mandi • Crop" },
    legal: { label: "Legal", sub: "RTI • Rights" },
    location: { label: "Near Me", sub: "Hospital • CSC" },
    homework: { label: "Homework", sub: "Class 1-12" },
    report: { label: "Report", sub: "Monthly PDF" },
    document: { label: "Docs", sub: "Aadhaar • PAN" },
    chat: { label: "AI Chat", sub: "Talk Now" },
  },
};

export default function App() {
  const [msgs,  setMsgs]  = useState([
    {id:1,type:"bot",text:TRANS.hi.welcome,time:T()},
  ]);
  const [input, setInput] = useState("");
  const [load,  setLoad]  = useState(false);
  const [panel, setPanel] = useState(null);
  const [isPrem,setIsPrem]= useState(false);
  const [subScr,setSubScr]= useState(false);
  const [rec,   setRec]   = useState(false);
  const [theme, setTheme] = useState("dark");
  const [lang,  setLang]  = useState("hi"); // hi or en
  const t = THEMES[theme];
  const tr = TRANS[lang];
  const svcText = SVC_TEXT[lang];
  const quickChips = lang === "hi"
    ? ["💊 दवाई","💸 खर्च","🏛 योजनाएं","🛒 डील्स","🏦 EMI","📍 आसपास","📊 रिपोर्ट"]
    : ["💊 Medicine","💸 Expenses","🏛 Schemes","🛒 Deals","🏦 EMI","📍 Near Me","📊 Report"];
  const endR=useRef(null); const inpR=useRef(null);
  const chatR=useRef(null);
  const filR=useRef(null); const recR=useRef(null);

  useEffect(()=>{ endR.current?.scrollIntoView({behavior:"smooth"}); },[msgs,load,panel]);

  useEffect(()=>{
    setMsgs(prev=>{
      if(!prev.length) return prev;
      const first = prev[0];
      const isDefaultWelcome = first.id===1 && (first.text===TRANS.hi.welcome || first.text===TRANS.en.welcome);
      if(!isDefaultWelcome) return prev;
      const next=[...prev];
      next[0]={...first,text:TRANS[lang].welcome};
      return next;
    });
  },[lang]);

  const push = arr => setMsgs(p=>[...p,...arr.map((m,i)=>({...m,id:Date.now()+i,time:T()}))]);

  const ai = useCallback(async(text,img=null)=>{
    if(load) return;
    push([{type:"user",text:img?"📸 "+text:text}]);
    setInput(""); setLoad(true);
    const hasHindiInput = /[\u0900-\u097F]/.test(String(text || ""));
    const effectiveLang = hasHindiInput ? "hi" : lang;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          image: img || undefined,
          lang: effectiveLang,
          history: msgs.filter(m => m.type !== "photo").map(m => ({
            role: m.type === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });
      
      const data = await response.json();
      const reply = data.reply || tr.noService;
      push([{type:"bot",text:reply}]);
      setLoad(false);
      inpR.current?.focus();
    } catch(err) {
      console.error("API Error:", err);
      push([{type:"bot",text:tr.apiError}]);
      setLoad(false);
      inpR.current?.focus();
    }
  },[load,msgs,lang,tr.apiError,tr.noService]);

  const onSvc = id=>{
    const s=SVCS.find(x=>x.id===id);
    if(!s) return;
    if(!s.free&&!isPrem){setSubScr(true);return;}
    const panels=["medicine","expense","family","finance","shopping","kisan","location","report","weather","whatsapp"];
    if(panels.includes(id)){
      setPanel(id);
      requestAnimationFrame(() => {
        chatR.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }
    const label = svcText?.[s.id]?.label || s.label;
    push([{type:"user",text:label}]);
    setTimeout(()=>ai(`Help with ${label} in ${lang==="en"?"English":"Hinglish"}`),200);
  };

  const voice=()=>{
    if(!rec){
      try{
        const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
        if(!SR){push([{type:"bot",text:tr.chromeError}]);return;}
        const r=new SR(); r.lang=lang==="hi"?"hi-IN":"en-US";
        r.onresult=e=>{setInput(e.results[0][0].transcript);setRec(false);};
        r.onerror=()=>setRec(false); r.onend=()=>setRec(false);
        recR.current=r; r.start(); setRec(true);
      }catch{push([{type:"bot",text:tr.voiceError}]);}
    }else{recR.current?.stop();setRec(false);}
  };

  const photo=e=>{
    const f=e.target.files[0]; if(!f) return;
    const rd=new FileReader();
    rd.onload=ev=>{
      const b=ev.target.result.split(",")[1];
      push([{type:"photo",src:ev.target.result}]);
      setTimeout(()=>ai("Analyze this image — prescription/bill/document — Hindi mein batao.",b),400);
    };
    rd.readAsDataURL(f); e.target.value="";
  };

  if(subScr) return <SubScreen onBack={()=>setSubScr(false)} onOk={()=>{setIsPrem(true);setSubScr(false);}}/>;

  const FREE = SVCS.filter(s=>s.free);
  const PRO  = SVCS.filter(s=>!s.free);
  
  const getStyles = (theme) => {
    const t = THEMES[theme];
    return {
      root: {...S.root, background:t.bg, color:t.text},
      hdr: {...S.hdr, background:t.hdrBg, borderColor:t.border},
      hName: {...S.hName, color:t.text},
      hSub: {...S.hSub, color:t.subText},
      sidebar: {...S.sidebar, background:t.sidebarBg, borderColor:t.border},
      sbCount: {...S.sbCount, color:t.subText, background: theme==="dark"?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)", borderColor:t.border},
      chatPanel: {...S.chatPanel, background:t.chatBg},
      chat: {...S.chat},
      promoBar: {...S.promoBar, background: theme==="dark"?"rgba(255,214,10,0.04)":"rgba(217,119,6,0.08)", borderBottomColor: theme==="dark"?"rgba(255,214,10,0.1)":"rgba(217,119,6,0.18)"},
      datePill: {...S.datePill, color:t.subText, background: theme==="dark"?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)", borderColor:t.border},
      bbl: {...S.bbl, background:t.bubble, borderColor:t.border},
      bbbl: {...S.bbbl, background:t.bubble, borderColor:t.border},
      ubble: {...S.ubble, background:t.ubble, borderColor:t.border},
      btext: {...S.btext, color:t.text},
      btime: {...S.btime, color:t.subText},
      typingBubble: {...S.typingBubble, background:t.bubble, borderColor:t.border},
      chipsRow: {...S.chipsRow, background:t.chatBg, borderTopColor:t.border},
      chip: {...S.chip, background: theme==="dark"?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)", borderColor:t.border, color:t.text},
      inputRow: {...S.inputRow, background:t.hdrBg, borderTopColor:t.border},
      inputBox: {...S.inputBox, background: theme==="dark"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)", borderColor:t.border},
      inp: {...S.inp, color:t.text},
      icoBtn: {...S.icoBtn, color:t.subText},
    };
  };
  const styled = getStyles(theme);

  return (
    <div style={styled.root}>
      <style>{`
        :root {
          --bg: ${t.bg};
          --hdrBg: ${t.hdrBg};
          --sidebarBg: ${t.sidebarBg};
          --chatBg: ${t.chatBg};
          --text: ${t.text};
          --subText: ${t.subText};
          --border: ${t.border};
          --bubble: ${t.bubble};
        }
        body { background: var(--bg); color: var(--text); }
        ${CSS}
      `}</style>

      {/* ══ TOP HEADER — full width ══ */}
      <header style={styled.hdr}>
        <div style={S.hLeft}>
          <div style={S.hLogo}>
            <span style={{fontSize:22}}>🤖</span>
            <div style={S.hRing}/>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <span style={styled.hName}>BharatBuddy</span>
              {isPrem&&<span style={S.premTag}>✦ PRO</span>}
            </div>
            <div style={styled.hSub}><span style={S.onDot}/>{tr.online}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button style={{background:"rgba(255,214,10,0.15)",border:"1px solid rgba(255,214,10,0.3)",borderRadius:12,color:theme==="dark"?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.6)",fontSize:13,padding:"6px 12px",cursor:"default",fontFamily:"inherit",transition:"all 0.2s",fontWeight:600}}>
            🇮🇳 हिंदी
          </button>
          <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{background:theme==="dark"?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)",border:`1px solid ${theme==="dark"?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`,borderRadius:12,color:theme==="dark"?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.6)",fontSize:16,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            {theme==="dark"?"☀️":"🌙"}
          </button>
          {!isPrem&&<button onClick={()=>setSubScr(true)} style={S.upBtn}>⭐ ₹99 {tr.premium}</button>}
        </div>
      </header>

      {/* ══ BODY: LEFT sidebar + RIGHT chat ══ */}
      <div style={S.body}>

        {/* ── LEFT: SERVICES SIDEBAR ── */}
        <div style={styled.sidebar}>
          {/* Sidebar header */}
          <div style={S.sbHdr}>
            <span style={{...S.sbTitle, color:t.text}}>{tr.services}</span>
            <span style={styled.sbCount}>{SVCS.length} Total</span>
          </div>

          <div style={S.sbScroll}>
            {/* FREE */}
            <div style={S.sbSection}>
              <div style={{...S.sbSectionLabel, color:t.text}}>
                <div style={{...S.sbPip, background:"#00D09C"}}/>
                <span style={{fontWeight:900}}>{tr.free}</span>
                <span style={S.sbFreeChip}>{FREE.length}</span>
              </div>
              {FREE.map(s=><SidebarTile key={s.id} s={s} onSvc={onSvc} active={panel===s.id} theme={theme} lang={lang}/>)}
            </div>

            {/* DIVIDER */}
            <div style={S.sbDivider}>
              <div style={{...S.sbDivLine, background:theme==="dark"?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}}/>
              <span style={{...S.sbDivText, color:theme==="dark"?"#FFD60A":"#D97706"}}>✦ {lang === "hi" ? "प्रीमियम" : "PREMIUM"}</span>
              <div style={{...S.sbDivLine, background:theme==="dark"?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}}/>
            </div>

            {/* PRO */}
            <div style={S.sbSection}>
              <div style={{...S.sbSectionLabel, color:t.text}}>
                <div style={{...S.sbPip, background:"#FFD60A"}}/>
                <span style={{fontWeight:900}}>{tr.premium}</span>
                <span style={S.sbProChip}>₹99</span>
              </div>
              {PRO.map(s=><SidebarTile key={s.id} s={s} onSvc={onSvc} active={panel===s.id} pro theme={theme} lang={lang}/>)}
            </div>
          </div>

          {/* Sidebar footer */}
          {!isPrem&&(
            <button onClick={()=>setSubScr(true)} style={S.sbUpgrade}>
              <span style={{fontSize:16}}>⭐</span>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{tr.getPremium}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.55)"}}>{tr.premiumPrice}</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:16}}>→</span>
            </button>
          )}
        </div>

        {/* ── RIGHT: CHAT PANEL ── */}
        <div style={styled.chatPanel}>

          {/* Promo bar */}
          {!isPrem&&(
            <div onClick={()=>setSubScr(true)} style={styled.promoBar}>
              <span>🔒</span>
              <span style={{fontSize:11,color:t.subText}}>{tr.promoText}<b style={{color:theme==="dark"?"#FFD60A":"#B45309"}}>{tr.promoHighlight}</b></span>
              <span style={{marginLeft:"auto",color:theme==="dark"?"#FFD60A":"#B45309",fontWeight:800,fontSize:11}}>{tr.upgrade}</span>
            </div>
          )}

          {/* Chat messages */}
          <div style={styled.chat} ref={chatR}>
            <div style={styled.datePill}>{new Date().toLocaleDateString(lang==="hi"?"hi-IN":"en-IN",{weekday:"long",day:"numeric",month:"long"})}</div>

            {panel==="medicine"&&<MedPane  onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="expense" &&<ExpPane  onClose={()=>setPanel(null)}/>}
            {panel==="family"  &&<FamPane  onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="finance" &&<FinPane  onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="shopping"&&<ShopPane onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="kisan"   &&<KisanPane onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="location"&&<LocPane  onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="report"  &&<RepPane  onClose={()=>setPanel(null)}/>}
            {panel==="weather" &&<WPane    onClose={()=>setPanel(null)} onAi={ai}/>}
            {panel==="whatsapp"&&<WhatsAppPane onClose={()=>setPanel(null)} theme={theme}/>}

            {msgs.map(m=><Bubble key={m.id} m={m} onSvc={onSvc} onBtn={ai} bbl={styled.bbl} bbbl={styled.bbbl} ubble={styled.ubble} btext={styled.btext} btime={styled.btime}/>)}

            {load&&(
              <div style={{display:"flex",gap:8,alignItems:"flex-end",marginBottom:8}}>
                <Av/>
                <div style={styled.typingBubble}><Dot d={0} color={theme==="dark"?"rgba(255,255,255,0.25)":"rgba(15,23,42,0.35)"}/><Dot d={.18} color={theme==="dark"?"rgba(255,255,255,0.25)":"rgba(15,23,42,0.35)"}/><Dot d={.36} color={theme==="dark"?"rgba(255,255,255,0.25)":"rgba(15,23,42,0.35)"}/></div>
              </div>
            )}

            <div ref={endR}/>
          </div>

          {/* Quick chips */}
          <div style={styled.chipsRow}>
            {quickChips.map((c,i)=>(
              <button key={i} onClick={()=>{
                const map={"💊":"medicine","💸":"expense","🏛":"schemes","🛒":"shopping","🏦":"finance","📍":"location","📊":"report"};
                const sv=Object.entries(map).find(([k])=>c.startsWith(k));
                sv?onSvc(sv[1]):ai(c);
              }} style={styled.chip}>{c}</button>
            ))}
          </div>

          {/* Rec bar */}
          {rec&&(
            <div style={S.recBar}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#FF4E6A",animation:"pulse 0.8s infinite"}}/>
              <span style={{fontSize:12,color:"#FF4E6A",fontWeight:700,flex:1}}>🎤 {lang==="hi"?"बोल रहे हो...":"Listening..."}</span>
              <button onClick={voice} style={{background:"transparent",border:"none",color:"#FF4E6A",cursor:"pointer",fontWeight:700}}>✕</button>
            </div>
          )}

          {/* Input */}
          <input ref={filR} type="file" accept="image/*" style={{display:"none"}} onChange={photo}/>
          <div style={styled.inputRow}>
            <button onClick={()=>filR.current?.click()} style={styled.icoBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </button>
            <div style={styled.inputBox}>
              <input ref={inpR} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&input.trim()&&ai(input)}
                placeholder={rec?tr.listening:tr.placeholder}
                style={styled.inp} disabled={rec}/>
            </div>
            <button onClick={input.trim()?()=>ai(input):voice}
              style={{...S.sendBtn,background:input.trim()?"linear-gradient(135deg,#00D09C,#00916E)":rec?"#FF4E6A":"linear-gradient(135deg,#FF8C42,#D4650C)"}}>
              {input.trim()
                ?<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/></svg>
                :rec?<span style={{fontSize:16}}>⏹</span>
                :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR TILE
═══════════════════════════════════════════════ */
function SidebarTile({s, onSvc, active, pro, theme, lang="hi"}) {
  const [hov, setHov] = useState(false);
  const on = hov || active;
  const t = THEMES[theme];
  const txt = SVC_TEXT[lang]?.[s.id] || { label: s.label, sub: s.sub };
  return (
    <button
      onClick={()=>onSvc(s.id)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%",
        display:"flex",
        alignItems:"center",
        gap:12,
        padding:"11px 14px",
        background: active ? `linear-gradient(${s.grd.replace("135deg,","")})` : hov ? `${s.col}12` : "transparent",
        border: `1px solid ${active ? "transparent" : hov ? `${s.col}40` : "transparent"}`,
        borderRadius:14,
        cursor:"pointer",
        fontFamily:"inherit",
        textAlign:"left",
        transition:"all 0.18s",
        position:"relative",
        marginBottom:3,
        boxShadow: active ? `0 4px 18px ${s.col}45` : "none",
      }}>
      {active && <div style={{position:"absolute",left:0,top:"20%",height:"60%",width:3,background:"#fff",borderRadius:"0 3px 3px 0"}}/>}
      {pro && (
        <div style={{position:"absolute",top:6,right:8,background: active?"rgba(255,255,255,0.2)":"rgba(255,214,10,0.15)",border:`1px solid ${active?"rgba(255,255,255,0.3)":"rgba(255,214,10,0.3)"}`,borderRadius:6,padding:"1px 5px",fontSize:8,color:active?"#fff":"#FFD60A",fontWeight:800}}>PRO</div>
      )}
      <div style={{
        width:42, height:42, borderRadius:13, flexShrink:0,
        background: on ? "rgba(255,255,255,0.18)" : `${s.col}18`,
        border: `1.5px solid ${on ? "rgba(255,255,255,0.25)" : `${s.col}40`}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22,
        boxShadow: on ? `0 4px 12px ${s.col}66` : "none",
        transition:"all 0.18s",
      }}>{s.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:900,color: on?"#fff":t.text,letterSpacing:"-0.2px",lineHeight:1.2}}>{txt.label}</div>
        <div style={{fontSize:10,fontWeight:600,color: on?"rgba(255,255,255,0.7)":t.subText,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{txt.sub}</div>
      </div>
    </button>
  );
}


function SubScreen({onBack,onOk}) {
  const [pay,setPay]=useState(false);
  const [plan,setPlan]=useState("m");
  const PERKS=[
    {i:"👨‍👩‍👧",l:"Family Manager",s:"5 members, reminders"},
    {i:"🏦",l:"Loan & Finance",s:"EMI calculator, credit"},
    {i:"🛒",l:"Shopping Deals",s:"3 platforms compare"},
    {i:"🌾",l:"Kisan Tools",s:"Mandi, fasal guide"},
    {i:"📍",l:"Near Me",s:"Hospital, pharmacy"},
    {i:"📊",l:"Monthly Report",s:"PDF + AI insights"},
    {i:"⚖",l:"Legal Rights",s:"RTI, FIR guide"},
    {i:"📚",l:"Homework Help",s:"Class 1-12 Hindi"},
    {i:"🔔",l:"Smart Alerts",s:"Deadlines, bills"},
    {i:"📄",l:"Documents",s:"Aadhaar, PAN guide"},
  ];
  return (
    <div style={{...S.root}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 55% at 50% -5%,rgba(255,140,66,0.18),transparent),radial-gradient(ellipse 70% 45% at 90% 90%,rgba(0,208,156,0.12),transparent)",pointerEvents:"none",zIndex:0}}/>

      <header style={{...S.hdr,position:"relative",zIndex:1}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"rgba(255,255,255,0.6)",fontSize:13,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:15,fontWeight:800,color:"#F1F5F9"}}>Premium Membership</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>सब unlock करें</div>
        </div>
        <div style={{width:60}}/>
      </header>

      <div style={{flex:1,overflowY:"auto",padding:"18px 16px",position:"relative",zIndex:1}}>
        {/* Hero */}
        <div style={{background:"linear-gradient(135deg,rgba(255,140,66,0.12),rgba(0,208,156,0.08))",borderRadius:24,padding:"26px 20px",marginBottom:18,border:"1px solid rgba(255,140,66,0.22)",textAlign:"center",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-50,right:-50,width:140,height:140,borderRadius:"50%",background:"rgba(255,214,10,0.06)",filter:"blur(40px)"}}/>
          <div style={{fontSize:60,marginBottom:10,filter:"drop-shadow(0 8px 16px rgba(255,184,0,0.4))"}}>⭐</div>
          <div style={{fontSize:26,fontWeight:900,color:"#F1F5F9",letterSpacing:"-0.6px",lineHeight:1.2,marginBottom:6}}>BharatBuddy<br/>Premium</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>16 AI Services • Hindi • Daily Life Manager</div>
        </div>

        {/* Plan toggle */}
        <div style={{background:"#0B1120",borderRadius:18,padding:5,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
          {[["m","₹99","Monthly",""],["y","₹79","Yearly","Save 20%"]].map(([p,price,sub,tag])=>(
            <button key={p} onClick={()=>setPlan(p)} style={{background:plan===p?"linear-gradient(135deg,#FF8C42,#D4650C)":"transparent",border:"none",borderRadius:14,padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.25s",position:"relative"}}>
              {tag&&plan===p&&<div style={{position:"absolute",top:-6,right:8,background:"#00D09C",borderRadius:20,padding:"2px 8px",fontSize:9,color:"#000",fontWeight:800}}>{tag}</div>}
              <div style={{fontSize:20,fontWeight:900,color:plan===p?"#fff":"rgba(255,255,255,0.35)"}}>{price}<span style={{fontSize:11}}>/mo</span></div>
              <div style={{fontSize:10,color:plan===p?"rgba(255,255,255,0.65)":"rgba(255,255,255,0.2)",marginTop:2}}>{sub}</div>
            </button>
          ))}
        </div>

        {/* Perks */}
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>✦ Premium में मिलेगा</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {PERKS.map((p,i)=>(
            <div key={i} style={{background:"#0F1929",borderRadius:14,padding:"12px 13px",border:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:9}}>
              <div style={{fontSize:22,flexShrink:0}}>{p.i}</div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#E2E8F0"}}>{p.l}</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,0.35)",marginTop:2,lineHeight:1.4}}>{p.s}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        {[{n:"Ramesh Kumar, Delhi",t:"PM Kisan status घर बैठे — बहुत helpful! 🙏"},{n:"Priya Sharma, Lucknow",t:"बच्चों की दवाई एक भी miss नहीं हुई!"}].map((x,i)=>(
          <div key={i} style={{background:"#0F1929",borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <div style={{fontSize:11,fontWeight:700,color:"#E2E8F0"}}>{x.n}</div>
              <div style={{fontSize:11}}>⭐⭐⭐⭐⭐</div>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>"{x.t}"</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{padding:"12px 16px 20px",background:"rgba(11,17,32,0.97)",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
        <button onClick={()=>{setPay(true);setTimeout(()=>{setPay(false);onOk();},1800);}} disabled={pay}
          style={{width:"100%",background:pay?"rgba(255,255,255,0.04)":"linear-gradient(135deg,#FF8C42,#D4650C)",border:"none",borderRadius:18,padding:"17px",cursor:pay?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:pay?"none":"0 10px 40px rgba(255,140,66,0.45)",transition:"all 0.3s"}}>
          {pay?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.15)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:700}}>Processing...</span>
            </div>
          ):(
            <>
              <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>✦ {plan==="m"?"₹99/month":"₹948/year"} — Premium लें</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:3}}>UPI • Card • NetBanking • Razorpay</div>
            </>
          )}
        </button>
        <div style={{textAlign:"center",marginTop:10,fontSize:10,color:"rgba(255,255,255,0.2)"}}>🔒 Secure Payment • Cancel anytime • No hidden charges</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MENU CARD — BEST DESIGN EVER
═══════════════════════════════════════════════ */
function Bubble({m,onSvc,onBtn,bbl,bbbl,ubble,btext,btime}) {
  if(m.type==="menu")  return <MenuCard onSvc={onSvc}/>;
  if(m.type==="btns")  return <BtnRow items={m.items} onBtn={onBtn}/>;
  if(m.type==="photo") return (
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
      <div style={{...ubble,padding:4,borderRadius:18}}>
        <img src={m.src} style={{width:190,height:140,objectFit:"cover",borderRadius:14,display:"block"}} alt=""/>
        <div style={{...btime,padding:"3px 8px"}}>Analyzing 🔍 ✓✓</div>
      </div>
    </div>
  );
  const isU=m.type==="user";
  return (
    <div style={{display:"flex",justifyContent:isU?"flex-end":"flex-start",marginBottom:6,animation:"fadeUp 0.2s ease",gap:8,alignItems:"flex-end"}}>
      {!isU&&<Av/>}
      <div style={{...bbl,...(isU?ubble:bbbl),maxWidth:"80%"}}>
        <div style={btext}>{fmt(m.text)}</div>
        <div style={btime}>{m.time}{isU&&" ✓✓"}</div>
      </div>
    </div>
  );
}

function MenuCard({onSvc}) {
  const FREE = SVCS.filter(s=>s.free);
  const PRO  = SVCS.filter(s=>!s.free);
  return (
    <div style={MC.wrap}>
      {/* ── FREE SECTION ── */}
      <div style={MC.section}>
        <div style={MC.grid}>
          {FREE.map(s=><SvcTile key={s.id} s={s} onSvc={onSvc}/>)}
        </div>
      </div>

      {/* ── PRO SECTION ── */}
      <div style={MC.section}>
        <div style={MC.grid}>
          {PRO.map(s=><SvcTile key={s.id} s={s} onSvc={onSvc} pro/>)}
        </div>
      </div>
    </div>
  );
}

function SvcTile({s, onSvc, pro}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={()=>onSvc(s.id)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",
        background: hov ? `linear-gradient(${s.grd})` : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${hov ? "transparent" : `${s.col}40`}`,
        borderRadius: 20,
        padding: "13px 14px",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.22s cubic-bezier(.34,1.4,.64,1)",
        transform: hov ? "scale(1.02)" : "none",
        boxShadow: hov ? `0 8px 28px ${s.col}55` : "0 1px 4px rgba(0,0,0,0.3)",
        overflow:"hidden",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:14,
      }}>
      {hov && <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.12),transparent 55%)",borderRadius:20,pointerEvents:"none"}}/>}
      {pro && (
        <div style={{position:"absolute",top:7,right:9,background:hov?"rgba(255,255,255,0.2)":"rgba(255,214,10,0.15)",border:`1px solid ${hov?"rgba(255,255,255,0.4)":"rgba(255,214,10,0.35)"}`,borderRadius:7,padding:"2px 6px",fontSize:9,color:hov?"#fff":"#FFD60A",fontWeight:800,lineHeight:1.6}}>PRO</div>
      )}
      <div style={{width:54,height:54,borderRadius:16,background:hov?"rgba(255,255,255,0.2)":`${s.col}20`,border:`2px solid ${hov?"rgba(255,255,255,0.3)":`${s.col}50`}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:hov?`0 6px 18px ${s.col}88`:`0 2px 8px ${s.col}28`,transition:"all 0.22s"}}>{s.icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:900,color:hov?"#fff":"#F1F5F9",lineHeight:1.25,letterSpacing:"-0.2px"}}>{s.label}</div>
        <div style={{fontSize:11,fontWeight:600,color:hov?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.42)",marginTop:3,lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.sub}</div>
      </div>
    </button>
  );
}

const MC = {
  wrap:       {background:"#0C1524",borderRadius:24,marginBottom:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)",animation:"slideUp 0.35s cubic-bezier(.34,1.4,.64,1)",boxShadow:"0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)"},
  brand:      {background:"linear-gradient(135deg,#0F2039,#091527)",padding:"16px 18px",display:"flex",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"},
  brandGlow:  {position:"absolute",top:-60,left:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,140,66,0.07)",filter:"blur(50px)",pointerEvents:"none"},
  brandLeft:  {display:"flex",alignItems:"center",gap:12,flex:1},
  brandIcon:  {width:46,height:46,background:"linear-gradient(135deg,#FF8C42,#D4650C)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 6px 20px rgba(255,140,66,0.4)",flexShrink:0},
  brandName:  {fontSize:17,fontWeight:900,color:"#F1F5F9",letterSpacing:"-0.4px"},
  brandSub:   {fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2},
  brandRight: {display:"flex",alignItems:"center",gap:14},
  brandStat:  {display:"flex",flexDirection:"column",alignItems:"center",gap:1},
  section:    {padding:"12px 14px 8px"},
  sectionHdr: {display:"flex",alignItems:"center",gap:7,marginBottom:10},
  sectionPip: {width:7,height:7,borderRadius:"50%",flexShrink:0},
  sectionTitle:{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.8px"},
  freeChip:   {marginLeft:"auto",background:"rgba(0,208,156,0.12)",border:"1px solid rgba(0,208,156,0.25)",borderRadius:20,padding:"2px 10px",fontSize:9.5,color:"#00D09C",fontWeight:700},
  proChip:    {marginLeft:"auto",background:"rgba(255,214,10,0.12)",border:"1px solid rgba(255,214,10,0.25)",borderRadius:20,padding:"2px 10px",fontSize:9.5,color:"#FFD60A",fontWeight:700},
  grid:       {display:"flex",flexDirection:"column",gap:7},
  divider:    {display:"flex",alignItems:"center",gap:12,padding:"4px 16px 0"},
  divLine:    {flex:1,height:1,background:"rgba(255,255,255,0.05)"},
  divBadge:   {background:"linear-gradient(135deg,rgba(255,214,10,0.15),rgba(255,140,66,0.1))",border:"1px solid rgba(255,214,10,0.25)",borderRadius:20,padding:"4px 14px",fontSize:9.5,color:"#FFD60A",fontWeight:800,letterSpacing:"1.2px",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"},
  foot:       {background:"rgba(0,0,0,0.25)",padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:4},
  footInner:  {display:"flex",justifyContent:"center",flexWrap:"wrap",gap:"6px 14px"},
  footItem:   {fontSize:9.5,color:"rgba(255,255,255,0.25)",fontWeight:600},
};

/* ═══════════════════════════════════════════════
   PANELS
═══════════════════════════════════════════════ */
function Pane({icon,title,sub,col,onClose,children}) {
  return (
    <div style={{background:"#0C1524",borderRadius:22,marginBottom:12,overflow:"hidden",border:`1px solid ${col}28`,animation:"slideUp 0.3s cubic-bezier(.34,1.4,.64,1)",boxShadow:`0 20px 60px rgba(0,0,0,0.7),0 0 0 1px ${col}18`}}>
      <div style={{background:`linear-gradient(135deg,${col}15,transparent)`,padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${col}12`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,background:`${col}18`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`1.5px solid ${col}30`,boxShadow:`0 4px 14px ${col}30`,flexShrink:0}}>{icon}</div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#F1F5F9",letterSpacing:"-0.3px"}}>{title}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:1}}>{sub}</div>
          </div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.45)",fontSize:11,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,transition:"all 0.15s"}}>✕ Close</button>
      </div>
      {children}
    </div>
  );
}

function MedPane({onClose,onAi}) {
  const [rems,setR]=useState([{n:"Metformin 500mg",t:"08:00",done:true,c:"#FF4E6A"},{n:"Vitamin D3",t:"13:00",done:true,c:"#FF8C42"},{n:"Amlodipine 5mg",t:"21:00",done:false,c:"#A78BFF"}]);
  const [nn,sNn]=useState(""); const [nt,sNt]=useState("08:00"); const [add,sAdd]=useState(false);
  const done=rems.filter(r=>r.done).length;
  return (
    <Pane icon="💊" title="Medicine Manager" sub={`${done}/${rems.length} आज ली`} col="#FF4E6A" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{height:5,background:"rgba(255,78,106,0.1)",borderRadius:3,marginBottom:12}}>
          <div style={{width:`${(done/rems.length)*100}%`,height:"100%",background:done===rems.length?"#00D09C":"#FF4E6A",borderRadius:3,transition:"width 0.6s ease"}}/>
        </div>
        {rems.map((r,i)=>(
          <div key={i} onClick={()=>setR(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x))}
            style={{display:"flex",alignItems:"center",gap:10,background:r.done?"rgba(0,208,156,0.05)":"rgba(255,255,255,0.03)",borderRadius:14,padding:"11px 13px",marginBottom:7,cursor:"pointer",border:`1px solid ${r.done?"rgba(0,208,156,0.18)":"rgba(255,255,255,0.06)"}`,transition:"all 0.2s"}}>
            <div style={{width:38,height:38,borderRadius:12,background:r.done?"rgba(0,208,156,0.12)":`${r.c}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,border:`1.5px solid ${r.done?"rgba(0,208,156,0.25)":`${r.c}25`}`}}>{r.done?"✅":"💊"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:r.done?"rgba(255,255,255,0.25)":"#E2E8F0",textDecoration:r.done?"line-through":"none"}}>{r.n}</div>
              <div style={{fontSize:10,color:r.done?"rgba(255,255,255,0.15)":r.c,marginTop:2}}>⏰ {r.t} • रोज़</div>
            </div>
            <span style={{fontSize:10,fontWeight:700,color:r.done?"#00D09C":"rgba(255,255,255,0.18)",background:r.done?"rgba(0,208,156,0.1)":"transparent",padding:"3px 9px",borderRadius:20,border:`1px solid ${r.done?"rgba(0,208,156,0.2)":"transparent"}`}}>{r.done?"ली ✓":"बाकी"}</span>
          </div>
        ))}
        {add?(
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:13,padding:12,border:"1px solid rgba(255,255,255,0.08)",marginBottom:8}}>
            <input value={nn} onChange={e=>sNn(e.target.value)} placeholder="दवाई का नाम..." style={S.inp2}/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input type="time" value={nt} onChange={e=>sNt(e.target.value)} style={{...S.inp2,flex:1}}/>
              <button onClick={()=>{if(nn){setR(p=>[...p,{n:nn,t:nt,done:false,c:"#FF8C42"}]);sNn("");sAdd(false);}}} style={S.abtn}>Add</button>
            </div>
          </div>
        ):(
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>sAdd(true)} style={{...S.abtn,flex:1}}>+ नई दवाई</button>
            <button onClick={()=>onAi("Medicine tips batao")} style={{...S.abtn,flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>🤖 AI Tips</button>
          </div>
        )}
      </div>
    </Pane>
  );
}

function ExpPane({onClose}) {
  const CATS=[{e:"🍛",c:"#FF8C42"},{e:"🚗",c:"#4E9FFF"},{e:"💊",c:"#FF4E6A"},{e:"📚",c:"#A78BFF"},{e:"🏠",c:"#00D09C"},{e:"📦",c:"#78909C"}];
  const [exps,sE]=useState([{cat:"🍛",l:"किराना",a:350,t:"आज"},{cat:"🚗",l:"Auto",a:80,t:"आज"},{cat:"💊",l:"दवाई",a:200,t:"कल"}]);
  const [amt,sA]=useState(""); const [lbl,sL]=useState(""); const [cat,sC]=useState("🍛");
  const tot=exps.filter(e=>e.t==="आज").reduce((s,e)=>s+e.a,0);
  return (
    <Pane icon="💸" title="खर्च Tracker" sub={`आज: ₹${tot}`} col="#FF8C42" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {CATS.map(({e,c})=><button key={e} onClick={()=>sC(e)} style={{fontSize:20,width:38,height:38,borderRadius:11,background:cat===e?`${c}22`:"rgba(255,255,255,0.04)",border:cat===e?`2px solid ${c}`:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",transition:"all 0.15s"}}>{e}</button>)}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:10}}>
          <input value={lbl} onChange={e=>sL(e.target.value)} placeholder="क्या खर्च?" style={{...S.inp2,flex:1}}/>
          <input value={amt} onChange={e=>sA(e.target.value)} type="number" placeholder="₹" style={{...S.inp2,width:75}}/>
          <button onClick={()=>{if(amt&&lbl){sE(p=>[{cat,l:lbl,a:parseInt(amt),t:"आज"},...p]);sA("");sL("");}}} style={S.abtn}>✓</button>
        </div>
        <div style={{overflowY:"auto",maxHeight:150}}>
          {exps.map((e,i)=>{const cc=CATS.find(x=>x.e===e.cat)?.c||"#888"; return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"10px 12px",marginBottom:6,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{width:34,height:34,borderRadius:10,background:`${cc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,border:`1.5px solid ${cc}25`}}>{e.cat}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#E2E8F0"}}>{e.l}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{e.t}</div></div>
              <div style={{fontSize:13,fontWeight:800,color:cc}}>₹{e.a}</div>
            </div>
          );})}
        </div>
      </div>
    </Pane>
  );
}

function FamPane({onClose,onAi}) {
  const [sel,sSel]=useState(null);
  return (
    <Pane icon="👨‍👩‍👧" title="Family Manager" sub={`${FAM.length} members`} col="#FF6BB5" onClose={onClose}>
      <div style={{padding:"10px 16px"}}>
        {!sel?FAM.map((m,i)=>(
          <div key={i} onClick={()=>sSel(m)} style={{display:"flex",alignItems:"center",gap:11,background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"12px 13px",marginBottom:7,cursor:"pointer",border:`1px solid ${m.c}20`,transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background=`${m.c}10`}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
            <div style={{width:44,height:44,borderRadius:14,background:`${m.c}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23,flexShrink:0,border:`1.5px solid ${m.c}28`}}>{m.e}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#E2E8F0"}}>{m.name} <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>• {m.age} साल</span></div>
              <div style={{fontSize:10,color:m.c,marginTop:2}}>💊 {m.r.length} reminders</div>
            </div>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:18}}>›</span>
          </div>
        )):(
          <>
            <button onClick={()=>sSel(null)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.5)",fontSize:11,padding:"5px 12px",cursor:"pointer",marginBottom:10}}>← Back</button>
            <div style={{background:`${sel.c}12`,borderRadius:16,padding:"13px 15px",marginBottom:10,border:`1.5px solid ${sel.c}22`,display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:38}}>{sel.e}</span>
              <div><div style={{fontSize:16,fontWeight:800,color:"#F1F5F9"}}>{sel.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{sel.age} साल</div></div>
            </div>
            {sel.r.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:9,background:"rgba(255,255,255,0.03)",borderRadius:11,padding:"9px 12px",marginBottom:6,border:"1px solid rgba(255,255,255,0.06)"}}>
                <span>⏰</span><span style={{fontSize:12,color:"#E2E8F0",flex:1}}>{r}</span><span style={{fontSize:10,color:"#00D09C",fontWeight:700}}>Active ✓</span>
              </div>
            ))}
            <button onClick={()=>onAi(`${sel.name} ke liye health tips, age ${sel.age}`)} style={{...S.abtn,width:"100%",marginTop:6}}>🤖 AI Health Tips</button>
          </>
        )}
        {!sel&&<button style={{...S.abtn,width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.4)"}}>+ Member जोड़ें</button>}
      </div>
    </Pane>
  );
}

function FinPane({onClose,onAi}) {
  const [L,sL]=useState(""); const [R,sR]=useState(""); const [M,sM]=useState(""); const [emi,sE]=useState(null);
  const calc=()=>{const P=+L,r=+R/12/100,n=+M;if(!P||!r||!n)return;const e=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);sE({m:Math.round(e),t:Math.round(e*n),i:Math.round(e*n-P)});};
  return (
    <Pane icon="🏦" title="Loan & Finance" sub="EMI Calculator" col="#A78BFF" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        {[["Loan Amount ₹",L,sL,"₹ e.g. 500000"],["Interest Rate %",R,sR,"e.g. 8.5"],["Tenure (Months)",M,sM,"e.g. 60"]].map(([l,v,s,p],i)=>(
          <div key={i} style={{marginBottom:9}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:700,marginBottom:4,letterSpacing:"0.4px",textTransform:"uppercase"}}>{l}</div>
            <input value={v} onChange={e=>s(e.target.value)} type="number" placeholder={p} style={{...S.inp2,width:"100%"}}/>
          </div>
        ))}
        <button onClick={calc} style={{...S.abtn,width:"100%",background:"linear-gradient(135deg,#A78BFF,#6D28D9)",marginBottom:10}}>🧮 Calculate EMI</button>
        {emi&&(
          <div style={{background:"rgba(167,139,255,0.08)",borderRadius:16,padding:"14px",border:"1px solid rgba(167,139,255,0.2)",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center",marginBottom:10}}>
              {[["Monthly EMI",`₹${emi.m.toLocaleString()}`,"#A78BFF",true],["Total Amt",`₹${emi.t.toLocaleString()}`,"#FF8C42",false],["Interest",`₹${emi.i.toLocaleString()}`,"#FF4E6A",false]].map(([l,v,c,b],i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 6px",border:`1px solid ${c}22`}}>
                  <div style={{fontSize:b?17:13,fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>onAi(`Loan ₹${L} ke liye financial advice do`)} style={{...S.abtn,width:"100%",fontSize:11}}>🤖 AI Advice</button>
          </div>
        )}
      </div>
    </Pane>
  );
}

function ShopPane({onClose,onAi}) {
  const [q,sQ]=useState(""); const [res,sR]=useState(null); const [ld,sLd]=useState(false);
  const go=()=>{if(!q.trim())return;sLd(true);const f=DEALS.find(d=>d.item.toLowerCase().includes(q.toLowerCase()));setTimeout(()=>{sR(f||"none");sLd(false);},700);};
  return (
    <Pane icon="🛒" title="Shopping Assistant" sub="Amazon vs Flipkart vs Meesho" col="#FFD60A" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:7,marginBottom:10}}>
          <input value={q} onChange={e=>sQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Product search करें..." style={{...S.inp2,flex:1}}/>
          <button onClick={go} style={{...S.abtn,background:"linear-gradient(135deg,#FFD60A,#D97706)"}}>{ld?"⏳":"🔍"}</button>
        </div>
        {res&&res!=="none"&&(
          <div style={{background:"rgba(255,214,10,0.05)",borderRadius:16,padding:"12px",border:"1px solid rgba(255,214,10,0.18)",animation:"fadeUp 0.3s ease",marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:700,color:"#F1F5F9",marginBottom:8}}>{res.item}</div>
            {[["🛒 Amazon",res.a,"#FF9900",false],["🛍 Flipkart",res.f,"#2874F0",false],["👗 Meesho",res.m,"#A78BFF",true]].map(([s,p,c,best],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:best?"rgba(0,208,156,0.07)":"rgba(255,255,255,0.03)",borderRadius:10,padding:"9px 12px",marginBottom:5,border:best?"1px solid rgba(0,208,156,0.22)":"1px solid rgba(255,255,255,0.06)"}}>
                <span style={{fontSize:11,color:best?"#E2E8F0":"rgba(255,255,255,0.5)"}}>{s}</span>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:800,color:c}}>{p}</span>
                  {best&&<span style={{fontSize:9,background:"rgba(0,208,156,0.15)",color:"#00D09C",padding:"2px 8px",borderRadius:10,fontWeight:800}}>BEST ✓</span>}
                </div>
              </div>
            ))}
            <div style={{background:"rgba(0,208,156,0.07)",borderRadius:10,padding:"9px 12px",marginTop:6,border:"1px solid rgba(0,208,156,0.18)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00D09C"}}>💰 Meesho पर खरीदें → {res.save} बचेंगे!</div>
            </div>
          </div>
        )}
        {res==="none"&&<div style={{textAlign:"center",padding:"10px 0"}}><div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:8}}>नहीं मिला 😔</div><button onClick={()=>onAi(`${q} ke liye best deal`)} style={{...S.abtn,fontSize:11}}>🤖 AI से पूछें</button></div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:4}}>
          {["Realme 12 Pro","Cooker","Earbuds"].map((p,i)=><button key={i} onClick={()=>sQ(p)} style={S.qBtn}>{p}</button>)}
        </div>
      </div>
    </Pane>
  );
}

function KisanPane({onClose,onAi}) {
  return (
    <Pane icon="🌾" title="Kisan Help" sub="Mandi Prices • Fasal • Yojana" col="#7EE787" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>📊 आज की Mandi Rates</div>
        {MANDI.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"10px 13px",marginBottom:6,border:"1px solid rgba(126,231,135,0.1)"}}>
            <span style={{fontSize:12,fontWeight:600,color:"#E2E8F0"}}>{m.c}</span>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:"#7EE787"}}>{m.p}/क्विंटल</div><div style={{fontSize:10,color:m.u?"#00D09C":"#FF4E6A"}}>{m.d} {m.u?"↑":"↓"}</div></div>
          </div>
        ))}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
          {["🌧 मौसम","🐛 बीमारी","💊 खाद","🏛 Schemes"].map((b,i)=><button key={i} onClick={()=>{onClose();onAi(b);}} style={S.qBtn}>{b}</button>)}
        </div>
      </div>
    </Pane>
  );
}

function LocPane({onClose,onAi}) {
  const [loc,sLoc]=useState(false); const [cat,sCat]=useState("h");
  const NEAR={h:["🏥 AIIMS Delhi — 2.3 km","🏥 Safdarjung — 3.1 km","🏥 RML — 4.2 km"],p:["💊 Apollo Pharmacy — 0.4 km","💊 MedPlus — 0.8 km","💊 Jan Aushadhi — 1.2 km"],b:["🩸 Blood Bank AIIMS — 2.3 km","🩸 Red Cross — 3.5 km"]};
  return (
    <Pane icon="📍" title="Near Me" sub="GPS based nearby services" col="#22D3EE" onClose={onClose}>
      {!loc?(
        <div style={{padding:"18px 16px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:10}}>📍</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:16}}>GPS से nearby services ढूंढें</div>
          <button onClick={()=>sLoc(true)} style={{...S.abtn,background:"linear-gradient(135deg,#22D3EE,#0E7490)"}}>📍 Location Allow करें</button>
        </div>
      ):(
        <div style={{padding:"10px 16px 12px"}}>
          <div style={{fontSize:10,color:"#00D09C",background:"rgba(0,208,156,0.07)",borderRadius:9,padding:"5px 10px",marginBottom:10,border:"1px solid rgba(0,208,156,0.18)"}}>📍 New Delhi, India • Updated now ✓</div>
          <div style={{display:"flex",gap:1,background:"rgba(0,0,0,0.3)",borderRadius:10,overflow:"hidden",marginBottom:10}}>
            {[["h","🏥 Hospital"],["p","💊 Pharmacy"],["b","🩸 Blood"]].map(([c,l])=>(
              <button key={c} onClick={()=>sCat(c)} style={{flex:1,background:cat===c?"rgba(34,211,238,0.18)":"transparent",border:"none",color:cat===c?"#22D3EE":"rgba(255,255,255,0.35)",padding:"8px 4px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>
          {NEAR[cat].map((item,i)=>(
            <div key={i} onClick={()=>onAi(item)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.03)",borderRadius:11,padding:"10px 13px",marginBottom:6,cursor:"pointer",border:"1px solid rgba(255,255,255,0.06)",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(34,211,238,0.07)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
              <span style={{fontSize:12,color:"#E2E8F0"}}>{item}</span>
              <span style={{color:"#22D3EE",fontSize:16}}>→</span>
            </div>
          ))}
        </div>
      )}
    </Pane>
  );
}

function RepPane({onClose}) {
  const D=[{c:"🍛 खाना",a:3200,m:4000,g:"#FF8C42"},{c:"🚗 यातायात",a:1800,m:2000,g:"#4E9FFF"},{c:"💊 दवाई",a:800,m:1000,g:"#FF4E6A"},{c:"📚 पढ़ाई",a:500,m:1000,g:"#A78BFF"},{c:"🏠 घर",a:5000,m:5000,g:"#00D09C"}];
  return (
    <Pane icon="📊" title="Monthly Report" sub="March 2026" col="#FBBF24" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[["₹11,300","Total खर्च","#FF8C42"],["87%","Medicine","#00D09C"],["₹4,000","Schemes","#22D3EE"]].map(([v,l,c],i)=>(
            <div key={i} style={{background:`${c}10`,borderRadius:13,padding:"11px 8px",textAlign:"center",border:`1px solid ${c}20`}}>
              <div style={{fontSize:15,fontWeight:900,color:c}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        {D.map((d,i)=>(
          <div key={i} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>{d.c}</span>
              <span style={{fontSize:11,fontWeight:800,color:d.g}}>₹{d.a.toLocaleString()}</span>
            </div>
            <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
              <div style={{width:`${(d.a/d.m)*100}%`,height:"100%",background:d.g,borderRadius:3,transition:"width 1s ease"}}/>
            </div>
          </div>
        ))}
        <button onClick={()=>alert("📊 Real app mein PDF available!")} style={{...S.abtn,width:"100%",background:"linear-gradient(135deg,#FBBF24,#B45309)",color:"#000",marginTop:8,fontWeight:800}}>📥 PDF Download करें</button>
      </div>
    </Pane>
  );
}

function WhatsAppPane({onClose, theme="dark"}) {
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState({ ok:false, users:0, error:"" });
  const t = THEMES[theme];
  const isLight = theme === "light";
  const webhookUrl = `${window.location.origin}/webhook/aisensy`;

  const checkStatus = async () => {
    setChecking(true);
    try {
      const r = await fetch("/health");
      const data = await r.json();
      setStatus({ ok: !!data?.status, users: Number(data?.whatsappUsers || 0), error: "" });
    } catch {
      setStatus({ ok:false, users:0, error:"Server reachable nahi hai" });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkStatus(); }, []);

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      alert("Webhook URL copy ho gaya ✅");
    } catch {
      alert("Copy failed. URL manually copy करें:");
    }
  };

  return (
    <Pane icon="💬" title="WhatsApp AI Bot" sub={status.ok?"Webhook Active ✓":"Setup Required"} col="#25D366" onClose={onClose}>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:isLight?"rgba(37,211,102,0.1)":"rgba(37,211,102,0.08)",borderRadius:14,padding:"11px 14px",marginBottom:12,border:"1px solid rgba(37,211,102,0.24)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:status.ok?"#25D366":"#FF8C42",boxShadow:status.ok?"0 0 10px #25D366":"none"}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:800,color:status.ok?"#25D366":"#FF8C42"}}>{checking?"Status check...":status.ok?"Webhook Connected":"Connection Pending"}</div>
            <div style={{fontSize:10,color:t.subText}}>Active WhatsApp users: {status.users}</div>
          </div>
          <button onClick={checkStatus} style={{...S.abtn,padding:"7px 11px",fontSize:10,background:isLight?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)",color:t.text,border:`1px solid ${t.border}`}}>Refresh</button>
        </div>

        <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:6}}>Setup Steps (AiSensy)</div>
        <div style={{fontSize:11,color:t.subText,lineHeight:1.65,marginBottom:10}}>
          1. AiSensy dashboard me webhook URL set करें।
          <br/>2. URL me yeh use करें: <b style={{color:t.text}}>{webhookUrl}</b>
          <br/>3. Verify token same रखें: <b style={{color:t.text}}>WEBHOOK_VERIFY_TOKEN</b>
          <br/>4. WhatsApp se message bhejke test करें।
        </div>

        {status.error && <div style={{fontSize:11,color:"#FF4E6A",marginBottom:10}}>⚠️ {status.error}</div>}

        <div style={{display:"flex",gap:7}}>
          <button onClick={copyWebhook} style={{...S.abtn,flex:1,background:"linear-gradient(135deg,#25D366,#128C7E)"}}>📋 Webhook Copy</button>
          <button onClick={()=>window.open("https://app.aisensy.com", "_blank")} style={{...S.abtn,flex:1,background:isLight?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)",color:t.text,border:`1px solid ${t.border}`}}>🌐 AiSensy Open</button>
        </div>
      </div>
    </Pane>
  );
}

function WPane({onClose,onAi}) {
  const W=[{n:"Delhi",t:32,i:"☀️",h:65,d:"गर्म धूप",w:"⚠️ पानी पिएं"},{n:"Mumbai",t:28,i:"🌤",h:80,d:"उमस भरा",w:"🌧 शाम बारिश"},{n:"Lucknow",t:35,i:"🌡",h:55,d:"बहुत गर्म",w:"⚠️ लू का खतरा"}];
  const [ci,sCi]=useState(0); const w=W[ci];
  return (
    <Pane icon="🌤" title="मौसम" sub="Live Forecast" col="#4E9FFF" onClose={onClose}>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {W.map((c,i)=><button key={i} onClick={()=>sCi(i)} style={{...S.qBtn,background:ci===i?"rgba(78,159,255,0.2)":"rgba(255,255,255,0.04)",borderColor:ci===i?"rgba(78,159,255,0.4)":"rgba(255,255,255,0.07)",color:ci===i?"#93C5FD":"rgba(255,255,255,0.4)"}}>{c.n}</button>)}
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(78,159,255,0.1),rgba(29,78,212,0.04))",borderRadius:18,padding:"20px",textAlign:"center",marginBottom:10,border:"1px solid rgba(78,159,255,0.16)"}}>
          <div style={{fontSize:56,filter:"drop-shadow(0 6px 14px rgba(78,159,255,0.3))"}}>{w.i}</div>
          <div style={{fontSize:42,fontWeight:900,color:"#F1F5F9",lineHeight:1,marginTop:4}}>{w.t}°C</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:6}}>{w.d} • 💧{w.h}%</div>
          {w.w&&<div style={{background:"rgba(255,184,0,0.09)",borderRadius:10,padding:"8px 14px",marginTop:10,fontSize:11,color:"#FBBF24",border:"1px solid rgba(255,184,0,0.18)"}}>{w.w}</div>}
        </div>
        <button onClick={()=>onAi(`${w.n} mein ${w.t} degree — health tips do`)} style={{...S.abtn,width:"100%",fontSize:11}}>🤖 Health Tips</button>
      </div>
    </Pane>
  );
}

function BtnRow({items,onBtn}) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:10,paddingLeft:36,animation:"fadeUp 0.25s ease"}}>
      {items.map((it,i)=><button key={i} onClick={()=>onBtn(it)} style={S.qBtn}>{it}</button>)}
    </div>
  );
}

const Av=()=><div style={{width:28,height:28,background:"linear-gradient(135deg,#00D09C,#00916E)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,alignSelf:"flex-end",marginRight:5,marginBottom:4,boxShadow:"0 4px 14px rgba(0,208,156,0.35)"}}>🤖</div>;
const Dot=({d,color="rgba(255,255,255,0.25)"})=><div style={{width:6,height:6,background:color,borderRadius:"50%",animation:`bounce 1.2s ${d}s ease-in-out infinite`}}/>;
const fmt=text=>text?text.split("\n").map((l,i)=><div key={i} dangerouslySetInnerHTML={{__html:l.replace(/\*(.*?)\*/g,"<b>$1</b>")||"&nbsp;"}} style={{lineHeight:1.65}}/>):null;

const S = {
  root:       {display:"flex",flexDirection:"column",height:"100vh",background:"#05080F",fontFamily:"'Plus Jakarta Sans','Noto Sans Devanagari',sans-serif",color:"#E2E8F0",overflow:"hidden"},
  hdr:        {background:"rgba(8,13,24,0.97)",padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0,backdropFilter:"blur(24px)"},
  hLeft:      {display:"flex",alignItems:"center",gap:12},
  hLogo:      {width:44,height:44,background:"linear-gradient(135deg,#00D09C,#00916E)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:"0 4px 18px rgba(0,208,156,0.35)",flexShrink:0},
  hRing:      {position:"absolute",inset:-4,borderRadius:18,border:"2px solid rgba(0,208,156,0.2)",animation:"ring 2.5s ease-in-out infinite"},
  hName:      {fontSize:17,fontWeight:900,color:"#F1F5F9",letterSpacing:"-0.5px"},
  premTag:    {background:"rgba(255,214,10,0.12)",border:"1px solid rgba(255,214,10,0.25)",borderRadius:20,padding:"2px 8px",fontSize:9,color:"#FFD60A",fontWeight:800,letterSpacing:"0.5px"},
  hSub:       {fontSize:10,color:"rgba(255,255,255,0.35)",display:"flex",alignItems:"center",gap:5,marginTop:2},
  onDot:      {width:7,height:7,background:"#00D09C",borderRadius:"50%",display:"inline-block",boxShadow:"0 0 8px #00D09C"},
  upBtn:      {background:"linear-gradient(135deg,#FF8C42,#D4650C)",border:"none",borderRadius:12,padding:"8px 16px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(255,140,66,0.35)"},

  // ── SPLIT BODY ──
  body:       {display:"flex",flex:1,overflow:"hidden"},

  // ── LEFT SIDEBAR ──
  sidebar:    {width:280,flexShrink:0,background:"#080E1C",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",overflow:"hidden"},
  sbHdr:      {padding:"14px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0},
  sbTitle:    {fontSize:13,fontWeight:800,color:"#F1F5F9",letterSpacing:"-0.2px"},
  sbCount:    {fontSize:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"2px 9px",color:"rgba(255,255,255,0.4)",fontWeight:700},
  sbScroll:   {flex:1,overflowY:"auto",padding:"10px 10px 6px"},
  sbSection:  {marginBottom:4},
  sbSectionLabel:{display:"flex",alignItems:"center",gap:6,padding:"4px 4px 8px",fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.8px"},
  sbPip:      {width:6,height:6,borderRadius:"50%",flexShrink:0},
  sbFreeChip: {marginLeft:"auto",background:"rgba(0,208,156,0.1)",border:"1px solid rgba(0,208,156,0.22)",borderRadius:20,padding:"1px 8px",fontSize:9,color:"#00D09C",fontWeight:700},
  sbProChip:  {marginLeft:"auto",background:"rgba(255,214,10,0.1)",border:"1px solid rgba(255,214,10,0.22)",borderRadius:20,padding:"1px 8px",fontSize:9,color:"#FFD60A",fontWeight:700},
  sbDivider:  {display:"flex",alignItems:"center",gap:8,padding:"8px 4px",margin:"4px 0"},
  sbDivLine:  {flex:1,height:1,background:"rgba(255,255,255,0.06)"},
  sbDivText:  {fontSize:9,color:"#FFD60A",fontWeight:800,letterSpacing:"1px",whiteSpace:"nowrap"},
  sbUpgrade:  {margin:"8px 10px 12px",background:"linear-gradient(135deg,#FF8C42,#D4650C)",border:"none",borderRadius:16,padding:"13px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,boxShadow:"0 6px 20px rgba(255,140,66,0.35)",flexShrink:0,transition:"all 0.2s"},

  // ── RIGHT CHAT PANEL ──
  chatPanel:  {flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#050810"},
  promoBar:   {background:"rgba(255,214,10,0.04)",borderBottom:"1px solid rgba(255,214,10,0.1)",padding:"7px 18px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0},
  chat:       {flex:1,overflowY:"auto",padding:"14px 18px 6px",display:"flex",flexDirection:"column",gap:0},
  datePill:   {textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.04)",borderRadius:20,padding:"4px 14px",display:"inline-block",margin:"0 auto 14px",fontWeight:700,letterSpacing:"0.5px",border:"1px solid rgba(255,255,255,0.07)"},
  bbl:        {padding:"10px 13px 7px",borderRadius:14,wordBreak:"break-word"},
  bbbl:       {background:"#0C1524",borderTopLeftRadius:3,marginLeft:3,border:"1px solid rgba(255,255,255,0.07)"},
  ubbl:       {background:"linear-gradient(135deg,#092D20,#061A12)",borderTopRightRadius:3,border:"1px solid rgba(0,208,156,0.12)"},
  btext:      {fontSize:13,lineHeight:1.65,color:"#E2E8F0"},
  btime:      {fontSize:10,color:"rgba(255,255,255,0.2)",textAlign:"right",marginTop:4},
  typingBubble:{background:"#0C1524",borderRadius:"14px 14px 14px 3px",padding:"13px 16px",display:"flex",gap:5,alignItems:"center",border:"1px solid rgba(255,255,255,0.07)"},
  chipsRow:   {padding:"7px 14px",background:"#050810",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",flexShrink:0,borderTop:"1px solid rgba(255,255,255,0.06)"},
  chip:       {background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"6px 13px",color:"rgba(255,255,255,0.6)",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0,transition:"all 0.15s"},
  recBar:     {background:"rgba(255,78,106,0.07)",padding:"7px 18px",display:"flex",alignItems:"center",gap:8,borderTop:"1px solid rgba(255,78,106,0.18)",flexShrink:0},
  inputRow:   {padding:"8px 14px 13px",background:"rgba(8,13,24,0.97)",display:"flex",alignItems:"center",gap:8,borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0,backdropFilter:"blur(20px)"},
  inputBox:   {flex:1,background:"rgba(255,255,255,0.05)",borderRadius:28,border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",overflow:"hidden"},
  inp:        {flex:1,background:"transparent",border:"none",outline:"none",color:"#E2E8F0",fontSize:13,padding:"11px 15px",fontFamily:"inherit"},
  icoBtn:     {background:"transparent",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.35)",padding:"6px",flexShrink:0,transition:"color 0.15s"},
  sendBtn:    {width:44,height:44,borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",boxShadow:"0 4px 16px rgba(0,0,0,0.4)"},
  qBtn:       {background:"rgba(0,208,156,0.07)",border:"1px solid rgba(0,208,156,0.18)",borderRadius:20,padding:"6px 13px",color:"rgba(0,208,156,0.85)",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all 0.15s"},
  inp2:       {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:11,padding:"10px 14px",color:"#E2E8F0",fontSize:13,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"},
  abtn:       {background:"linear-gradient(135deg,#00D09C,#00916E)",border:"none",borderRadius:11,padding:"10px 16px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"all 0.15s",boxShadow:"0 4px 14px rgba(0,208,156,0.28)"},
};

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
  ::-webkit-scrollbar{width:2px;height:2px;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px;}
  input::placeholder{color:var(--subText);font-family:inherit;}
  input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.3;}
  input[type="number"]::-webkit-inner-spin-button{-webkit-appearance:none;}
  @keyframes fadeUp  {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bounce  {0%,60%,100%{transform:translateY(0);opacity:0.2}30%{transform:translateY(-5px);opacity:1}}
  @keyframes ring    {0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.1);opacity:0.1}}
  @keyframes pulse   {0%,100%{opacity:1}50%{opacity:0.25}}
  @keyframes spin    {to{transform:rotate(360deg)}}
`;
