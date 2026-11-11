import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, Brain, Radar, BarChart3, Lock, Zap, ArrowRight, Activity, Gauge, Timer, Fingerprint } from "lucide-react";
import { PageShell, Reveal, SectionHeading } from "@/components/Reveal";
import { ScannerCard } from "@/components/ScannerCard";
import { ShieldVisual } from "@/components/ShieldVisual";
import { getStats } from "@/lib/api";

const FEATURES = [
  { icon: Radar, title: "Real-Time URL Scanning", text: "Submit any link and receive a verdict in seconds with a live radar-style analysis flow." },
  { icon: Brain, title: "Heuristic ML Model", text: "16 weighted lexical, host and pattern signals feed a tuned risk-scoring engine." },
  { icon: ShieldCheck, title: "Multi-Layer Verification", text: "Structure, keywords, brand impersonation, TLD abuse and obfuscation — checked together." },
  { icon: BarChart3, title: "Threat Analytics", text: "Trends, threat split and accuracy visualized on a live security dashboard." },
  { icon: Lock, title: "Privacy First", text: "URLs are analyzed locally by the engine — your browsing is never followed." },
  { icon: Zap, title: "Instant Verdicts", text: "Green, amber or red classification with a transparent risk score and indicators." },
];

const STEPS = [
  { n: "01", title: "Submit a URL", text: "Paste any link into the glowing scanner input — no account or setup required." },
  { n: "02", title: "Analyze Signals", text: "The engine extracts features and matches them against known phishing patterns." },
  { n: "03", title: "Act on the Verdict", text: "Get a color-coded verdict, risk score and the exact indicators that triggered it." },
];

const Home = () => {
  const [stats, setStats] = useState(null);
  const { scrollY } = useScroll();
  const shieldY = useTransform(scrollY, [0, 600], [0, 90]);
  const textY = useTransform(scrollY, [0, 600], [0, -30]);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  const strip = [
    { icon: Activity, label: "URLs scanned", value: stats ? stats.total_scanned.toLocaleString() : "—" },
    { icon: ShieldCheck, label: "Threats flagged", value: stats ? stats.phishing_detected.toLocaleString() : "—" },
    { icon: Gauge, label: "Accuracy", value: stats ? `${stats.accuracy}%` : "—" },
    { icon: Timer, label: "Avg. scan time", value: stats ? `${stats.avg_latency_ms}ms` : "—" },
  ];

  return (
    <PageShell>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden pt-32 sm:pt-40" data-testid="hero-section">
        <div className="section-pad grid items-center gap-14 lg:grid-cols-2 lg:gap-8">
          <motion.div style={{ y: textY }} className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="glass-soft mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-cyan-200 lg:mx-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              AI-Powered Threat Intelligence · Real-Time
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.4rem]"
            >
              Your Digital World.
              <br />
              <span className="text-gradient">Protected.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0"
            >
              Detect phishing threats before they compromise your security. Paste a URL and let the PhishGuard engine analyze it instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-9"
              data-testid="hero-scanner"
            >
              <ScannerCard />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: shieldY }} className="relative">
            <ShieldVisual />
          </motion.div>
        </div>

        {/* trust strip */}
        <div className="section-pad mt-16">
          <Reveal className="glass grid grid-cols-2 gap-6 rounded-2xl px-6 py-6 sm:grid-cols-4 sm:px-8">
            {strip.map((s) => (
              <div key={s.label} className="flex items-center gap-3" data-testid={`hero-stat-${s.label.toLowerCase().replace(/\s|\.+/g, "-")}`}>
                <s.icon className="h-5 w-5 shrink-0 text-cyan-300" />
                <div>
                  <p className="font-display text-lg font-semibold text-white sm:text-xl">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="section-pad mt-28" data-testid="features-section">
        <SectionHeading
          center
          eyebrow="Capabilities"
          title={<>Security that thinks <span className="text-gradient">ahead</span></>}
          subtitle="Every scan runs through a layered detection pipeline designed to catch modern phishing kits."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="glass glow-border card-hover group h-full rounded-2xl p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-glow-cyan transition duration-300 group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="section-pad mt-28" data-testid="how-it-works">
        <SectionHeading
          center
          eyebrow="How it works"
          title="Three steps to a verdict"
        />
        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-cyan-400/10 via-cyan-400/40 to-emerald-400/10 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="glass card-hover relative h-full rounded-2xl p-7 text-center">
                <span className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/30 bg-night font-display text-sm font-bold text-cyan-300 shadow-glow-cyan">
                  {s.n}
                </span>
                <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section-pad mt-28">
        <Reveal>
          <div className="glass glow-border relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[100px]" />
            <Fingerprint className="mx-auto h-8 w-8 text-cyan-300" />
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
              Check a link <span className="text-gradient">before it checks you</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
              Run a free scan now — verdicts, risk scores and full indicator breakdowns in seconds.
            </p>
            <Link to="/scanner" data-testid="cta-scan-button" className="btn-primary mt-8">
              Open URL Scanner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
};

export default Home;

