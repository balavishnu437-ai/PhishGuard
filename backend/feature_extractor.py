"""
PhishGuard - Intelligent Phishing Link & URL Detection System
Authors: Bala Vishnu & Diyanezwaran
Module: feature_extractor.py
Description: Robust 51-feature extraction engine analyzing lexical URL patterns
             and live HTML page structures.
"""

import re
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup
import tldextract

# Initialize offline-capable extractor (uses bundled snapshot, no external socket calls)
_tld_extractor = tldextract.TLDExtract(suffix_list_urls=())


def _safe_extract_tld(url: str, domain: str):
    """
    Safely extracts subdomain, domain, and suffix without network dependency.
    """
    try:
        ext = _tld_extractor(url)
        return ext.subdomain, ext.domain, ext.suffix
    except Exception:
        # Fallback using standard string splitting
        parts = domain.split(".")
        if len(parts) >= 2:
            return ".".join(parts[:-2]), parts[-2], parts[-1]
        return "", domain, ""


def extract_features(url: str, timeout: int = 5) -> dict:
    """
    Extracts all 51 lexical and HTML-based features required by the PhishGuard
    decision tree pipeline, along with the FetchFailed diagnostic flag.
    """
    features = {}

    try:
        # Ensure scheme for proper url parsing
        if not re.match(r"^https?://", url, re.IGNORECASE):
            url_to_parse = "http://" + url
        else:
            url_to_parse = url

        parsed = urlparse(url_to_parse)
        domain = parsed.netloc.lower()

        subdomain, main_domain, tld = _safe_extract_tld(url_to_parse, domain)

        # ==========================================
        # 1. URL LEXICAL FEATURES
        # ==========================================
        features["URLLength"] = len(url)
        features["DomainLength"] = len(domain)

        # IP Address detection
        is_ip = 1 if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", domain) else 0
        features["IsDomainIP"] = is_ip
        features["TLD"] = tld

        features["URLSimilarityIndex"] = 0.0

        # Character continuation rate (longest sequence of identical consecutive characters)
        consecutive_matches = re.findall(r"(.)\1+", url)
        features["CharContinuationRate"] = (
            max([len(x) for x in consecutive_matches], default=0)
        )

        # TLD legitimacy score
        common_tlds = {"com", "org", "net", "edu", "gov", "io", "co", "in"}
        features["TLDLegitimateProb"] = 1.0 if tld in common_tlds else 0.5

        features["URLCharProb"] = len(set(url)) / len(url) if len(url) > 0 else 0.0
        features["TLDLength"] = len(tld)
        features["NoOfSubDomain"] = len(subdomain.split(".")) if subdomain else 0

        # Obfuscation characters
        suspicious_chars = ["@", "%", "-", "_", "~"]
        obfuscated_chars = sum(url.count(c) for c in suspicious_chars)
        features["HasObfuscation"] = 1 if obfuscated_chars > 0 else 0
        features["NoOfObfuscatedChar"] = obfuscated_chars
        features["ObfuscationRatio"] = obfuscated_chars / len(url) if len(url) > 0 else 0.0

        # Letters and digits
        letters = sum(c.isalpha() for c in url)
        digits = sum(c.isdigit() for c in url)
        features["NoOfLettersInURL"] = letters
        features["LetterRatioInURL"] = letters / len(url) if len(url) > 0 else 0.0
        features["NoOfDegitsInURL"] = digits
        features["DegitRatioInURL"] = digits / len(url) if len(url) > 0 else 0.0

        features["NoOfEqualsInURL"] = url.count("=")
        features["NoOfQMarkInURL"] = url.count("?")
        features["NoOfAmpersandInURL"] = url.count("&")

        special_chars = len(re.findall(r"[^a-zA-Z0-9]", url))
        features["NoOfOtherSpecialCharsInURL"] = special_chars
        features["SpacialCharRatioInURL"] = special_chars / len(url) if len(url) > 0 else 0.0
        features["IsHTTPS"] = 1 if parsed.scheme == "https" else 0

        # ==========================================
        # 2. LIVE HTML & WEBPAGE FEATURES
        # ==========================================
        fetch_failed = False
        response = None
        html = ""

        try:
            response = requests.get(
                url_to_parse,
                timeout=timeout,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
            )
            html = response.text
            if not html or not html.strip():
                fetch_failed = True
        except Exception:
            html = ""
            fetch_failed = True

        features["FetchFailed"] = 1 if fetch_failed else 0

        soup = BeautifulSoup(html, "html.parser")
        lines = html.split("\n")

        features["LineOfCode"] = len(lines) if html else 0
        features["LargestLineLength"] = max([len(x) for x in lines], default=0) if html else 0

        # Title analysis
        title = soup.title.text.strip().lower() if soup.title and soup.title.text else ""
        features["HasTitle"] = 1 if title else 0
        domain_word = main_domain.lower() if main_domain else ""
        features["DomainTitleMatchScore"] = 1 if (domain_word and domain_word in title) else 0
        features["URLTitleMatchScore"] = 1 if (domain_word and domain_word in url.lower()) else 0

        # Page structure
        features["HasFavicon"] = 1 if soup.find("link", rel=lambda x: x and "icon" in x.lower()) else 0
        features["Robots"] = 1 if "robots" in html.lower() else 0
        features["IsResponsive"] = 1 if "viewport" in html.lower() else 0
        features["NoOfURLRedirect"] = len(response.history) if response is not None else 0
        features["NoOfSelfRedirect"] = 0
        features["HasDescription"] = 1 if soup.find("meta", attrs={"name": "description"}) else 0
        features["NoOfPopup"] = html.lower().count("alert(")
        features["NoOfiFrame"] = len(soup.find_all("iframe"))

        # Form security features
        has_external_form = 0
        for form in soup.find_all("form"):
            action = form.get("action", "")
            if "http" in action and domain not in action:
                has_external_form = 1
                break
        features["HasExternalFormSubmit"] = has_external_form

        features["HasSocialNet"] = (
            1 if any(net in html.lower() for net in ["facebook", "twitter", "instagram", "linkedin", "tiktok", "youtube"])
            else 0
        )
        features["HasSubmitButton"] = 1 if soup.find("input", type="submit") or soup.find("button", type="submit") else 0
        features["HasHiddenFields"] = 1 if soup.find("input", type="hidden") else 0
        features["HasPasswordField"] = 1 if soup.find("input", type="password") else 0

        # Sensitive keyword features
        text = html.lower()
        features["Bank"] = 1 if "bank" in text else 0
        features["Pay"] = 1 if any(x in text for x in ["pay", "payment", "paypal", "creditcard", "checkout"]) else 0
        features["Crypto"] = 1 if any(x in text for x in ["bitcoin", "crypto", "wallet", "binance", "metamask"]) else 0
        features["HasCopyrightInfo"] = 1 if "copyright" in text or "©" in text else 0

        # Resources & Links
        features["NoOfImage"] = len(soup.find_all("img"))
        features["NoOfCSS"] = len(soup.find_all("link", rel="stylesheet"))
        features["NoOfJS"] = len(soup.find_all("script"))

        links = soup.find_all("a")
        features["NoOfSelfRef"] = sum(1 for l in links if domain in str(l.get("href", "")))
        features["NoOfEmptyRef"] = sum(1 for l in links if l.get("href") in ["", "#", None, "javascript:void(0)"])
        features["NoOfExternalRef"] = sum(1 for l in links if "http" in str(l.get("href", "")) and domain not in str(l.get("href", "")))

        return features

    except Exception as e:
        print(f"[PhishGuard] Feature extraction error for '{url}': {e}")
        return None


def get_feature_summary(features: dict) -> dict:
    """
    Groups features into human-readable logical sections for presentation in the UI/API.
    """
    if not features:
        return {}

    return {
        "url_lexical": {
            "URL Length": features.get("URLLength", 0),
            "Domain Length": features.get("DomainLength", 0),
            "Subdomain Count": features.get("NoOfSubDomain", 0),
            "Is HTTPS": bool(features.get("IsHTTPS", 0)),
            "Is Raw IP Domain": bool(features.get("IsDomainIP", 0)),
            "Obfuscated Characters": features.get("NoOfObfuscatedChar", 0),
            "Digits in URL": features.get("NoOfDegitsInURL", 0),
        },
        "domain_reputation": {
            "Top-Level Domain (TLD)": features.get("TLD", ""),
            "TLD Length": features.get("TLDLength", 0),
            "TLD Legitimacy Probability": features.get("TLDLegitimateProb", 0.5),
            "Title Matches Domain": bool(features.get("DomainTitleMatchScore", 0)),
        },
        "content_analysis": {
            "Fetch Succeeded": not bool(features.get("FetchFailed", 0)),
            "Lines of Code": features.get("LineOfCode", 0),
            "Has Favicon": bool(features.get("HasFavicon", 0)),
            "Mobile Responsive": bool(features.get("IsResponsive", 0)),
            "Redirect Count": features.get("NoOfURLRedirect", 0),
            "iFrames Count": features.get("NoOfiFrame", 0),
        },
        "security_indicators": {
            "External Form Submission": bool(features.get("HasExternalFormSubmit", 0)),
            "Password Input Present": bool(features.get("HasPasswordField", 0)),
            "Hidden Form Fields": bool(features.get("HasHiddenFields", 0)),
            "Banking Keywords Found": bool(features.get("Bank", 0)),
            "Payment Keywords Found": bool(features.get("Pay", 0)),
            "Crypto Keywords Found": bool(features.get("Crypto", 0)),
        }
    }
