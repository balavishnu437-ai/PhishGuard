import { motion } from "framer-motion";
import { ShieldCheck, Lock, Bug, Gauge, Sparkles, Cpu, Radio } from "lucide-react";

const RING_CIRCUM = 2 * Math.PI * 48;

export const ShieldVisual = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.65, 0.35, 1] }}
    data-testid="shield-visual"
    className="relative mx-auto aspect-square w-full max-w-[440px]"
  >
    {/* Multi-Color Ambient Backing Aura */}
    <div className="absolute inset-4 -z-10 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/20 blur-3xl animate-pulse" />

    {/* Rotating Outer Rings in Multi-color */}
    <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]" />
    <div className="absolute inset-4 animate-spin-reverse rounded-full border border-purple-500/25 shadow-[0_0_20px_rgba(168,85,247,0.15)]" />
    <div className="absolute inset-8 rounded-full border border-dashed border-pink-500/20" />
    <div className="absolute inset-12 rounded-full border border-emerald-400/15" />

    {/* Radar sweep with multi-color hue */}
    <div className="absolute inset-10 overflow-hidden rounded-full">
      <div className="radar-sweep absolute inset-0 opacity-80" />
    </div>
    
    {/* Multi-color pulsing beacon pings */}
    <span className="absolute left-[24%] top-[28%] h-2 w-2 animate-ping rounded-full bg-pink-400/90" />
    <span className="absolute right-[26%] top-[56%] h-2 w-2 animate-ping rounded-full bg-emerald-400/90" style={{ animationDelay: "0.9s" }} />
    <span className="absolute left-[45%] bottom-[22%] h-2 w-2 animate-ping rounded-full bg-cyan-400/90" style={{ animationDelay: "1.4s" }} />

    {/* Orbiting Multi-Color Nodes */}
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
    </motion.div>
    <motion.div
      className="absolute inset-6"
      animate={{ rotate: -360 }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc]" />
    </motion.div>

    {/* Core Shield Emblem */}
    <div className="absolute inset-0 grid place-items-center">
      <div className="glass-vibrant relative grid h-48 w-48 place-items-center rounded-full shadow-[0_0_40px_rgba(168,85,247,0.35)]">
        <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
        <svg viewBox="0 0 100 100" className="absolute inset-2 h-auto w-auto">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#shieldMultiGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUM}
            initial={{ strokeDashoffset: RING_CIRCUM }}
            animate={{ strokeDashoffset: RING_CIRCUM * 0.18 }}
            transition={{ duration: 2.2, delay: 0.7, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="shieldMultiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="35%" stopColor="#818cf8" />
              <stop offset="70%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        <ShieldCheck className="h-20 w-20 text-cyan-200 drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]" />
      </div>
    </div>

    {/* Floating Animated Status Chips with Multi-Color Accents */}
    <div
      className="glass absolute -left-4 top-8 flex animate-float-y items-center gap-2 rounded-2xl border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
      style={{ animationDelay: "0.3s" }}
    >
      <Lock className="h-3.5 w-3.5 text-emerald-400" />
      <span>TLS / HTTPS Verified</span>
    </div>
    
    <div
      className="glass absolute -right-5 top-1/4 flex animate-float-y items-center gap-2 rounded-2xl border-purple-500/30 px-4 py-2.5 text-xs font-semibold text-purple-200 shadow-[0_4px_20px_rgba(168,85,247,0.2)]"
      style={{ animationDelay: "0.8s" }}
    >
      <Cpu className="h-3.5 w-3.5 text-purple-300" />
      <span>51 ML Features</span>
    </div>

    <div
      className="glass absolute bottom-6 -left-3 flex animate-float-y items-center gap-2 rounded-2xl border-cyan-400/30 px-4 py-2.5 text-xs font-semibold text-cyan-200 shadow-[0_4px_20px_rgba(6,182,212,0.2)]"
      style={{ animationDelay: "1.2s" }}
    >
      <Gauge className="h-3.5 w-3.5 text-cyan-300" />
      <span>97.4% Precision</span>
    </div>

    <div
      className="glass absolute bottom-12 -right-4 flex animate-float-y items-center gap-2 rounded-2xl border-pink-500/30 px-4 py-2.5 text-xs font-semibold text-pink-300 shadow-[0_4px_20px_rgba(236,72,153,0.2)]"
      style={{ animationDelay: "1.6s" }}
    >
      <Radio className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
      <span>Zero-Hour Defense</span>
    </div>
  </motion.div>
);

