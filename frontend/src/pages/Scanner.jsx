import { useEffect, useState } from "react";
import { ListChecks, ShieldQuestion, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell, Reveal } from "@/components/Reveal";
import { ScannerCard } from "@/components/ScannerCard";
import { VerdictBadge } from "@/components/VerdictBadge";
import { getScans } from "@/lib/api";
import { timeAgo, truncateUrl } from "@/lib/format";

const SIGNALS = [
  "IP-address hosts", "@ obfuscation", "Risky TLDs", "Brand impersonation", "Punycode look-alikes",
  "URL shorteners", "Phishing keywords", "Deep subdomains", "Double extensions", "Embedded redirects",
  "Non-standard ports", "Randomized strings", "Missing TLS", "Excessive length", "Hyphenated domains", "Dot stacking",
];

const Scanner = () => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    getScans({ limit: 5 }).then(setRecent).catch(() => {});
  }, []);

  return (
    <PageShell className="pt-32 sm:pt-36">
      <section className="section-pad" data-testid="scanner-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">URL Scanner</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Scan any link with <span className="text-gradient">precision</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            The engine inspects 16 security signals without ever visiting the destination — fast, private and transparent.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-3xl">
          <ScannerCard />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-5">
          {/* what we check */}
          <Reveal delay={0.2} className="lg:col-span-3">
            <div className="glass glow-border h-full rounded-2xl p-7">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold">
                <ListChecks className="h-5 w-5 text-cyan-300" />
                What we check
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {SIGNALS.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                Weighted risk model · verdicts at risk ≥ 65 (phishing) or ≥ 40 (suspicious)
              </p>
            </div>
          </Reveal>

          {/* recent scans */}
          <Reveal delay={0.28} className="lg:col-span-2">
            <div className="glass h-full rounded-2xl p-7">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold">
                <ShieldQuestion className="h-5 w-5 text-cyan-300" />
                Latest verdicts
              </h2>
              <ul className="mt-5 space-y-3" data-testid="scanner-recent-list">
                {recent.map((r) => (
                  <li key={r.id} className="rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-slate-300">{truncateUrl(r.url, 34)}</span>
                      <VerdictBadge verdict={r.verdict} />
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">Risk {r.risk_score} · {timeAgo(r.scanned_at)}</p>
                  </li>
                ))}
                {recent.length === 0 && <li className="text-sm text-slate-500">No scans yet — be the first.</li>}
              </ul>
              <Link to="/history" data-testid="scanner-view-history" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 transition hover:text-cyan-100">
                View full history <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default Scanner;

