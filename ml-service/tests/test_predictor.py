"""Unit Tests for ML Predictor."""

import unittest

import pandas as pd

from models.isolation_forest import IsolationForestModel
from models.predictor import Predictor
from utils.feature_extractor import FeatureExtractor
from utils.preprocessor import LogPreprocessor


class TestLogPreprocessor(unittest.TestCase):
    """Test log preprocessing functionality."""

    def test_clean_log(self):
        """Test log cleaning."""
        raw = "  Failed Password for ROOT from 192.168.1.10 port 22  "
        cleaned = LogPreprocessor.clean_log(raw)
        self.assertTrue(cleaned.islower())
        self.assertEqual(cleaned, cleaned.strip())

    def test_parse_log_failed_login(self):
        """Test parsing failed login log."""
        log = "Failed password for root from 192.168.1.10 port 22"
        parsed = LogPreprocessor.parse_log(log)

        self.assertEqual(parsed["login_status"], "failed")
        self.assertEqual(parsed["user"], "root")
        self.assertEqual(parsed["ip_address"], "192.168.1.10")
        self.assertEqual(parsed["port"], 22)

    def test_parse_log_success_login(self):
        """Test parsing successful login log."""
        log = "Accepted password for user from 10.0.0.5"
        parsed = LogPreprocessor.parse_log(log)

        self.assertEqual(parsed["login_status"], "success")
        self.assertEqual(parsed["user"], "user")
        self.assertEqual(parsed["ip_address"], "10.0.0.5")

    def test_validate_input_valid(self):
        """Test validation with valid input."""
        logs = ["log1", "log2", "log3"]
        self.assertTrue(LogPreprocessor.validate_input(logs))

    def test_validate_input_invalid_type(self):
        """Test validation with invalid type."""
        self.assertFalse(LogPreprocessor.validate_input("not a list"))
        self.assertFalse(LogPreprocessor.validate_input([123, 456]))
        self.assertFalse(LogPreprocessor.validate_input([]))


class TestFeatureExtractor(unittest.TestCase):
    """Test feature extraction."""

    def setUp(self):
        """Set up test data."""
        self.parsed_logs = [
            {
                "raw_log": "Failed password for root from 192.168.1.10 port 22",
                "cleaned_log": "failed password for root from 192.168.1.10 port 22",
                "login_status": "failed",
                "user": "root",
                "ip_address": "192.168.1.10",
                "port": 22,
            },
            {
                "raw_log": "Accepted password for user from 10.0.0.5",
                "cleaned_log": "accepted password for user from 10.0.0.5",
                "login_status": "success",
                "user": "user",
                "ip_address": "10.0.0.5",
                "port": None,
            },
        ]

    def test_extract_features(self):
        """Test feature extraction."""
        df = FeatureExtractor.extract_features(self.parsed_logs)

        self.assertEqual(len(df), 2)
        self.assertGreater(len(df.columns), 0)

    def test_features_not_empty(self):
        """Test that extracted features have values."""
        df = FeatureExtractor.extract_features(self.parsed_logs)

        # Check for NaN values
        self.assertFalse(df.isna().any().any())

    def test_validate_features(self):
        """Test feature validation."""
        df = FeatureExtractor.extract_features(self.parsed_logs)
        self.assertTrue(FeatureExtractor.validate_features(df))


class TestPredictor(unittest.TestCase):
    """Test ML predictor."""

    def setUp(self):
        """Set up test data."""
        self.test_logs = [
            "Failed password for root from 192.168.1.10 port 22",
            "Failed password for root from 192.168.1.10 port 22",
            "Accepted password for user from 10.0.0.5",
        ]

        # Create a minimal model for testing
        self.model = IsolationForestModel()
        self.predictor = Predictor(model=self.model)

    def test_predict_returns_results(self):
        """Test that predict returns results."""
        results = self.predictor.predict(self.test_logs)

        self.assertEqual(len(results), len(self.test_logs))
        self.assertIsInstance(results, list)

    def test_predict_result_structure(self):
        """Test result structure."""
        results = self.predictor.predict(self.test_logs)

        for result in results:
            self.assertIn("log", result)
            self.assertIn("anomaly", result)
            self.assertIn("score", result)
            self.assertIn("reason", result)

            self.assertIsInstance(result["log"], str)
            self.assertIsInstance(result["anomaly"], bool)
            self.assertIsInstance(result["score"], float)
            self.assertIsInstance(result["reason"], str)

    def test_score_range(self):
        """Test that scores are in valid range."""
        results = self.predictor.predict(self.test_logs)

        for result in results:
            self.assertGreaterEqual(result["score"], 0)
            self.assertLessEqual(result["score"], 1)

    def test_reason_not_empty(self):
        """Test that reasons are provided."""
        results = self.predictor.predict(self.test_logs)

        for result in results:
            self.assertGreater(len(result["reason"]), 0)


class TestIsolationForest(unittest.TestCase):
    """Test Isolation Forest model."""

    def setUp(self):
        """Set up test data."""
        self.model = IsolationForestModel()

    def test_model_initialized(self):
        """Test that model is initialized."""
        self.assertIsNotNone(self.model.model)

    def test_predict_valid_data(self):
        """Test prediction on valid data."""
        # Create dummy data
        data = {
            "failed_login_count": [0, 1, 2],
            "success_login_count": [1, 0, 0],
            "unknown_count": [0, 0, 0],
            "ip_frequency": [1, 1, 3],
            "unique_ip_flag": [1, 1, 0],
            "failed_ratio": [0.0, 1.0, 1.0],
            "success_ratio": [1.0, 0.0, 0.0],
            "unusual_port_flag": [0, 0, 0],
            "user_frequency": [1, 1, 1],
            "batch_size": [1, 1, 2],
        }
        df = pd.DataFrame(data)

        predictions = self.model.predict(df)
        self.assertEqual(len(predictions), 3)


if __name__ == "__main__":
    unittest.main()
