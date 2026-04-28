"""Log Preprocessing - Cleaning and Parsing."""

import logging
import re
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class LogPreprocessor:
    """Process and parse raw log strings."""

    # Regex patterns for common log formats
    IP_PATTERN = re.compile(r"\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b")
    USER_PATTERN = re.compile(r"(?:for|user)\s+(\w+)")
    PORT_PATTERN = re.compile(r"(?:port|:)?\s*(\d{4,5})\b")
    FAILED_PATTERN = re.compile(
        r"(failed|invalid|error|incorrect|denied|refused|broken)",
        re.IGNORECASE,
    )
    SUCCESS_PATTERN = re.compile(
        r"(accepted|success|authorized|granted|authenticated)",
        re.IGNORECASE,
    )

    @staticmethod
    def clean_log(log: str) -> str:
        """
        Clean log string.

        Args:
            log: Raw log string

        Returns:
            Cleaned log (lowercase, stripped)
        """
        if not isinstance(log, str):
            return ""

        return log.strip().lower()

    @classmethod
    def parse_log(cls, log: str) -> Dict[str, any]:
        """
        Parse log string and extract structured data.

        Args:
            log: Raw log string

        Returns:
            Parsed log dict with extracted fields
        """
        cleaned = cls.clean_log(log)

        parsed = {
            "raw_log": log,
            "cleaned_log": cleaned,
            "login_status": cls._extract_login_status(cleaned),
            "user": cls._extract_user(cleaned),
            "ip_address": cls._extract_ip(cleaned),
            "port": cls._extract_port(cleaned),
        }

        return parsed

    @classmethod
    def _extract_login_status(cls, log: str) -> str:
        """
        Extract login status (failed/success/error/unknown).

        Args:
            log: Cleaned log string

        Returns:
            Login status string
        """
        if cls.FAILED_PATTERN.search(log):
            return "failed"
        elif cls.SUCCESS_PATTERN.search(log):
            return "success"
        else:
            return "unknown"

    @classmethod
    def _extract_user(cls, log: str) -> Optional[str]:
        """Extract username from log."""
        match = cls.USER_PATTERN.search(log)
        return match.group(1) if match else None

    @classmethod
    def _extract_ip(cls, log: str) -> Optional[str]:
        """Extract IP address from log."""
        match = cls.IP_PATTERN.search(log)
        return match.group(1) if match else None

    @classmethod
    def _extract_port(cls, log: str) -> Optional[int]:
        """Extract port number from log."""
        match = cls.PORT_PATTERN.search(log)
        if match:
            try:
                return int(match.group(1))
            except (ValueError, AttributeError):
                return None
        return None

    @staticmethod
    def validate_input(logs: List[str]) -> bool:
        """
        Validate logs input.

        Args:
            logs: List of log strings

        Returns:
            True if valid, False otherwise
        """
        if not isinstance(logs, list):
            logger.warning("Logs must be a list")
            return False

        if len(logs) == 0:
            logger.warning("Logs list cannot be empty")
            return False

        if not all(isinstance(log, str) for log in logs):
            logger.warning("All logs must be strings")
            return False

        return True


# Convenience function
def preprocess_logs(logs: List[str]) -> List[Dict[str, any]]:
    """
    Preprocess a list of logs.

    Args:
        logs: List of raw log strings

    Returns:
        List of parsed log dictionaries
    """
    if not LogPreprocessor.validate_input(logs):
        return []

    parsed_logs = []
    for log in logs:
        try:
            parsed = LogPreprocessor.parse_log(log)
            parsed_logs.append(parsed)
        except Exception as e:
            logger.error(f"Error parsing log '{log}': {e}")
            continue

    return parsed_logs
