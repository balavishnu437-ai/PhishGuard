import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, ScanLine } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/scanner", label: "URL Scanner" },
  { to: "/threat-intel", label: "Threat Intel", live: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "Scan History" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass border-b border-white/5 py-3" : "border-b border-transparent py-5"
      }`}
    >
      <nav className="section-pad flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-glow-cyan transition group-hover:scale-105">
            <Shield className="h-5 w-5 text-cyan-300" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-blink rounded-full bg-emerald-400" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Phish
            <span className="text-gradient">Guard</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-400 hover:text-cyan-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.55 }}
                        className="absolute inset-0 -z-10 rounded-full border border-cyan-400/25 bg-cyan-400/10 shadow-glow-cyan"
                      />
                    )}
                    {l.label}
                    {l.live && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/scanner" data-testid="nav-cta" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            <ScanLine className="h-4 w-4" />
            Scan URL
          </Link>
          <button
            data-testid="mobile-menu-button"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="section-pad flex flex-col gap-1 pb-5 pt-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "border border-cyan-400/25 bg-cyan-400/10 text-white shadow-glow-cyan"
                          : "text-slate-400 hover:bg-white/5 hover:text-cyan-200"
                      }`
                    }
                  >
                    {l.label}
                    {l.live && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

