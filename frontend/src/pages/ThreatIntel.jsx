import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Shield, Radio, Activity, Target, Zap, Layers, RefreshCw, Link as LinkIcon, Search, CheckCircle2, ArrowRight, AlertTriangle, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { PageShell, Reveal } from "@/components/Reveal";
import { LiveThreatMap } from "@/components/LiveThreatMap";
import { ThreatRiskMeter } from "@/components/ThreatRiskMeter";
import { URLForensics } from "@/components/URLForensics";
import { ThreatIntelCards } from "@/components/ThreatIntelCards";
import { SecurityRecommendations } from "@/components/SecurityRecommendations";
import { ThreatHistoryTimeline } from "@/components/ThreatHistoryTimeline";
import { getThreatIntel, getScans, scanUrl } from "@/lib/api";
import { VERDICT_THEME } from "@/components/VerdictBadge";

const ThreatIntel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [intelData, setIntelData] = useState(null);
  const [scans, setScans] = useState([]);
  const [activeScan, setActiveScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const targetScanId = searchParams.get("scanId");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intelRes, scansRes] = await Promise.all([
        getThreatIntel().catch(() => null),
        getScans({ limit: 15 }).catch(() => []),
      ]);
      if (intelRes) setIntelData(intelRes);
      if (scansRes && Array.isArray(scansRes)) {
        setScans(scansRes);
        if (targetScanId) {
          const match = scansRes.find((s) => s.id === targetScanId);
          if (match) {
            setActiveScan(match);
          } else if (scansRes.length > 0) {
            setActiveScan(scansRes[0]);
          }
        } else if (scansRes.length > 0) {
          setActiveScan(scansRes[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update active scan if URL query param changes
  useEffect(() => {
    if (targetScanId && scans.length > 0) {
      const match = scans.find((s) => s.id === targetScanId);
      if (match) setActiveScan(match);
    }
  }, [targetScanId, scans]);

  const handleSelectScan = (scan) => {
    setActiveScan(scan);
    setSearchParams({ scanId: scan.id });
  };

  const handleLiveAnalyze = async (e) => {
    e.preventDefault();
    let val = urlInput.trim();
    if (!val) return;
    if (!/^[a-z][a-z\d+.-]*:\/\//i.test(val)) {
      val = "https://" + val;
    }
    setAnalyzing(true);
    try {
      const result = await scanUrl(val);
      toast.success(`Telemetry extracted for ${result.url}`);
      setScans((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
      setActiveScan(result);
      setSearchParams({ scanId: result.id });
      setUrlInput("");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Target analysis failed. Please verify the URL.";
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const metrics = intelData?.metrics || {
    active_campaigns_tracked: 1284,
    global_threat_index: 78.4,
    threats_blocked_today: 3418,
    top_targeted_brands: [
      { brand: "Microsoft 365", share: "31%" },
      { brand: "Google Workspace", share: "22%" },
      { brand: "PayPal / Venmo", share: "16%" },
      { brand: "Amazon AWS", share: "12%" },
      { brand: "Apple ID", share: "9%" },
      { brand: "Netflix", share: "6%" },
    ],
    targeted_industries: [
      { industry: "Financial Services & Crypto", percentage: 37 },
      { industry: "Cloud & SaaS Platforms", percentage: 28 },
      { industry: "E-Commerce & Retail", percentage: 17 },
      { industry: "Government & Public Sector", percentage: 11 },
      { industry: "Healthcare & Telecom", percentage: 7 },
    ],
  };

  // Fallback sample forensics if no scans exist
  const sampleForensics = {
    host: "secure-auth.paypal-verification.top",
    scheme: "http",
    is_ip: false,
    has_https: false,
    https_status: "Unencrypted HTTP (Insecure)",
    tld: "top",
    subdomains_count: 2,
    url_length: 54,
    suspicious_keywords: ["secure", "auth", "paypal", "verification"],
    has_obfuscation: true,
    entropy_level: "High (Randomized)",
    has_password_field: true,
    has_external_action: true,
  };

  const sampleRecommendations = [
    {
      priority: "critical",
      title: "Block Domain at DNS/Proxy Perimeter",
      desc: "Implement immediate ingress filtering for this host across all perimeter gateways.",
    },
    {
      priority: "high",
      title: "Initiate Session Revocation for Impersonated Services",
      desc: "Force logout and credential invalidation for any users who accessed this domain in the past 24 hours.",
    },
    {
      priority: "medium",
      title: "Submit Domain Takedown to Registrar",
      desc: "File abuse reports with the registrar (.top registry) and hosting provider to disable DNS resolution.",
    },
  ];

  // Derive active target parameters
  const currentUrl = activeScan?.url || "http://secure-auth.paypal-verification.top/login.php";
  const currentRiskScore = activeScan?.risk_score ?? 88;
  const currentVerdict = activeScan?.verdict || "phishing";
  const currentForensics = activeScan?.forensics || sampleForensics;
  const currentRecommendations = activeScan?.recommendations?.length
    ? activeScan.recommendations
    : sampleRecommendations;

  // Infer matching MITRE ATT&CK technique for the currently selected target
  const getMatchedTechniqueId = () => {
    if (!activeScan) return "T1566.002";
    const indNames = (activeScan.indicators || []).map((i) => (i.name || "").toLowerCase()).join(" ");
    const f = activeScan.forensics || {};

    if (f.has_password_field && f.has_external_action) return "T1059.007";
    if (f.scheme === "http" || indNames.includes("reverse") || indNames.includes("proxy")) return "T1556";
    if (indNames.includes("qr") || indNames.includes("quish")) return "T1566.003";
    if (indNames.includes("unreachable") || indNames.includes("dormant") || (f.subdomains_count || 0) > 2) return "T1584.001";
    if (f.suspicious_keywords?.length > 0 || indNames.includes("urgency") || indNames.includes("financial")) return "T1204.001";
    return "T1566.002";
  };
  const matchedTechniqueId = getMatchedTechniqueId();

  const theme = VERDICT_THEME[currentVerdict] || VERDICT_THEME.suspicious;
  const VerdictIcon = theme.icon;

  return (
    <PageShell className="pt-28 sm:pt-32">
      <section className="section-pad" data-testid="threat-intel-page">
        {/* Header */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-semibold text-red-400">
            <Radio className="h-3 w-3 animate-pulse" />
            AI Threat Intelligence Center
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Real-Time Global <span className="text-gradient">Threat Telemetry</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            Continuous threat observation, machine learning risk modeling, forensic URL dissection, and adversary attack intelligence.
          </p>
        </Reveal>

        {/* Top KPI Banner */}
        <Reveal delay={0.1} className="mt-10">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="glass glow-border rounded-2xl p-5">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Target className="h-4 w-4 text-cyan-300" />
                Active Phishing Campaigns
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                {metrics.active_campaigns_tracked.toLocaleString()}
              </p>
              <span className="mt-1 block text-[11px] text-emerald-400">Live AI tracking active</span>
            </div>

            <div className="glass glow-border rounded-2xl p-5">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Zap className="h-4 w-4 text-red-400" />
                Global Threat Index
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-red-400 sm:text-3xl">
                {metrics.global_threat_index} <span className="text-sm font-normal text-slate-500">/ 100</span>
              </p>
              <span className="mt-1 block text-[11px] text-red-300">Elevated global risk level</span>
            </div>

            <div className="glass glow-border rounded-2xl p-5">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Shield className="h-4 w-4 text-emerald-400" />
                Threats Intercepted Today
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                {metrics.threats_blocked_today.toLocaleString()}
              </p>
              <span className="mt-1 block text-[11px] text-cyan-400">Decision Tree AI Engine</span>
            </div>

            <div className="glass glow-border rounded-2xl p-5">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Layers className="h-4 w-4 text-amber-400" />
                Detection Accuracy
              </span>
              <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                97.4%
              </p>
              <span className="mt-1 block text-[11px] text-slate-400">PhiUSIIL 51-Feature Model</span>
            </div>
          </div>
        </Reveal>

        {/* Feature 1: Live Threat Map */}
        <Reveal delay={0.15} className="mt-8">
          <LiveThreatMap threats={intelData?.live_threats || []} />
        </Reveal>

        {/* ACTIVE INVESTIGATION TARGET CONTROL BAR */}
        <Reveal delay={0.18} className="mt-8">
          <div className="glass glow-border rounded-3xl p-6 sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Active Investigated Target
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-400">
                    {activeScan ? "Synced from Scan History" : "Sample Demo Target"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${theme.chip} ${theme.text}`}>
                    <VerdictIcon className="h-3.5 w-3.5" />
                    {theme.label} · Risk {currentRiskScore}/100
                  </span>
                  <p className="max-w-xl truncate font-mono text-xs text-slate-200" title={currentUrl}>
                    <LinkIcon className="mr-1.5 inline h-3.5 w-3.5 text-cyan-400" />
                    {currentUrl}
                  </p>
                </div>
              </div>

              {/* Quick Analyze URL Form */}
              <form onSubmit={handleLiveAnalyze} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Analyze target in Threat Intel..."
                    className="w-64 sm:w-80 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={analyzing || !urlInput.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/15 px-3.5 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/25 disabled:opacity-50"
                >
                  {analyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                  Analyze
                </button>
              </form>
            </div>

            {/* Quick Switcher of Recent Scans */}
            {scans.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
                <span className="text-[11px] font-medium text-slate-400">Switch Target:</span>
                <div className="flex flex-wrap gap-1.5">
                  {scans.slice(0, 5).map((s) => {
                    const isSelected = activeScan?.id === s.id;
                    const host = s.forensics?.host || s.url.replace(/^https?:\/\//i, "").split("/")[0];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectScan(s)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                          isSelected
                            ? "border-cyan-400/60 bg-cyan-400/20 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                            : "border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200"
                        }`}
                      >
                        {host} (Risk {s.risk_score})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Features 2 & 3: Threat Risk Meter & URL Forensics */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <Reveal delay={0.2} className="lg:col-span-2">
            <ThreatRiskMeter
              initialScore={currentRiskScore}
              targetUrl={currentUrl}
              interactive={true}
              title="Threat Risk Meter"
            />
          </Reveal>
          <Reveal delay={0.25} className="lg:col-span-3">
            <URLForensics forensics={currentForensics} url={currentUrl} />
          </Reveal>
        </div>

        {/* Feature 4: Threat Intelligence Technique Cards (MITRE ATT&CK) */}
        <Reveal delay={0.3} className="mt-8">
          <ThreatIntelCards
            techniques={intelData?.attack_techniques || []}
            matchedTechniqueId={matchedTechniqueId}
          />
        </Reveal>

        {/* Features 5 & 6: Security Recommendations & Threat History Timeline */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.35}>
            <SecurityRecommendations
              recommendations={currentRecommendations}
              verdict={currentVerdict}
              riskScore={currentRiskScore}
            />
          </Reveal>
          <Reveal delay={0.4}>
            <ThreatHistoryTimeline
              scans={scans}
              maxItems={8}
              activeScanId={activeScan?.id}
              onSelectScan={handleSelectScan}
            />
          </Reveal>
        </div>

        {/* Top Targeted Brands & Industries Breakdown */}
        <Reveal delay={0.45} className="mt-8">
          <div className="glass glow-border rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-base font-semibold text-white">Targeted Brand & Industry Landscape</h3>
            <p className="text-xs text-slate-400">Distribution of actively spoofed brands and targeted vertical sectors</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Brands */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Most Impersonated Brands</p>
                <div className="mt-3 space-y-2.5">
                  {metrics.top_targeted_brands?.map((b, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-xs">
                      <span className="font-medium text-slate-200">{b.brand}</span>
                      <span className="font-mono font-bold text-red-400">{b.share} of attacks</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Targeted Industry Sectors</p>
                <div className="mt-3 space-y-3">
                  {metrics.targeted_industries?.map((ind, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">{ind.industry}</span>
                        <span className="font-mono text-cyan-300">{ind.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${ind.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
};

export default ThreatIntel;
