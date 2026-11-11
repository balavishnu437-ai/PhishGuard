import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

export const VERDICT_THEME = {
  safe: {
    label: "Legitimate",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    chip: "border-emerald-400/30 bg-emerald-400/10",
    icon: ShieldCheck,
    bar: "bg-emerald-400",
    stroke: "#34d399",
    ring: "shadow-glow-emerald",
  },
  suspicious: {
    label: "Suspicious",
    dot: "bg-amber-400",
    text: "text-amber-300",
    chip: "border-amber-400/30 bg-amber-400/10",
    icon: AlertTriangle,
    bar: "bg-amber-400",
    stroke: "#fbbf24",
    ring: "shadow-[0_0_28px_rgba(251,191,36,0.3)]",
  },
  phishing: {
    label: "Phishing",
    dot: "bg-red-400",
    text: "text-red-300",
    chip: "border-red-400/30 bg-red-400/10",
    icon: ShieldAlert,
    bar: "bg-red-400",
    stroke: "#ff4d6d",
    ring: "shadow-glow-red",
  },
};

export const VerdictBadge = ({ verdict, className = "" }) => {
  const t = VERDICT_THEME[verdict] || VERDICT_THEME.suspicious;
  return (
    <span
      data-testid={`verdict-badge-${verdict}`}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${t.chip} ${t.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {t.label}
    </span>
  );
};

