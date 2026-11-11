import { motion } from "framer-motion";
import { ShieldCheck, Lock, Bug, Gauge } from "lucide-react";

const RING_CIRCUM = 2 * Math.PI * 48;

export const ShieldVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.65, 0.35, 1] }}
    data-testid="shield-visual"
    className="relative mx-auto aspect-square w-full max-w-[420px]"
  >
    {/* rotating rings */}
    <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cyan-400/20" />
    <div className="absolute inset-6 animate-spin-reverse rounded-full border border-white/5" />
    <div className="absolute inset-6 rounded-full border border-dashed border-blue-400/15" />

    {/* radar sweep */}
    <div className="absolute inset-10 overflow-hidden rounded-full">
      <div className="radar-sweep absolute inset-0 opacity-70" />
    </div>
    <span className="absolute left-[26%] top-[30%] h-1.5 w-1.5 animate-ping rounded-full bg-red-400/80" />
    <span className="absolute right-[28%] top-[58%] h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400/80" style={{ animationDelay: "0.9s" }} />

    {/* orbiting node */}
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-glow-cyan" />
    </motion.div>

    {/* core */}
    <div className="absolute inset-0 grid place-items-center">
      <div className="glass glow-border relative grid h-44 w-44 place-items-center rounded-full shadow-glow-cyan">
        <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-cyan-400/15 blur-2xl" />
        <svg viewBox="0 0 100 100" className="absolute inset-2 h-auto w-auto">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="1" />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#shieldGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUM}
            initial={{ strokeDashoffset: RING_CIRCUM }}
            animate={{ strokeDashoffset: RING_CIRCUM * 0.22 }}
            transition={{ duration: 2.2, delay: 0.7, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        <ShieldCheck className="h-16 w-16 text-cyan-300 drop-shadow-[0_0_16px_rgba(0,240,255,0.6)]" />
      </div>
    </div>

    {/* floating status chips */}
    <div className="glass absolute -left-2 top-10 flex animate-float-y items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium text-emerald-300" style={{ animationDelay: "0.4s" }}>
      <Lock className="h-3.5 w-3.5" /> TLS Verified
    </div>
    <div className="glass absolute -right-3 top-1/3 flex animate-float-y items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium text-cyan-300">
      <Bug className="h-3.5 w-3.5" /> 0 Malware
    </div>
    <div className="glass absolute bottom-8 left-8 flex animate-float-y items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-200" style={{ animationDelay: "1.1s" }}>
      <Gauge className="h-3.5 w-3.5" /> Risk 4 / 100
    </div>
  </motion.div>
);

