"""
PhishGuard - Intelligent Phishing Link & URL Detection System
Authors: Bala Vishnu & Diyanezwaran
Module: streamlit_app.py
Description: Modern, enterprise-grade Cybersecurity Dashboard for PhishGuard.
"""

import time
import pandas as pd
import streamlit as st
from predictor import Predictor
from utils import normalize_url, is_valid_url

# Configure Page
st.set_page_config(
    page_title="PhishGuard - AI Phishing Link Detector",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-Tech Cyber Theme CSS
st.markdown("""
<style>
    /* Global Styles */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    code, pre {
        font-family: 'JetBrains Mono', monospace !important;
    }
    
    /* Header Gradient & Badges */
    .phishguard-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 24px 28px;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
    }
    
    .phishguard-title {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 6px;
    }
    
    .phishguard-subtitle {
        color: #94a3b8;
        font-size: 1.05rem;
        margin-bottom: 12px;
    }
    
    .team-badge {
        display: inline-block;
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 20px;
        padding: 4px 14px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    /* Result Cards */
    .verdict-card {
        border-radius: 12px;
        padding: 20px 24px;
        margin-top: 15px;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.25);
    }
    
    .verdict-safe {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%);
        border: 1px solid #10b981;
    }
    
    .verdict-danger {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(185, 28, 28, 0.08) 100%);
        border: 1px solid #ef4444;
    }
    
    .verdict-warning {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 100%);
        border: 1px solid #f59e0b;
    }

    .metric-container {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 14px 18px;
        text-align: center;
    }
    
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f8fafc;
    }
    
    .metric-label {
        font-size: 0.82rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_resource
def load_predictor():
    return Predictor()


try:
    predictor = load_predictor()
except Exception as e:
    st.error(f"Error loading PhishGuard core engine: {e}")
    st.stop()

# ==========================================
# SIDEBAR
# ==========================================
with st.sidebar:
    st.markdown("## 🛡️ **PhishGuard**")
    st.markdown("*Next-Gen AI Phishing URL Scanner*")
    
    st.markdown("---")
    
    app_mode = st.radio(
        "Navigation Mode",
        [
            "🔍 Single URL Scanner",
            "📂 Batch URL Scanner",
            "🧠 AI Model & Safeguards",
            "👨‍💻 About & Authors"
        ]
    )

    st.markdown("---")
    st.markdown("### 🧪 Quick Samples")
    sample_choice = st.selectbox(
        "Load sample URL:",
        [
            "-- Select a sample --",
            "https://www.google.com",
            "https://github.com",
            "https://www.paypal.com",
            "http://bit.ly/3xyzSampleShortener",
            "http://192.168.1.1/admin-login-bank",
            "http://secure-update-verify-account.bank-login.com"
        ]
    )

    st.markdown("---")
    st.markdown("### 👨‍💻 Project Authors")
    st.markdown("**Bala Vishnu** & **Diyanezwaran**")
    st.caption("Engineered for advanced cybersecurity protection.")


# ==========================================
# HEADER HERO SECTION
# ==========================================
st.markdown("""
<div class="phishguard-hero">
    <div class="phishguard-title">🛡️ PhishGuard</div>
    <div class="phishguard-subtitle">Real-Time Artificial Intelligence URL Threat Intelligence & Phishing Link Detection</div>
    <div class="team-badge">👨‍💻 Designed & Developed by Bala Vishnu & Diyanezwaran</div>
</div>
""", unsafe_allow_html=True)


# ==========================================
# 1. SINGLE URL SCANNER
# ==========================================
if app_mode == "🔍 Single URL Scanner":
    st.markdown("### 🔍 URL Threat Diagnostic Scanner")
    st.write("Analyze any website link in real time using our trained 51-feature Decision Tree Pipeline and heuristic safety engine.")

    # Determine default input value
    default_url = "" if sample_choice == "-- Select a sample --" else sample_choice

    col_input, col_btn = st.columns([5, 1])
    with col_input:
        target_url = st.text_input(
            "Enter URL to inspect:",
            value=default_url,
            placeholder="e.g. https://account-verification-paypal.com/login",
            label_visibility="collapsed"
        )
    with col_btn:
        scan_pressed = st.button("🚀 Analyze URL", use_container_width=True, type="primary")

    if scan_pressed or (target_url and sample_choice != "-- Select a sample --"):
        if not target_url.strip():
            st.warning("Please enter a URL to scan.")
        else:
            with st.spinner("🕵️ Running deep lexical extraction, live DNS check, and HTML heuristic verification..."):
                result = predictor.predict(target_url)

            if not result.get("valid", True):
                st.error(f"⚠️ Scan Failed: {result.get('error')}")
            else:
                is_phishing = result["prediction"] == 1
                overridden = result["overridden"]
                confidence = result["confidence_percent"]
                risk_info = result["risk_info"]

                # Card styling
                if is_phishing and overridden:
                    card_class = "verdict-warning"
                    icon = "⚠️"
                    headline = "SUSPICIOUS / UNTRUSTED LINK"
                elif is_phishing:
                    card_class = "verdict-danger"
                    icon = "🚨"
                    headline = "PHISHING THREAT DETECTED"
                else:
                    card_class = "verdict-safe"
                    icon = "✅"
                    headline = "VERIFIED LEGITIMATE WEBSITE"

                st.markdown(f"""
                <div class="verdict-card {card_class}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="margin: 0; color: {risk_info['color']}; font-weight: 800;">
                                {icon} {headline}
                            </h2>
                            <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 1rem;">
                                <strong>Assessed Target:</strong> <code>{result['url']}</code>
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <span style="background: {risk_info['color']}; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.9rem;">
                                {risk_info['level']}
                            </span>
                        </div>
                    </div>
                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); color: #e2e8f0;">
                        💡 <strong>Recommendation:</strong> {risk_info['recommendation']}
                    </div>
                </div>
                """, unsafe_allow_html=True)

                if result.get("warning"):
                    st.warning(result["warning"])

                # KPI Metrics
                c1, c2, c3, c4 = st.columns(4)
                with c1:
                    st.markdown(f"""
                    <div class="metric-container">
                        <div class="metric-value" style="color: {risk_info['color']};">{result['verdict'].split()[0]}</div>
                        <div class="metric-label">Model Verdict</div>
                    </div>
                    """, unsafe_allow_html=True)
                with c2:
                    st.markdown(f"""
                    <div class="metric-container">
                        <div class="metric-value">{confidence:.1f}%</div>
                        <div class="metric-label">Confidence Score</div>
                    </div>
                    """, unsafe_allow_html=True)
                with c3:
                    st.markdown(f"""
                    <div class="metric-container">
                        <div class="metric-value">{result['analysis_time_ms']} ms</div>
                        <div class="metric-label">Inference Speed</div>
                    </div>
                    """, unsafe_allow_html=True)
                with c4:
                    st.markdown(f"""
                    <div class="metric-container">
                        <div class="metric-value">{"YES" if overridden else "NO"}</div>
                        <div class="metric-label">Safety Override</div>
                    </div>
                    """, unsafe_allow_html=True)

                st.markdown("### 📊 Deep Diagnostic Analysis")

                tab_summary, tab_lexical, tab_html, tab_security, tab_raw = st.tabs([
                    "📌 Category Summary",
                    "🔗 Lexical Structure",
                    "📄 Webpage & Content",
                    "⚠️ Threat Indicators",
                    "🧪 All 51 Features (Raw)"
                ])

                summary = result["summary"]

                with tab_summary:
                    sc1, sc2 = st.columns(2)
                    with sc1:
                        st.markdown("#### 🌐 Lexical & Domain Profile")
                        lex_df = pd.DataFrame(list(summary["url_lexical"].items()), columns=["Metric", "Value"])
                        st.dataframe(lex_df, hide_index=True, use_container_width=True)

                        st.markdown("#### 🛡️ Domain Reputation")
                        dom_df = pd.DataFrame(list(summary["domain_reputation"].items()), columns=["Metric", "Value"])
                        st.dataframe(dom_df, hide_index=True, use_container_width=True)

                    with sc2:
                        st.markdown("#### 📄 Page Content Signals")
                        cnt_df = pd.DataFrame(list(summary["content_analysis"].items()), columns=["Metric", "Value"])
                        st.dataframe(cnt_df, hide_index=True, use_container_width=True)

                        st.markdown("#### ⚠️ Sensitive Security Signals")
                        sec_df = pd.DataFrame(list(summary["security_indicators"].items()), columns=["Metric", "Value"])
                        st.dataframe(sec_df, hide_index=True, use_container_width=True)

                with tab_lexical:
                    st.write("Detailed lexical metrics extracted directly from the URL string:")
                    lex_features = {
                        k: v for k, v in result["features"].items()
                        if k in [
                            "URLLength", "DomainLength", "IsDomainIP", "TLD", "TLDLength",
                            "NoOfSubDomain", "HasObfuscation", "NoOfObfuscatedChar", "ObfuscationRatio",
                            "NoOfLettersInURL", "LetterRatioInURL", "NoOfDegitsInURL", "DegitRatioInURL",
                            "NoOfEqualsInURL", "NoOfQMarkInURL", "NoOfAmpersandInURL",
                            "NoOfOtherSpecialCharsInURL", "SpacialCharRatioInURL", "IsHTTPS"
                        ]
                    }
                    st.json(lex_features)

                with tab_html:
                    st.write("Live structural HTML properties retrieved during inspection:")
                    html_features = {
                        k: v for k, v in result["features"].items()
                        if k in [
                            "FetchFailed", "LineOfCode", "LargestLineLength", "HasTitle",
                            "DomainTitleMatchScore", "URLTitleMatchScore", "HasFavicon", "Robots",
                            "IsResponsive", "NoOfURLRedirect", "NoOfSelfRedirect", "HasDescription",
                            "NoOfPopup", "NoOfiFrame", "NoOfImage", "NoOfCSS", "NoOfJS",
                            "NoOfSelfRef", "NoOfEmptyRef", "NoOfExternalRef"
                        ]
                    }
                    st.json(html_features)

                with tab_security:
                    st.write("Phishing-specific threat indicators (credential theft, spoofing, sensitive forms):")
                    sec_features = {
                        k: v for k, v in result["features"].items()
                        if k in [
                            "HasExternalFormSubmit", "HasSocialNet", "HasSubmitButton",
                            "HasHiddenFields", "HasPasswordField", "Bank", "Pay", "Crypto",
                            "HasCopyrightInfo"
                        ]
                    }
                    st.json(sec_features)

                with tab_raw:
                    st.write("Complete 51-feature array passed to the Scikit-learn Pipeline:")
                    st.json(result["features"])


# ==========================================
# 2. BATCH URL SCANNER
# ==========================================
elif app_mode == "📂 Batch URL Scanner":
    st.markdown("### 📂 Multi-URL Batch Scanner")
    st.write("Scan batches of URLs to audit email campaigns, logs, or domain lists.")

    sample_batch = (
        "https://www.google.com\n"
        "https://www.github.com\n"
        "http://bit.ly/fake-bank-login\n"
        "http://192.168.0.1/verify\n"
        "https://www.wikipedia.org"
    )

    batch_input = st.text_area(
        "Enter URLs (one per line):",
        value=sample_batch,
        height=160
    )

    if st.button("⚡ Run Batch Scan", type="primary"):
        urls = [line.strip() for line in batch_input.splitlines() if line.strip()]
        if not urls:
            st.warning("Please provide at least one URL.")
        else:
            with st.spinner(f"Auditing {len(urls)} URLs..."):
                results = predictor.predict_batch(urls)

            total = len(results)
            phishing_count = sum(1 for r in results if r.get("prediction") == 1)
            legit_count = total - phishing_count

            # Summary Metrics
            b1, b2, b3 = st.columns(3)
            with b1:
                st.metric("Total Scanned", total)
            with b2:
                st.metric("Legitimate Links", legit_count)
            with b3:
                st.metric("Phishing / Suspicious Links", phishing_count, delta=f"{phishing_count} threats", delta_color="inverse")

            # Table display
            table_data = []
            for r in results:
                table_data.append({
                    "URL": r["url"],
                    "Verdict": r["verdict"],
                    "Confidence": f"{r['confidence_percent']:.1f}%",
                    "Risk Level": r["risk_info"]["level"],
                    "Override": "Yes" if r["overridden"] else "No",
                    "Latency (ms)": r["analysis_time_ms"]
                })

            df_results = pd.DataFrame(table_data)
            st.dataframe(df_results, use_container_width=True)

            # CSV Download
            csv_data = df_results.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Download Audit Report (CSV)",
                data=csv_data,
                file_name="phishguard_audit_report.csv",
                mime="text/csv"
            )


# ==========================================
# 3. AI MODEL & SAFEGUARDS
# ==========================================
elif app_mode == "🧠 AI Model & Safeguards":
    st.markdown("### 🧠 PhishGuard Machine Learning Architecture")
    st.write("PhishGuard couples a trained Decision Tree Classifier Pipeline with heuristic threat mitigation rules.")

    st.markdown("""
    #### ⚙️ End-to-End Pipeline
    ```
      Target URL
          │
          ▼
      Feature Extraction (51 Lexical & Live HTML Features)
          │
          ▼
      Missing Value Imputation (SimpleImputer)
          │
          ▼
      Categorical Encoding & Normalization (OneHotEncoder + StandardScaler)
          │
          ▼
      Decision Tree Classification (PhiUSIIL Trained Model)
          │
          ▼
      Heuristic Safety Overrides (Shorteners & Offline Domain Verification)
          │
          ▼
      Final Risk Score & Detailed Diagnostic Verdict
    ```
    """)

    st.markdown("#### 🛡️ Defense-in-Depth Safety Overrides")
    st.markdown("""
    Machine Learning models evaluate what they observe. In real-world web environments, malicious actors use evasion techniques that could trick standard models. PhishGuard applies two vital safeguards:
    
    1. **Shortened URL Cloaking Protection**:
       - Attackers frequently abuse services like `bit.ly` or `tinyurl.com` to hide target destination domains.
       - If a shortened URL would otherwise receive a "Legitimate" verdict, PhishGuard overrides it to **Suspicious/Untrusted** to prevent blind redirection.
    
    2. **Dormant / Unreachable Host Verification**:
       - If an attacker's domain is offline, dead, or blocking automated scanners, content-based features return empty (0 forms, 0 images, 0 scripts).
       - Standard classifiers might mistake an empty page for a clean minimal site. PhishGuard flags unreachable hosts so false legitimate verdicts are avoided.
    """)


# ==========================================
# 4. ABOUT & AUTHORS
# ==========================================
elif app_mode == "👨‍💻 About & Authors":
    st.markdown("### 👨‍💻 About PhishGuard")
    st.markdown("""
    **PhishGuard** was conceived and engineered by **Bala Vishnu** and **Diyanezwaran** as a comprehensive, real-time cyber defense solution against phishing, spear-phishing, and credential harvesting campaigns.
    
    #### 👥 Development Team
    - **Bala Vishnu** — AI System Architecture & Model Pipeline
    - **Diyanezwaran** — Cybersecurity Feature Engineering & Security Safeguards

    #### 🌟 Key Capabilities
    - **51-Dimensional Feature Analysis**: Evaluates both URL lexical structure and live webpage HTML DOM.
    - **Enterprise Fast Response**: Sub-second feature extraction and inference latency.
    - **Dual Deployment**: High-performance FastAPI REST API + Interactive Streamlit Analytics Dashboard.
    - **Zero False-Security Heuristics**: Integrated protections against cloaked short links and unreachable decoy hosts.

    #### 📄 License
    Licensed under the **MIT License**. Copyright © 2026 Bala Vishnu & Diyanezwaran.
    """)

# Footer
st.markdown("---")
st.markdown(
    "<div style='text-align: center; color: #64748b; font-size: 0.85rem;'>"
    "🛡️ PhishGuard v2.0 | Developed by <strong>Bala Vishnu & Diyanezwaran</strong> | Built with Python, Scikit-learn, FastAPI & Streamlit"
    "</div>",
    unsafe_allow_html=True
)
