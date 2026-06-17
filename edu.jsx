import { useState, useEffect, useRef } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
// Palette: warm saffron + deep teal + cream parchment + brick red accent
// Type: bold display for scores, readable body for questions
// Signature: biscuit jar that fills up as you collect rewards

const BISCUITS = ["🍪", "🥐", "🍩", "🧁", "🍬"];

const QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    topic: "Literacy",
    question: "What is the approximate literacy rate in Pakistan as of recent years?",
    options: ["40%", "58%", "72%", "85%"],
    answer: 1,
    fact: "Pakistan's literacy rate is around 58%, meaning millions of adults still cannot read or write.",
  },
  {
    id: 2,
    type: "mcq",
    topic: "Out-of-School Children",
    question: "How many children of school-going age are estimated to be out of school in Pakistan?",
    options: ["5 million", "12 million", "22 million", "30 million"],
    answer: 2,
    fact: "Around 22 million children are out of school in Pakistan — one of the highest numbers in the world.",
  },
  {
    id: 3,
    type: "mcq",
    topic: "Gender Gap",
    question: "Which statement best describes the gender gap in Pakistan's education?",
    options: [
      "Boys and girls attend school equally",
      "Girls have higher enrollment than boys",
      "Girls face significantly lower enrollment rates than boys",
      "There is no gender gap in urban areas",
    ],
    answer: 2,
    fact: "Girls face significant barriers including cultural norms, distance to school, and lack of female teachers, leading to lower enrollment.",
  },
  {
    id: 4,
    type: "mcq",
    topic: "Budget",
    question: "Pakistan spends roughly what percentage of its GDP on education?",
    options: ["1.5%", "3%", "5%", "7%"],
    answer: 0,
    fact: "Pakistan spends about 1.5–2% of GDP on education, far below the UNESCO-recommended 4–6%.",
  },
  {
    id: 5,
    type: "mcq",
    topic: "Medium of Instruction",
    question: "What is a major issue with Pakistan's medium of instruction in schools?",
    options: [
      "All schools teach in English only",
      "Urdu and regional languages are banned",
      "A split between Urdu/regional language public schools and English private schools creates inequality",
      "Schools have no language policy",
    ],
    answer: 2,
    fact: "The two-tiered system — English-medium private vs. Urdu-medium public — deepens social inequality.",
  },
  {
    id: 6,
    type: "unscramble",
    topic: "Key Concept",
    question: "Unscramble this word related to a major Pakistan education challenge:",
    scrambled: "RLEMANOLT",
    answer: "ENROLLMENT",
    hint: "It means getting students into schools.",
    fact: "Low school enrollment, especially in rural areas, is one of Pakistan's biggest education hurdles.",
  },
  {
    id: 7,
    type: "mcq",
    topic: "Rural vs Urban",
    question: "How does rural education in Pakistan generally compare to urban education?",
    options: [
      "Rural schools have better facilities",
      "There is no significant difference",
      "Rural areas have fewer schools, worse facilities, and higher dropout rates",
      "Rural areas receive more government funding",
    ],
    answer: 2,
    fact: "Rural Pakistan faces ghost schools, missing teachers, and crumbling infrastructure — all driving dropout rates up.",
  },
  {
    id: 8,
    type: "truefalse",
    topic: "Teacher Quality",
    question: "'Ghost teachers' — teachers who receive salaries but don't show up — are a documented problem in Pakistan's public schools.",
    answer: true,
    fact: "Ghost teachers are a real and widespread issue, wasting education budgets and leaving classrooms empty.",
  },
  {
    id: 9,
    type: "unscramble",
    topic: "Institution",
    question: "Unscramble the name of the UN agency that tracks global education:",
    scrambled: "OCSEUN",
    answer: "UNESCO",
    hint: "It sets global education standards and goals.",
    fact: "UNESCO recommends countries spend at least 4–6% of GDP on education. Pakistan falls well short.",
  },
  {
    id: 10,
    type: "mcq",
    topic: "Higher Education",
    question: "What percentage of Pakistanis go on to higher education (university level)?",
    options: ["Less than 10%", "20%", "35%", "50%"],
    answer: 0,
    fact: "Fewer than 10% of Pakistanis access higher education, reflecting the bottleneck from primary to university.",
  },
];

function BiscuitJar({ count, total }) {
  const pct = Math.min(count / total, 1);
  const fillHeight = Math.round(pct * 80);

  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Jar shape */}
        <svg width="90" height="110" viewBox="0 0 90 110">
          {/* Lid */}
          <rect x="18" y="4" width="54" height="14" rx="6" fill="#C0795A" />
          {/* Jar body */}
          <rect x="10" y="18" width="70" height="82" rx="10" fill="#FDE8C8" stroke="#C0795A" strokeWidth="3" />
          {/* Fill level */}
          <clipPath id="jarClip">
            <rect x="12" y="20" width="66" height="78" rx="8" />
          </clipPath>
          <rect
            x="12"
            y={98 - fillHeight}
            width="66"
            height={fillHeight}
            rx="4"
            fill="#F5A623"
            opacity="0.7"
            clipPath="url(#jarClip)"
            style={{ transition: "all 0.6s ease" }}
          />
          {/* Biscuits inside */}
          {Array.from({ length: count }).map((_, i) => (
            <text
              key={i}
              x={28 + (i % 3) * 16}
              y={92 - Math.floor(i / 3) * 20}
              fontSize="13"
              style={{ transition: "all 0.4s ease" }}
            >
              🍪
            </text>
          ))}
        </svg>
      </div>
      <div style={{ fontSize: "13px", color: "#8B5E3C", fontWeight: 700, marginTop: 4 }}>
        {count}/{total} Biscuits
      </div>
    </div>
  );
}

function StarBurst({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100,
      animation: "fadeOut 1.5s forwards",
    }}>
      <div style={{ fontSize: "80px", animation: "popIn 0.4s ease" }}>🎉🍪✨</div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ background: "#EDD5B3", borderRadius: 20, height: 10, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${(current / total) * 100}%`,
        background: "linear-gradient(90deg, #F5A623, #E8602C)",
        borderRadius: 20,
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}

function MCQQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    onAnswer(i === q.answer);
  };

  return (
    <div>
      {q.options.map((opt, i) => {
        let bg = "#FDF6EC";
        let border = "2px solid #E8C99A";
        let color = "#3D2B1F";
        if (selected !== null) {
          if (i === selected && i === q.answer) { bg = "#D4EDDA"; border = "2px solid #28A745"; color = "#155724"; }
          else if (i === selected && i !== q.answer) { bg = "#F8D7DA"; border = "2px solid #DC3545"; color = "#721C24"; }
        }
        return (
          <button key={i} onClick={() => choose(i)} style={{
            display: "block", width: "100%", textAlign: "left",
            padding: "12px 16px", marginBottom: 10, borderRadius: 10,
            background: bg, border, color, fontSize: 15,
            cursor: answered ? "default" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}>
            <span style={{ fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  const choose = (val) => {
    if (answered) return;
    setSelected(val);
    onAnswer(val === q.answer);
  };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {[true, false].map((val) => {
        let bg = val ? "#D1ECF1" : "#FDE8C8";
        let border = val ? "2px solid #17A2B8" : "2px solid #F5A623";
        if (selected !== null) {
          if (val === selected && val === q.answer) { bg = "#D4EDDA"; border = "2px solid #28A745"; }
          else if (val === selected && val !== q.answer) { bg = "#F8D7DA"; border = "2px solid #DC3545"; }
        }
        return (
          <button key={String(val)} onClick={() => choose(val)} style={{
            flex: 1, padding: "16px", borderRadius: 12, border,
            background: bg, fontSize: 20, fontWeight: 700, cursor: answered ? "default" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}>
            {val ? "✅ True" : "❌ False"}
          </button>
        );
      })}
    </div>
  );
}

function UnscrambleQuestion({ q, onAnswer, answered }) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);

  const submit = () => {
    if (submitted) return;
    const isCorrect = input.trim().toUpperCase() === q.answer.toUpperCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    onAnswer(isCorrect);
  };

  // shuffle letters display
  const letters = q.scrambled.split("").map((l, i) => (
    <span key={i} style={{
      display: "inline-block", background: "#F5A623", color: "#fff",
      borderRadius: 6, padding: "6px 10px", margin: "0 3px",
      fontWeight: 900, fontSize: 20, letterSpacing: 2,
    }}>{l}</span>
  ));

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "center" }}>{letters}</div>
      <div style={{ fontSize: 13, color: "#8B5E3C", marginBottom: 12, textAlign: "center" }}>
        💡 Hint: {q.hint}
      </div>
      {!submitted ? (
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type your answer..."
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 10,
              border: "2px solid #E8C99A", fontSize: 16,
              fontFamily: "inherit", background: "#FDF6EC", color: "#3D2B1F",
              outline: "none",
            }}
          />
          <button onClick={submit} style={{
            background: "#E8602C", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px 20px", fontWeight: 700,
            fontSize: 15, cursor: "pointer", fontFamily: "inherit",
          }}>Check</button>
        </div>
      ) : (
        <div style={{
          padding: "14px", borderRadius: 10, textAlign: "center",
          background: correct ? "#D4EDDA" : "#F8D7DA",
          border: `2px solid ${correct ? "#28A745" : "#DC3545"}`,
          color: correct ? "#155724" : "#721C24",
          fontWeight: 700, fontSize: 16,
        }}>
          {correct ? "✅ Correct! The answer is " : "❌ The correct answer was "}
          <strong>{q.answer}</strong>
        </div>
      )}
    </div>
  );
}

export default function PakistanEduGame() {
  const [screen, setScreen] = useState("intro"); // intro | game | result
  const [currentQ, setCurrentQ] = useState(0);
  const [biscuits, setBiscuits] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [biscuitEmoji] = useState(() => BISCUITS[Math.floor(Math.random() * BISCUITS.length)]);
  const nextTimer = useRef(null);

  const q = QUESTIONS[currentQ];
  const totalBiscuits = QUESTIONS.length;

  const handleAnswer = (correct) => {
    if (answered) return;
    setAnswered(true);
    setLastCorrect(correct);
    if (correct) {
      setBiscuits((b) => b + 1);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1500);
    }
    nextTimer.current = setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ((n) => n + 1);
        setAnswered(false);
        setLastCorrect(null);
      } else {
        setScreen("result");
      }
    }, 2800);
  };

  const restart = () => {
    setCurrentQ(0);
    setBiscuits(0);
    setAnswered(false);
    setLastCorrect(null);
    setScreen("game");
  };

  useEffect(() => () => clearTimeout(nextTimer.current), []);

  // ── Screens ──────────────────────────────────────────────────────────────────

  const baseStyle = {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #FFF8EC 0%, #FDE8C8 60%, #F5D09A 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: "#3D2B1F",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "0 16px 40px",
  };

  if (screen === "intro") return (
    <div style={baseStyle}>
      <style>{`
        @keyframes fadeOut { 0%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
        @keyframes popIn { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div style={{ maxWidth: 540, width: "100%", textAlign: "center", paddingTop: 48 }}>
        {/* Logo area */}
        <div style={{ fontSize: 64, animation: "float 3s ease-in-out infinite" }}>📚</div>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: 4,
          color: "#E8602C", textTransform: "uppercase", marginTop: 12,
        }}>Pakistan Education Quiz</div>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 42px)", margin: "10px 0 0",
          color: "#3D2B1F", lineHeight: 1.2, fontStyle: "italic",
        }}>Win Biscuits,<br />Learn the Truth</h1>
        <p style={{ color: "#8B5E3C", fontSize: 16, lineHeight: 1.7, marginTop: 14 }}>
          Answer questions about the real state of education in Pakistan.
          Every correct answer fills your biscuit jar! 🍪
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14, margin: "28px 0",
        }}>
          {[
            { icon: "❓", label: "10 Questions" },
            { icon: "🧩", label: "3 Types" },
            { icon: "🍪", label: "10 Biscuits" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              background: "#FFF3DC", borderRadius: 14, padding: "16px 8px",
              border: "2px solid #E8C99A",
            }}>
              <div style={{ fontSize: 28 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5E3C", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setScreen("game")} style={{
          background: "linear-gradient(135deg, #E8602C, #C0452A)",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "16px 48px", fontSize: 18, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 20px rgba(232,96,44,0.4)",
        }}>
          Start Playing 🎮
        </button>

        <p style={{ fontSize: 12, color: "#B08060", marginTop: 20 }}>
          Questions based on research and UNESCO data on Pakistan's education system.
        </p>
      </div>
    </div>
  );

  if (screen === "result") {
    const pct = Math.round((biscuits / totalBiscuits) * 100);
    let verdict, msg;
    if (pct === 100) { verdict = "🏆 Scholar of Pakistan!"; msg = "Perfect score! You truly understand the education crisis — and can help change it."; }
    else if (pct >= 70) { verdict = "🎓 Education Advocate"; msg = "Impressive knowledge! Share what you've learned with others."; }
    else if (pct >= 40) { verdict = "📖 Curious Learner"; msg = "Good effort! Read the facts again to deepen your understanding."; }
    else { verdict = "🌱 Just Getting Started"; msg = "Every expert starts somewhere. Try again — the biscuits await!"; }

    return (
      <div style={baseStyle}>
        <div style={{ maxWidth: 540, width: "100%", paddingTop: 40, textAlign: "center" }}>
          <div style={{ fontSize: 72 }}>🍪</div>
          <h2 style={{ fontSize: 28, margin: "12px 0 4px" }}>{verdict}</h2>
          <p style={{ color: "#8B5E3C", fontSize: 16 }}>{msg}</p>

          <div style={{
            background: "#FFF3DC", border: "3px solid #E8C99A",
            borderRadius: 20, padding: "24px 32px", margin: "24px 0",
          }}>
            <BiscuitJar count={biscuits} total={totalBiscuits} />
            <div style={{ marginTop: 16, fontSize: 32, fontWeight: 900 }}>
              {biscuits}/{totalBiscuits}
            </div>
            <div style={{ color: "#8B5E3C", fontWeight: 700 }}>Biscuits Earned</div>
          </div>

          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, color: "#E8602C", marginBottom: 10 }}>Key Facts You Learned:</h3>
            {QUESTIONS.slice(0, 4).map((q) => (
              <div key={q.id} style={{
                fontSize: 13, color: "#5C3D2E", padding: "8px 12px",
                borderLeft: "3px solid #F5A623", marginBottom: 8,
                background: "#FFF8EC", borderRadius: "0 8px 8px 0",
              }}>📌 {q.fact}</div>
            ))}
          </div>

          <button onClick={restart} style={{
            background: "linear-gradient(135deg, #E8602C, #C0452A)",
            color: "#fff", border: "none", borderRadius: 14,
            padding: "14px 36px", fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>Play Again 🔄</button>
        </div>
      </div>
    );
  }

  // ── Game screen ──────────────────────────────────────────────────────────────
  return (
    <div style={baseStyle}>
      <style>{`
        @keyframes fadeOut { 0%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
        @keyframes popIn { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
      `}</style>
      <StarBurst show={showBurst} />

      <div style={{ maxWidth: 580, width: "100%", paddingTop: 28 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#E8602C", fontWeight: 700, textTransform: "uppercase" }}>
              Question {currentQ + 1} of {QUESTIONS.length}
            </div>
            <div style={{ fontSize: 13, color: "#8B5E3C" }}>{q.topic}</div>
          </div>
          <BiscuitJar count={biscuits} total={totalBiscuits} />
        </div>

        <ProgressBar current={currentQ} total={QUESTIONS.length} />

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "28px 24px",
          marginTop: 20, boxShadow: "0 8px 40px rgba(61,43,31,0.12)",
          border: "1px solid #EDD5B3",
        }}>
          {/* Question type badge */}
          <div style={{
            display: "inline-block",
            background: q.type === "mcq" ? "#17A2B8" : q.type === "truefalse" ? "#6F42C1" : "#28A745",
            color: "#fff", borderRadius: 20, padding: "3px 12px",
            fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12,
            textTransform: "uppercase",
          }}>
            {q.type === "mcq" ? "Multiple Choice" : q.type === "truefalse" ? "True or False" : "Unscramble"}
          </div>

          <p style={{ fontSize: "clamp(15px, 3vw, 18px)", lineHeight: 1.6, fontWeight: 600, margin: "0 0 20px" }}>
            {q.question}
          </p>

          {q.type === "mcq" && <MCQQuestion q={q} onAnswer={handleAnswer} answered={answered} />}
          {q.type === "truefalse" && <TrueFalseQuestion q={q} onAnswer={handleAnswer} answered={answered} />}
          {q.type === "unscramble" && <UnscrambleQuestion q={q} onAnswer={handleAnswer} answered={answered} />}
        </div>

        {/* Feedback */}
        {answered && (
          <div style={{
            marginTop: 16, padding: "16px 20px", borderRadius: 14,
            background: lastCorrect ? "#D4EDDA" : "#FFF3CD",
            border: `2px solid ${lastCorrect ? "#28A745" : "#FFC107"}`,
            animation: "popIn 0.3s ease",
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              {lastCorrect ? `🍪 Biscuit earned! +1` : "💡 Here's what you should know:"}
            </div>
            <div style={{ fontSize: 14, color: "#5C3D2E", lineHeight: 1.6 }}>{q.fact}</div>
            <div style={{ fontSize: 12, color: "#8B5E3C", marginTop: 8 }}>⏩ Next question loading…</div>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          {!answered && (
            <p style={{ fontSize: 13, color: "#B08060" }}>
              {q.type === "unscramble" ? "Type your answer and press Check or Enter." :
               q.type === "truefalse" ? "Select True or False." :
               "Select the best answer."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
