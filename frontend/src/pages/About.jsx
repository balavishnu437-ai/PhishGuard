import { Fingerprint, Brain, Calculator, Zap, ShieldCheck, Eye, Lock, Globe, Cpu, Activity } from "lucide-react";
import { PageShell, Reveal, SectionHeading } from "@/components/Reveal";

const PIPELINE = [
  { icon: Fingerprint, title: "Feature Extraction", text: "Each URL is decomposed into 16 lexical, host and structural signals — length, TLD, subdomains, keywords, obfuscation tricks and more." },
  { icon: Calculator, title: "Weighted Risk Scoring", text: "Signals feed a weighted scoring model tuned on phishing-campaign characteristics, producing a 0–100 risk score." },
  { icon: Zap, title: "Real-Time Verdict", text: "Scores map to color-coded verdicts — safe, suspicious or phishing — with the exact indicators that fired, in seconds." },
];

const VALUES = [
  { icon: Eye, title: "Transparent", text: "You always see why a URL was flagged — every indicator is shown." },
  { icon: Lock, title: "Private by design", text: "The engine analyzes structure only. It never visits the destination." },
  { icon: Globe, title: "Built for everyone", text: "No sign-up, no install — paste a link and get a verdict." },
  { icon: Activity, title: "Always measuring", text: "Accuracy and latency are tracked live on the dashboard." },
];

const About = () => (
  <PageShell className="pt-32 sm:pt-36">
    <section className="section-pad" data-testid="about-page">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">About</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Intelligence against <span className="text-gradient">deception</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          PhishGuard is an intelligent phishing URL detection system. Modern phishing kits imitate trusted brands and bury malicious destinations under look-alike domains — PhishGuard catches those tricks with a layered heuristic engine, before a single click does damage.
        </p>
      </Reveal>

      {/* pipeline */}
      <div className="mx-auto mt-16 max-w-5xl">
        <SectionHeading center eyebrow="The engine" title="How detection works" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PIPELINE.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="glass glow-border card-hover h-full rounded-2xl p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-glow-cyan">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* values */}
      <div className="mx-auto mt-20 max-w-5xl">
        <SectionHeading center eyebrow="Principles" title="What we optimize for" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="glass card-hover flex h-full items-start gap-4 rounded-2xl p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                  <v.icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* model card */}
      <div className="mx-auto mt-20 max-w-5xl">
        <Reveal>
          <div className="glass glow-border flex flex-col items-start gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-glow-cyan">
              <Brain className="h-7 w-7 text-cyan-300" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="flex flex-wrap items-center gap-3 text-lg font-semibold">
                PhishGuard ML Architecture
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-200">Decision Tree v2.0</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Engineered by <strong>Bala Vishnu & Diyanezwaran</strong>. Pre-trained on the comprehensive <strong>PhiUSIIL Phishing URL Dataset</strong> with 51 lexical and HTML DOM inspection features, complemented by automated safety overrides for cloaked shorteners and offline hosts.
              </p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-white">51</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Features</p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-bold text-white">
                  <Cpu className="h-4 w-4 text-cyan-300" /> ML
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Pipeline</p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-bold text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> 97.4%
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Accuracy</p>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
          PhishGuard combines Decision Tree Machine Learning with heuristic defense-in-depth verification. Built by Bala Vishnu & Diyanezwaran.
        </p>
      </div>
    </section>
  </PageShell>
);

export default About;

