import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════
// ALL INDIA SERVICES DATABASE
// ══════════════════════════════════════════════════════
const DB = {
  government: {
    icon: "🏛️",
    en: { name: "Government & Documents", services: [
      { name: "Aadhaar Card", detail: "New Aadhaar or update name, address, mobile, DOB.", where: "Aadhaar Seva Kendra / Post Office", docs: "ID Proof, Address Proof, Photo", helpline: "1947", fee: "Free (New) / ₹50 (Update)", time: "15-30 days", website: "uidai.gov.in", steps: ["Visit nearest Aadhaar Kendra or book on uidai.gov.in","Carry original ID & address proof","Give biometrics (fingerprint, iris, photo)","Track status online using URN"] },
      { name: "PAN Card", detail: "New PAN or correct name/DOB on existing PAN.", where: "NSDL / UTIITSL Portal / CSC", docs: "Aadhaar, Photo, Signature", helpline: "1800-180-1961", fee: "₹107 (e-PAN) / ₹1023 (abroad)", time: "Instant e-PAN / 15 days physical", website: "onlineservices.nsdl.com", steps: ["Visit NSDL portal or use instant e-PAN via Aadhaar","Fill Form 49A","Upload docs and photo","e-PAN on email instantly"] },
      { name: "Passport", detail: "Fresh passport or renewal.", where: "Passport Seva Kendra (PSK)", docs: "Aadhaar, PAN, Birth Certificate, Address Proof", helpline: "1800-258-1800", fee: "₹1500 Normal / ₹3500 Tatkal", time: "30-45 days / 7-14 Tatkal", website: "passportindia.gov.in", steps: ["Apply on passportindia.gov.in","Book PSK appointment","Visit with originals","Police verification → delivery by post"] },
      { name: "Voter ID (EPIC)", detail: "New voter registration or correction.", where: "Electoral Office / voters.eci.gov.in", docs: "Aadhaar, Address Proof, Photo", helpline: "1950", fee: "Free", time: "15-30 days", website: "voters.eci.gov.in", steps: ["Apply on voters.eci.gov.in (Form 6)","Upload photo & docs","BLO home verification","Download e-EPIC or collect card"] },
      { name: "Driving License", detail: "Learner, permanent DL or renewal.", where: "RTO / parivahan.gov.in", docs: "Aadhaar, Medical Certificate, Photos", helpline: "1800-2000", fee: "₹200-₹1000", time: "7-30 days", website: "parivahan.gov.in", steps: ["Apply on Sarathi portal","Book RTO test slot","Pass written & driving test","DL by post or DigiLocker"] },
      { name: "Birth Certificate", detail: "Register birth at municipal body.", where: "Municipal Corp / Gram Panchayat", docs: "Hospital discharge, Parents' Aadhaar", helpline: "State helpline", fee: "Free-₹50", time: "7-21 days", website: "crsorgi.gov.in", steps: ["Register within 21 days at hospital/municipal office","Fill registration form","Submit hospital documents","Collect certificate"] },
      { name: "Death Certificate", detail: "Register death for legal & property matters.", where: "Municipal Corp / Hospital", docs: "Hospital death report, Deceased Aadhaar", helpline: "State helpline", fee: "Free-₹50", time: "7-21 days", website: "crsorgi.gov.in", steps: ["Register at hospital or municipal office","Fill death registration form","Submit medical certificate","Collect death certificate"] },
      { name: "Caste Certificate", detail: "SC/ST/OBC caste certificate for reservation.", where: "Tehsildar / SDM / State e-District", docs: "Aadhaar, Ration Card, School Cert, Affidavit", helpline: "1076", fee: "Free-₹50", time: "15-30 days", website: "State e-District portal", steps: ["Apply at state e-District portal","Upload documents","Officer verification","Download certificate"] },
      { name: "Income Certificate", detail: "Annual family income proof for scholarships.", where: "Tehsildar / State e-District", docs: "Aadhaar, Salary Slip, Ration Card", helpline: "1076", fee: "Free-₹50", time: "15-30 days", website: "State e-District portal", steps: ["Apply at e-District portal","Upload income proof","Field verification","Download when approved"] },
      { name: "Domicile Certificate", detail: "State residence proof for admissions & jobs.", where: "Tehsildar / SDM / State e-District", docs: "Aadhaar, Voter ID, Electricity Bill, Ration Card", helpline: "State helpline", fee: "Free-₹50", time: "15-30 days", website: "State e-District portal", steps: ["Apply at state e-District portal","Upload address proofs","Field verification","Download certificate"] },
      { name: "Marriage Certificate", detail: "Legal marriage registration.", where: "Sub-Registrar / State e-District", docs: "Aadhaar (both), Wedding Photos, 2 Witnesses", helpline: "State helpline", fee: "₹25-₹100", time: "15-30 days", website: "State e-District portal", steps: ["Apply at e-District portal","Upload photos & docs","Both appear before registrar","Certificate after verification"] },
      { name: "Ration Card", detail: "New ration card or update members.", where: "State Food & Supply Office", docs: "Aadhaar (all members), Address Proof", helpline: "1967 / 1800-180-0150", fee: "Free-₹45", time: "15-30 days", website: "nfsa.gov.in", steps: ["Apply at state food portal","Upload family details","Home field verification","Collect ration card"] },
      { name: "e-Shram Card", detail: "Unorganized worker registration for benefits.", where: "CSC / eshram.gov.in", docs: "Aadhaar, Bank Account, Mobile", helpline: "14434", fee: "Free", time: "Instant", website: "eshram.gov.in", steps: ["Visit eshram.gov.in or CSC","Enter Aadhaar & bank details","OTP verification","Download card instantly"] },
      { name: "Property Registration", detail: "Register sale/gift deed at Sub-Registrar.", where: "Sub-Registrar Office", docs: "Property papers, Aadhaar, Stamp Paper, Witnesses", helpline: "State helpline", fee: "Stamp Duty 4-7% + Reg 1%", time: "1-7 days", website: "State registration portal", steps: ["Get documents drafted","Buy stamp paper","Book Sub-Registrar slot","Sign & collect registered deed"] },
    ]},
    hi: { name: "सरकारी सेवाएँ और दस्तावेज़", services: [
      { name: "आधार कार्ड", detail: "नया आधार या नाम, पता, मोबाइल अपडेट।", where: "आधार सेवा केंद्र / पोस्ट ऑफिस", docs: "पहचान पत्र, पता प्रमाण, फोटो", helpline: "1947", fee: "मुफ़्त (नया) / ₹50 (अपडेट)", time: "15-30 दिन", website: "uidai.gov.in", steps: ["नज़दीकी आधार केंद्र जाएँ या uidai.gov.in पर बुक करें","मूल ID और पता प्रमाण ले जाएँ","बायोमेट्रिक दें","URN से स्टेटस ट्रैक करें"] },
      { name: "पैन कार्ड", detail: "नया पैन या मौजूदा पैन में सुधार।", where: "NSDL / UTIITSL / CSC सेंटर", docs: "आधार, फोटो, हस्ताक्षर", helpline: "1800-180-1961", fee: "₹107 (e-PAN)", time: "e-PAN तुरंत / 15 दिन", website: "onlineservices.nsdl.com", steps: ["NSDL पोर्टल जाएँ या आधार से instant e-PAN","फॉर्म 49A भरें","दस्तावेज़ अपलोड करें","e-PAN ईमेल पर तुरंत"] },
      { name: "पासपोर्ट", detail: "नया पासपोर्ट या रिन्यूअल।", where: "पासपोर्ट सेवा केंद्र (PSK)", docs: "आधार, पैन, जन्म प्रमाण पत्र, पता प्रमाण", helpline: "1800-258-1800", fee: "₹1500 सामान्य / ₹3500 तत्काल", time: "30-45 दिन / 7-14 तत्काल", website: "passportindia.gov.in", steps: ["passportindia.gov.in पर आवेदन","PSK अपॉइंटमेंट बुक करें","मूल दस्तावेज़ लेकर जाएँ","पुलिस वेरिफिकेशन → डाक से डिलीवरी"] },
      { name: "वोटर ID (EPIC)", detail: "नया मतदाता पंजीकरण या सुधार।", where: "निर्वाचन कार्यालय / voters.eci.gov.in", docs: "आधार, पता प्रमाण, फोटो", helpline: "1950", fee: "मुफ़्त", time: "15-30 दिन", website: "voters.eci.gov.in", steps: ["voters.eci.gov.in पर आवेदन (फॉर्म 6)","फोटो और दस्तावेज़ अपलोड","BLO घर पर सत्यापन","e-EPIC डाउनलोड करें"] },
      { name: "ड्राइविंग लाइसेंस", detail: "लर्नर, स्थायी DL या रिन्यूअल।", where: "RTO / parivahan.gov.in", docs: "आधार, मेडिकल सर्टिफिकेट, फोटो", helpline: "1800-2000", fee: "₹200-₹1000", time: "7-30 दिन", website: "parivahan.gov.in", steps: ["सारथी पोर्टल पर आवेदन","RTO टेस्ट स्लॉट बुक","टेस्ट पास करें","DL डाक या DigiLocker से"] },
      { name: "जन्म प्रमाण पत्र", detail: "नगर निगम से जन्म पंजीकरण।", where: "नगर निगम / ग्राम पंचायत", docs: "अस्पताल डिस्चार्ज, माता-पिता आधार", helpline: "राज्य हेल्पलाइन", fee: "मुफ़्त-₹50", time: "7-21 दिन", website: "crsorgi.gov.in", steps: ["21 दिन में अस्पताल/नगर निगम में पंजीकरण","फॉर्म भरें","दस्तावेज़ जमा करें","प्रमाण पत्र लें"] },
      { name: "मृत्यु प्रमाण पत्र", detail: "कानूनी और संपत्ति कार्यों के लिए।", where: "नगर निगम / अस्पताल", docs: "अस्पताल मृत्यु रिपोर्ट, मृतक आधार", helpline: "राज्य हेल्पलाइन", fee: "मुफ़्त-₹50", time: "7-21 दिन", website: "crsorgi.gov.in", steps: ["अस्पताल या नगर निगम में पंजीकरण","फॉर्म भरें","मेडिकल सर्टिफिकेट जमा करें","प्रमाण पत्र लें"] },
      { name: "जाति प्रमाण पत्र", detail: "SC/ST/OBC आरक्षण के लिए।", where: "तहसीलदार / SDM / राज्य e-District", docs: "आधार, राशन कार्ड, स्कूल प्रमाण, शपथ पत्र", helpline: "1076", fee: "मुफ़्त-₹50", time: "15-30 दिन", website: "राज्य e-District पोर्टल", steps: ["e-District पोर्टल पर आवेदन","दस्तावेज़ अपलोड","अधिकारी सत्यापन","प्रमाण पत्र डाउनलोड"] },
      { name: "आय प्रमाण पत्र", detail: "छात्रवृत्ति और सब्सिडी के लिए आय प्रमाण।", where: "तहसीलदार / राज्य e-District", docs: "आधार, वेतन पर्ची, राशन कार्ड", helpline: "1076", fee: "मुफ़्त-₹50", time: "15-30 दिन", website: "राज्य e-District पोर्टल", steps: ["e-District पोर्टल पर आवेदन","आय प्रमाण अपलोड","फील्ड सत्यापन","स्वीकृत होने पर डाउनलोड"] },
      { name: "निवास प्रमाण पत्र", detail: "एडमिशन और नौकरी के लिए राज्य निवास प्रमाण।", where: "तहसीलदार / SDM / राज्य e-District", docs: "आधार, वोटर ID, बिजली बिल, राशन कार्ड", helpline: "राज्य हेल्पलाइन", fee: "मुफ़्त-₹50", time: "15-30 दिन", website: "राज्य e-District पोर्टल", steps: ["e-District पोर्टल पर आवेदन","पता प्रमाण अपलोड","फील्ड सत्यापन","प्रमाण पत्र डाउनलोड"] },
      { name: "विवाह प्रमाण पत्र", detail: "विवाह का कानूनी पंजीकरण।", where: "सब-रजिस्ट्रार / राज्य e-District", docs: "आधार (दोनों), शादी फोटो, 2 गवाह", helpline: "राज्य हेल्पलाइन", fee: "₹25-₹100", time: "15-30 दिन", website: "राज्य e-District पोर्टल", steps: ["e-District पोर्टल पर आवेदन","फोटो और दस्तावेज़ अपलोड","दोनों रजिस्ट्रार के सामने","सत्यापन बाद प्रमाण पत्र"] },
      { name: "राशन कार्ड", detail: "नया राशन कार्ड या सदस्य अपडेट।", where: "राज्य खाद्य कार्यालय", docs: "आधार (सभी), पता प्रमाण", helpline: "1967 / 1800-180-0150", fee: "मुफ़्त-₹45", time: "15-30 दिन", website: "nfsa.gov.in", steps: ["राज्य खाद्य पोर्टल पर आवेदन","परिवार विवरण अपलोड","घर पर सत्यापन","राशन कार्ड लें"] },
      { name: "ई-श्रम कार्ड", detail: "असंगठित कर्मचारी पंजीकरण।", where: "CSC / eshram.gov.in", docs: "आधार, बैंक खाता, मोबाइल", helpline: "14434", fee: "मुफ़्त", time: "तुरंत", website: "eshram.gov.in", steps: ["eshram.gov.in या CSC जाएँ","आधार और बैंक विवरण दें","OTP वेरिफिकेशन","कार्ड तुरंत डाउनलोड"] },
      { name: "संपत्ति पंजीकरण", detail: "सब-रजिस्ट्रार में सेल/गिफ्ट डीड पंजीकरण।", where: "सब-रजिस्ट्रार कार्यालय", docs: "संपत्ति कागज़ात, आधार, स्टांप पेपर, गवाह", helpline: "राज्य हेल्पलाइन", fee: "स्टांप ड्यूटी 4-7% + पंजीकरण 1%", time: "1-7 दिन", website: "राज्य पंजीकरण पोर्टल", steps: ["दस्तावेज़ तैयार करवाएँ","स्टांप पेपर खरीदें","सब-रजिस्ट्रार स्लॉट बुक करें","साइन करें और डीड लें"] },
    ]},
  },
  health: { icon: "🏥",
    en: { name: "Health Services", services: [
      { name: "Ambulance 102/108", detail: "Free government ambulance across India.", where: "Comes to you", docs: "None", helpline: "102/108/112", fee: "Free", time: "10-20 min", website: "Call directly", steps: ["Call 102/108/112","Share location","Describe emergency","Paramedic arrives"] },
      { name: "Ayushman Bharat (PMJAY)", detail: "Free ₹5 lakh health insurance for eligible families.", where: "CSC / Govt Hospital Ayushman Mitra", docs: "Aadhaar, Ration Card, Mobile", helpline: "14555", fee: "Free", time: "Same day card", website: "pmjay.gov.in", steps: ["Check eligibility on mera.pmjay.gov.in","Visit CSC or hospital","Show Aadhaar & docs","Get card on spot → Free treatment up to ₹5L"] },
      { name: "Government Hospital OPD", detail: "OPD consultation at any govt hospital.", where: "Nearest Govt Hospital / PHC / CHC", docs: "Any ID", helpline: "104", fee: "₹5-₹10", time: "Same day", website: "N/A", steps: ["Visit OPD counter","Register with ID","Get token","Consult doctor & get medicines"] },
      { name: "Jan Aushadhi (Cheap Medicines)", detail: "Generic medicines at 50-90% less cost.", where: "Jan Aushadhi Kendra (9000+ in India)", docs: "Prescription", helpline: "1800-180-8080", fee: "50-90% cheaper", time: "Walk-in", website: "janaushadhi.gov.in", steps: ["Find Kendra on janaushadhi.gov.in","Carry prescription","Buy generic medicines at huge discount","1800+ medicines available"] },
      { name: "Blood Bank", detail: "Donate blood or find blood in emergency.", where: "Govt & licensed blood banks", docs: "ID (donate) / Prescription (request)", helpline: "104/1910", fee: "Free donation / nominal", time: "Immediate", website: "eraktkosh.in", steps: ["Call 104 or visit eraktkosh.in","Check availability","Donate: health screening first","Request: carry prescription"] },
      { name: "Vaccination (UIP)", detail: "Free vaccination for children and adults.", where: "Govt Hospital / PHC / Anganwadi", docs: "Aadhaar, vaccination card", helpline: "104", fee: "Free", time: "Walk-in", website: "nhm.gov.in", steps: ["Visit nearest health center","Show previous card","Get vaccinated","Collect updated card"] },
      { name: "Mental Health Helpline", detail: "Free 24x7 mental health counseling.", where: "Phone", docs: "None", helpline: "1860-2662-345 / 9152987821", fee: "Free", time: "Immediate", website: "vandrevalafoundation.com", steps: ["Call 1860-2662-345 (24x7)","Or iCall: 9152987821","Speak to counselor","Follow-up available"] },
    ]},
    hi: { name: "स्वास्थ्य सेवाएँ", services: [
      { name: "एम्बुलेंस 102/108", detail: "पूरे भारत में मुफ़्त सरकारी एम्बुलेंस।", where: "आपके पास आएगी", docs: "कोई नहीं", helpline: "102/108/112", fee: "मुफ़्त", time: "10-20 मिनट", website: "सीधे कॉल करें", steps: ["102/108/112 कॉल करें","लोकेशन बताएँ","इमरजेंसी बताएँ","पैरामेडिक आएगा"] },
      { name: "आयुष्मान भारत (PMJAY)", detail: "पात्र परिवारों को ₹5 लाख मुफ़्त स्वास्थ्य बीमा।", where: "CSC / सरकारी अस्पताल", docs: "आधार, राशन कार्ड, मोबाइल", helpline: "14555", fee: "मुफ़्त", time: "उसी दिन कार्ड", website: "pmjay.gov.in", steps: ["mera.pmjay.gov.in पर पात्रता जाँचें","CSC या अस्पताल जाएँ","आधार और दस्तावेज़ दिखाएँ","मौके पर कार्ड → ₹5L तक मुफ़्त इलाज"] },
      { name: "सरकारी अस्पताल OPD", detail: "किसी भी सरकारी अस्पताल में OPD।", where: "नज़दीकी सरकारी अस्पताल / PHC", docs: "कोई ID", helpline: "104", fee: "₹5-₹10", time: "उसी दिन", website: "N/A", steps: ["OPD काउंटर जाएँ","ID से रजिस्टर","टोकन लें","डॉक्टर से मिलें और दवाइयाँ लें"] },
      { name: "जन औषधि (सस्ती दवाइयाँ)", detail: "50-90% कम कीमत पर जेनेरिक दवाइयाँ।", where: "जन औषधि केंद्र (9000+ भारत में)", docs: "प्रिस्क्रिप्शन", helpline: "1800-180-8080", fee: "50-90% सस्ती", time: "वॉक-इन", website: "janaushadhi.gov.in", steps: ["janaushadhi.gov.in पर केंद्र खोजें","प्रिस्क्रिप्शन ले जाएँ","भारी छूट पर जेनेरिक दवाइयाँ खरीदें","1800+ दवाइयाँ उपलब्ध"] },
      { name: "ब्लड बैंक", detail: "रक्तदान करें या इमरजेंसी में रक्त पाएँ।", where: "सरकारी ब्लड बैंक", docs: "ID (दान) / प्रिस्क्रिप्शन (माँग)", helpline: "104/1910", fee: "मुफ़्त दान / नाममात्र", time: "तुरंत", website: "eraktkosh.in", steps: ["104 कॉल या eraktkosh.in","उपलब्धता जाँचें","दान: स्वास्थ्य जाँच पहले","माँग: प्रिस्क्रिप्शन ले जाएँ"] },
      { name: "टीकाकरण (UIP)", detail: "बच्चों और वयस्कों के लिए मुफ़्त टीकाकरण।", where: "सरकारी अस्पताल / PHC / आँगनवाड़ी", docs: "आधार, टीकाकरण कार्ड", helpline: "104", fee: "मुफ़्त", time: "वॉक-इन", website: "nhm.gov.in", steps: ["नज़दीकी स्वास्थ्य केंद्र जाएँ","पिछला कार्ड दिखाएँ","टीका लगवाएँ","अपडेटेड कार्ड लें"] },
      { name: "मानसिक स्वास्थ्य हेल्पलाइन", detail: "मुफ़्त 24x7 मानसिक स्वास्थ्य परामर्श।", where: "फोन", docs: "कोई नहीं", helpline: "1860-2662-345 / 9152987821", fee: "मुफ़्त", time: "तुरंत", website: "vandrevalafoundation.com", steps: ["1860-2662-345 कॉल करें (24x7)","या iCall: 9152987821","काउंसलर से बात करें","फॉलो-अप उपलब्ध"] },
    ]},
  },
  emergency: { icon: "🚨",
    en: { name: "Emergency Helplines", services: [
      { name: "Unified Emergency 112", detail: "Police, Fire, Ambulance — one number for all India.", where: "Phone", docs: "None", helpline: "112", fee: "Free", time: "Immediate", website: "112.gov.in", steps: ["Dial 112 (works without SIM)","Choose Police/Fire/Medical","Share location","Team dispatched"] },
      { name: "Police 100", detail: "Crime, FIR, theft, assault.", where: "Phone / Police Station", docs: "ID for FIR", helpline: "100/112", fee: "Free", time: "Immediate", website: "State police site", steps: ["Call 100 or 112","For FIR: visit police station","Many states have online FIR","Keep FIR number"] },
      { name: "Fire Brigade 101", detail: "Fire emergency.", where: "Phone", docs: "None", helpline: "101/112", fee: "Free", time: "5-15 min", website: "N/A", steps: ["Call 101 or 112","Give exact address","Describe fire","Evacuate safely"] },
      { name: "Women Helpline 181", detail: "Domestic violence, harassment, stalking.", where: "Phone", docs: "None", helpline: "181/1091", fee: "Free", time: "Immediate", website: "ncw.nic.in", steps: ["Call 181 or 1091","Describe situation","Share location","Police & counselor dispatched"] },
      { name: "Child Helpline 1098", detail: "Child abuse, missing, labour.", where: "Phone", docs: "None", helpline: "1098", fee: "Free", time: "Immediate", website: "childlineindia.org", steps: ["Call 1098","Describe situation","Share location","Rescue team sent"] },
      { name: "Cyber Crime 1930", detail: "Online fraud, UPI scam, hacking.", where: "Phone / cybercrime.gov.in", docs: "Screenshots, transaction details", helpline: "1930", fee: "Free", time: "Immediate", website: "cybercrime.gov.in", steps: ["Call 1930 immediately for fraud","Or file at cybercrime.gov.in","Share all evidence","Track with acknowledgment number"] },
      { name: "Senior Citizen 14567", detail: "Elder abuse, medical help, loneliness.", where: "Phone", docs: "None", helpline: "14567", fee: "Free", time: "Immediate", website: "elderline.in", steps: ["Call 14567","Available in many languages","Get support & info","Field help if needed"] },
      { name: "Disaster 1078", detail: "Flood, earthquake, cyclone help.", where: "Phone / NDMA", docs: "None", helpline: "1078", fee: "Free", time: "Immediate", website: "ndma.gov.in", steps: ["Call 1078","Describe situation & location","Follow evacuation orders","Check ndma.gov.in for relief"] },
    ]},
    hi: { name: "आपातकालीन हेल्पलाइन", services: [
      { name: "एकीकृत आपातकालीन 112", detail: "पुलिस, फायर, एम्बुलेंस — पूरे भारत के लिए एक नंबर।", where: "फोन", docs: "कोई नहीं", helpline: "112", fee: "मुफ़्त", time: "तुरंत", website: "112.gov.in", steps: ["112 डायल करें (बिना SIM भी)","पुलिस/फायर/मेडिकल चुनें","लोकेशन बताएँ","टीम भेजी जाएगी"] },
      { name: "पुलिस 100", detail: "अपराध, FIR, चोरी, हमला।", where: "फोन / पुलिस स्टेशन", docs: "FIR के लिए ID", helpline: "100/112", fee: "मुफ़्त", time: "तुरंत", website: "राज्य पुलिस साइट", steps: ["100 या 112 कॉल करें","FIR: पुलिस स्टेशन जाएँ","कई राज्यों में ऑनलाइन FIR","FIR नंबर रखें"] },
      { name: "फायर ब्रिगेड 101", detail: "आग की आपातकाल।", where: "फोन", docs: "कोई नहीं", helpline: "101/112", fee: "मुफ़्त", time: "5-15 मिनट", website: "N/A", steps: ["101 या 112 कॉल करें","सटीक पता दें","आग बताएँ","सुरक्षित बाहर निकलें"] },
      { name: "महिला हेल्पलाइन 181", detail: "घरेलू हिंसा, छेड़छाड़, पीछा।", where: "फोन", docs: "कोई नहीं", helpline: "181/1091", fee: "मुफ़्त", time: "तुरंत", website: "ncw.nic.in", steps: ["181 या 1091 कॉल करें","स्थिति बताएँ","लोकेशन बताएँ","पुलिस और काउंसलर भेजे जाएँगे"] },
      { name: "बाल हेल्पलाइन 1098", detail: "बाल दुर्व्यवहार, गुमशुदा, श्रम।", where: "फोन", docs: "कोई नहीं", helpline: "1098", fee: "मुफ़्त", time: "तुरंत", website: "childlineindia.org", steps: ["1098 कॉल करें","स्थिति बताएँ","लोकेशन बताएँ","बचाव दल भेजा जाएगा"] },
      { name: "साइबर अपराध 1930", detail: "ऑनलाइन धोखाधड़ी, UPI स्कैम, हैकिंग।", where: "फोन / cybercrime.gov.in", docs: "स्क्रीनशॉट, ट्रांज़ैक्शन", helpline: "1930", fee: "मुफ़्त", time: "तुरंत", website: "cybercrime.gov.in", steps: ["धोखाधड़ी होते ही 1930 कॉल करें","या cybercrime.gov.in पर शिकायत","सारे सबूत दें","पावती नंबर से ट्रैक करें"] },
      { name: "वरिष्ठ नागरिक 14567", detail: "बुज़ुर्ग दुर्व्यवहार, चिकित्सा, अकेलापन।", where: "फोन", docs: "कोई नहीं", helpline: "14567", fee: "मुफ़्त", time: "तुरंत", website: "elderline.in", steps: ["14567 कॉल करें","कई भाषाओं में उपलब्ध","सहारा और जानकारी पाएँ","ज़रूरत पर फील्ड मदद"] },
      { name: "आपदा 1078", detail: "बाढ़, भूकंप, चक्रवात में मदद।", where: "फोन / NDMA", docs: "कोई नहीं", helpline: "1078", fee: "मुफ़्त", time: "तुरंत", website: "ndma.gov.in", steps: ["1078 कॉल करें","स्थिति और लोकेशन बताएँ","निकासी निर्देश मानें","ndma.gov.in पर राहत जानकारी"] },
    ]},
  },
  utility: { icon: "💡",
    en: { name: "Bills & Utilities", services: [
      { name: "Electricity Bill", detail: "Pay electricity bill for any state.", where: "Online / Paytm / PhonePe", docs: "Consumer Number", helpline: "State board helpline", fee: "As per usage", time: "Instant", website: "State electricity website", steps: ["Find consumer number on bill","Use Paytm/PhonePe/state site","Enter number & view bill","Pay via UPI/card"] },
      { name: "Gas Cylinder Refill/New", detail: "LPG refill or new connection — HP, Bharat, Indane.", where: "Gas Agency / Online", docs: "Aadhaar, Address (new)", helpline: "1800-233-3555 (HP)", fee: "New: ₹1600+ / Refill: market", time: "Refill: 1-3 days", website: "mylpg.in", steps: ["Refill: IVRS or app","New: visit agency with docs","Pay online","Doorstep delivery"] },
      { name: "Water Bill", detail: "Pay water bill to local Jal Board.", where: "Online / Jal Board Office", docs: "Consumer Number", helpline: "State water board", fee: "As per usage", time: "Instant", website: "State Jal Board site", steps: ["Find consumer number","Visit state site or payment app","Enter number","Pay online"] },
      { name: "Mobile/DTH Recharge", detail: "Recharge any operator.", where: "Online", docs: "Mobile Number", helpline: "198 (TRAI)", fee: "Per plan", time: "Instant", website: "Paytm/PhonePe", steps: ["Open Paytm/PhonePe","Select recharge","Enter number, choose plan","Pay instantly"] },
      { name: "FASTag Recharge", detail: "Recharge FASTag for toll payment.", where: "Online / Bank / Paytm", docs: "Vehicle RC", helpline: "1033 (NHAI)", fee: "₹100+ recharge", time: "Instant", website: "ihmcl.com", steps: ["Open bank app or Paytm","Select FASTag recharge","Enter vehicle/tag number","Pay via UPI"] },
    ]},
    hi: { name: "बिल और उपयोगिता", services: [
      { name: "बिजली बिल", detail: "किसी भी राज्य का बिजली बिल भरें।", where: "ऑनलाइन / Paytm / PhonePe", docs: "उपभोक्ता नंबर", helpline: "राज्य बोर्ड हेल्पलाइन", fee: "उपयोग अनुसार", time: "तुरंत", website: "राज्य बिजली वेबसाइट", steps: ["बिल पर उपभोक्ता नंबर देखें","Paytm/PhonePe/राज्य साइट खोलें","नंबर दर्ज करें","UPI/कार्ड से भुगतान"] },
      { name: "गैस सिलेंडर रिफिल/नया", detail: "LPG रिफिल या नया कनेक्शन — HP, भारत, इंडेन।", where: "गैस एजेंसी / ऑनलाइन", docs: "आधार, पता (नया)", helpline: "1800-233-3555 (HP)", fee: "नया: ₹1600+ / रिफिल: बाज़ार दर", time: "रिफिल: 1-3 दिन", website: "mylpg.in", steps: ["रिफिल: IVRS या ऐप","नया: दस्तावेज़ लेकर एजेंसी जाएँ","ऑनलाइन भुगतान","घर पर डिलीवरी"] },
      { name: "पानी बिल", detail: "स्थानीय जल बोर्ड का बिल भरें।", where: "ऑनलाइन / जल बोर्ड", docs: "उपभोक्ता नंबर", helpline: "राज्य जल बोर्ड", fee: "उपयोग अनुसार", time: "तुरंत", website: "राज्य जल बोर्ड साइट", steps: ["उपभोक्ता नंबर देखें","राज्य साइट या ऐप खोलें","नंबर दर्ज करें","ऑनलाइन भुगतान"] },
      { name: "मोबाइल/DTH रिचार्ज", detail: "किसी भी ऑपरेटर का रिचार्ज।", where: "ऑनलाइन", docs: "मोबाइल नंबर", helpline: "198 (TRAI)", fee: "प्लान अनुसार", time: "तुरंत", website: "Paytm/PhonePe", steps: ["Paytm/PhonePe खोलें","रिचार्ज चुनें","नंबर और प्लान चुनें","तुरंत भुगतान"] },
      { name: "FASTag रिचार्ज", detail: "टोल भुगतान के लिए FASTag रिचार्ज।", where: "ऑनलाइन / बैंक / Paytm", docs: "वाहन RC", helpline: "1033 (NHAI)", fee: "₹100+ रिचार्ज", time: "तुरंत", website: "ihmcl.com", steps: ["बैंक ऐप या Paytm खोलें","FASTag रिचार्ज चुनें","वाहन/टैग नंबर दें","UPI से भुगतान"] },
    ]},
  },
  welfare: { icon: "🤝",
    en: { name: "Govt Schemes & Welfare", services: [
      { name: "PM Kisan (₹6000/year)", detail: "₹6000/year income support for farmers.", where: "CSC / Gram Panchayat", docs: "Aadhaar, Bank Account, Land Records", helpline: "155261", fee: "Free", time: "Every 4 months", website: "pmkisan.gov.in", steps: ["Register on pmkisan.gov.in","Enter Aadhaar & land details","State agriculture dept verifies","₹2000 every 4 months to bank"] },
      { name: "Free Ration (NFSA)", detail: "Free/cheap food grain from ration shop.", where: "Nearest Ration Shop", docs: "Ration Card + Aadhaar", helpline: "1967", fee: "Free or ₹1-3/kg", time: "Monthly", website: "nfsa.gov.in", steps: ["Check status on nfsa.gov.in","Find nearest ration shop","Visit with ration card","Aadhaar verify & collect ration"] },
      { name: "Ujjwala (Free Gas)", detail: "Free LPG connection for poor families.", where: "Nearest Gas Agency", docs: "Aadhaar, BPL/Ration Card, Bank", helpline: "1800-266-6696", fee: "Free connection", time: "7-15 days", website: "pmuy.gov.in", steps: ["Visit gas agency","Fill Ujjwala form","Submit docs","Free connection + first cylinder + stove"] },
      { name: "PM Awas (Housing)", detail: "Affordable housing with govt subsidy.", where: "Municipality / Gram Panchayat / Bank", docs: "Aadhaar, Income Proof, No-house Declaration", helpline: "1800-11-6163", fee: "Subsidized", time: "Varies", website: "pmaymis.gov.in", steps: ["Check eligibility on pmaymis.gov.in","Apply through municipality or bank","Get subsidy ₹1.5-2.67 lakh","Build or buy home"] },
      { name: "Old Age/Widow/Disability Pension", detail: "Monthly pension for elderly, widows, disabled.", where: "Block Office / State Portal", docs: "Aadhaar, Age/Widow/Disability Proof, Bank", helpline: "1076", fee: "Free", time: "30-60 days", website: "nsap.nic.in", steps: ["Apply at block office or state portal","Submit proof documents","Field verification","Monthly pension to bank (₹200-1000)"] },
      { name: "Sukanya Samriddhi (Girl Savings)", detail: "High-interest savings for girl child.", where: "Post Office / Bank", docs: "Girl's birth cert, Parent's Aadhaar & PAN", helpline: "1800-266-6868", fee: "Min ₹250/yr", time: "Same day", website: "indiapost.gov.in", steps: ["Visit Post Office/bank","Open account for girl below 10","Deposit min ₹250/year","Money for education at 18, full at 21"] },
      { name: "Scholarship (NSP)", detail: "Central & state scholarships for students.", where: "Online / School", docs: "Aadhaar, Marksheet, Income/Caste Cert, Bank", helpline: "0120-6619540", fee: "Free", time: "Per calendar", website: "scholarships.gov.in", steps: ["Register on scholarships.gov.in","Search & select scholarship","Fill form & upload docs","Institution verifies → money to bank"] },
      { name: "Skill India (PMKVY)", detail: "Free vocational training with certificate.", where: "PMKVY Training Center", docs: "Aadhaar, Education Cert", helpline: "1800-123-9626", fee: "Free", time: "1-6 months", website: "pmkvyofficial.org", steps: ["Find center on pmkvyofficial.org","Enroll with Aadhaar","Complete training & assessment","Get NSDC certificate + placement help"] },
    ]},
    hi: { name: "सरकारी योजनाएँ और कल्याण", services: [
      { name: "PM किसान (₹6000/साल)", detail: "किसानों को ₹6000/साल आय सहायता।", where: "CSC / ग्राम पंचायत", docs: "आधार, बैंक खाता, भूमि रिकॉर्ड", helpline: "155261", fee: "मुफ़्त", time: "हर 4 महीने", website: "pmkisan.gov.in", steps: ["pmkisan.gov.in पर रजिस्टर","आधार और भूमि विवरण दें","राज्य कृषि विभाग सत्यापन","हर 4 महीने ₹2000 बैंक में"] },
      { name: "मुफ़्त राशन (NFSA)", detail: "राशन दुकान से मुफ़्त/सस्ता अनाज।", where: "नज़दीकी राशन दुकान", docs: "राशन कार्ड + आधार", helpline: "1967", fee: "मुफ़्त या ₹1-3/किलो", time: "मासिक", website: "nfsa.gov.in", steps: ["nfsa.gov.in पर स्थिति जाँचें","नज़दीकी दुकान खोजें","राशन कार्ड लेकर जाएँ","आधार वेरिफिकेशन और राशन लें"] },
      { name: "उज्ज्वला (मुफ़्त गैस)", detail: "गरीब परिवारों को मुफ़्त LPG कनेक्शन।", where: "नज़दीकी गैस एजेंसी", docs: "आधार, BPL/राशन कार्ड, बैंक", helpline: "1800-266-6696", fee: "मुफ़्त कनेक्शन", time: "7-15 दिन", website: "pmuy.gov.in", steps: ["गैस एजेंसी जाएँ","उज्ज्वला फॉर्म भरें","दस्तावेज़ जमा करें","मुफ़्त कनेक्शन + पहला सिलेंडर + चूल्हा"] },
      { name: "PM आवास (आवास)", detail: "सरकारी सब्सिडी से किफायती आवास।", where: "नगरपालिका / ग्राम पंचायत / बैंक", docs: "आधार, आय प्रमाण, मकान न होने की घोषणा", helpline: "1800-11-6163", fee: "सब्सिडी युक्त", time: "भिन्न", website: "pmaymis.gov.in", steps: ["pmaymis.gov.in पर पात्रता जाँचें","नगरपालिका या बैंक से आवेदन","₹1.5-2.67 लाख सब्सिडी","मकान बनाएँ या खरीदें"] },
      { name: "वृद्ध/विधवा/विकलांग पेंशन", detail: "बुज़ुर्गों, विधवाओं, विकलांगों को मासिक पेंशन।", where: "ब्लॉक कार्यालय / राज्य पोर्टल", docs: "आधार, आयु/विधवा/विकलांगता प्रमाण, बैंक", helpline: "1076", fee: "मुफ़्त", time: "30-60 दिन", website: "nsap.nic.in", steps: ["ब्लॉक कार्यालय या राज्य पोर्टल पर आवेदन","प्रमाण दस्तावेज़ जमा करें","फील्ड सत्यापन","मासिक पेंशन बैंक में (₹200-1000)"] },
      { name: "सुकन्या समृद्धि (बेटी बचत)", detail: "बेटियों के लिए उच्च ब्याज बचत योजना।", where: "पोस्ट ऑफिस / बैंक", docs: "बेटी का जन्म प्रमाण, माता-पिता आधार व PAN", helpline: "1800-266-6868", fee: "न्यूनतम ₹250/साल", time: "उसी दिन", website: "indiapost.gov.in", steps: ["पोस्ट ऑफिस/बैंक जाएँ","10 साल से कम बेटी के लिए खाता खोलें","न्यूनतम ₹250/साल जमा","18 पर शिक्षा, 21 पर पूरा पैसा"] },
      { name: "छात्रवृत्ति (NSP)", detail: "केंद्र और राज्य छात्रवृत्ति।", where: "ऑनलाइन / स्कूल", docs: "आधार, मार्कशीट, आय/जाति प्रमाण, बैंक", helpline: "0120-6619540", fee: "मुफ़्त", time: "कैलेंडर अनुसार", website: "scholarships.gov.in", steps: ["scholarships.gov.in पर रजिस्टर","छात्रवृत्ति खोजें और चुनें","फॉर्म भरें और दस्तावेज़ अपलोड","संस्थान सत्यापन → पैसा बैंक में"] },
      { name: "स्किल इंडिया (PMKVY)", detail: "मुफ़्त व्यावसायिक प्रशिक्षण और प्रमाण पत्र।", where: "PMKVY प्रशिक्षण केंद्र", docs: "आधार, शिक्षा प्रमाण", helpline: "1800-123-9626", fee: "मुफ़्त", time: "1-6 महीने", website: "pmkvyofficial.org", steps: ["pmkvyofficial.org पर केंद्र खोजें","आधार से नामांकन","प्रशिक्षण और परीक्षा पूरी करें","NSDC प्रमाण पत्र + प्लेसमेंट सहायता"] },
    ]},
  },
  transport: { icon: "🚆",
    en: { name: "Transport & Travel", services: [
      { name: "Train Ticket (IRCTC)", detail: "Book train tickets online.", where: "Online / Station", docs: "ID for travel", helpline: "139", fee: "Per route", time: "Instant", website: "irctc.co.in", steps: ["Register on irctc.co.in","Search trains","Book & pay","Carry matching ID"] },
      { name: "Bus Ticket", detail: "Book state/inter-state bus.", where: "Online / Bus Stand", docs: "ID", helpline: "State transport", fee: "Per route", time: "Instant", website: "redbus.in", steps: ["Visit state transport or redbus.in","Search route","Select seat & pay","Show ticket at boarding"] },
      { name: "Traffic Challan", detail: "Check & pay traffic challans.", where: "Online", docs: "Vehicle/Challan Number", helpline: "State traffic", fee: "Per violation", time: "Instant", website: "echallan.parivahan.gov.in", steps: ["Visit echallan.parivahan.gov.in","Enter vehicle number","View challans","Pay online"] },
      { name: "Vehicle Registration", detail: "Register new vehicle or transfer.", where: "RTO / parivahan.gov.in", docs: "Invoice, Insurance, Aadhaar, PAN", helpline: "1800-2000", fee: "₹600-5000+", time: "7-15 days", website: "parivahan.gov.in", steps: ["Apply on Vahan portal","RTO inspection","Pay road tax","RC by post or DigiLocker"] },
    ]},
    hi: { name: "परिवहन और यात्रा", services: [
      { name: "ट्रेन टिकट (IRCTC)", detail: "ऑनलाइन ट्रेन टिकट बुक करें।", where: "ऑनलाइन / स्टेशन", docs: "यात्रा के लिए ID", helpline: "139", fee: "रूट अनुसार", time: "तुरंत", website: "irctc.co.in", steps: ["irctc.co.in पर रजिस्टर","ट्रेन खोजें","बुक करें और भुगतान","मैचिंग ID रखें"] },
      { name: "बस टिकट", detail: "राज्य/अंतर-राज्य बस बुक करें।", where: "ऑनलाइन / बस स्टैंड", docs: "ID", helpline: "राज्य परिवहन", fee: "रूट अनुसार", time: "तुरंत", website: "redbus.in", steps: ["राज्य परिवहन या redbus.in जाएँ","रूट खोजें","सीट चुनें और भुगतान","बोर्डिंग पर टिकट दिखाएँ"] },
      { name: "ट्रैफिक चालान", detail: "चालान जाँचें और भरें।", where: "ऑनलाइन", docs: "वाहन/चालान नंबर", helpline: "राज्य ट्रैफिक", fee: "उल्लंघन अनुसार", time: "तुरंत", website: "echallan.parivahan.gov.in", steps: ["echallan.parivahan.gov.in जाएँ","वाहन नंबर दर्ज करें","चालान देखें","ऑनलाइन भुगतान"] },
      { name: "वाहन रजिस्ट्रेशन", detail: "नया वाहन रजिस्टर या ट्रांसफर।", where: "RTO / parivahan.gov.in", docs: "इनवॉइस, बीमा, आधार, PAN", helpline: "1800-2000", fee: "₹600-5000+", time: "7-15 दिन", website: "parivahan.gov.in", steps: ["वाहन पोर्टल पर आवेदन","RTO निरीक्षण","रोड टैक्स भरें","RC डाक या DigiLocker से"] },
    ]},
  },
};

const T = {
  en: { appName:"Seva Saathi", tagline:"India's AI Service Helper 🤖", home:"Home", chat:"AI Chat", services:"Services", plan:"Plan", settings:"Settings",
    welcome:"Namaste! Welcome to Seva Saathi", welcomeSub:"AI-powered assistant for all Indian government services",
    selectCat:"Choose a Category", search:"Search any service...", back:"← Back",
    where:"Where",docs:"Documents",helpline:"Helpline",fee:"Fee",time:"Time",steps:"Steps",website:"Website",call:"Call",
    sendReq:"Send Request via Chat", noRes:"No results found.", totalSvc:"services", explore:"Explore →",
    webChat:"Web Chat",waChat:"WhatsApp Chat",
    premTitle:"Premium Plan",premPrice:"₹199/month",premDesc:"Priority support, video call, document help",
    premFeats:["Priority Helpline","Expert Video Call","Document Assistance","Personal Manager","WhatsApp Priority"],
    subscribe:"Subscribe Now",alreadyPrem:"Premium Active ✓",curPlan:"Current Plan",freePlan:"Basic (Free)",
    language:"Language",theme:"Theme",light:"Light",dark:"Dark",
    aiLabel:"🤖 AI-Powered", typing:"AI is thinking...",
    chatIntro:"Hello! I'm Seva Saathi AI Bot 🤖\n\nI can answer any question about Indian government services in detail. Try asking me:\n\n• \"How to make Aadhaar card?\"\n• \"पासपोर्ट कैसे बनाएँ?\"\n• \"Ayushman Bharat eligibility\"\n• \"साइबर फ्रॉड में क्या करें?\"\n\nOr choose a category below:",
  },
  hi: { appName:"सेवा साथी", tagline:"भारत का AI सेवा सहायक 🤖", home:"होम", chat:"AI चैट", services:"सेवाएँ", plan:"योजना", settings:"सेटिंग्स",
    welcome:"नमस्ते! सेवा साथी में स्वागत है", welcomeSub:"सभी सरकारी सेवाओं के लिए AI-संचालित सहायक",
    selectCat:"श्रेणी चुनें", search:"कोई भी सेवा खोजें...", back:"← वापस",
    where:"कहाँ",docs:"दस्तावेज़",helpline:"हेल्पलाइन",fee:"शुल्क",time:"समय",steps:"प्रक्रिया",website:"वेबसाइट",call:"कॉल",
    sendReq:"चैट में अनुरोध भेजें", noRes:"कोई परिणाम नहीं।", totalSvc:"सेवाएँ", explore:"देखें →",
    webChat:"वेब चैट",waChat:"व्हाट्सएप चैट",
    premTitle:"प्रीमियम योजना",premPrice:"₹199/माह",premDesc:"प्राथमिकता सहायता, वीडियो कॉल, दस्तावेज़ सहायता",
    premFeats:["प्राथमिकता हेल्पलाइन","विशेषज्ञ वीडियो कॉल","दस्तावेज़ सहायता","व्यक्तिगत प्रबंधक","व्हाट्सएप प्राथमिकता"],
    subscribe:"अभी सदस्यता लें",alreadyPrem:"प्रीमियम सक्रिय ✓",curPlan:"वर्तमान योजना",freePlan:"बेसिक (मुफ़्त)",
    language:"भाषा",theme:"थीम",light:"लाइट",dark:"डार्क",
    aiLabel:"🤖 AI-संचालित", typing:"AI सोच रहा है...",
    chatIntro:"नमस्ते! मैं सेवा साथी AI बॉट हूँ 🤖\n\nमैं भारतीय सरकारी सेवाओं के बारे में किसी भी सवाल का विस्तार से जवाब दे सकता हूँ। मुझसे पूछें:\n\n• \"आधार कार्ड कैसे बनाएँ?\"\n• \"How to apply for passport?\"\n• \"आयुष्मान भारत की पात्रता?\"\n• \"साइबर फ्रॉड में क्या करें?\"\n\nया नीचे श्रेणी चुनें:",
  },
};

// ═══════════════════════════
// MAIN COMPONENT
// ═══════════════════════════
export default function SevaSaathi() {
  const [lang, setLang] = useState("hi");
  const [theme, setTheme] = useState("light");
  const [isPrem, setIsPrem] = useState(false);
  const [tab, setTab] = useState("home");
  const [chatMode, setChatMode] = useState("web");
  const [selCat, setSelCat] = useState(null);
  const [selSvc, setSelSvc] = useState(null);
  const [search, setSearch] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef(null);
  const t = T[lang];
  const dk = theme === "dark";

  const C = dk ? {
    bg:"#08060e",card:"#13111a",card2:"#1a1725",surf:"#221e2e",tx:"#e8e4f0",tx2:"#8a82a0",
    acc:"#a855f7",accBg:"#2e1065",bdr:"#2e2640",chatBg:"#0a0812",uMsg:"#3b1d7a",bMsg:"#1a1528",
    nav:"#0e0c16",inp:"#1a1528",gold:"#f59e0b",grn:"#22c55e",shd:"rgba(0,0,0,0.5)",
  } : {
    bg:"#faf8ff",card:"#ffffff",card2:"#faf5ff",surf:"#f3e8ff",tx:"#1e1033",tx2:"#7c6f94",
    acc:"#9333ea",accBg:"#f3e8ff",bdr:"#e2d8f0",chatBg:"#f5f0ff",uMsg:"#e9d5ff",bMsg:"#ffffff",
    nav:"#ffffff",inp:"#ffffff",gold:"#d97706",grn:"#16a34a",shd:"rgba(30,16,51,0.06)",
  };

  const getCats = () => { const o={}; Object.keys(DB).forEach(k=>{const d=DB[k][lang];o[k]={name:d.name,icon:DB[k].icon,count:d.services.length};}); return o; };
  const getSvc = ck => DB[ck]?.[lang]?.services?.sort((a,b)=>a.name.localeCompare(b.name,lang==="hi"?"hi":"en")) || [];
  const allSvc = () => { const a=[]; Object.keys(DB).forEach(ck=>{const d=DB[ck][lang];d.services.forEach(s=>a.push({...s,ck,cName:d.name,cIcon:DB[ck].icon}));}); return a; };
  const filtered = () => { if(!search.trim())return[];const q=search.toLowerCase();return allSvc().filter(s=>s.name.toLowerCase().includes(q)||s.detail.toLowerCase().includes(q)); };
  const fmtT = d => {const h=d.getHours(),m=d.getMinutes().toString().padStart(2,"0");return `${h%12||12}:${m} ${h>=12?"PM":"AM"}`;};

  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,aiLoading]);

  // Build system prompt with all services data
  const buildSystemPrompt = () => {
    const allServices = [];
    Object.keys(DB).forEach(ck => {
      const d = DB[ck][lang];
      d.services.forEach(s => {
        allServices.push(`Service: ${s.name}\nCategory: ${d.name}\nDetail: ${s.detail}\nWhere: ${s.where}\nDocuments: ${s.docs}\nHelpline: ${s.helpline}\nFee: ${s.fee}\nTime: ${s.time}\nWebsite: ${s.website}\nSteps: ${s.steps.join(" → ")}`);
      });
    });
    return `You are Seva Saathi AI — India's most helpful government services assistant. You help common Indian citizens understand government services in simple, clear language.

IMPORTANT RULES:
1. If the user asks in Hindi, ALWAYS reply in Hindi (Devanagari script). If in English, reply in English.
2. Always give practical, step-by-step answers.
3. Always mention: where to go, what documents needed, helpline number, fee, and website.
4. Be warm, respectful, use "आप" in Hindi. Use emojis to make it friendly.
5. If someone asks about something not in the database, still try to help with general knowledge.
6. Keep answers concise but complete. Use bullet points for steps.
7. For emergencies, always give the helpline number FIRST.

HERE IS YOUR KNOWLEDGE BASE OF INDIAN GOVERNMENT SERVICES:
${allServices.join("\n\n")}

Remember: You are talking to common people, many elderly. Keep language simple and helpful.`;
  };

  // ── AI CHAT via /api/chat ──
  const callAI = async (userMsg) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          lang: lang,
          history: msgs.slice(-6).map(m => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });
      const data = await response.json();
      const aiText = data.reply || (lang === "hi" ? "माफ़ कीजिए, कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।" : "Sorry, something went wrong. Please try again.");
      setAiLoading(false);
      setMsgs(p => [...p, { id: Date.now(), from: "bot", text: aiText, time: new Date(), isAI: true }]);
    } catch (err) {
      setAiLoading(false);
      setMsgs(p => [...p, { id: Date.now(), from: "bot", text: lang === "hi" ? "⚠️ AI से जुड़ने में समस्या हुई। कृपया सेवाएँ टैब से मैन्युअल देखें या हेल्पलाइन 1076 कॉल करें।" : "⚠️ Couldn't connect to AI. Please browse services manually or call helpline 1076.", time: new Date() }]);
    }
  };

  // Init chat
  useEffect(() => {
    if (msgs.length === 0) {
      const catBtns = Object.keys(DB).map(k => ({ label: `${DB[k].icon} ${DB[k][lang].name}`, action: "cat", value: k }));
      setMsgs([{ id: 1, from: "bot", text: t.chatIntro, buttons: catBtns, time: new Date() }]);
    }
  }, []);

  const handleBtn = (btn) => {
    if (btn.action === "cat") {
      const addU = { id: Date.now(), from: "user", text: `${DB[btn.value].icon} ${DB[btn.value][lang].name}`, time: new Date() };
      const svcs = getSvc(btn.value);
      const svcBtns = svcs.map((s, i) => ({ label: `${i + 1}. ${s.name}`, action: "svc", value: btn.value, idx: i }));
      svcBtns.push({ label: t.back, action: "home" });
      setMsgs(p => [...p, addU, { id: Date.now() + 1, from: "bot", text: lang === "hi" ? "इस श्रेणी की सेवाएँ (A-Z)। किसी पर टैप करें:" : "Services in this category (A-Z). Tap any:", buttons: svcBtns, time: new Date() }]);
    } else if (btn.action === "svc") {
      const svc = getSvc(btn.value)[btn.idx];
      const addU = { id: Date.now(), from: "user", text: svc.name, time: new Date() };
      const txt = `📋 **${svc.name}**\n\n${svc.detail}\n\n📍 ${t.where}: ${svc.where}\n📄 ${t.docs}: ${svc.docs}\n📞 ${t.helpline}: ${svc.helpline}\n💰 ${t.fee}: ${svc.fee}\n⏱ ${t.time}: ${svc.time}\n🌐 ${t.website}: ${svc.website}\n\n${t.steps}:\n${svc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
      const actBtns = [
        { label: `📞 ${t.call} ${svc.helpline.split("/")[0].trim()}`, action: "call", value: svc.helpline.split("/")[0].trim().replace(/[^0-9]/g, "") },
        { label: t.back, action: "home" },
      ];
      setMsgs(p => [...p, addU, { id: Date.now() + 1, from: "bot", text: txt, buttons: actBtns, time: new Date() }]);
    } else if (btn.action === "call") {
      window.open(`tel:${btn.value}`, "_self");
    } else if (btn.action === "home") {
      const catBtns = Object.keys(DB).map(k => ({ label: `${DB[k].icon} ${DB[k][lang].name}`, action: "cat", value: k }));
      setMsgs(p => [...p, { id: Date.now(), from: "bot", text: t.chatIntro, buttons: catBtns, time: new Date() }]);
    }
  };

  const sendMsg = (txt) => {
    if (!txt.trim() || aiLoading) return;
    setMsgs(p => [...p, { id: Date.now(), from: "user", text: txt, time: new Date() }]);
    setInput("");
    callAI(txt);
  };

  const renderBold = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>);
  };

  // ═══ HEADER ═══
  const Header = () => (
    <div style={{ background: dk ? "linear-gradient(135deg,#1a0e30,#2e1065)" : "linear-gradient(135deg,#9333ea,#7c3aed)", color: "#fff", padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 4px 20px ${C.shd}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🇮🇳</div>
        <div><div style={{ fontSize: 19, fontWeight: 900 }}>{t.appName}</div><div style={{ fontSize: 11, opacity: 0.85 }}>{t.tagline}</div></div>
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {isPrem && <span style={{ background: "#fbbf24", color: "#1a1a1a", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 12 }}>⭐PRO</span>}
        <button onClick={() => { setLang(lang === "en" ? "hi" : "en"); setMsgs([]); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 10, padding: "6px 10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{lang === "en" ? "हिं" : "EN"}</button>
        <button onClick={() => setTheme(dk ? "light" : "dark")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dk ? "☀️" : "🌙"}</button>
      </div>
    </div>
  );

  // ═══ HOME ═══
  const Home = () => {
    const cc = getCats();
    return (
      <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
        <div style={{ background: dk ? "linear-gradient(135deg,#2e1065,#1a0e30)" : "linear-gradient(135deg,#e9d5ff,#c084fc)", borderRadius: 20, padding: "22px 20px", marginBottom: 16, border: `1.5px solid ${dk ? "#581c87" : "#a855f7"}` }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🤖</div>
          <div style={{ fontSize: 21, fontWeight: 900, color: dk ? "#e9d5ff" : "#581c87", marginBottom: 3 }}>{t.welcome}</div>
          <div style={{ fontSize: 13, color: dk ? "#c084fc" : "#7c3aed", fontWeight: 600 }}>{t.welcomeSub}</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setTab("chat")} style={{ padding: "12px 24px", borderRadius: 14, border: "none", background: dk ? "#a855f7" : "#7c3aed", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 15px ${C.shd}` }}>
              💬 {lang === "hi" ? "AI चैटबॉट से बात करें" : "Talk to AI Chatbot"}
            </button>
          </div>
        </div>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`🔍 ${t.search}`} style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${C.bdr}`, background: C.card, color: C.tx, fontSize: 16, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        {search.trim() ? (
          <div>{filtered().length === 0 ? <div style={{ textAlign: "center", padding: 20, color: C.tx2 }}>{t.noRes}</div> :
            filtered().map((s, i) => (
              <div key={i} onClick={() => setSelSvc(s)} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: `0 2px 8px ${C.shd}` }}>
                <span style={{ fontSize: 24 }}>{s.cIcon}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 12, color: C.tx2 }}>{s.cName}</div></div>
                <span style={{ color: C.tx2 }}>›</span>
              </div>
            ))}</div>
        ) : (
          <>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{t.selectCat}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.keys(cc).map(k => (
                <div key={k} onClick={() => { setSelCat(k); setTab("services"); }} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.bdr}`, padding: "18px 12px", textAlign: "center", cursor: "pointer", boxShadow: `0 2px 8px ${C.shd}`, transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 34 }}>{cc[k].icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{cc[k].name}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.acc, background: C.accBg, padding: "2px 8px", borderRadius: 8 }}>{cc[k].count} {t.totalSvc}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // ═══ SERVICES ═══
  const Services = () => {
    if (selCat) {
      const svcs = getSvc(selCat); const cd = DB[selCat][lang];
      return (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ background: dk ? "linear-gradient(135deg,#2e1065,#1a0e30)" : "linear-gradient(135deg,#9333ea,#7c3aed)", padding: "14px 16px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSelCat(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 10, padding: "6px 10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>←</button>
            <span style={{ fontSize: 28 }}>{DB[selCat].icon}</span>
            <div><div style={{ fontSize: 18, fontWeight: 900 }}>{cd.name}</div><div style={{ fontSize: 11, opacity: 0.85 }}>{svcs.length} {t.totalSvc}</div></div>
          </div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {svcs.map((s, i) => (
              <div key={i} onClick={() => setSelSvc({ ...s, ck: selCat })} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, padding: "14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: `0 1px 6px ${C.shd}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: C.acc, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 12, color: C.tx2, marginTop: 1 }}>{s.detail.length > 50 ? s.detail.slice(0, 50) + "..." : s.detail}</div></div>
                <span style={{ color: C.acc, fontSize: 20 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    const cc = getCats();
    return (
      <div style={{ padding: 12, flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>{t.selectCat}</div>
        {Object.keys(cc).map(k => (
          <div key={k} onClick={() => setSelCat(k)} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: `0 1px 6px ${C.shd}` }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: C.surf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{cc[k].icon}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800 }}>{cc[k].name}</div><div style={{ fontSize: 12, color: C.tx2 }}>{cc[k].count} {t.totalSvc}</div></div>
            <div style={{ background: C.accBg, color: C.acc, fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8 }}>{t.explore}</div>
          </div>
        ))}
      </div>
    );
  };

  // ═══ DETAIL MODAL ═══
  const Detail = () => {
    if (!selSvc) return null;
    const s = selSvc;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setSelSvc(null)}>
        <div onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: `0 -10px 40px ${C.shd}` }}>
          <div style={{ background: dk ? "linear-gradient(135deg,#2e1065,#1a0e30)" : "linear-gradient(135deg,#9333ea,#7c3aed)", padding: "20px 18px 16px", borderRadius: "22px 22px 0 0", color: "#fff" }}>
            <button onClick={() => setSelSvc(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 10, padding: "5px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>{t.back}</button>
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.3 }}>{s.name}</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{s.detail}</div>
          </div>
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ ic: "📍", lb: t.where, v: s.where }, { ic: "📄", lb: t.docs, v: s.docs }, { ic: "📞", lb: t.helpline, v: s.helpline }, { ic: "💰", lb: t.fee, v: s.fee }, { ic: "⏱️", lb: t.time, v: s.time }, { ic: "🌐", lb: t.website, v: s.website }].map((item, i) => (
              <div key={i} style={{ background: C.card2, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.bdr}`, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.ic}</span>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: C.tx2, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.lb}</div><div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{item.v}</div></div>
              </div>
            ))}
            <div style={{ background: dk ? C.accBg : "#f3e8ff", borderRadius: 14, padding: "16px", border: `1.5px solid ${dk ? "#581c87" : "#c084fc"}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: C.acc }}>📋 {t.steps}</div>
              {s.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < s.steps.length - 1 ? 10 : 0, paddingBottom: i < s.steps.length - 1 ? 10 : 0, borderBottom: i < s.steps.length - 1 ? `1px solid ${dk ? "#581c8733" : "#e9d5ff"}` : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, paddingTop: 4 }}>{step}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`tel:${s.helpline.split("/")[0].trim().replace(/[^0-9]/g, "")}`} style={{ flex: 1, padding: "14px", borderRadius: 12, textAlign: "center", background: C.grn, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 800 }}>📞 {t.call}</a>
              <button onClick={() => { setSelSvc(null); setTab("chat"); sendMsg(`${lang === "hi" ? "मुझे" : "Tell me about"} ${s.name} ${lang === "hi" ? "के बारे में बताओ" : ""}`); }} style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: C.acc, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>🤖 {lang === "hi" ? "AI से पूछें" : "Ask AI"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══ CHAT ═══
  const Chat = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.bdr}`, alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
        <div style={{ display: "flex", flex: 1 }}>
          {["web", "whatsapp"].map(m => (
            <button key={m} onClick={() => setChatMode(m)} style={{ flex: 1, padding: "10px 6px", border: "none", background: "none", borderBottom: chatMode === m ? `3px solid ${m === "whatsapp" ? "#25d366" : C.acc}` : "3px solid transparent", fontSize: 13, fontWeight: 700, cursor: "pointer", color: chatMode === m ? (m === "whatsapp" ? "#25d366" : C.acc) : C.tx2, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {m === "whatsapp" ? "💬" : "🌐"} {m === "whatsapp" ? t.waChat : t.webChat}
            </button>
          ))}
        </div>
        <div style={{ background: dk ? "#2e1065" : "#f3e8ff", color: C.acc, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, marginLeft: 8 }}>{t.aiLabel}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, background: chatMode === "whatsapp" ? (dk ? "#0b141a" : "#ece5dd") : C.chatBg }}>
        {msgs.map(msg => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "85%", padding: "11px 14px", borderRadius: msg.from === "user" ? (chatMode === "whatsapp" ? "12px 0 12px 12px" : "14px 14px 4px 14px") : (chatMode === "whatsapp" ? "0 12px 12px 12px" : "14px 14px 14px 4px"), background: msg.from === "user" ? (chatMode === "whatsapp" ? (dk ? "#005c4b" : "#dcf8c6") : C.uMsg) : (chatMode === "whatsapp" ? (dk ? "#1f2c34" : "#fff") : C.bMsg), color: msg.from === "user" && chatMode === "whatsapp" && !dk ? "#111" : C.tx, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-line", boxShadow: `0 1px 2px ${C.shd}`, border: chatMode === "whatsapp" ? "none" : `1px solid ${C.bdr}`, wordBreak: "break-word" }}>
                {msg.isAI && <div style={{ fontSize: 10, fontWeight: 800, color: C.acc, marginBottom: 4 }}>🤖 AI</div>}
                {msg.from === "bot" ? renderBold(msg.text) : msg.text}
                <div style={{ fontSize: 9, color: C.tx2, textAlign: "right", marginTop: 3 }}>{fmtT(msg.time)}</div>
              </div>
            </div>
            {msg.buttons && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6, justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                {msg.buttons.map((btn, i) => (
                  <button key={i} onClick={() => handleBtn(btn)} style={{ padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `1.5px solid ${btn.action === "home" ? C.bdr : C.acc}`, background: btn.action === "home" ? "transparent" : C.accBg, color: btn.action === "home" ? C.tx2 : C.acc, lineHeight: 1.3, maxWidth: "100%", textAlign: "left" }}>{btn.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {aiLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
            <div style={{ padding: "11px 16px", borderRadius: "14px 14px 14px 4px", background: C.bMsg, border: `1px solid ${C.bdr}`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.acc, animation: `pulse 1s ${i * 0.2}s infinite` }} />))}
              </div>
              <span style={{ fontSize: 12, color: C.tx2, fontWeight: 600 }}>{t.typing}</span>
            </div>
          </div>
        )}
        <div ref={chatRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: C.card, borderTop: `1px solid ${C.bdr}`, alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg(input)} placeholder={lang === "hi" ? "AI से कुछ भी पूछें..." : "Ask AI anything..."} disabled={aiLoading}
          style={{ flex: 1, padding: "12px 14px", borderRadius: 22, border: `1.5px solid ${C.bdr}`, background: C.inp, color: C.tx, fontSize: 15, outline: "none", fontFamily: "inherit", opacity: aiLoading ? 0.5 : 1 }} />
        <button onClick={() => sendMsg(input)} disabled={aiLoading} style={{ width: 46, height: 46, borderRadius: "50%", background: chatMode === "whatsapp" ? "#25d366" : C.acc, border: "none", color: "#fff", fontSize: 18, cursor: aiLoading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: aiLoading ? 0.5 : 1 }}>➤</button>
      </div>
    </div>
  );

  // ═══ PLAN ═══
  const Plan = () => (
    <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 14 }}>{t.premTitle}</div>
      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, padding: "14px", marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.tx2, fontWeight: 700 }}>{t.curPlan}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: isPrem ? C.gold : C.tx }}>{isPrem ? t.premTitle + " ⭐" : t.freePlan}</div>
      </div>
      <div style={{ background: dk ? "linear-gradient(135deg,#422006,#1a0e00)" : "linear-gradient(135deg,#fffbeb,#fef3c7)", borderRadius: 18, padding: "24px 20px", border: `2px solid ${C.gold}`, position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: C.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>PREMIUM</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: dk ? "#fef3c7" : "#78350f", marginBottom: 4 }}>{t.premPrice}</div>
        <div style={{ fontSize: 13, color: dk ? "#d6d3d1" : "#78716c", marginBottom: 18 }}>{t.premDesc}</div>
        {t.premFeats.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.gold, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>✓</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: dk ? "#e7e5e4" : "#44403c" }}>{f}</span>
          </div>
        ))}
        <button onClick={() => setIsPrem(!isPrem)} style={{ width: "100%", marginTop: 14, padding: "14px", borderRadius: 12, border: "none", background: isPrem ? C.grn : C.gold, color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer" }}>{isPrem ? t.alreadyPrem : t.subscribe}</button>
      </div>
    </div>
  );

  // ═══ SETTINGS ═══
  const Settings = () => (
    <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 14 }}>{t.settings}</div>
      {[{ label: `🌐 ${t.language}`, items: [{ v: "en", l: "English" }, { v: "hi", l: "हिन्दी" }], cur: lang, set: v => { setLang(v); setMsgs([]); } },
      { label: `🎨 ${t.theme}`, items: [{ v: "light", l: `☀️ ${t.light}` }, { v: "dark", l: `🌙 ${t.dark}` }], cur: theme, set: setTheme }].map((sec, si) => (
        <div key={si} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, padding: "16px", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tx2, marginBottom: 10 }}>{sec.label}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {sec.items.map(it => (
              <button key={it.v} onClick={() => sec.set(it.v)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${sec.cur === it.v ? C.acc : C.bdr}`, background: sec.cur === it.v ? C.accBg : "none", color: sec.cur === it.v ? C.acc : C.tx, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{it.l}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: `'Noto Sans','Noto Sans Devanagari',system-ui,sans-serif`, background: C.bg, color: C.tx, minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", lineHeight: 1.5, boxShadow: `0 0 80px ${C.shd}` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.bdr};border-radius:3px}
        input::placeholder{color:${C.tx2}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "home" && <Home />}{tab === "chat" && <Chat />}{tab === "services" && <Services />}
        {tab === "plan" && <Plan />}{tab === "settings" && <Settings />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", background: C.nav, borderTop: `1px solid ${C.bdr}`, padding: "5px 0 7px", boxShadow: `0 -2px 12px ${C.shd}` }}>
        {[{ k: "home", ic: "🏠", lb: t.home }, { k: "chat", ic: "🤖", lb: t.chat }, { k: "services", ic: "📋", lb: t.services }, { k: "plan", ic: "⭐", lb: t.plan }, { k: "settings", ic: "⚙️", lb: t.settings }].map(n => (
          <button key={n.k} onClick={() => { setTab(n.k); if (n.k === "services") setSelCat(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: "none", background: "none", cursor: "pointer", padding: "4px 10px", color: tab === n.k ? C.acc : C.tx2, fontSize: 10, fontWeight: tab === n.k ? 800 : 500, position: "relative", borderRadius: 10 }}>
            {tab === n.k && <div style={{ position: "absolute", top: -1, width: 18, height: 3, borderRadius: 2, background: C.acc }} />}
            <span style={{ fontSize: 20 }}>{n.ic}</span><span>{n.lb}</span>
          </button>
        ))}
      </div>
      <Detail />
    </div>
  );
}
