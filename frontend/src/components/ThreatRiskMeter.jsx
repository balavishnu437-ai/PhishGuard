import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, AlertTriangle, Gauge } from "lucide-react";

export const ThreatRiskMeter = ({ initialScore = 78, interactive = false, title = "Threat Risk Meter" }) => {
  const [score, setScore] = useState(initialScore);

  const getZone = (val) => {
    if (val >= 65) {
      return {
        label: "CRITICAL RISK",
        subtitle: "High probability of credential harvesting or malware delivery",
        color: "text-red-400",
        stroke: "#f43f5e",
        glow: "rgba(244, 63, 94, 0.4)",
        bg: "bg-red-500/10 border-red-500/30",
        icon: ShieldAlert,
      };
    }
    if (val >= 40) {
      return {
        label: "SUSPICIOUS",
        subtitle: "Cloaking, dormant host or unusual lexical signals detected",
        color: "text-amber-400",
        stroke: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        bg: "bg-amber-500/10 border-amber-500/30",
        icon: AlertTriangle,
      };
    }
    return {
      label: "SAFE / CLEAN",
      subtitle: "URL aligns with established legitimate infrastructure",
      color: "text-emerald-400",
      stroke: "#10b981",
      glow: "rgba(16, 185, 129, 0.4)",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      icon: ShieldCheck,
    };
  };

  const zone = getZone(score);
  const Icon = zone.icon;

  // Arc calculation (half-circle gauge 180 degrees)
  const radius = 90;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const needleAngle = -90 + (score / 100) * 180;

  return (
    <div className="glass glow-border rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">Continuous AI Risk Scoring Engine (0 – 100)</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${zone.bg} ${zone.color}`}>
          <Icon className="h-3.5 w-3.5" />
          {zone.label}
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center">
        {/* Semi-circular Gauge */}
        <div className="relative flex h-48 w-80 items-end justify-center overflow-hidden">
          <svg viewBox="0 0 220 120" className="h-full w-full">
            <defs>
              <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Active Progress Arc */}
            <motion.path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke="url(#meterGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 10px ${zone.glow})` }}
            />

            {/* Needle Pivot Center */}
            <circle cx="110" cy="110" r="8" fill="#0f172a" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" />
          </svg>

          {/* Animated Needle */}
          <motion.div
            className="absolute bottom-2 left-1/2 h-24 w-1.5 origin-bottom -translate-x-1/2 rounded-full"
            style={{
              background: `linear-gradient(to top, #ffffff, ${zone.stroke})`,
              filter: `drop-shadow(0 0 6px ${zone.stroke})`,
            }}
            initial={{ rotate: -90 }}
            animate={{ rotate: needleAngle }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          />
        </div>

        {/* Numeric Readout */}
        <div className="mt-2 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-display text-5xl font-extrabold tracking-tight ${zone.color}`}>{score}</span>
            <span className="text-lg font-medium text-slate-500">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{zone.subtitle}</p>
        </div>

        {/* Threat Level Tiers */}
        <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center text-[11px]">
          <div className={`rounded-xl border p-2 transition ${score < 40 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-semibold" : "border-white/5 bg-white/[0.02] text-slate-500"}`}>
            <span className="block text-[10px] uppercase tracking-wider">Low</span>
            0 – 39 Safe
          </div>
          <div className={`rounded-xl border p-2 transition ${score >= 40 && score < 65 ? "border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold" : "border-white/5 bg-white/[0.02] text-slate-500"}`}>
            <span className="block text-[10px] uppercase tracking-wider">Medium</span>
            40 – 64 Suspicious
          </div>
          <div className={`rounded-xl border p-2 transition ${score >= 65 ? "border-red-500/50 bg-red-500/10 text-red-300 font-semibold" : "border-white/5 bg-white/[0.02] text-slate-500"}`}>
            <span className="block text-[10px] uppercase tracking-wider">High</span>
            65 – 100 Phishing
          </div>
        </div>

        {/* Interactive Slider if enabled */}
        {interactive && (
          <div className="mt-6 w-full border-t border-white/5 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Interactive Gauge Test</span>
              <span className="font-mono text-cyan-300">{score}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

