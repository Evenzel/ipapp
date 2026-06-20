import React, { useEffect, useMemo, useState } from "react";

const statusLabel = {
  draft: "Review",
  filing: "Filing",
  examination: "Examining",
  registered: "Registered",
  expired: "Expired",
};

const priorityLabel = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const demoPatents = [
  {
    id: "PT-2026-041",
    title: "Adaptive Battery Life Prediction System",
    owner: "Alpha Mobility",
    inventor: "Kim Jihoon + 2",
    status: "examination",
    priority: "high",
    filingDate: "2026-02-12",
    deadline: "2026-07-08",
    jurisdiction: "KR / US / EP",
    category: "AI / Battery",
  },
  {
    id: "PT-2026-038",
    title: "Next-Gen Cooling Module Controller",
    owner: "Alpha Mobility",
    inventor: "Park Seoyeon",
    status: "filing",
    priority: "medium",
    filingDate: "2026-04-27",
    deadline: "2026-06-30",
    jurisdiction: "KR",
    category: "HW / Thermal",
  },
  {
    id: "PT-2025-119",
    title: "Factory Equipment Anomaly Detection Model",
    owner: "Alpha Mobility",
    inventor: "Lee Minjae + 4",
    status: "registered",
    priority: "high",
    filingDate: "2025-09-03",
    deadline: "2027-09-03",
    jurisdiction: "US / JP",
    category: "AI / Manufacturing",
  },
  {
    id: "PT-2024-072",
    title: "Secure Document Workflow Signature System",
    owner: "Alpha Mobility",
    inventor: "Choi Yujin",
    status: "draft",
    priority: "low",
    filingDate: "2026-05-19",
    deadline: "2026-08-10",
    jurisdiction: "KR",
    category: "SaaS / Security",
  },
];

const activity = [
  { time: "09:10", text: "PT-2026-041 amendment draft ready" },
  { time: "11:40", text: "PT-2026-038 claim 7 wording review requested" },
  { time: "14:25", text: "PT-2025-119 renewal reminder scheduled" },
  { time: "16:50", text: "2 new invention disclosures saved as drafts" },
];

function daysLeft(dateString) {
  const today = new Date();
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [patents, setPatents] = useState([]);

  useEffect(() => {
    fetch("/api/patents")
      .then((res) => res.json())
      .then((data) => setPatents(data.items))
      .catch(() => setPatents(demoPatents));
  }, []);

  const filtered = useMemo(() => {
    return patents.filter((item) => {
      const text = `${item.id} ${item.title} ${item.owner} ${item.inventor} ${item.category}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesStatus = status === "all" || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [patents, query, status]);

  const summary = useMemo(() => {
    return {
      total: patents.length,
      active: patents.filter((p) => p.status === "filing" || p.status === "examination").length,
      registered: patents.filter((p) => p.status === "registered").length,
      urgent: patents.filter((p) => daysLeft(p.deadline) <= 30 && daysLeft(p.deadline) >= 0).length,
    };
  }, [patents]);

  return (
    <div className="shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div>
          <p className="eyebrow">PatentOS</p>
          <h1>Manage enterprise patents from one modern command center</h1>
          <p className="subcopy">
            Track filing, examination, registration, renewal, and expiry with a clean dashboard built for legal and R&amp;D teams.
          </p>
        </div>
        <div className="topbar-card">
          <span>Next renewal alert</span>
          <strong>PT-2025-119 · 18 days left</strong>
          <small>Calendar sync ready</small>
        </div>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span>Total patents</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="stat-card">
          <span>In progress</span>
          <strong>{summary.active}</strong>
        </article>
        <article className="stat-card">
          <span>Registered</span>
          <strong>{summary.registered}</strong>
        </article>
        <article className="stat-card accent">
          <span>Due within 30 days</span>
          <strong>{summary.urgent}</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Portfolio</h2>
              <p>Search, status filtering, and priority grouping</p>
            </div>
            <div className="filters">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by patent, inventor, or category"
              />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="draft">Review</option>
                <option value="filing">Filing</option>
                <option value="examination">Examining</option>
                <option value="registered">Registered</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="patent-list">
            {filtered.map((patent) => {
              const left = daysLeft(patent.deadline);
              return (
                <article className="patent-card" key={patent.id}>
                  <div className="patent-row">
                    <div>
                      <p className="patent-id">{patent.id}</p>
                      <h3>{patent.title}</h3>
                    </div>
                    <span className={`badge ${patent.status}`}>{statusLabel[patent.status]}</span>
                  </div>
                  <p className="meta">
                    {patent.owner} · {patent.inventor}
                  </p>
                  <div className="tags">
                    <span>{patent.category}</span>
                    <span>{patent.jurisdiction}</span>
                    <span>{priorityLabel[patent.priority]} priority</span>
                  </div>
                  <div className="footer">
                    <small>Filed {patent.filingDate}</small>
                    <small className={left <= 30 ? "deadline warning" : "deadline"}>Due in {left} days</small>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="sidebar">
          <section className="panel side-panel">
            <h2>Today&apos;s work</h2>
            <ul className="activity-list">
              {activity.map((item) => (
                <li key={item.time}>
                  <strong>{item.time}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel side-panel">
            <h2>Work status</h2>
            <div className="progress-block">
              <div className="progress-label">
                <span>Examination response</span>
                <strong>78%</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: "78%" }} />
              </div>
            </div>
            <div className="progress-block">
              <div className="progress-label">
                <span>Renewal prep</span>
                <strong>62%</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: "62%" }} />
              </div>
            </div>
            <div className="progress-block">
              <div className="progress-label">
                <span>Disclosure review</span>
                <strong>91%</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: "91%" }} />
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default App;
