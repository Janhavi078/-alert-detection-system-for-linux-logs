"""Isolation Forest Model - Training and Loading."""

import logging
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

logger = logging.getLogger(__name__)


class IsolationForestModel:
    """Isolation Forest model wrapper for anomaly detection."""

    def __init__(self, contamination: float = 0.05, model_path: str = None):
        """
        Initialize the Isolation Forest model.

        Args:
            contamination: Expected proportion of outliers (0-0.5)
            model_path: Path to load pre-trained model from
        """
        self.contamination = contamination
        self.model_path = model_path or "data/trained_model.pkl"
        self.model = None
        self._load_or_initialize()

    def _load_or_initialize(self) -> None:
        """Load model from disk or initialize new one."""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"✅ Loaded model from {self.model_path}")
            except Exception as e:
                logger.warning(f"Failed to load model: {e}. Initializing new model.")
                self._initialize_new_model()
        else:
            logger.info("No pre-trained model found. Initializing new model.")
            self._initialize_new_model()

    def _initialize_new_model(self) -> None:
        """Initialize a new Isolation Forest model."""
        self.model = IsolationForest(
            contamination=self.contamination,
            random_state=42,
            n_estimators=100,
        )
        logger.info("✅ Initialized new Isolation Forest model")

    def train(self, X: pd.DataFrame) -> None:
        """
        Train the Isolation Forest model.

        Args:
            X: Training data (features DataFrame)
        """
        if X.shape[0] < 10:
            logger.warning("Training data too small (< 10 samples). Skipping training.")
            return

        try:
            self.model.fit(X)
            logger.info(f"✅ Model trained on {X.shape[0]} samples, {X.shape[1]} features")
        except Exception as e:
            logger.error(f"❌ Training failed: {e}")
            raise

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict anomalies.

        Args:
            X: Feature data

        Returns:
            Predictions: -1 (anomaly), 1 (normal)
        """
        if self.model is None:
            raise ValueError("Model not initialized")

        try:
            predictions = self.model.predict(X)
            return predictions
        except Exception as e:
            logger.error(f"❌ Prediction failed: {e}")
            raise

    def score_samples(self, X: pd.DataFrame) -> np.ndarray:
        """
        Get anomaly scores (higher = more anomalous).

        Args:
            X: Feature data

        Returns:
            Anomaly scores [0-1 approximately]
        """
        if self.model is None:
            raise ValueError("Model not initialized")

        try:
            scores = self.model.score_samples(X)
            # Normalize scores to [0, 1] range
            scores_normalized = 1 / (1 + np.exp(scores))
            return scores_normalized
        except Exception as e:
            logger.error(f"❌ Scoring failed: {e}")
            raise

    def save_model(self) -> None:
        """Save model to disk."""
        if self.model is None:
            logger.warning("No model to save")
            return

        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            logger.info(f"✅ Model saved to {self.model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to save model: {e}")
            raise
