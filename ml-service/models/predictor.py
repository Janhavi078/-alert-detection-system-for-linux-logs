"""Predictor - Orchestrates full ML pipeline and generates explanations."""

import logging
from typing import Dict, List

import numpy as np

from models.isolation_forest import IsolationForestModel
from utils.feature_extractor import FeatureExtractor
from utils.preprocessor import LogPreprocessor

logger = logging.getLogger(__name__)


class Predictor:
    """Orchestrate ML pipeline: preprocess → features → predict → reason."""

    def __init__(self, model: IsolationForestModel = None):
        """
        Initialize predictor.

        Args:
            model: IsolationForestModel instance (or None to create new)
        """
        self.model = model or IsolationForestModel()
        self.preprocessor = LogPreprocessor()
        self.feature_extractor = FeatureExtractor()

    def predict(self, logs: List[str]) -> List[Dict[str, any]]:
        """
        Full prediction pipeline.

        Args:
            logs: List of raw log strings

        Returns:
            List of prediction results with scores and reasons
        """
        try:
            # Validate input
            if not self.preprocessor.validate_input(logs):
                logger.error("Invalid input logs")
                return []

            # Step 1: Preprocess
            logger.info(f"Preprocessing {len(logs)} logs...")
            parsed_logs = [self.preprocessor.parse_log(log) for log in logs]

            # Step 2: Extract features
            logger.info("Extracting features...")
            features_df = self.feature_extractor.extract_features(parsed_logs)

            if features_df.empty:
                logger.error("Feature extraction failed")
                return []

            # Step 3: Predict anomalies
            logger.info("Running anomaly detection...")
            predictions = self.model.predict(features_df)
            scores = self.model.score_samples(features_df)

            # Step 4: Build results with reasons
            logger.info("Generating explanations...")
            results = []
            for i, log in enumerate(logs):
                is_anomaly = predictions[i] == -1
                score = float(scores[i])
                reason = self._generate_reason(
                    parsed_logs[i], is_anomaly, score, len(logs)
                )

                result = {
                    "log": log,
                    "anomaly": is_anomaly,
                    "score": round(score, 2),
                    "reason": reason,
                }
                results.append(result)

            logger.info(f"✅ Prediction complete. Found {sum(1 for r in results if r['anomaly'])} anomalies")
            return results

        except Exception as e:
            logger.error(f"❌ Prediction pipeline failed: {e}")
            raise

    @staticmethod
    def _generate_reason(
        parsed_log: Dict[str, any], is_anomaly: bool, score: float, batch_size: int
    ) -> str:
        """
        Generate human-readable reason for prediction.

        Args:
            parsed_log: Parsed log dictionary
            is_anomaly: Whether classified as anomaly
            score: Anomaly score (0-1)
            batch_size: Total logs in batch

        Returns:
            Human-readable explanation string
        """
        if not is_anomaly:
            return "Normal login activity"

        # Extract features from parsed log
        failed_count = parsed_log.get("failed_count", 0)
        login_status = parsed_log.get("login_status", "unknown")
        ip_address = parsed_log.get("ip_address")
        user = parsed_log.get("user")
        port = parsed_log.get("port")

        reasons = []

        # Brute force detection
        if login_status == "failed":
            if score > 0.85:
                reasons.append("Multiple failed login attempts detected")
            else:
                reasons.append("Failed login detected")

        # Unusual IP detection
        if ip_address and score > 0.75:
            reasons.append(f"Activity from potentially suspicious IP: {ip_address}")

        # Port-based detection
        if port and port not in [22, 80, 443, 3306, 5432]:
            reasons.append(f"Unusual port detected: {port}")

        # High confidence anomaly
        if score > 0.90:
            reasons.append("⚠️ High-confidence anomaly")

        # Default reason if none matched
        if not reasons:
            reasons.append("Suspicious pattern detected")

        return "; ".join(reasons)

    def train_on_batch(self, logs: List[str]) -> None:
        """
        Train model on a batch of logs (for demo purposes).

        Args:
            logs: List of raw logs to train on
        """
        try:
            if not self.preprocessor.validate_input(logs):
                logger.error("Invalid logs for training")
                return

            logger.info(f"Training model on {len(logs)} logs...")

            # Preprocess
            parsed_logs = [self.preprocessor.parse_log(log) for log in logs]

            # Extract features
            features_df = self.feature_extractor.extract_features(parsed_logs)

            if features_df.empty:
                logger.warning("No features to train on")
                return

            # Train model
            self.model.train(features_df)
            self.model.save_model()

            logger.info("✅ Model trained and saved")

        except Exception as e:
            logger.error(f"❌ Training failed: {e}")
            raise
