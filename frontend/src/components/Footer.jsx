import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin, Mail, MapPin, Cpu } from "lucide-react";

const PRODUCT = [
  { to: "/scanner", label: "URL Scanner" },
  { to: "/threat-intel", label: "Threat Intel Center" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "Scan History" },
];

const COMPANY = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/", label: "Home" },
];

export const Footer = () => (
  <footer data-testid="footer" className="relative mt-24 border-t border-white/5 bg-night-800/60">
    <div className="section-pad grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-glow-cyan">
            <Shield className="h-5 w-5 text-cyan-300" />
          </span>
          <span className="font-display text-lg font-semibold text-white">
            Phish<span className="text-gradient">Guard</span>
          </span>
        </Link>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
          Intelligent phishing URL detection that flags threats before they compromise your security.
        </p>
        <div className="mt-5 flex gap-3">
          {[
            { icon: Github, label: "GitHub" },
            { icon: Twitter, label: "Twitter" },
            { icon: Linkedin, label: "LinkedIn" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              data-testid={`footer-social-${label.toLowerCase()}`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Product</h4>
        <ul className="mt-4 space-y-2.5">
          {PRODUCT.map((l) => (
            <li key={l.to}>
              <Link to={l.to} data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-400 transition hover:text-cyan-200">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Company</h4>
        <ul className="mt-4 space-y-2.5">
          {COMPANY.map((l) => (
            <li key={l.to}>
              <Link to={l.to} data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-400 transition hover:text-cyan-200">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Contact</h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-400">
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-cyan-300" />
            support@phishguard.io
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-cyan-300" />
            Remote · Global
          </li>
          <li className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-cyan-300" />
            Model PG-Heur v2.1
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/5">
      <div className="section-pad flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
        <p data-testid="footer-copyright">© {new Date().getFullYear()} PhishGuard. All rights reserved.</p>
        <p>
          Heuristic threat intelligence · <span className="text-cyan-300/80">Real-time verdicts</span>
        </p>
      </div>
    </div>
  </footer>
);

