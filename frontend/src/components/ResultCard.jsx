import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanLine, History, CheckCircle2, Fingerprint, Link as LinkIcon, ShieldAlert, Radio } from "lucide-react";
import { VERDICT_THEME } from "@/components/VerdictBadge";
import { timeAgo } from "@/lib/format";
import { URLForensics } from "@/components/URLForensics";
import { SecurityRecommendations } from "@/components/SecurityRecommendations";

const CIRCUM = 2 * Math.PI * 52;
const SEVERITY_DOT = { high: "bg-red-400", medium: "bg-amber-400", low: "bg-sky-400" };

export const ResultCard = ({ result, onReset }) => {
  const t = VERDICT_THEME[result.verdict] || VERDICT_THEME.suspicious;
  const Icon = t.icon;
  const offset = CIRCUM * (1 - result.risk_score / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.65, 0.35, 1] }}
      data-testid="result-card"
      className="glass glow-border rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        {/* risk gauge */}
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="7" />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={t.stroke}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUM}
              initial={{ strokeDashoffset: CIRCUM }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 8px ${t.stroke})` }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-3xl font-bold text-white" data-testid="result-risk-score">{result.risk_score}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Risk Score</p>
            </div>
          </div>
        </div>

        {/* verdict */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <span className={`grid h-11 w-11 place-items-center rounded-xl border ${t.chip} ${t.ring}`}>
              <Icon className={`h-5 w-5 ${t.text}`} />
            </span>
            <div>
              <p className={`font-display text-2xl font-bold ${t.text}`} data-testid="result-verdict-title">
                {t.label === "Legitimate" ? "Safe — Legitimate URL" : t.label === "Phishing" ? "Phishing Detected" : "Suspicious URL"}
              </p>
              <p className="text-sm text-slate-400" data-testid="result-verdict-subtitle">
                {result.verdict === "safe" && "No phishing indicators matched this URL."}
                {result.verdict === "suspicious" && "Several weak signals detected — proceed with caution."}
                {result.verdict === "phishing" && "Strong phishing indicators. Do not visit or share this URL."}
              </p>
            </div>
          </div>

          <p className="mt-3 break-all rounded-xl border border-white/10 bg-night-700/70 px-3.5 py-2.5 text-left text-xs text-slate-300" data-testid="result-scanned-url">
            <LinkIcon className="mr-2 inline h-3.5 w-3.5 text-cyan-300" />
            {result.url}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400 sm:justify-start">
            <span className="flex items-center gap-1.5" data-testid="result-checks">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {result.checks_passed}/{result.checks_total} checks passed
            </span>
            <span className="flex items-center gap-2" data-testid="result-confidence">
              Confidence
              <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </span>
              {result.confidence}%
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1" data-testid="result-model">{result.model_version}</span>
            <span data-testid="result-time">{timeAgo(result.scanned_at)}</span>
          </div>
        </div>
      </div>

      {/* indicators */}
      {result.indicators?.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Detected indicators ({result.indicators.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {result.indicators.map((ind, i) => (
              <span
                key={i}
                data-testid="result-indicator"
                title={ind.detail}
                className="group flex cursor-help items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[ind.severity] || "bg-slate-400"}`} />
                {ind.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* URL Forensics Breakdown */}
      {result.forensics && (
        <div className="mt-6 border-t border-white/5 pt-5">
          <URLForensics forensics={result.forensics} url={result.url} />
        </div>
      )}

      {/* Security Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-5">
          <SecurityRecommendations
            recommendations={result.recommendations}
            verdict={result.verdict}
            riskScore={result.risk_score}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
        <button onClick={onReset} data-testid="scan-another-button" className="btn-primary">
          <ScanLine className="h-4 w-4" />
          Scan another URL
        </button>
        <Link
          to={`/threat-intel?scanId=${result.id}`}
          data-testid="result-view-intel"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20 hover:border-cyan-400/50"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-300" />
          Investigate in Threat Intel Center
        </Link>
        <Link to="/history" data-testid="result-view-history" className="btn-ghost">
          <History className="h-4 w-4" />
          View scan history
        </Link>
        <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-slate-500 sm:flex">
          <Fingerprint className="h-3.5 w-3.5" />
          Heuristic analysis — no site was contacted
        </span>
      </div>
    </motion.div>
  );
};

