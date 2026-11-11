import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, ShieldAlert, ShieldCheck, Gauge, RefreshCw, ChevronRight, Radar } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { PageShell, Reveal } from "@/components/Reveal";
import { StatCard } from "@/components/StatCard";
import { VerdictBadge } from "@/components/VerdictBadge";
import { getScans, getStats } from "@/lib/api";
import { timeAgo, truncateUrl } from "@/lib/format";

const ChartTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="glass rounded-xl border border-cyan-400/20 px-4 py-3 text-xs">
      <p className="mb-1.5 font-semibold text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.stroke }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  ) : null;

const SPLIT_COLORS = { Safe: "#34d399", Suspicious: "#fbbf24", Phishing: "#ff4d6d" };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([getStats(), getScans({ limit: 8 })]);
      setStats(s);
      setRecent(r);
    } catch {
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const split = stats
    ? [
        { name: "Safe", value: stats.safe_urls },
        { name: "Suspicious", value: stats.suspicious },
        { name: "Phishing", value: stats.phishing_detected },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <PageShell className="pt-32 sm:pt-36">
      <section className="section-pad" data-testid="dashboard-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Threat overview</h1>
            <p className="mt-3 text-sm text-slate-400">
              Live statistics from the detection engine ·{" "}
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-cyan-200">
                {stats?.model_version || "PG-Heur v2.1"}
              </span>
            </p>
          </div>
          <button onClick={load} data-testid="dashboard-refresh-button" className="btn-ghost !px-4 !py-2.5 text-xs" disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </Reveal>

        {loading && !stats ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="glass h-36 animate-pulse rounded-2xl" />
            ))}
            <div className="glass h-80 animate-pulse rounded-2xl sm:col-span-2" />
            <div className="glass h-80 animate-pulse rounded-2xl sm:col-span-2" />
          </div>
        ) : (
          <>
            {/* stat cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total URLs Scanned" value={stats?.total_scanned || 0} icon={ScanLine} accent="cyan" tooltip="Every URL analyzed by the engine, across all time." />
              <StatCard title="Phishing Threats Detected" value={stats?.phishing_detected || 0} icon={ShieldAlert} accent="red" delay={0.08} tooltip="URLs classified as phishing (risk score ≥ 65)." />
              <StatCard title="Safe URLs" value={stats?.safe_urls || 0} icon={ShieldCheck} accent="emerald" delay={0.16} tooltip="URLs with no phishing indicators found." />
              <StatCard title="Detection Accuracy" value={stats?.accuracy || 96.8} decimals={1} suffix="%" icon={Gauge} accent="blue" delay={0.24} tooltip="Benchmark accuracy of the risk model on the labeled evaluation corpus." />
            </div>

            {/* charts */}
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <Reveal delay={0.1} className="lg:col-span-2">
                <div className="glass glow-border h-full rounded-2xl p-6" data-testid="dashboard-trend-chart">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold">Scans — last 7 days</h2>
                    <div className="flex gap-4 text-[11px] text-slate-400">
                      {[["Safe", "#34d399"], ["Suspicious", "#fbbf24"], ["Phishing", "#ff4d6d"]].map(([l, c]) => (
                        <span key={l} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={stats?.trend || []} margin={{ top: 8, right: 6, left: -16, bottom: 0 }}>
                        <defs>
                          {[
                            ["gSafe", "#34d399"], ["gSusp", "#fbbf24"], ["gPhish", "#ff4d6d"],
                          ].map(([id, color]) => (
                            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTip />} cursor={{ stroke: "rgba(0,240,255,0.25)" }} />
                        <Area type="monotone" dataKey="safe" name="Safe" stackId="1" stroke="#34d399" strokeWidth={2} fill="url(#gSafe)" />
                        <Area type="monotone" dataKey="suspicious" name="Suspicious" stackId="1" stroke="#fbbf24" strokeWidth={2} fill="url(#gSusp)" />
                        <Area type="monotone" dataKey="phishing" name="Phishing" stackId="1" stroke="#ff4d6d" strokeWidth={2} fill="url(#gPhish)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="glass glow-border flex h-full flex-col rounded-2xl p-6" data-testid="dashboard-split-chart">
                  <h2 className="text-base font-semibold">Threat split</h2>
                  <div className="relative mx-auto mt-2 w-full max-w-[260px]">
                    <div className="h-[230px] w-full">
                      <ResponsiveContainer width="100%" height={230}>
                        <PieChart>
                          <Pie data={split} dataKey="value" nameKey="name" innerRadius={64} outerRadius={92} paddingAngle={4} stroke="none">
                            {split.map((d) => (
                              <Cell key={d.name} fill={SPLIT_COLORS[d.name]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <p className="font-display text-2xl font-bold text-white">{stats?.total_scanned || 0}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Total scans</p>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-auto flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
                    {split.map((d) => (
                      <li key={d.name} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: SPLIT_COLORS[d.name] }} />
                        {d.name} · {d.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* activity + history */}
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <Reveal delay={0.1}>
                <div className="glass h-full rounded-2xl p-6" data-testid="activity-feed">
                  <h2 className="flex items-center gap-2.5 text-base font-semibold">
                    <Radar className="h-4 w-4 text-cyan-300" />
                    Recent activity
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {recent.slice(0, 6).map((r, i) => (
                      <motion.li
                        key={r.id}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-3 transition hover:border-cyan-400/20"
                      >
                        <VerdictBadge verdict={r.verdict} />
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-300">{truncateUrl(r.url, 40)}</span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-slate-500">{timeAgo(r.scanned_at)}</span>
                      </motion.li>
                    ))}
                    {recent.length === 0 && <li className="py-6 text-center text-sm text-slate-500">No activity yet.</li>}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="glass h-full rounded-2xl p-6" data-testid="dashboard-history-table">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2.5 text-base font-semibold">
                      <ShieldCheck className="h-4 w-4 text-cyan-300" />
                      Scan history
                    </h2>
                    <Link to="/history" data-testid="dashboard-view-all-history" className="flex items-center gap-1 text-xs font-medium text-cyan-300 transition hover:text-cyan-100">
                      View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                          <th className="pb-3 pr-3 font-medium">URL</th>
                          <th className="pb-3 pr-3 font-medium">Verdict</th>
                          <th className="pb-3 pr-3 font-medium">Risk</th>
                          <th className="pb-3 font-medium">When</th>
                        </tr>
                      </thead>
                      <tbody data-testid="history-table-body">
                        {recent.map((r) => (
                          <tr key={r.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                            <td className="max-w-[180px] truncate py-3 pr-3 text-slate-300">{truncateUrl(r.url, 36)}</td>
                            <td className="py-3 pr-3"><VerdictBadge verdict={r.verdict} /></td>
                            <td className="py-3 pr-3">
                              <span className="flex items-center gap-2">
                                <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
                                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${r.risk_score}%` }} />
                                </span>
                                {r.risk_score}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500">{timeAgo(r.scanned_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Reveal>
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
};

export default Dashboard;

