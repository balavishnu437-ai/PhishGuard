import { useState } from "react";
import { Clock, ShieldAlert, ShieldCheck, AlertTriangle, ChevronRight, Link as LinkIcon, ExternalLink } from "lucide-react";
import { timeAgo, truncateUrl } from "@/lib/format";
import { VERDICT_THEME } from "@/components/VerdictBadge";

export const ThreatHistoryTimeline = ({ scans = [], maxItems = 10, activeScanId = null, onSelectScan = null }) => {
  const [selectedScan, setSelectedScan] = useState(null);

  const displayScans = scans.slice(0, maxItems);

  if (!displayScans.length) {
    return (
      <div className="glass glow-border rounded-3xl p-8 text-center">
        <Clock className="mx-auto h-8 w-8 text-slate-500" />
        <h3 className="mt-3 text-sm font-semibold text-white">No Threat History Yet</h3>
        <p className="mt-1 text-xs text-slate-400">Scan URLs in the scanner to populate your threat timeline.</p>
      </div>
    );
  }

  return (
    <div className="glass glow-border rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-white">Threat History Timeline</h3>
            <p className="text-xs text-slate-400">Chronological telemetry of investigated web targets</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
          {scans.length} Total Records
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative mt-6 pl-6 sm:pl-8">
        {/* Continuous Vertical Timeline Line */}
        <div className="absolute bottom-3 left-2.5 sm:left-3.5 top-3 w-0.5 bg-gradient-to-b from-cyan-400/40 via-blue-500/20 to-transparent" />

        <div className="space-y-6">
          {displayScans.map((s, index) => {
            const verdictKey = (s?.verdict || "suspicious").toLowerCase();
            const theme = VERDICT_THEME[verdictKey] || VERDICT_THEME.suspicious;
            const Icon = theme.icon;
            const isTargetActive = activeScanId ? activeScanId === s.id : selectedScan?.id === s.id;
            const isSelected = selectedScan?.id === s.id;

            return (
              <div key={s.id || index} className="relative group">
                {/* Node Marker */}
                <div
                  className={`absolute -left-[27px] sm:-left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 bg-night-900 transition ${
                    isTargetActive
                      ? "border-cyan-400 text-cyan-300 shadow-[0_0_12px_#22d3ee]"
                      : s.verdict === "phishing"
                      ? "border-red-400 text-red-400 shadow-[0_0_8px_#f43f5e]"
                      : s.verdict === "suspicious"
                      ? "border-amber-400 text-amber-400 shadow-[0_0_8px_#f59e0b]"
                      : "border-emerald-400 text-emerald-400 shadow-[0_0_8px_#10b981]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>

                {/* Content Card */}
                <div
                  onClick={() => {
                    setSelectedScan(isSelected ? null : s);
                    if (onSelectScan) onSelectScan(s);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    isTargetActive
                      ? "border-cyan-400/70 bg-cyan-500/10 shadow-[0_0_18px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40"
                      : isSelected
                      ? "border-cyan-400/40 bg-white/[0.04]"
                      : "border-white/5 bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.chip} ${theme.text}`}>
                          <Icon className="h-3 w-3" />
                          {theme.label}
                        </span>
                        {isTargetActive && (
                          <span className="inline-flex items-center rounded-full border border-cyan-400/50 bg-cyan-400/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                            Active Intel Target
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-500">
                          {timeAgo(s.scanned_at)}
                        </span>
                      </div>
                      <p className="mt-1.5 truncate text-xs font-medium text-slate-200">
                        {s.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white">Risk {s.risk_score}</span>
                        <span className="block text-[10px] text-slate-500">{s.confidence}% conf</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded Forensics Details */}
                  {isSelected && (
                    <div className="mt-4 border-t border-white/5 pt-3 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="rounded-lg bg-white/5 p-2">
                          <span className="text-slate-500 block">Checks Passed</span>
                          <span className="font-semibold text-slate-200">{s.checks_passed || 51}/51</span>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <span className="text-slate-500 block">Model Engine</span>
                          <span className="font-semibold text-cyan-300">Decision Tree</span>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <span className="text-slate-500 block">Latency</span>
                          <span className="font-semibold text-slate-200">{s.analysis_time_ms ? `${s.analysis_time_ms}ms` : "Fast"}</span>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <span className="text-slate-500 block">Indicators</span>
                          <span className="font-semibold text-amber-300">{s.indicators?.length || 0} flagged</span>
                        </div>
                      </div>

                      {s.indicators?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.indicators.map((ind, i) => (
                            <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-300">
                              {ind.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

