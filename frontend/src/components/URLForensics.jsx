import { ShieldCheck, ShieldAlert, Lock, Unlock, Server, Hash, FileCode, Search, AlertCircle } from "lucide-react";

export const URLForensics = ({ forensics = {}, url = "" }) => {
  if (!forensics || Object.keys(forensics).length === 0) {
    return null;
  }

  const {
    host = "Unknown",
    scheme = "https",
    is_ip = false,
    has_https = true,
    https_status = "TLS/HTTPS Encrypted",
    tld = "com",
    subdomains_count = 0,
    url_length = (url || "").length,
    suspicious_keywords = [],
    has_obfuscation = false,
    entropy_level = "Normal",
    has_password_field = false,
    has_external_action = false,
  } = forensics;

  const cards = [
    {
      title: "Host & Domain Structure",
      icon: Server,
      badge: is_ip ? "Raw IP Detected" : "Standard Domain",
      badgeColor: is_ip ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      items: [
        { label: "Host Name", value: host || "Unknown", mono: true },
        { label: "Top-Level Domain (TLD)", value: tld ? `.${tld}` : "N/A" },
        { label: "Subdomain Depth", value: `${subdomains_count || 0} level(s)` },
        { label: "Host Length", value: `${(host || "").length} characters` },
      ],
    },
    {
      title: "Transport & Encryption",
      icon: has_https ? Lock : Unlock,
      badge: has_https ? "HTTPS Secure" : "Unencrypted HTTP",
      badgeColor: has_https ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400",
      items: [
        { label: "Protocol", value: scheme.toUpperCase() },
        { label: "Encryption State", value: https_status },
        { label: "Cleartext Transmission", value: has_https ? "No (Encrypted)" : "Yes (High Risk)", highlight: !has_https },
        { label: "Credential Safety", value: has_https ? "Transport Protected" : "Exposed to Interception", highlight: !has_https },
      ],
    },
    {
      title: "Lexical & Obfuscation",
      icon: Hash,
      badge: has_obfuscation ? "Obfuscation Detected" : "Clean Syntax",
      badgeColor: has_obfuscation ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
      items: [
        { label: "Full URL Length", value: `${url_length} chars ${url_length > 75 ? "(Long)" : "(Normal)"}` },
        { label: "Randomness Entropy", value: entropy_level },
        { label: "Encoded Characters", value: has_obfuscation ? "Present (% / hex / @)" : "None" },
        { label: "Punycode / Lookalikes", value: host.startsWith("xn--") ? "IDN Homograph" : "Standard ASCII" },
      ],
    },
    {
      title: "Payload & Target Signals",
      icon: FileCode,
      badge: suspicious_keywords.length > 0 ? `${suspicious_keywords.length} Triggers` : "No Triggers",
      badgeColor: suspicious_keywords.length > 0 ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      items: [
        { label: "Suspicious Keywords", value: suspicious_keywords.length > 0 ? suspicious_keywords.join(", ") : "None detected", highlight: suspicious_keywords.length > 0 },
        { label: "Password Input Form", value: has_password_field ? "Present (Credential Intake)" : "Not detected", highlight: has_password_field },
        { label: "External Form Submit", value: has_external_action ? "Yes (Cross-Domain)" : "No (Same Origin)", highlight: has_external_action },
      ],
    },
  ];

  return (
    <div className="glass glow-border rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-white">URL Forensic Breakdown</h3>
          <p className="text-xs text-slate-400">Deep structural dissection of URL attributes and security characteristics</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-400/20">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-semibold text-white">{c.title}</span>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.badgeColor}`}>
                  {c.badge}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {c.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-medium ${item.mono ? "font-mono" : ""} ${item.highlight ? "text-red-400 font-semibold" : "text-slate-200"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

