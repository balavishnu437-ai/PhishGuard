import { Radar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyState = ({ icon: Icon = Radar, title, description, actionLabel, actionTo = "/scanner", testId = "empty-state" }) => (
  <div data-testid={testId} className="glass flex flex-col items-center rounded-2xl px-8 py-14 text-center">
    <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-glow-cyan">
      <Icon className="h-7 w-7 text-cyan-300" />
      <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-2xl bg-cyan-400/20 blur-xl" />
    </span>
    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{description}</p>}
    {actionLabel && (
      <Link to={actionTo} data-testid={`${testId}-action`} className="btn-primary mt-6">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

