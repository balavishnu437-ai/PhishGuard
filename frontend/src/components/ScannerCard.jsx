import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link2, Radar, ScanLine, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { scanUrl } from "@/lib/api";
import { ResultCard } from "@/components/ResultCard";

const PHASES = [
  { at: 0, label: "Parsing URL structure" },
  { at: 22, label: "Extracting lexical features" },
  { at: 45, label: "Checking host & certificate signals" },
  { at: 68, label: "Matching threat patterns" },
  { at: 86, label: "Scoring risk model" },
];

const VERDICT_LABEL = { safe: "Legitimate", suspicious: "Suspicious", phishing: "Phishing" };

export const ScannerCard = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const pending = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  useEffect(() => {
    if (scanning && progress >= 100 && ready && pending.current) {
      clearInterval(timer.current);
      const r = pending.current;
      pending.current = null;
      setScanning(false);
      setResult(r);
      const fn = r.verdict === "safe" ? toast.success : r.verdict === "phishing" ? toast.error : toast.warning;
      fn(`URL classified as ${VERDICT_LABEL[r.verdict] || r.verdict}`);
    }
  }, [progress, scanning, ready]);

  const reset = () => {
    setUrl("");
    setResult(null);
    setProgress(0);
    setError("");
    setReady(false);
    pending.current = null;
  };

  const start = async (e) => {
    e.preventDefault();
    if (scanning) return;
    let value = url.trim();
    if (!value) {
      setError("Please enter a URL to scan, e.g. https://example.com");
      return;
    }
    // Auto-prepend https:// if no protocol is given
    if (!/^[a-z][a-z\d+.-]*:\/\//i.test(value)) {
      value = "https://" + value;
    }
    const bare = value.replace(/^[a-z][a-z\d+.-]*:\/\//i, "").split("/")[0].split(":")[0];
    if (!bare || (!bare.includes(".") && bare !== "localhost")) {
      setError("Please enter a valid URL, e.g. https://example.com");
      return;
    }
    setError("");
    setResult(null);
    setProgress(0);
    setReady(false);
    pending.current = null;
    setScanning(true);
    timer.current = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 6 + 2.5));
    }, 95);
    try {
      pending.current = await scanUrl(value);
      setReady(true);
    } catch (err) {
      clearInterval(timer.current);
      setScanning(false);
      setProgress(0);
      const msg = err?.response?.data?.detail || "Scan failed — please check the URL and try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  if (result) {
    return <ResultCard result={result} onReset={reset} />;
  }

  const phase = [...PHASES].reverse().find((p) => progress >= p.at) || PHASES[0];

  return (
    <div data-testid="scanner-card" className="glass glow-border rounded-3xl p-6 sm:p-8">
      <form onSubmit={start} data-testid="scan-form">
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              data-testid="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/login"
              autoComplete="off"
              spellCheck="false"
              className="neon-field !py-4 pl-11 pr-4 text-base"
              aria-label="URL to scan"
            />
          </div>
          <button
            type="submit"
            data-testid="scan-button"
            disabled={scanning}
            className="btn-primary relative overflow-hidden !px-7 !py-4 disabled:cursor-wait disabled:opacity-70"
          >
            <ScanLine className="h-4 w-4" />
            {scanning ? "Scanning…" : "Scan URL"}
            {scanning && <span className="absolute inset-0 -z-0 animate-pulse bg-cyan-400/10" />}
          </button>
        </div>
        {error && (
          <p data-testid="scan-error" className="mt-3 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      {scanning && (
        <div data-testid="scanning-progress" className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-24 w-24 shrink-0 rounded-full border border-cyan-400/20 bg-night/70 sm:mx-0">
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="radar-sweep absolute inset-0 rounded-full" />
            <Radar className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-cyan-300" />
            <span className="absolute left-7 top-8 h-1.5 w-1.5 animate-ping rounded-full bg-red-400/80" />
            <span className="absolute bottom-8 right-7 h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400/70" style={{ animationDelay: "0.7s" }} />
          </div>
          <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-400" data-testid="scan-phase-label">{phase.label}…</span>
              <span className="font-semibold text-cyan-300" data-testid="scan-progress-percent">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-glow-cyan transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-500 sm:grid-cols-3">
              {PHASES.map((p) => (
                <li key={p.label} className={`flex items-center gap-1.5 ${progress >= p.at ? "text-emerald-300" : ""}`}>
                  <CheckCircle2 className={`h-3 w-3 ${progress >= p.at ? "text-emerald-400" : "text-slate-600"}`} />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!scanning && (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          No sign-up required · 16 detection signals · Verdict in seconds
        </p>
      )}
    </div>
  );
};

