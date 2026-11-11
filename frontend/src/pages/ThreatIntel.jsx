import { useState, useEffect } from "react";
import { Shield, Radio, Activity, Target, Zap, Layers, RefreshCw } from "lucide-react";
import { PageShell, Reveal } from "@/components/Reveal";
import { LiveThreatMap } from "@/components/LiveThreatMap";
import { ThreatRiskMeter } from "@/components/ThreatRiskMeter";
import { URLForensics } from "@/components/URLForensics";
import { ThreatIntelCards } from "@/components/ThreatIntelCards";
import { SecurityRecommendations } from "@/components/SecurityRecommendations";
import { ThreatHistoryTimeline } from "@/components/ThreatHistoryTimeline";
import { getThreatIntel, getScans } from "@/lib/api";

const ThreatIntel = () => {
  const [intelData, setIntelData] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intelRes, scansRes] = await Promise.all([
        getThreatIntel().catch(() => null),
        getScans({ limit: 10 }).catch(() => []),
      ]);
      if (intelRes) setIntelData(intelRes);
      if (scansRes) setScans(scansRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Sample forensics for the forensics showcase module
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

        {/* Features 2 & 3: Threat Risk Meter & URL Forensics */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <Reveal delay={0.2} className="lg:col-span-2">
            <ThreatRiskMeter initialScore={88} interactive={true} title="Threat Risk Meter" />
          </Reveal>
          <Reveal delay={0.25} className="lg:col-span-3">
            <URLForensics forensics={sampleForensics} url="http://secure-auth.paypal-verification.top/login.php" />
          </Reveal>
        </div>

        {/* Feature 4: Threat Intelligence Technique Cards (MITRE ATT&CK) */}
        <Reveal delay={0.3} className="mt-8">
          <ThreatIntelCards techniques={intelData?.attack_techniques || []} />
        </Reveal>

        {/* Features 5 & 6: Security Recommendations & Threat History Timeline */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.35}>
            <SecurityRecommendations
              recommendations={sampleRecommendations}
              verdict="phishing"
              riskScore={88}
            />
          </Reveal>
          <Reveal delay={0.4}>
            <ThreatHistoryTimeline scans={scans} maxItems={8} />
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

