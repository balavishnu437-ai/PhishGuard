import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ACCENTS = {
  cyan: { box: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300", glow: "shadow-glow-cyan", bar: "from-cyan-400 to-sky-500" },
  red: { box: "border-red-400/25 bg-red-400/10 text-red-300", glow: "shadow-glow-red", bar: "from-red-400 to-rose-500" },
  emerald: { box: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300", glow: "shadow-glow-emerald", bar: "from-emerald-400 to-teal-500" },
  blue: { box: "border-blue-400/25 bg-blue-400/10 text-blue-300", glow: "shadow-glow-blue", bar: "from-blue-400 to-indigo-500" },
};

export const StatCard = ({ title, value = 0, decimals = 0, suffix = "", icon: Icon, accent = "cyan", delay = 0, tooltip }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const a = ACCENTS[accent] || ACCENTS.cyan;

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((value || 0) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div
      ref={ref}
      data-testid={`stat-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className="glass glow-border card-hover relative overflow-hidden rounded-2xl p-6"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {title}
            {tooltip && (
              <TooltipProvider delayDuration={120}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button data-testid={`stat-info-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-label={`About ${title}`} className="text-slate-500 transition hover:text-cyan-300">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-xs">
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
          <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl" data-testid={`stat-value-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            {formatted}
            <span className="text-xl text-cyan-300">{suffix}</span>
          </p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${a.box} ${a.glow}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full w-full rounded-full bg-gradient-to-r ${a.bar} opacity-80 transition-transform duration-1000`} style={{ transform: inView ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }} />
      </div>
    </div>
  );
};

