import { useState } from "react";
import { ShieldAlert, BookOpen, CheckCircle, Crosshair, ArrowUpRight } from "lucide-react";

export const ThreatIntelCards = ({ techniques = [], matchedTechniqueId = null }) => {
  const [filter, setFilter] = useState("all");

  const categories = ["all", "Initial Access", "Credential Access", "Evasion", "Social Engineering"];

  const filtered = filter === "all" ? techniques : techniques.filter((t) => t.category === filter);

  const getSeverityStyle = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "high":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      default:
        return "border-sky-500/30 bg-sky-500/10 text-sky-400";
    }
  };

  return (
    <div className="glass glow-border rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Threat Intelligence Knowledge Base</h2>
            <p className="text-xs text-slate-400">Analysis of common adversarial phishing vectors mapped to MITRE ATT&CK</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filter === c
                  ? "border border-cyan-400/40 bg-cyan-400/15 text-white"
                  : "border border-white/5 bg-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {c === "all" ? "All Vectors" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => {
          const isMatched = matchedTechniqueId && t.id === matchedTechniqueId;
          return (
            <div
              key={t.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition duration-300 group ${
                isMatched
                  ? "border-cyan-400 bg-cyan-500/[0.08] ring-1 ring-cyan-400/50 shadow-[0_0_24px_rgba(6,182,212,0.22)]"
                  : "border-white/10 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-300">
                      {t.id}
                    </span>
                    {isMatched && (
                      <span className="rounded-full border border-cyan-400/50 bg-cyan-400/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-200 animate-pulse">
                        Detected in Target
                      </span>
                    )}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getSeverityStyle(t.severity)}`}>
                    {t.severity} · {t.prevalence}
                  </span>
                </div>

              <h3 className="mt-3 font-display text-sm font-semibold text-white group-hover:text-cyan-200 transition">
                {t.name}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-slate-400">{t.category}</p>

              <p className="mt-3 text-xs leading-relaxed text-slate-300">{t.description}</p>

              {/* Indicators */}
              <div className="mt-4 border-t border-white/5 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key Indicators</p>
                <ul className="mt-1.5 space-y-1">
                  {t.indicators?.map((ind, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Crosshair className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Defense Guidance */}
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                Mitigation & Defense
              </div>
              <p className="mt-1 text-[11px] text-slate-300 leading-normal">{t.defense}</p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

