import { ShieldAlert, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, LifeBuoy } from "lucide-react";

export const SecurityRecommendations = ({ recommendations = [], verdict = "safe", riskScore = 0 }) => {
  const getVerdictHeader = () => {
    if (verdict === "phishing" || riskScore >= 65) {
      return {
        badge: "Critical Threat Response",
        color: "text-red-400",
        border: "border-red-500/30 bg-red-500/10",
        icon: ShieldAlert,
        summary: "Active malicious indicators detected. Immediate containment protocols recommended.",
      };
    }
    if (verdict === "suspicious" || riskScore >= 40) {
      return {
        badge: "Cautionary Protocols",
        color: "text-amber-400",
        border: "border-amber-500/30 bg-amber-500/10",
        icon: AlertTriangle,
        summary: "Anomalous domain or cloaking signals detected. Verification required before interaction.",
      };
    }
    return {
      badge: "Standard Safety Cleared",
      color: "text-emerald-400",
      border: "border-emerald-500/30 bg-emerald-500/10",
      icon: ShieldCheck,
      summary: "No immediate threats found. Maintain routine defensive cyber hygiene.",
    };
  };

  const header = getVerdictHeader();
  const HeaderIcon = header.icon;

  const priorityStyles = {
    critical: "border-red-500/30 bg-red-500/10 text-red-300",
    high: "border-red-500/20 bg-red-500/5 text-red-200",
    medium: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    low: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
    info: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  };

  return (
    <div className="glass glow-border rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-white">Security Recommendations</h3>
            <p className="text-xs text-slate-400">Prescriptive mitigation and defensive actions based on AI verdict</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${header.border} ${header.color}`}>
          <HeaderIcon className="h-3.5 w-3.5" />
          {header.badge}
        </span>
      </div>

      <p className="mt-4 text-xs text-slate-300">{header.summary}</p>

      {/* Recommendations List */}
      <div className="mt-5 space-y-3">
        {(recommendations || []).map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/20"
          >
            <div className="mt-0.5">
              <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityStyles[rec.priority] || priorityStyles.info}`}>
                {rec.priority || "Action"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-white">{rec.title}</h4>
              <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Standard Incident Help Box */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-night-800/80 p-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Found a confirmed phishing attack? Report it to global threat feeds:</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <a
            href="https://safebrowsing.google.com/safebrowsing/report_phish/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition"
          >
            Google Safe Browsing <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-slate-600">·</span>
          <a
            href="https://apwg.org/reportphishing/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition"
          >
            APWG.org <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

