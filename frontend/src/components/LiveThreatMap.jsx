import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Radio, ShieldAlert, Activity, Crosshair, MapPin } from "lucide-react";

export const LiveThreatMap = ({ threats = [] }) => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [activePulse, setActivePulse] = useState(0);

  // Cycle active threat blip every 3.5s
  useEffect(() => {
    if (!threats.length) return;
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % threats.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [threats]);

  // Convert lat/lng to normalized % inside the SVG map viewport (Equirectangular projection)
  const coordsToPos = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const current = threats[activePulse] || threats[0];

  return (
    <div className="glass glow-border relative overflow-hidden rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Globe className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-white">Live Global Threat Map</h2>
              <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                <Radio className="h-2.5 w-2.5 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time global interception of phishing infrastructure</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Nodes: <strong className="text-white">{threats.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative mt-6 h-72 sm:h-96 w-full rounded-2xl border border-white/10 bg-night-900/90 overflow-hidden">
        {/* Radar Scanner Beam Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* World Map Stylized Vector (Simplified continents representation) */}
        <svg viewBox="0 0 1000 500" className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="none">
          {/* North America */}
          <path d="M120 70 Q 200 60 250 120 T 220 220 T 150 200 T 100 130 Z" fill="#38bdf8" />
          {/* South America */}
          <path d="M260 250 Q 320 280 300 400 T 260 450 T 230 310 Z" fill="#38bdf8" />
          {/* Europe */}
          <path d="M460 70 Q 560 60 550 140 T 480 180 T 430 110 Z" fill="#38bdf8" />
          {/* Africa */}
          <path d="M450 190 Q 580 200 560 350 T 490 420 T 430 260 Z" fill="#38bdf8" />
          {/* Asia */}
          <path d="M570 60 Q 820 40 850 190 T 730 270 T 570 170 Z" fill="#38bdf8" />
          {/* Australia */}
          <path d="M780 320 Q 880 330 870 410 T 790 420 Z" fill="#38bdf8" />
        </svg>

        {/* Threat Markers */}
        {threats.map((t, idx) => {
          const pos = coordsToPos(t.lat, t.lng);
          const isCurrent = idx === activePulse;
          const isCritical = t.risk >= 90;

          return (
            <div
              key={t.id}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => setSelectedThreat(t)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {/* Outer Pulsing Ping */}
              {isCurrent && (
                <span className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${isCritical ? "bg-red-400" : "bg-cyan-400"}`} />
              )}
              {/* Node Dot */}
              <div
                className={`relative h-3 w-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-150 ${
                  isCritical
                    ? "border-red-300 bg-red-500 shadow-[0_0_12px_#f43f5e]"
                    : "border-cyan-300 bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                }`}
              />

              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center rounded-lg border border-white/10 bg-slate-900/95 px-2.5 py-1.5 text-center shadow-2xl backdrop-blur-md whitespace-nowrap z-30">
                <span className="text-[11px] font-semibold text-white">{t.city}, {t.code}</span>
                <span className="text-[10px] text-cyan-300">{t.target} · Risk {t.risk}</span>
              </div>
            </div>
          );
        })}

        {/* Live Attack Intercept Card Overlay (Current Pulse) */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md rounded-xl border border-red-500/30 bg-slate-950/90 p-3.5 backdrop-blur-md shadow-2xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">Intercepted Attack</span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">{current.time}</span>
                </div>
                <span className="font-mono text-xs font-bold text-red-400">Risk {current.risk}/100</span>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-white">
                Target: <span className="text-cyan-300">{current.target}</span>
              </p>
              <p className="text-[11px] text-slate-400">{current.type}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  {current.city}, {current.country}
                </span>
                <span className="font-mono text-slate-400">Origin IP: {current.ip}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Threat Feed Table below map */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="pb-2">Location</th>
              <th className="pb-2">Targeted Brand</th>
              <th className="pb-2">Attack Vector</th>
              <th className="pb-2">Source IP</th>
              <th className="pb-2 text-right">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {threats.slice(0, 5).map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02] transition">
                <td className="py-2.5 font-medium text-slate-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {t.city}, {t.code}
                </td>
                <td className="py-2.5 text-cyan-300 font-semibold">{t.target}</td>
                <td className="py-2.5 text-slate-400">{t.type}</td>
                <td className="py-2.5 font-mono text-slate-400">{t.ip}</td>
                <td className="py-2.5 text-right font-bold text-red-400">
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5">
                    {t.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

