'use client';
import { useState, useEffect, useRef, ReactNode } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface StackItem {
  label: string;
  signal: string;
}

interface Experience {
  period: string;
  role: string;
  org: string;
  detail: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  desc: string;
  stack: string;
}

interface Risk {
  sev: "LOW" | "MED" | "HIGH";
  title: string;
  note: string;
}

interface RoadmapItem {
  date: string;
  dot: "done" | "wip" | "todo";
  text: string;
  sub: string | null;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
}

interface SidebarLink {
  l: string;
  href: string;
}

interface SidebarRow {
  l: string;
  v: string;
  cls: string;
}

interface KpiItem {
  label: string;
  val: string;
  valCls: string;
  sub: string;
}

interface ContactRow {
  label: string;
  val: string;
  href: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const STACK: StackItem[] = [
  { label: "React / Next.js", signal: "▲ STRONG" },
  { label: "TypeScript",      signal: "▲ STRONG" },
  { label: "Python",          signal: "▲ STRONG" },
  { label: "C / C++",         signal: "▲ STRONG" },
  { label: "Swift",           signal: "→ SOLID"  },
  { label: "SQL",             signal: "→ SOLID"  },
];

const EXPERIENCE: Experience[] = [
  {
    period:  "2025 – NOW",
    role:    "Research Assistant II",
    org:     "MSU RIVAL Lab",
    detail:  "Building data analysis dashboard & GUI for an autonomous apple harvesting robot. Sensor telemetry → operator-readable interface. The robot picks apples. The dashboard makes sense of it.",
    tags:    ["React", "Python", "Data Viz"],
  },
  {
    period:  "2025 – NOW",
    role:    "Front-End Web Assistant",
    org:     "MSU College of Engineering",
    detail:  "Internal tooling for faculty and department data. WCAG 2.1 compliant, SEO-optimized, CMS-compatible. Migrations without breakage. Mostly.",
    tags:    ["React", "WCAG", "CMS"],
  },
  {
    period:  "2024 – NOW",
    role:    "VP Technology",
    org:     "Google Developer Groups on Campus",
    detail:  "Led workshops, shipped dev resources, kept the organization running. Campus-wide technical community. Surprisingly smooth.",
    tags:    ["Leadership", "Workshops"],
  },
];

const PROJECTS: Project[] = [
  {
    id:    "RIVAL-GUI",
    name:  "Apple Harvest Robot Dashboard",
    desc:  "Real-time data analysis interface for MSU RIVAL Lab's autonomous harvesting robot. Raw sensor telemetry → human-readable GUI. First production robotics software project.",
    stack: "React · Python · Data Viz",
  },
  {
    id:    "HFT-PPL",
    name:  "HFT Data Pipeline",
    desc:  "C++ pipeline processing millions of ticks/sec. Low-latency, high-throughput architecture. Built for speed because Python was slow and that felt personal.",
    stack: "C++ · Systems · Low Latency",
  },
  {
    id:    "MKTPULSE",
    name:  "MarketPulse",
    desc:  "AI-powered equity research platform. Processes financial data into analyst-style reports. Financial advice not included. Alpha generation not guaranteed.",
    stack: "Next.js · Gemini · Supabase",
  },
  {
    id:    "AUTOSNS",
    name:  "Autosense",
    desc:  "EV powertrain simulation in Python: telemetry, thermal buffer management, fan/coolant logic. Niche audience. Very distinguished.",
    stack: "Python · Pandas · Simulation",
  },
];

const RISKS: Risk[] = [
  { sev: "LOW",  title: "Ships before writing tests.",                  note: "Mitigation: 'works on my machine.' A time-honored hedge."         },
  { sev: "MED",  title: "Refactors working code for aesthetic reasons.",note: "Status: Will Not Fix. Reclassified as a feature."                  },
  { sev: "MED",  title: "Underestimates time. Overestimates caffeine.", note: "Historical frequency: 100%. Outlook: unchanged."                   },
  { sev: "HIGH", title: "Opens 40 tabs debugging one CSS flex issue.",  note: "Resolution: close tabs, open new ones, repeat until enlightened."  },
  { sev: "LOW",  title: "Says 'quick fix,' gone for 3 hours.",         note: "ETA on ETA: 'shouldn't take long.'"                               },
];

const ROADMAP: RoadmapItem[] = [
  { date: "Completed", dot: "done", text: "Dean's List · GDG VP · HFT Pipeline · MarketPulse · Autosense",   sub: "All shipped. No major incidents."      },
  { date: "Live Now",  dot: "wip",  text: "RIVAL Lab robot dashboard · MSU CoE tooling · Interview circuit", sub: "In active development."                },
  { date: "Q3 2025",   dot: "todo", text: "SWE internship · Robot GUI v1 · Finance / systems exposure",       sub: null                                    },
  { date: "2026",      dot: "todo", text: "Junior year · Scale projects · Deepen quant skills",               sub: null                                    },
  { date: "May 2027",  dot: "todo", text: "B.S. Computer Science · Full-time deployment",                     sub: "PTO negotiable. Coffee non-negotiable." },
];

const NAV_ITEMS: NavItem[] = [
  { key: "F1", label: "OVERVIEW",   href: "#overview"   },
  { key: "F2", label: "STACK",      href: "#stack"      },
  { key: "F3", label: "EXPERIENCE", href: "#experience" },
  { key: "F4", label: "PROJECTS",   href: "#projects"   },
  { key: "F5", label: "RISK",       href: "#risk"       },
  { key: "F6", label: "ROADMAP",    href: "#roadmap"    },
  { key: "F7", label: "CONTACT",    href: "#contact"    },
];

const SEV_CLASS: Record<Risk["sev"], string> = {
  LOW:  "sev-l",
  MED:  "sev-m",
  HIGH: "sev-h",
};

const BAR_CLASS: Record<Risk["sev"], string> = {
  LOW:  "bar-l",
  MED:  "bar-m",
  HIGH: "bar-h",
};

const DOT_CLASS: Record<RoadmapItem["dot"], string> = {
  done: "rm-dot-done",
  wip:  "rm-dot-wip",
  todo: "rm-dot-todo",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --bg:       #0C0C0C;
    --surface:  #111111;
    --border:   #222222;
    --border2:  #1A1A1A;
    --amber:    #E8900A;
    --amber2:   #F5A623;
    --amberDim: #5C3800;
    --green:    #22C55E;
    --red:      #EF4444;
    --cyan:     #22D3EE;
    --white:    #E2DDD6;
    --muted:    #555047;
    --muted2:   #7A7060;
    --font:     'IBM Plex Mono', 'Courier New', monospace;
  }

  body {
    background: var(--bg);
    color: var(--white);
    font-family: var(--font);
    font-size: 12px;
    line-height: 1.6;
    cursor: crosshair;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--amberDim); }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 2px,
      rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .topbar {
    position: fixed; top: 0; left: 0; right: 0;
    height: 30px; background: var(--amber);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px; z-index: 200;
    font-size: 11px; font-weight: 600; color: #000; letter-spacing: 0.06em;
  }
  .topbar-left  { display: flex; align-items: center; gap: 16px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; font-size: 10px; }
  .topbar-name  { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; }
  .topbar-tag   { background: #000; color: var(--amber); font-size: 9px; padding: 1px 7px; letter-spacing: 0.1em; }
  .topbar-ticker { font-size: 10px; font-weight: 400; opacity: 0.7; letter-spacing: 0.04em; }

  .menubar {
    position: fixed; top: 30px; left: 0; right: 0;
    height: 26px; background: #161616;
    border-bottom: 1px solid var(--amber);
    display: flex; align-items: center;
    z-index: 199; overflow: hidden;
  }
  .menu-item {
    height: 100%; display: flex; align-items: center;
    padding: 0 16px; gap: 7px;
    border-right: 1px solid var(--border);
    font-size: 10px; letter-spacing: 0.08em;
    color: var(--muted2); text-decoration: none;
    transition: background 0.12s, color 0.12s; white-space: nowrap;
  }
  .menu-item:hover, .menu-item.active { background: var(--amber); color: #000; }
  .menu-key { font-size: 8px; opacity: 0.6; font-weight: 300; }
  .menu-item:hover .menu-key, .menu-item.active .menu-key { opacity: 1; color: #000; }

  .layout {
    display: grid; grid-template-columns: 200px 1fr;
    margin-top: 56px; min-height: calc(100vh - 56px);
  }

  .sidebar {
    background: var(--surface); border-right: 1px solid var(--border);
    position: sticky; top: 56px; height: calc(100vh - 56px);
    overflow-y: auto; display: flex; flex-direction: column;
  }
  .sb-block { padding: 14px 0; border-bottom: 1px solid var(--border2); }
  .sb-heading {
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--amber); padding: 0 14px 8px; display: block;
  }
  .sb-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 5px 14px; font-size: 11px; color: var(--muted2);
    transition: background 0.1s, color 0.1s; cursor: default;
    text-decoration: none;
  }
  .sb-row:hover { background: rgba(232,144,10,0.07); color: var(--amber); }
  .sb-val-pos  { color: var(--green);  font-size: 10px; }
  .sb-val-neu  { color: var(--muted2); font-size: 10px; }
  .sb-val-link { color: var(--cyan);   font-size: 10px; }

  .main { overflow: hidden; }

  .hero {
    padding: 28px 24px 24px; border-bottom: 1px solid var(--border);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: 'TD'; position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); font-size: 180px; font-weight: 600;
    color: rgba(232,144,10,0.035); letter-spacing: -0.06em;
    pointer-events: none; line-height: 1;
  }
  .hero-name {
    font-size: clamp(28px, 4vw, 40px); font-weight: 600;
    color: var(--amber); letter-spacing: -0.01em; line-height: 1; margin-bottom: 6px;
  }
  .hero-name span { color: var(--white); font-weight: 300; }
  .hero-sub { font-size: 11px; color: var(--muted2); letter-spacing: 0.05em; margin-bottom: 18px; }
  .hero-sub strong { color: var(--white); font-weight: 400; }
  .hero-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
  .tag {
    font-size: 10px; border: 1px solid var(--border);
    padding: 3px 9px; color: var(--muted2); letter-spacing: 0.04em;
    transition: border-color 0.15s, color 0.15s; cursor: default;
  }
  .tag:hover  { border-color: var(--amber);    color: var(--amber);  }
  .tag.active { border-color: var(--amberDim); color: var(--amber2); }
  .status-line {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; color: var(--green); letter-spacing: 0.06em;
  }
  .status-dot {
    width: 7px; height: 7px; background: var(--green);
    border-radius: 50%; animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .panel-row { display: grid; border-bottom: 1px solid var(--border); }
  .pr-4 { grid-template-columns: repeat(4, 1fr); }
  .pr-2 { grid-template-columns: 1fr 1fr; }
  .pr-1 { grid-template-columns: 1fr; }

  .panel { border-right: 1px solid var(--border); padding: 16px 18px; }
  .panel:last-child { border-right: none; }
  .panel-label {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 12px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-cmd { font-size: 8px; background: var(--amberDim); color: var(--amber2); padding: 1px 6px; }

  .kpi-val { font-size: 26px; font-weight: 500; color: var(--amber); line-height: 1; margin-bottom: 4px; letter-spacing: -0.01em; }
  .kpi-val.green { color: var(--green); }
  .kpi-sub { font-size: 9px; color: var(--muted2); letter-spacing: 0.06em; }

  .dt { width: 100%; border-collapse: collapse; }
  .dt tr { border-bottom: 1px solid var(--border2); transition: background 0.1s; }
  .dt tr:last-child { border-bottom: none; }
  .dt tr:hover { background: rgba(232,144,10,0.035); }
  .dt td { padding: 9px 0; vertical-align: top; font-size: 11.5px; }
  .dt td:first-child { color: var(--muted2); width: 110px; padding-right: 14px; font-size: 10px; white-space: nowrap; }
  .dt-title { color: var(--amber2); font-size: 12px; font-weight: 500; display: block; margin-bottom: 3px; }
  .dt-desc  { color: var(--muted2); font-size: 11px; line-height: 1.55; display: block; }
  .dt-meta  { color: var(--amberDim); font-size: 9px; margin-top: 4px; display: block; letter-spacing: 0.04em; }

  .exp-item { padding: 14px 0; border-bottom: 1px solid var(--border2); }
  .exp-item:last-child { border-bottom: none; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
  .exp-role   { font-size: 12.5px; font-weight: 500; color: var(--amber2); }
  .exp-period { font-size: 10px; color: var(--muted); white-space: nowrap; }
  .exp-org    { font-size: 10px; color: var(--cyan); margin-bottom: 7px; letter-spacing: 0.04em; }
  .exp-detail { font-size: 11.5px; color: var(--muted2); line-height: 1.6; margin-bottom: 8px; }
  .exp-tags   { display: flex; flex-wrap: wrap; gap: 5px; }
  .exp-tag    { font-size: 9px; border: 1px solid var(--border); padding: 2px 7px; color: var(--muted2); letter-spacing: 0.04em; }

  .risk-row {
    display: grid; grid-template-columns: 50px 3px 1fr;
    gap: 12px; align-items: start;
    padding: 10px 0; border-bottom: 1px solid var(--border2);
  }
  .risk-row:last-child { border-bottom: none; }
  .risk-sev { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; padding-top: 2px; }
  .sev-l { color: var(--green); }
  .sev-m { color: var(--amber); }
  .sev-h { color: var(--red);   }
  .risk-bar { border-radius: 1px; align-self: stretch; min-height: 100%; }
  .bar-l { background: var(--green); opacity: 0.5; }
  .bar-m { background: var(--amber); opacity: 0.5; }
  .bar-h { background: var(--red);   opacity: 0.5; }
  .risk-title { font-size: 11.5px; color: var(--white); line-height: 1.5; }
  .risk-note  { font-size: 10.5px; color: var(--muted2); margin-top: 2px; }

  .rm-row {
    display: grid; grid-template-columns: 90px 14px 1fr;
    gap: 14px; padding: 10px 0;
    border-bottom: 1px solid var(--border2); align-items: start;
  }
  .rm-row:last-child { border-bottom: none; }
  .rm-date     { font-size: 10px; color: var(--muted2); padding-top: 4px; }
  .rm-dot-done { width: 8px; height: 8px; background: var(--green); border-radius: 50%; margin-top: 5px; }
  .rm-dot-wip  { width: 8px; height: 8px; background: var(--amber); border-radius: 50%; margin-top: 5px; animation: pulse 1.6s infinite; }
  .rm-dot-todo { width: 8px; height: 8px; border: 1px solid var(--muted); border-radius: 50%; margin-top: 5px; }
  .rm-text { font-size: 11.5px; color: var(--white); line-height: 1.55; }
  .rm-sub  { font-size: 10.5px; color: var(--muted2); margin-top: 2px; }

  .footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 18px; border-top: 1px solid var(--border);
    font-size: 10px; color: var(--muted); flex-wrap: wrap; gap: 8px;
  }
  .footer-links { display: flex; gap: 20px; }
  .footer-links a { color: var(--muted); text-decoration: none; transition: color 0.15s; }
  .footer-links a:hover { color: var(--amber); }
  .contact-link { color: var(--cyan); text-decoration: none; transition: color 0.15s; }
  .contact-link:hover { color: var(--white); }

  .fade { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; }
  .fade.in { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    .layout { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .pr-4, .pr-2 { grid-template-columns: 1fr 1fr; }
    .hero::before { display: none; }
  }
  @media (max-width: 560px) {
    .topbar-ticker { display: none; }
    .pr-4 { grid-template-columns: 1fr 1fr; }
    .pr-2 { grid-template-columns: 1fr; }
  }
`;

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useClock(): string {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = (): string =>
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        timeZone: "America/New_York",
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useInView(ref: React.RefObject<HTMLElement>): boolean {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

interface FadeInProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

function FadeIn({ children, style }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={`fade${v ? " in" : ""}`} style={style}>
      {children}
    </div>
  );
}

interface PanelProps {
  label: string;
  cmd?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

function Panel({ label, cmd, children, style }: PanelProps) {
  return (
    <div className="panel" style={style}>
      <div className="panel-label">
        <span>{label}</span>
        {cmd && <span className="panel-cmd">{cmd}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const clock = useClock();
  const [activeNav, setActiveNav] = useState<string>("F1");

  useEffect(() => {
    const ids = ["overview", "stack", "experience", "projects", "risk", "roadmap", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx !== -1) setActiveNav(`F${idx + 1}`);
          }
        });
      },
      { threshold: 0.4 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const sidebarProfile: SidebarRow[] = [
    { l: "STATUS",   v: "● OPEN",      cls: "sb-val-pos" },
    { l: "AVAIL.",   v: "INTERN '25",  cls: "sb-val-pos" },
    { l: "FT OFFER", v: "MAY '27",     cls: "sb-val-neu" },
    { l: "STANDING", v: "DEAN'S LIST", cls: "sb-val-pos" },
    { l: "LOCATION", v: "E. LANSING",  cls: "sb-val-neu" },
  ];

  const sidebarLinks: SidebarLink[] = [
    { l: "GITHUB",   href: "https://github.com/TanmayDabhade"           },
    { l: "LINKEDIN", href: "https://www.linkedin.com/in/tanmay-dabhade" },
    { l: "EMAIL",    href: "mailto:dabhadet@msu.edu"                    },
    { l: "RESUME",   href: "/Tanmay_Dabhade_SWE_Intern.pdf"            },
  ];

  const kpis: KpiItem[] = [
    { label: "TIME TO MVP",    val: "<3",  valCls: "",      sub: "WEEKS · CERTIFIED"        },
    { label: "ACTIVE ROLES",   val: "3",   valCls: "green", sub: "RA-II · FE DEV · VP TECH" },
    { label: "ACADEMIC",       val: "DL",  valCls: "green", sub: "DEAN'S LIST · SP 2024"    },
    { label: "GRADUATION ETA", val: "'27", valCls: "",      sub: "3 SEMESTERS REMAINING"    },
  ];

  const contactRows: ContactRow[] = [
    { label: "EMAIL",    val: "dabhadet@msu.edu",               href: "mailto:dabhadet@msu.edu"                          },
    { label: "GITHUB",   val: "github.com/TanmayDabhade",       href: "https://github.com/TanmayDabhade"                 },
    { label: "LINKEDIN", val: "linkedin.com/in/tanmay-dabhade", href: "https://www.linkedin.com/in/tanmay-dabhade"       },
    { label: "RESUME",   val: "Tanmay_Dabhade_SWE_Intern.pdf",  href: "/Tanmay_Dabhade_SWE_Intern.pdf"                   },
  ];

  const heroTags = ["FRONT-END","SYSTEMS","DATA VIZ","ROBOTICS GUI","HFT PIPELINES","SWIFT / iOS","SUPABASE","FIREBASE"];

  return (
    <>
      <style>{css}</style>

      {/* ── TOPBAR ── */}
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-name">TANMAY DABHADE</span>
          <span className="topbar-tag">PRD &lt;GO&gt;</span>
          <span className="topbar-ticker">
            CS @ MSU · RA-II RIVAL LAB · AVAILABLE INTERN 2025 · CLASS OF 2027
          </span>
        </div>
        <div className="topbar-right">
          <span>{clock}</span>
          <span>EST</span>
        </div>
      </div>

      {/* ── MENUBAR ── */}
      <nav className="menubar">
        {NAV_ITEMS.map((n) => (
          <a
            key={n.key}
            href={n.href}
            className={`menu-item${activeNav === n.key ? " active" : ""}`}
          >
            <span className="menu-key">{n.key}</span>
            {n.label}
          </a>
        ))}
      </nav>

      {/* ── LAYOUT ── */}
      <div className="layout">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sb-block">
            <span className="sb-heading">Profile</span>
            {sidebarProfile.map((r) => (
              <div className="sb-row" key={r.l}>
                <span>{r.l}</span>
                <span className={r.cls}>{r.v}</span>
              </div>
            ))}
          </div>

          <div className="sb-block">
            <span className="sb-heading">Stack</span>
            {STACK.map((s) => (
              <div className="sb-row" key={s.label}>
                <span>{s.label}</span>
                <span className={s.signal.startsWith("▲") ? "sb-val-pos" : "sb-val-neu"}>
                  {s.signal}
                </span>
              </div>
            ))}
          </div>

          <div className="sb-block">
            <span className="sb-heading">Links</span>
            {sidebarLinks.map((l) => (
              <a key={l.l} href={l.href} target="_blank" rel="noopener noreferrer" className="sb-row">
                <span>{l.l}</span>
                <span className="sb-val-link">↗</span>
              </a>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">

          {/* HERO */}
          <div className="hero" id="overview">
            <div className="hero-name">
              TANMAY <span>DABHADE</span>
            </div>
            <div className="hero-sub">
              <strong>CS @ MICHIGAN STATE</strong>
              {" · "}RESEARCH ASSISTANT II, RIVAL LAB
              {" · "}VP TECH, GDG
              {" · "}CLASS OF 2027
            </div>
            <div className="hero-tags">
              {heroTags.map((t, i) => (
                <span key={t} className={`tag${i < 3 ? " active" : ""}`}>{t}</span>
              ))}
            </div>
            <div className="status-line">
              <span className="status-dot" />
              ACTIVELY SEEKING INTERNSHIP 2025 · FULL-TIME 2027
            </div>
          </div>

          {/* KPI STRIP */}
          <FadeIn>
            <div className="panel-row pr-4" id="stack">
              {kpis.map((k) => (
                <Panel key={k.label} label={k.label}>
                  <div className={`kpi-val${k.valCls ? ` ${k.valCls}` : ""}`}>{k.val}</div>
                  <div className="kpi-sub">{k.sub}</div>
                </Panel>
              ))}
            </div>
          </FadeIn>

          {/* EXPERIENCE */}
          <FadeIn>
            <div className="panel-row pr-1" id="experience">
              <Panel label="Deployment History" cmd="EXPR">
                {EXPERIENCE.map((e, i) => (
                  <div className="exp-item" key={i}>
                    <div className="exp-header">
                      <span className="exp-role">{e.role}</span>
                      <span className="exp-period">{e.period}</span>
                    </div>
                    <div className="exp-org">{e.org.toUpperCase()}</div>
                    <div className="exp-detail">{e.detail}</div>
                    <div className="exp-tags">
                      {e.tags.map((t) => (
                        <span key={t} className="exp-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </Panel>
            </div>
          </FadeIn>

          {/* PROJECTS */}
          <FadeIn>
            <div className="panel-row pr-1" id="projects">
              <Panel label="Project Holdings" cmd="PROJ">
                <table className="dt">
                  <tbody>
                    {PROJECTS.map((p) => (
                      <tr key={p.id}>
                        <td style={{ width: 90 }}>
                          <span style={{ color: "var(--amber2)", fontSize: 11, letterSpacing: "0.04em" }}>
                            {p.id}
                          </span>
                        </td>
                        <td>
                          <span className="dt-title">{p.name}</span>
                          <span className="dt-desc">{p.desc}</span>
                          <span className="dt-meta">{p.stack}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            </div>
          </FadeIn>

          {/* RISK + ROADMAP */}
          <FadeIn>
            <div className="panel-row pr-2">
              <Panel label="Risk Factors" cmd="RISK">
                <div id="risk">
                  {RISKS.map((r, i) => (
                    <div className="risk-row" key={i}>
                      <span className={`risk-sev ${SEV_CLASS[r.sev]}`}>{r.sev}</span>
                      <div className={`risk-bar ${BAR_CLASS[r.sev]}`} />
                      <div>
                        <div className="risk-title">{r.title}</div>
                        <div className="risk-note">{r.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel label="Forward Guidance" cmd="RMAP">
                <div id="roadmap">
                  {ROADMAP.map((r, i) => (
                    <div className="rm-row" key={i}>
                      <span className="rm-date">{r.date}</span>
                      <div className={DOT_CLASS[r.dot]} />
                      <div>
                        <div className="rm-text">{r.text}</div>
                        {r.sub && <div className="rm-sub">{r.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </FadeIn>

          {/* CONTACT */}
          <FadeIn>
            <div className="panel-row pr-1" id="contact">
              <Panel label="Contact · Integration Guide" cmd="CNTCT">
                <table className="dt">
                  <tbody>
                    {contactRows.map((c) => (
                      <tr key={c.label}>
                        <td>{c.label}</td>
                        <td>
                          <a
                            className="contact-link"
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {c.val} ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>ACCEPTING</td>
                      <td style={{ color: "var(--amber2)" }}>
                        INTERNSHIP &apos;25 · FULL-TIME &apos;27 · INTERESTING COLLABS
                      </td>
                    </tr>
                    <tr>
                      <td>NOTE</td>
                      <td style={{ color: "var(--muted2)", fontStyle: "italic" }}>
                        No cold pitch decks. No &quot;10yr experience in a 2yr framework.&quot;
                        Just a reasonable email and we&apos;ll figure it out.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Panel>
            </div>
          </FadeIn>

          {/* FOOTER */}
          <div className="footer">
            <span>TDABHADE · PRD REV.5 · MICHIGAN STATE &apos;27</span>
            <div className="footer-links">
              <a href="https://github.com/TanmayDabhade" target="_blank" rel="noopener noreferrer">GITHUB</a>
              <a href="https://www.linkedin.com/in/tanmay-dabhade" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
              <a href="mailto:dabhadet@msu.edu">EMAIL</a>
            </div>
            <span style={{ color: "var(--green)" }}>● AVAILABLE · MARKET OPEN</span>
          </div>

        </main>
      </div>
    </>
  );
}