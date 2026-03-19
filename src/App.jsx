import { useState } from "react";

const SAMPLE_JD = `Position: Data Analyst
Company: Nutrabay

Requirements:
- 1-3 years of experience in data analysis
- Strong proficiency in SQL and Excel
- Experience with Python or R for data analysis
- Familiarity with dashboards (Power BI / Tableau / Google Looker)
- Strong analytical and problem-solving skills
- Good communication skills for presenting insights
- Experience in e-commerce or FMCG sector is a plus
- Basic understanding of statistics and data modeling`;

const SAMPLE_RESUMES = [
  {
    name: "Priya Sharma",
    text: `Priya Sharma | priya.sharma@email.com | LinkedIn: linkedin.com/in/priyasharma
    
    Education: B.Tech Computer Science, Delhi Technological University (2022), CGPA: 8.4
    
    Experience:
    Data Analyst Intern, Myntra (6 months, 2023)
    - Built SQL queries to analyze 2M+ customer records
    - Created weekly dashboards in Tableau for marketing team
    - Reduced report generation time by 40% using Python automation
    
    Skills: SQL (Advanced), Python (Pandas, NumPy), Tableau, Excel (Advanced), Power BI, Statistics
    
    Projects: Customer Churn Prediction using Logistic Regression (Python), Sales Forecasting Dashboard (Tableau)`,
  },
  {
    name: "Rahul Verma",
    text: `Rahul Verma | rahul.v@gmail.com
    
    Education: BBA Finance, Amity University (2023), 72%
    
    Experience:
    Finance Intern, HDFC Bank (3 months)
    - Maintained Excel sheets for loan tracking
    - Prepared monthly MIS reports
    
    Skills: Excel (Intermediate), Tally, MS Office, Basic SQL
    
    Interests: Stock market, cricket`,
  },
  {
    name: "Ananya Singh",
    text: `Ananya Singh | ananya.singh@email.com | GitHub: github.com/ananyasingh
    
    Education: M.Sc. Statistics, IIT Bombay (2023), GPA 9.1
    
    Experience:
    Data Science Intern, Flipkart (8 months, 2022-23)
    - Developed recommendation engine improving CTR by 18%
    - Performed A/B testing analysis for 12+ product experiments
    - Built automated reporting pipeline using Python + SQL
    
    Skills: Python (Advanced), R, SQL (Advanced), Machine Learning, Tableau, Power BI, Statistics, Google Analytics
    
    Projects: Price Elasticity Model for FMCG products, Inventory Optimization Dashboard`,
  },
  {
    name: "Karan Mehta",
    text: `Karan Mehta | karan.mehta@email.com
    
    Education: B.Sc. Mathematics, Delhi University (2021)
    
    Experience:
    Sales Executive, FMCG company (1.5 years)
    - Managed territory sales data in Excel
    - Created weekly sales reports for manager
    
    Teaching Assistant, Online Platform (6 months)
    - Taught basic Excel and data skills to 200+ students
    
    Skills: Excel (Advanced), SQL (Basic), Power BI (Beginner), MS Office
    
    Currently learning: Python, Tableau`,
  },
  {
    name: "Sneha Patel",
    text: `Sneha Patel | sneha.patel@email.com | Portfolio: sneha-analytics.com
    
    Education: B.Tech Information Technology, NIT Surat (2022), CGPA: 7.9
    
    Experience:
    Business Analyst, Nykaa (1.5 years, 2022-present)
    - Designed and maintained 15+ KPI dashboards in Looker
    - Wrote complex SQL queries joining 10+ tables for business insights
    - Collaborated with product and marketing teams to define metrics
    - Experience in e-commerce analytics (GMV, conversion, retention)
    
    Skills: SQL (Advanced), Python (Moderate), Google Looker, Excel, Data Storytelling, A/B Testing
    
    Certifications: Google Data Analytics Certificate, SQL for Data Science (Coursera)`,
  },
];

const ScoreRing = ({ score }) => {
  const color =
    score >= 75 ? "#00e5a0" : score >= 50 ? "#f5c842" : "#ff5a5a";
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e2535" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="36" y="41" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="'DM Mono', monospace">
        {score}
      </text>
    </svg>
  );
};

const Badge = ({ label }) => {
  const colors = {
    "Strong Fit": { bg: "#00e5a020", border: "#00e5a0", text: "#00e5a0" },
    "Moderate Fit": { bg: "#f5c84220", border: "#f5c842", text: "#f5c842" },
    "Not Fit": { bg: "#ff5a5a20", border: "#ff5a5a", text: "#ff5a5a" },
  };
  const c = colors[label] || colors["Moderate Fit"];
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
      letterSpacing: "0.5px", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap"
    }}>{label}</span>
  );
};

export default function App() {
  const [jd, setJd] = useState(SAMPLE_JD);
  const [resumes, setResumes] = useState(SAMPLE_RESUMES.map(r => r.text).join("\n\n---RESUME BREAK---\n\n"));
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [expandedCard, setExpandedCard] = useState(null);
  const [loadMsg, setLoadMsg] = useState("");

  const loadingMessages = [
    "Parsing resumes...",
    "Analysing skill matches...",
    "Scoring candidates...",
    "Generating recommendations...",
  ];

  const runScreening = async () => {
    if (!jd.trim() || !resumes.trim()) {
      setError("Please fill in both Job Description and Resumes.");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);
    setActiveTab("results");

    let msgIdx = 0;
    setLoadMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadMsg(loadingMessages[msgIdx]);
    }, 1800);

    try {
      const prompt = `You are an expert HR recruiter and technical screener. You will evaluate resumes against a job description.

JOB DESCRIPTION:
${jd}

RESUMES (separated by "---RESUME BREAK---"):
${resumes}

For each resume, evaluate and return ONLY a valid JSON array. No markdown, no explanation outside JSON.

Return this exact structure:
[
  {
    "name": "Candidate Name (extract from resume, use 'Candidate N' if missing)",
    "score": <integer 0-100>,
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "gaps": ["gap 1", "gap 2"],
    "recommendation": "Strong Fit" | "Moderate Fit" | "Not Fit",
    "summary": "One sentence hiring rationale"
  }
]

Scoring guide: 80-100 = Strong Fit, 50-79 = Moderate Fit, 0-49 = Not Fit. Be honest and precise.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const sorted = [...parsed].sort((a, b) => b.score - a.score);
      setResults(sorted);
    } catch (e) {
      setError("Screening failed. Check your input and try again.");
      setActiveTab("input");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const loadSample = () => {
    setJd(SAMPLE_JD);
    setResumes(SAMPLE_RESUMES.map(r => r.text).join("\n\n---RESUME BREAK---\n\n"));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b0f1a; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0b0f1a; }
        ::-webkit-scrollbar-thumb { background: #2a3150; border-radius: 3px; }
        textarea { resize: vertical; }

        .app { min-height: 100vh; background: #0b0f1a; color: #e2e8f0; font-family: 'Syne', sans-serif; padding: 0 0 60px; }

        .header { padding: 32px 24px 0; max-width: 900px; margin: 0 auto; }
        .header-top { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-dot { width: 10px; height: 10px; background: #00e5a0; border-radius: 50%; box-shadow: 0 0 12px #00e5a0; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        .logo-text { font-size: 13px; font-family: 'DM Mono', monospace; color: #00e5a0; letter-spacing: 2px; text-transform: uppercase; }
        .powered { font-size: 11px; font-family: 'DM Mono', monospace; color: #4a5568; }

        h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 800; line-height: 1.1; margin-top: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #a0aec0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #64748b; font-size: 15px; margin-top: 8px; font-family: 'DM Mono', monospace; }

        .divider { height: 1px; background: linear-gradient(90deg, #00e5a020, #00e5a060, #00e5a020); margin: 24px 0; max-width: 900px; margin-left: auto; margin-right: auto; }

        .tabs { display: flex; gap: 4px; max-width: 900px; margin: 0 auto 24px; padding: 0 24px; }
        .tab { padding: 9px 20px; border-radius: 8px; border: 1px solid transparent; font-family: 'DM Mono', monospace;
          font-size: 13px; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b; }
        .tab.active { background: #131929; border-color: #00e5a040; color: #00e5a0; }
        .tab:hover:not(.active) { color: #a0aec0; }

        .content { max-width: 900px; margin: 0 auto; padding: 0 24px; }

        .panel { background: #111827; border: 1px solid #1e2d45; border-radius: 16px; padding: 24px; }
        .panel-label { font-size: 11px; font-family: 'DM Mono', monospace; color: #00e5a0; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        textarea.field {
          width: 100%; background: #0d1421; border: 1px solid #1e2d45; border-radius: 10px;
          color: #cbd5e0; font-family: 'DM Mono', monospace; font-size: 13px; padding: 14px;
          outline: none; transition: border-color 0.2s; line-height: 1.6;
        }
        textarea.field:focus { border-color: #00e5a060; }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:640px){ .grid2 { grid-template-columns: 1fr; } }

        .btn-row { display: flex; gap: 10px; align-items: center; margin-top: 20px; flex-wrap: wrap; }
        .btn-primary {
          background: linear-gradient(135deg, #00e5a0, #00b87a); color: #0b0f1a;
          border: none; padding: 13px 28px; border-radius: 10px; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #00e5a040; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-ghost { background: transparent; border: 1px solid #2a3a55; color: #64748b; padding: 12px 20px;
          border-radius: 10px; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #00e5a040; color: #a0aec0; }

        .error { color: #ff5a5a; font-size: 13px; font-family: 'DM Mono', monospace; margin-top: 8px; }

        /* Loading */
        .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 80px 24px; gap: 20px; }
        .spinner { width: 48px; height: 48px; border: 3px solid #1e2d45; border-top-color: #00e5a0;
          border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .load-msg { font-family: 'DM Mono', monospace; font-size: 14px; color: #64748b; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; } }

        /* Results */
        .summary-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-chip { background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 12px 16px; flex: 1; min-width: 90px; }
        .stat-num { font-size: 22px; font-weight: 800; color: #fff; }
        .stat-lbl { font-size: 11px; font-family: 'DM Mono', monospace; color: #4a5568; margin-top: 2px; }

        .card { background: #111827; border: 1px solid #1e2d45; border-radius: 14px; margin-bottom: 12px;
          overflow: hidden; transition: border-color 0.2s; cursor: pointer; }
        .card:hover { border-color: #00e5a030; }
        .card.expanded { border-color: #00e5a060; }
        .card-header { display: flex; align-items: center; gap: 14px; padding: 16px 20px; }
        .rank { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a5568; min-width: 24px; }
        .cand-name { font-weight: 700; font-size: 16px; flex: 1; }
        .card-body { padding: 0 20px 18px; border-top: 1px solid #1a2436; margin-top: 4px; }
        .summary-text { font-size: 13px; color: #94a3b8; font-family: 'DM Mono', monospace; padding: 12px 0; line-height: 1.6; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
        @media(max-width:500px){ .two-col { grid-template-columns: 1fr; } }
        .detail-box { background: #0d1421; border-radius: 10px; padding: 12px 14px; }
        .detail-title { font-size: 11px; font-family: 'DM Mono', monospace; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 8px; }
        .detail-title.green { color: #00e5a0; }
        .detail-title.red { color: #ff5a5a; }
        .detail-item { font-size: 13px; color: #cbd5e0; padding: 3px 0; display: flex; align-items: flex-start; gap: 6px; }
        .dot-green { color: #00e5a0; font-size: 16px; line-height: 1; flex-shrink: 0; }
        .dot-red { color: #ff5a5a; font-size: 16px; line-height: 1; flex-shrink: 0; }
        .chevron { font-size: 12px; color: #4a5568; transition: transform 0.2s; }
        .chevron.open { transform: rotate(180deg); }

        .empty { text-align: center; padding: 60px 24px; color: #4a5568; font-family: 'DM Mono', monospace; font-size: 14px; }

        .tip { background: #0d1421; border: 1px solid #1e2d45; border-radius: 10px; padding: 14px 18px;
          margin-top: 14px; font-family: 'DM Mono', monospace; font-size: 12px; color: #4a5568; line-height: 1.7; }
        .tip span { color: #00e5a0; }
      `}</style>

      <div className="app">
        <div className="header">
          <div className="header-top">
            <div className="logo">
              <div className="logo-dot" />
              <span className="logo-text">RecruitAI</span>
            </div>
            <span className="powered">Powered by Claude · Nutrabay Assessment</span>
          </div>
          <h1>AI Resume<br />Screening System</h1>
          <p className="subtitle">// paste JD + resumes → get ranked candidates instantly</p>
        </div>

        <div className="divider" />

        <div className="tabs">
          <button className={`tab ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>
            01 / Input
          </button>
          <button className={`tab ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            02 / Results {results ? `(${results.length})` : ""}
          </button>
        </div>

        <div className="content">
          {activeTab === "input" && (
            <div>
              <div className="grid2">
                <div className="panel">
                  <div className="panel-label">Job Description</div>
                  <textarea
                    className="field"
                    rows={14}
                    placeholder="Paste the job description here..."
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                  />
                </div>
                <div className="panel">
                  <div className="panel-label">Resumes (separate with "---RESUME BREAK---")</div>
                  <textarea
                    className="field"
                    rows={14}
                    placeholder={`Paste Resume 1 here\n\n---RESUME BREAK---\n\nPaste Resume 2 here`}
                    value={resumes}
                    onChange={e => setResumes(e.target.value)}
                  />
                </div>
              </div>

              <div className="tip">
                <span>Tip:</span> Separate multiple resumes with the text <span>---RESUME BREAK---</span> on its own line.
                You can paste 2–10 resumes at once. <span>Sample data is pre-loaded</span> — just click Screen Now!
              </div>

              <div className="btn-row">
                <button className="btn-primary" onClick={runScreening} disabled={loading}>
                  {loading ? "Screening..." : "▶ Screen Now"}
                </button>
                <button className="btn-ghost" onClick={loadSample}>Load Sample Data</button>
              </div>
              {error && <div className="error">⚠ {error}</div>}
            </div>
          )}

          {activeTab === "results" && (
            <div>
              {loading && (
                <div className="loading-box">
                  <div className="spinner" />
                  <div className="load-msg" key={loadMsg}>{loadMsg}</div>
                </div>
              )}

              {!loading && !results && (
                <div className="empty">
                  No results yet. Go to Input tab and click Screen Now.
                </div>
              )}

              {!loading && results && (
                <>
                  <div className="summary-bar">
                    {[
                      { num: results.length, lbl: "Total Screened" },
                      { num: results.filter(r => r.recommendation === "Strong Fit").length, lbl: "Strong Fit" },
                      { num: results.filter(r => r.recommendation === "Moderate Fit").length, lbl: "Moderate Fit" },
                      { num: results.filter(r => r.recommendation === "Not Fit").length, lbl: "Not Fit" },
                    ].map((s, i) => (
                      <div className="stat-chip" key={i}>
                        <div className="stat-num" style={{ color: i === 1 ? "#00e5a0" : i === 3 ? "#ff5a5a" : "#fff" }}>{s.num}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={`card ${expandedCard === i ? "expanded" : ""}`}
                      onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                    >
                      <div className="card-header">
                        <span className="rank">#{i + 1}</span>
                        <ScoreRing score={r.score} />
                        <div style={{ flex: 1 }}>
                          <div className="cand-name">{r.name}</div>
                          <Badge label={r.recommendation} />
                        </div>
                        <span className={`chevron ${expandedCard === i ? "open" : ""}`}>▼</span>
                      </div>

                      {expandedCard === i && (
                        <div className="card-body">
                          <div className="summary-text">"{r.summary}"</div>
                          <div className="two-col">
                            <div className="detail-box">
                              <div className="detail-title green">✦ Strengths</div>
                              {r.strengths?.map((s, j) => (
                                <div className="detail-item" key={j}>
                                  <span className="dot-green">·</span>{s}
                                </div>
                              ))}
                            </div>
                            <div className="detail-box">
                              <div className="detail-title red">⚠ Gaps</div>
                              {r.gaps?.map((g, j) => (
                                <div className="detail-item" key={j}>
                                  <span className="dot-red">·</span>{g}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}