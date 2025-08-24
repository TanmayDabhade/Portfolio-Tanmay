'use client';
import { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ExternalLink, Github, Linkedin, Mail, ArrowRight, Star, Folder, Command, Download, ChevronRight } from "lucide-react";

/**
 * Elevated Minimal Portfolio — White bg, Black fg
 * Awe touches: scroll progress, spotlight cursor, sticky blur nav with ⌘K palette,
 * kinetic underline, gentle tilt cards, searchable GitHub projects.
 */

const GH_USER = "TanmayDabhade";
const RESUME_URL = "/Tanmay_Dabhade_SWE_Intern.pdf"; // TODO: replace with your hosted URL

// Types
type IconType = React.ComponentType<{ className?: string }>;
interface IconLinkProps { href: string; icon: IconType; children: ReactNode }
interface TinyLinkProps { href: string; children: ReactNode }
interface ExpRowProps { role: string; bullets: string[] }
interface Repo { id?: number; name: string; description?: string | null; stars: number; url: string; lang?: string | null }
interface GitHubRepo { id: number; fork: boolean; name: string; description: string | null; stargazers_count: number; html_url: string; language: string | null }

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  // Spotlight cursor
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLMapElement | null>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  // Dev-only smoke tests (will not render anything)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        console.assert(typeof Projects === "function", "Projects component exists");
        console.assert(typeof ExpRow === "function", "ExpRow component exists");
        console.assert(GH_USER.length > 0, "GH_USER is set");
      }
    } catch (e) {
      console.warn("[Portfolio smoke]", e);
    }
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen bg-white text-black selection:bg-black selection:text-white relative overflow-x-clip">
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(200px 200px at ${spot.x}px ${spot.y}px, rgba(0,0,0,0.06), transparent 60%)` }}
      />

      {/* Scroll progress */}
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-[3px] origin-left bg-gradient-to-r from-black via-gray-800 to-black z-50" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/10 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="#top" className="font-black tracking-tight text-lg">TD</a>
          <nav className="flex items-center gap-3 text-sm">
            <IconLink href={`https://github.com/${GH_USER}`} icon={Github}>GitHub</IconLink>
            <IconLink href="https://www.linkedin.com/in/tanmay-dabhade" icon={Linkedin}>LinkedIn</IconLink>
            <IconLink href="mailto:dabhadet@msu.edu" icon={Mail}>Email</IconLink>
            <button onClick={() => (document.getElementById('cmdk')?.dispatchEvent(new Event('open')))} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 transition hover:-translate-y-0.5">
              <Command className="h-4 w-4" /> <span className="hidden sm:inline">Command</span>
              <kbd className="ml-1 rounded border px-1 text-xs">⌘K</kbd>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">Tanmay Dabhade</h1>
            <p className="mt-4 text-lg max-w-xl leading-snug">
              CS @ Michigan State · Front-end & Systems · Building <Underline>Grata</Underline> with Voodoo.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#projects" className="group inline-flex items-center gap-2 rounded-full border border-black px-4 py-2 font-medium transition hover:-translate-y-0.5">
                View Projects <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href={RESUME_URL} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 transition hover:-translate-y-0.5">
                <Download className="h-4 w-4" /> Resume
              </a>
            </div>
            <TechTicker />
          </div>
          <HeroStats />
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <TiltCard>
            <h3 className="font-semibold">Founder — Grata</h3>
            <p className="mt-2 text-sm opacity-80">
              Social accountability app. Built MVP in <strong>&lt;3 weeks</strong> with RN + Firebase + Expo. Partnering with Voodoo on retention.
            </p>
            <TinyLink href="#projects">see more</TinyLink>
          </TiltCard>
          <TiltCard>
            <h3 className="font-semibold">Front-End Web Assistant — MSU CoE</h3>
            <p className="mt-2 text-sm opacity-80">Internal web tooling for faculty/dept data · WCAG 2.1, SEO, CMS-friendly.</p>
            <TinyLink href="#experience">experience</TinyLink>
          </TiltCard>
          <TiltCard>
            <h3 className="font-semibold">VP Tech — GDG on Campus</h3>
            <p className="mt-2 text-sm opacity-80">Led workshops and shipped resources across stacks.</p>
            <TinyLink href="#about">about me</TinyLink>
          </TiltCard>
        </div>
      </section>

      <Projects />

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-black">Experience</h2>
        <div className="mt-6 divide-y">
          <ExpRow
            role="Founder — Grata (backed by Voodoo)"
            bullets={[
              "Built & launched MVP in &lt; 3 weeks with RN + Firebase + Expo.",
              "Collaborated with Voodoo product on UX, retention, goals.",
              "Private TestFlight; integrating real-time user feedback.",
            ]}
          />
          <ExpRow
            role="Front-End Web Assistant — MSU College of Engineering (Aug 2025 – Present)"
            bullets={[
              "Internal archiving tool for faculty/dept data; accelerates migrations.",
              "Met WCAG 2.1, SEO, and CMS compatibility requirements.",
              "Contributed to content migration & bug-fixing during redesigns.",
            ]}
          />
          <ExpRow
            role="VP Tech — Google Developer Groups on Campus (Jul 2024 – Present)"
            bullets={["Led experts, shipped workshops, kept ops smooth."]}
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-black">About</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 text-sm leading-relaxed opacity-85">
            <p>
              I build fast, minimal products with just-enough motion: front-end craft, systems thinking, and a bias for shipping.
              Recent work: HFT-style data pipeline in C++, MarketPulse (AI equity analysis), Autosense (EV telemetry sim).
            </p>
            <p className="mt-3">
              Tools I use a lot: Python, C/C++, JS/TS, React/Next, Swift, SQL, Pandas/NumPy. Also: Excel/Power BI for analysis
              and quick dashboards.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="font-semibold">Education</h3>
            <p className="mt-2 text-sm">B.S. in Computer Science — Michigan State University (Aug 2023 – May 2027)</p>
            <p className="mt-1 text-xs opacity-70">Dean&apos;s List (Spring 2024) · Algorithms · Systems · Architecture</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Watermark */}
      <motion.div aria-hidden className="fixed bottom-6 right-6 pointer-events-none select-none" initial={{ rotate: -8, opacity: 0 }} animate={{ rotate: 0, opacity: 0.1 }} transition={{ duration: 1 }}>
        <div className="text-6xl font-black tracking-tight">TD</div>
      </motion.div>
    </main>
  );
}

// ——— UI Bits ———
function IconLink({ href, icon: Icon, children }: IconLinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 transition hover:-translate-y-0.5 active:translate-y-0">
      <Icon className="h-4 w-4" /> {children}
    </a>
  );
}

function Underline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <motion.span
        layoutId="underline"
        className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-black"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

function TinyLink({ href, children }: TinyLinkProps) {
  return (
    <a href={href} className="mt-3 inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100">
      {children} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  return (
    <motion.article className="rounded-2xl border border-black/10 p-5 will-change-transform bg-white relative overflow-hidden" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
      <div className="absolute inset-x-0 -top-1 h-[2px] bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-60" />
      {children}
    </motion.article>
  );
}

function ExpRow({ role, bullets }: ExpRowProps) {
  return (
    <div className="py-6">
      <h3 className="font-semibold">{role}</h3>
      <ul className="mt-3 space-y-2 text-sm opacity-80 list-disc pl-5">
        {bullets.map((b, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
        ))}
      </ul>
    </div>
  );
}

// ——— Projects ———
function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [lang, setLang] = useState<string>("all");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
        const data = await res.json();
        const raw: GitHubRepo[] = Array.isArray(data) ? (data as GitHubRepo[]) : [];
        const filtered: Repo[] = raw
          .filter((r) => !r.fork)
          .map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? undefined,
            stars: r.stargazers_count ?? 0,
            url: r.html_url,
            lang: r.language ?? undefined,
          }))
          .sort((a, b) => (b.stars || 0) - (a.stars || 0));
        setRepos(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const fallback: Repo[] = useMemo(
    () => [
      { name: "hft-pipeline", description: "Real-time C++ pipeline that ingests millions of ticks/sec.", stars: 0, url: "#", lang: "C++" },
      { name: "marketpulse", description: "AI-powered equity analysis (Next.js + Supabase + Clerk + Gemini).", stars: 0, url: "#", lang: "TypeScript" },
      { name: "autosense", description: "EV powertrain sim in Python: telemetry, thermal buffer, fan/coolant logic.", stars: 0, url: "#", lang: "Python" },
    ],
    []
  );

  const items: Repo[] = (repos.length ? repos : fallback)
    .filter((p) => (lang === "all" || p.lang === lang))
    .filter((p) => (query ? (p.name + " " + (p.description || "")).toLowerCase().includes(query.toLowerCase()) : true));

  const languages: string[] = useMemo(() => {
    const set = new Set<string>((repos.length ? repos : fallback).map((r) => (r.lang || "")).filter(Boolean) as string[]);
    return ["all", ...Array.from(set)];
  }, [repos, fallback]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-black">Projects</h2>
        <div className="flex gap-2">
          <input
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-44 rounded-full border border-black/15 px-3 text-sm outline-none focus:ring-2 focus:ring-black/60"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="h-9 rounded-full border border-black/15 px-3 text-sm outline-none focus:ring-2 focus:ring-black/60"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="sm:col-span-2 lg:col-span-3 text-sm opacity-60">Loading repositories…</div>}
        {items.map((p, i) => (
          <motion.a
            key={p.id ?? i}
            href={p.url}
            target={p.url?.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="group block rounded-2xl border border-black/10 p-5 focus:outline-none focus:ring-2 focus:ring-black/60"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
              </div>
              {p.stars > 0 && (
                <div className="inline-flex items-center gap-1 text-xs opacity-70">
                  <Star className="h-3.5 w-3.5" /> {p.stars}
                </div>
              )}
            </div>
            {p.description && <p className="mt-2 text-sm opacity-80 line-clamp-3">{p.description}</p>}
            <div className="mt-3 text-xs opacity-60">{p.lang || "—"}</div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// ——— Footer & Command ———
function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm opacity-70">© {new Date().getFullYear()} Tanmay Dabhade</p>
        <div className="text-xs opacity-60">Built with React + Tailwind. Minimal UI, elevated with motion.</div>
      </div>
      <div id="cmdk" />
      <CommandPalette />
    </footer>
  );
}

function TechTicker() {
  const items = ["React", "Next.js", "TypeScript", "Swift", "C++", "Python", "Firebase", "Supabase", "Postgres", "Framer Motion"];
  return (
    <div className="mt-8 overflow-hidden">
      <div className="flex items-center gap-6 animate-[ticker_30s_linear_infinite] whitespace-nowrap text-sm opacity-70 will-change-transform">
        {items.concat(items).map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            {t} <ChevronRight className="h-3 w-3" />
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function HeroStats() {
  const stats = [
    { k: "Time-to-MVP", v: "< 3 weeks" },
    { k: "Core Stacks", v: "RN / Next / Swift" },
    { k: "Focus", v: "Speed x UX" },
  ];
  return (
    <div className="grid content-start gap-4">
      {stats.map((s, i) => (
        <div key={i} className="rounded-2xl border border-black/10 p-5">
          <div className="text-xs uppercase tracking-wider opacity-60">{s.k}</div>
          <div className="text-2xl font-black mt-1">{s.v}</div>
        </div>
      ))}
    </div>
  );
}

function CommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = document.getElementById('cmdk');
    const onOpen = () => setOpen(true);
    el?.addEventListener('open', onOpen);
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
    };
    window.addEventListener('keydown', down);
    return () => { el?.removeEventListener('open', onOpen); window.removeEventListener('keydown', down); };
  }, []);

  if (!open) return null;
  const actions: { label: string; run: () => void }[] = [
    { label: 'Scroll to Projects', run: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Scroll to Experience', run: () => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Scroll to About', run: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Open GitHub', run: () => window.open(`https://github.com/${GH_USER}`, '_blank') },
  ];
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-start p-6 pt-24">
      <div className="absolute inset-0 bg-black/10" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-black/10 bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <input autoFocus placeholder="Type a command…" className="w-full rounded-xl border border-black/10 px-3 py-2 outline-none" onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }} />
        <ul className="mt-2 divide-y">
          {actions.map((a, i) => (
            <li key={i}>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 rounded-xl" onClick={() => { a.run(); setOpen(false); }}>{a.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
