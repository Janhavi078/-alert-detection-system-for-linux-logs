"""Feature Engineering - Convert parsed logs to ML features."""

import logging
from typing import Dict, List

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class FeatureExtractor:
    """Extract numerical features from parsed logs."""

    @staticmethod
    def extract_features(parsed_logs: List[Dict[str, any]]) -> pd.DataFrame:
        """
        Extract features from parsed logs.

        Args:
            parsed_logs: List of parsed log dictionaries

        Returns:
            DataFrame with numerical features
        """
        if not parsed_logs:
            logger.warning("No parsed logs provided")
            return pd.DataFrame()

        features = []

        for log in parsed_logs:
            try:
                feature_dict = FeatureExtractor._extract_single_log_features(
                    log, parsed_logs
                )
                features.append(feature_dict)
            except Exception as e:
                logger.error(f"Error extracting features for log: {e}")
                continue

        if not features:
            logger.warning("No features extracted")
            return pd.DataFrame()

        df = pd.DataFrame(features)
        logger.info(f"✅ Extracted features for {len(df)} logs")
        return df

    @staticmethod
    def _extract_single_log_features(
        log: Dict[str, any], all_logs: List[Dict[str, any]]
    ) -> Dict[str, float]:
        """
        Extract features for a single log.

        Args:
            log: Parsed log dictionary
            all_logs: All logs (for context calculations)

        Returns:
            Dictionary with feature values
        """
        failed_count = sum(1 for l in all_logs if l["login_status"] == "failed")
        success_count = sum(1 for l in all_logs if l["login_status"] == "success")
        unknown_count = sum(1 for l in all_logs if l["login_status"] == "unknown")

        ip_address = log.get("ip_address")
        ip_frequency = (
            sum(1 for l in all_logs if l.get("ip_address") == ip_address)
            if ip_address
            else 0
        )

        # Check if this IP is unique in the batch
        unique_ip = 1 if ip_frequency == 1 else 0

        # Calculate ratios
        total = failed_count + success_count + unknown_count
        failed_ratio = failed_count / total if total > 0 else 0
        success_ratio = success_count / total if total > 0 else 0

        # Port anomaly detection
        port = log.get("port", 0)
        is_unusual_port = 1 if port not in [22, 80, 443, 3306, 5432] else 0

        # User frequency in batch
        user = log.get("user")
        user_frequency = (
            sum(1 for l in all_logs if l.get("user") == user) if user else 0
        )

        return {
            "failed_login_count": float(failed_count),
            "success_login_count": float(success_count),
            "unknown_count": float(unknown_count),
            "ip_frequency": float(ip_frequency),
            "unique_ip_flag": float(unique_ip),
            "failed_ratio": failed_ratio,
            "success_ratio": success_ratio,
            "unusual_port_flag": float(is_unusual_port),
            "user_frequency": float(user_frequency),
            "batch_size": float(total),
        }

    @staticmethod
    def validate_features(df: pd.DataFrame) -> bool:
        """
        Validate feature DataFrame.

        Args:
            df: Feature DataFrame

        Returns:
            True if valid, False otherwise
        """
        if df.empty:
            logger.warning("Feature DataFrame is empty")
            return False

        if any(df.isna().sum() > 0):
            logger.warning("Feature DataFrame contains NaN values")
            return False

        expected_cols = {
            "failed_login_count",
            "success_login_count",
            "unknown_count",
            "ip_frequency",
            "unique_ip_flag",
            "failed_ratio",
            "success_ratio",
            "unusual_port_flag",
            "user_frequency",
            "batch_size",
        }

        if not expected_cols.issubset(df.columns):
            missing = expected_cols - set(df.columns)
            logger.warning(f"Missing features: {missing}")
            return False

        return True

    @staticmethod
    def get_feature_names() -> List[str]:
        """Get list of feature names."""
        return [
            "failed_login_count",
            "success_login_count",
            "unknown_count",
            "ip_frequency",
            "unique_ip_flag",
            "failed_ratio",
            "success_ratio",
            "unusual_port_flag",
            "user_frequency",
            "batch_size",
        ]
