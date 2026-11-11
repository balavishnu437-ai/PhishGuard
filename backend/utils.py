"""
PhishGuard - Intelligent Phishing Link & URL Detection System
Authors: Bala Vishnu & Diyanezwaran
Module: utils.py
Description: Helper utilities for URL validation, normalization, and scoring.
"""

from urllib.parse import urlparse
import re


def normalize_url(url: str) -> str:
    """
    Normalizes a given URL string by stripping whitespace and ensuring
    it has an HTTP/HTTPS scheme.
    """
    if not url:
        return ""
    
    url = url.strip()
    
    # If no scheme is provided, default to http:// for parsing
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "http://" + url
        
    return url


def is_valid_url(url: str) -> bool:
    """
    Validates whether the given string has a valid URL structure.
    """
    if not url or not isinstance(url, str):
        return False

    url = normalize_url(url)

    try:
        result = urlparse(url)
        # Check scheme and netloc presence
        if not (result.scheme in ("http", "https") and result.netloc):
            return False
        
        # Check domain contains at least a dot or is localhost / IP
        domain = result.netloc.split(":")[0]
        if "." not in domain and domain != "localhost":
            return False

        return True
    except Exception:
        return False


def get_risk_level(prediction: int, confidence: float, overridden: bool = False) -> dict:
    """
    Computes a risk level tier, UI color, and recommendation badge.
    """
    if prediction == 1:
        if overridden:
            return {
                "level": "SUSPICIOUS (OVERRIDE)",
                "color": "#f59e0b",
                "badge": "⚠️ High Suspicion",
                "recommendation": "Avoid interacting. Destination is obfuscated or unreachable."
            }
        elif confidence >= 0.85:
            return {
                "level": "CRITICAL RISK",
                "color": "#ef4444",
                "badge": "🚨 Phishing Threat",
                "recommendation": "Do not visit or enter any credentials on this website."
            }
        else:
            return {
                "level": "HIGH RISK",
                "color": "#f97316",
                "badge": "⚠️ Likely Phishing",
                "recommendation": "Proceed with extreme caution. Several phishing signals triggered."
            }
    else:
        if confidence >= 0.85:
            return {
                "level": "SAFE",
                "color": "#10b981",
                "badge": "✅ Legitimate Site",
                "recommendation": "Verified safe based on URL and structural analysis."
            }
        else:
            return {
                "level": "LOW RISK",
                "color": "#06b6d4",
                "badge": "ℹ️ Neutral / Safe",
                "recommendation": "No prominent phishing patterns detected."
            }
