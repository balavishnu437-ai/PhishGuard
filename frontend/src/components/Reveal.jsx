import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 28 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.65, delay, ease: [0.21, 0.65, 0.35, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageShell = ({ children, className = "" }) => (
  <motion.main
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.main>
);

export const SectionHeading = ({ eyebrow, title, subtitle, center = false }) => (
  <Reveal className={center ? "text-center" : ""}>
    {eyebrow && (
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">{eyebrow}</p>
    )}
    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
    {subtitle && <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
  </Reveal>
);

