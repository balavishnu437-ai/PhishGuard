"""
PhishGuard - Intelligent Phishing Link & URL Detection System
Authors: Bala Vishnu & Diyanezwaran
Module: predictor.py
Description: End-to-end Machine Learning prediction pipeline with automated safety overrides
             and comprehensive risk assessment.
"""

import os
import time
import joblib
import pandas as pd
from urllib.parse import urlparse
import sklearn.compose._column_transformer as ct

# Cross-version compatibility shim for scikit-learn pipeline unpickling
if not hasattr(ct, "_RemainderColsList"):
    class _RemainderColsList(list):
        pass
    ct._RemainderColsList = _RemainderColsList

from feature_extractor import extract_features, get_feature_summary
from utils import normalize_url, is_valid_url, get_risk_level

# Common URL shorteners where true destination is obscured
KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "bl.ink", "rebrand.ly", "cutt.ly", "shorte.st",
    "s.id", "tiny.cc", "lnkd.in", "rb.gy", "shorturl.at", "v.gd",
    "qr.ae", "clck.ru", "rotf.lol", "trib.al"
}


class Predictor:
    """
    PhishGuard Machine Learning Predictor.
    Loads the trained Decision Tree Pipeline and runs comprehensive inference
    augmented by rule-based heuristic safety overrides.
    """

    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "phishing_decision_tree_pipeline.pkl")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"PhishGuard model file not found at: {model_path}")
            
        self.model = joblib.load(model_path)
        self.authors = ["Bala Vishnu", "Diyanezwaran"]
        self.model_name = "PhishGuard Decision Tree Pipeline"

    def _is_shortened_url(self, url: str) -> bool:
        try:
            domain = urlparse(url).netloc.lower()
            domain = domain.replace("www.", "").split(":")[0]
            return domain in KNOWN_SHORTENERS
        except Exception:
            return False

    def predict(self, url: str) -> dict:
        """
        Executes end-to-end feature extraction and prediction for a single URL.
        """
        start_time = time.time()
        url = normalize_url(url)

        if not is_valid_url(url):
            return {
                "url": url,
                "error": "Invalid URL format. Please provide a valid web address.",
                "valid": False
            }

        features = extract_features(url)
        if features is None:
            return {
                "url": url,
                "error": "Feature extraction failed. Could not process target URL.",
                "valid": False
            }

        # Format dataframe with feature names
        df = pd.DataFrame([features])

        # Run pipeline inference
        try:
            raw_prediction = int(self.model.predict(df)[0])
        except Exception as e:
            return {
                "url": url,
                "error": f"Model inference error: {str(e)}",
                "valid": False
            }

        # Calculate prediction probability / confidence
        if hasattr(self.model, "predict_proba"):
            try:
                probabilities = self.model.predict_proba(df)[0]
                confidence = float(max(probabilities))
            except Exception:
                confidence = 1.0
        else:
            confidence = 1.0

        is_shortened = self._is_shortened_url(url)
        is_unreachable = features.get("FetchFailed", 0) == 1

        final_prediction = raw_prediction
        overridden = False
        warning = None

        # Rule-Based Override 1: Obfuscated URL Shorteners
        if is_shortened and raw_prediction == 0:
            final_prediction = 1
            overridden = True
            warning = (
                "⚠️ Obfuscated Link Detected: This URL uses a shortening service (e.g. bit.ly, tinyurl). "
                "Because the true destination is masked, PhishGuard classifies this as suspicious."
            )

        # Rule-Based Override 2: Unreachable / Offline Domains
        elif is_unreachable and raw_prediction == 0:
            final_prediction = 1
            overridden = True
            warning = (
                "⚠️ Host Unreachable: The target website could not be contacted or returned empty content. "
                "Because content-based safety checks cannot be verified, PhishGuard flags this link as untrusted."
            )

        verdict = "Phishing Website" if final_prediction == 1 else "Legitimate Website"
        risk_info = get_risk_level(final_prediction, confidence, overridden)
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "url": url,
            "prediction": final_prediction,
            "raw_prediction": raw_prediction,
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
            "risk_info": risk_info,
            "overridden": overridden,
            "warning": warning,
            "analysis_time_ms": elapsed_ms,
            "features": features,
            "summary": get_feature_summary(features),
            "valid": True
        }

    def predict_batch(self, urls: list) -> list:
        """
        Executes prediction on a batch of URLs.
        """
        results = []
        for u in urls:
            u_clean = u.strip()
            if u_clean:
                results.append(self.predict(u_clean))
        return results

    def get_model_info(self) -> dict:
        """
        Returns PhishGuard system and model architectural metadata.
        """
        return {
            "system_name": "PhishGuard",
            "version": "2.0.0",
            "authors": self.authors,
            "algorithm": "Decision Tree Classifier Pipeline",
            "features_count": 51,
            "dataset": "PhiUSIIL Phishing URL Dataset",
            "safety_overrides": [
                "Shortened URL Cloaking Detection",
                "Unreachable / Dormant Host Protection"
            ]
        }
