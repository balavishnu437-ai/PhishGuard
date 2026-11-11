import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, Radar, ShieldAlert, ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { PageShell, Reveal } from "@/components/Reveal";
import { VerdictBadge } from "@/components/VerdictBadge";
import { EmptyState } from "@/components/EmptyState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { clearScans, deleteScan, getScans } from "@/lib/api";
import { timeAgo, truncateUrl } from "@/lib/format";

const FILTERS = [
  { key: "", label: "All", icon: Radar },
  { key: "safe", label: "Safe", icon: ShieldCheck },
  { key: "suspicious", label: "Suspicious", icon: AlertTriangle },
  { key: "phishing", label: "Phishing", icon: ShieldAlert },
];

const History = () => {
  const [rows, setRows] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQDeb(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    const params = { limit: 100 };
    if (verdict) params.verdict = verdict;
    if (qDeb) params.q = qDeb;
    try {
      setRows(await getScans(params));
    } catch {
      toast.error("Failed to load scan history");
    }
  }, [verdict, qDeb]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    try {
      await deleteScan(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      toast.success("Scan removed from history");
    } catch {
      toast.error("Could not remove this scan");
    }
  };

  const clearAll = async () => {
    try {
      await clearScans();
      setRows([]);
      setConfirmClear(false);
      toast.success("History cleared");
    } catch {
      toast.error("Could not clear history");
    }
  };

  const filtered = Boolean(verdict || qDeb);
  const empty = rows && rows.length === 0;

  return (
    <PageShell className="pt-32 sm:pt-36">
      <section className="section-pad" data-testid="history-page">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Scan History</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Every verdict, on record</h1>
              <p className="mt-3 text-sm text-slate-400">Search, filter and manage all URLs analyzed by PhishGuard.</p>
            </div>
            {rows && rows.length > 0 && (
              <button
                onClick={() => (confirmClear ? clearAll() : setConfirmClear(true))}
                data-testid="clear-history-button"
                onBlur={() => setConfirmClear(false)}
                className={`btn-ghost !px-4 !py-2.5 text-xs ${confirmClear ? "!border-red-400/50 !text-red-300 shadow-glow-red" : "hover:!border-red-400/40 hover:!text-red-300"}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {confirmClear ? "Confirm clear all" : "Clear history"}
              </button>
            )}
          </div>
        </Reveal>

        {/* controls */}
        <Reveal delay={0.1} className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" data-testid="history-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setVerdict(f.key)}
                data-testid={`history-filter-${f.label.toLowerCase()}`}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition ${
                  verdict === f.key
                    ? "border-cyan-400/40 bg-cyan-400/10 text-white shadow-glow-cyan"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/25 hover:text-cyan-200"
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              data-testid="history-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search scanned URLs…"
              className="neon-field pl-11"
              aria-label="Search scan history"
            />
          </div>
        </Reveal>

        {/* table */}
        {empty ? (
          <div className="mt-8">
            <EmptyState
              icon={filtered ? Radar : ShieldCheck}
              title={filtered ? "No matching scans" : "No scans yet"}
              description={
                filtered
                  ? "Try a different search term or clear the verdict filter to see more results."
                  : "Your scan history will appear here once you analyze your first URL."
              }
              actionLabel="Scan a URL now"
              testId="history-empty-state"
            />
          </div>
        ) : (
          <Reveal delay={0.15} className="mt-8">
            <div className="glass glow-border overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      <th className="px-6 py-4 font-medium">URL</th>
                      <th className="px-4 py-4 font-medium">Verdict</th>
                      <th className="px-4 py-4 font-medium">Risk</th>
                      <th className="px-4 py-4 font-medium">Confidence</th>
                      <th className="px-4 py-4 font-medium">Scanned</th>
                      <th className="px-6 py-4 text-right font-medium">
                        <TooltipProvider delayDuration={120}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button aria-label="About columns" data-testid="history-columns-info" className="text-slate-500 transition hover:text-cyan-300">
                                <Info className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-[220px] text-xs">
                              Risk 0–39 = safe, 40–64 = suspicious, ≥ 65 = phishing. Removal is instant.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </th>
                    </tr>
                  </thead>
                  <tbody data-testid="history-table-body">
                    {(rows || []).map((r) => (
                      <tr key={r.id} data-testid={`scan-row-${r.id}`} className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]">
                        <td className="max-w-[300px] truncate px-6 py-4 text-slate-300">{truncateUrl(r.url, 46)}</td>
                        <td className="px-4 py-4"><VerdictBadge verdict={r.verdict} /></td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-2.5 text-xs text-slate-300">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                              <span
                                className={`block h-full rounded-full ${r.verdict === "safe" ? "bg-emerald-400" : r.verdict === "phishing" ? "bg-red-400" : "bg-amber-400"}`}
                                style={{ width: `${r.risk_score}%` }}
                              />
                            </span>
                            {r.risk_score}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-400">{r.confidence}%</td>
                        <td className="px-4 py-4 text-xs text-slate-500">{timeAgo(r.scanned_at)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => remove(r.id)}
                            data-testid={`delete-scan-${r.id}`}
                            aria-label="Remove scan"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-500 transition hover:border-red-400/40 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {rows && (
              <p className="mt-4 text-center text-xs text-slate-500" data-testid="history-count">
                Showing {rows.length} {rows.length === 1 ? "scan" : "scans"}
              </p>
            )}
          </Reveal>
        )}
      </section>
    </PageShell>
  );
};

export default History;
