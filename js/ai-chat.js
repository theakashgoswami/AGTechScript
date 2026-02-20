/* =========================================================
   AG TECHSCRIPT – AI ASSISTANT (ADVANCED EDITION)
   Single source of truth – NO duplicated functions
========================================================= */

let ALL_FAQS = [];
let AI_KNOWLEDGE = [];
let BLOG_POSTS_CACHE = null;

/* =========================================================
   INITIALIZER
========================================================= */
function initializeAIAssistant() {
    console.log("🤖 AI Assistant Loaded");

    setTimeout(() => {
        const btn = document.getElementById("aiFloatingBtn");
        const popup = document.getElementById("aiPopupWindow");
        const closeBtn = document.getElementById("aiCloseBtn");
        const input = document.getElementById("aiInput");
        const send = document.getElementById("aiSend");
        const messages = document.getElementById("aiMessages");

        if (!btn || !popup) {
            console.warn("AI elements missing...");
            return;
        }

        /* POPUP TOGGLE */
        btn.onclick = e => {
            e.preventDefault();
            popup.classList.toggle("active");
        };

        if (closeBtn) closeBtn.onclick = () => popup.classList.remove("active");

        /* OUTSIDE CLICK */
        document.addEventListener("click", e => {
            if (!e.target.closest(".ai-popup-window") &&
                !e.target.closest(".ai-floating-btn")) {
                popup.classList.remove("active");
            }
        });

        /* INPUT SEND */
        if (send && input) {
            send.onclick = () => handleAIQuestion();
            input.addEventListener("keypress", e => {
                if (e.key === "Enter") handleAIQuestion();
            });
        }

        /* Initial welcome */
        if (messages && messages.children.length === 0) {
            addAIMessage("Hello! Ask me anything about AG TechScript 😊", false);
        }

        /* Load FAQs */
        loadFAQs();

    }, 400);
}

/* =========================================================
   MESSAGE SYSTEM
========================================================= */
function addAIMessage(text, isUser = false) {
    const box = document.getElementById("aiMessages");
    if (!box) return;

    const msg = document.createElement("div");
    msg.className = `ai-message ${isUser ? "user" : "bot"}`;
    msg.innerHTML = `<p>${text}</p>`;

    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

/* Typing animation */
function showTyping() {
    const box = document.getElementById("aiMessages");
    if (!box) return;

    const typing = document.createElement("div");
    typing.id = "typingIndicator";
    typing.className = "ai-message bot typing";
    typing.innerHTML = `<p>Thinking<span class="typing-dots">...</span></p>`;
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById("typingIndicator");
    if (t) t.remove();
}

/* =========================================================
   ASK + RESPONSE HANDLER
========================================================= */
async function handleAIQuestion() {
    const input = document.getElementById("aiInput");
    if (!input) return;

    const txt = input.value.trim();
    if (!txt) return;

    addAIMessage(txt, true);
    input.value = "";

    showTyping();

    setTimeout(async () => {
        const answer = await findAIResponse(txt);
        hideTyping();
        addAIMessage(answer);
    }, 700);
}

/* =========================================================
   FAQ LOADER (SHEETS + FALLBACK)
========================================================= */
async function loadFAQs() {
    try {
        const sheetId = "12LdHpXyaV32tc4gZaDz8yawfsvSv_sA1-tlx0tzmHvc";
        let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

        const res = await fetch(url);
        const text = await res.text();

        const json = JSON.parse(
            text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1]
        );

        const rows = json.table.rows || [];

        ALL_FAQS = rows.map(r => ({
            question: r.c[0]?.v || "",
            answer: r.c[1]?.v || "",
            tags: r.c[2]?.v?.toLowerCase().split(",").map(t => t.trim()) || []
        })).filter(f => f.question);

    } catch (err) {
        console.warn("Using fallback FAQ:", err);

        ALL_FAQS = [
            { question:"How to contact support?", answer:"Email connect@agtechscript.in or WhatsApp on 6397563847", tags:["contact","help"] },
            { question:"What is your return policy?", answer:"7-day easy return policy.", tags:["policy","refund"] },
            { question:"Where are you located?", answer:"Kisrauli, Kasganj, UP.", tags:["location"] },
            { question:"Do you offer jobs?", answer:"Yes, visit jobs.agtechscript.in", tags:["jobs","career"] }
        ];
    }

    AI_KNOWLEDGE = ALL_FAQS.map(f => ({
        question: f.question.toLowerCase(),
        answer: f.answer,
        tags: f.tags
    }));

    loadAISuggestions();
}

/* =========================================================
   RESPONSE ENGINE (SMART MATCH)
========================================================= */
async function findAIResponse(query) {
    const q = query.toLowerCase();
    let best = null, bestScore = 0;

    AI_KNOWLEDGE.forEach(faq => {
        let score = 0;

        if (faq.question === q) score = 100;

        q.split(/\s+/).forEach(word => {
            if (faq.question.includes(word)) score += 3;
            faq.tags.forEach(t => {
                if (t.includes(word)) score += 2;
            });
        });

        if (score > bestScore) {
            bestScore = score;
            best = faq;
        }
    });

    if (best && bestScore >= 2) {
        return best.answer;
    }

    // Suggestions
    const random = [...ALL_FAQS].sort(() => 0.5 - Math.random()).slice(0, 3);
    let s = "Couldn't find exact answer. Try these:<br><br>";
    random.forEach(f => {
        s += `• <span class='suggestion-link' style='color:#0066ff;cursor:pointer' onclick="document.getElementById('aiInput').value='${f.question}'; handleAIQuestion();">${f.question}</span><br>`;
    });
    return s;
}

/* =========================================================
   SUGGESTION CHIPS
========================================================= */
function loadAISuggestions() {
    const box = document.getElementById("suggestionChips");
    if (!box) return;

    const emojis = ["🤔","💭","💡","✨","🔍","⚡"];
    const random = [...ALL_FAQS].sort(() => Math.random() - 0.5).slice(0, 6);

    box.innerHTML = random.map(f => {
        const em = emojis[Math.floor(Math.random()*emojis.length)];
        const short = f.question.length > 35 ? f.question.slice(0,35)+"..." : f.question;
        return `<div class='suggestion-chip' data-question="${f.question.replace(/"/g,"&quot;")}">${em} ${short}</div>`;
    }).join("");

    document.querySelectorAll(".suggestion-chip").forEach(chip => {
        chip.onclick = () => {
            const input = document.getElementById("aiInput");
            input.value = chip.dataset.question;
            handleAIQuestion();
        };
    });
}