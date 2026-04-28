const axios = require("axios");

/**
 * ML Service Integration Module
 * Communicates with Python FastAPI ML service for anomaly detection
 */

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";
const ML_TIMEOUT = parseInt(process.env.ML_TIMEOUT || "30000", 10);

/**
 * Analyzes logs using the Python ML service
 * @param {Array<string>} logs - Raw log strings
 * @returns {Promise<Array>} - Detection results with anomaly, score, reason
 */
const analyzeLogs = async (logs) => {
  try {
    if (!Array.isArray(logs) || logs.length === 0) {
      throw new Error("Logs must be a non-empty array");
    }

    console.log(`📨 Sending ${logs.length} logs to ML service...`);

    const response = await axios.post(
      `${ML_SERVICE_URL}/detect`,
      { logs },
      { timeout: ML_TIMEOUT }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "ML service returned failure");
    }

    const results = response.data.results;
    const anomalyCount = results.filter((r) => r.anomaly).length;

    console.log(
      `✅ ML analysis complete. Found ${anomalyCount} anomalies in ${logs.length} logs`
    );

    return results;
  } catch (error) {
    console.error("❌ ML Service Error:", error.message);
    throw new Error(`ML analysis failed: ${error.message}`);
  }
};

/**
 * Legacy function name for backward compatibility
 * @deprecated Use analyzeLogs instead
 */
exports.analyzeLogsWithML = analyzeLogs;

/**
 * Main export
 */
exports.analyzeLogs = analyzeLogs;

/**
 * Check ML service health
 * @returns {Promise<boolean>} - Service is healthy
 */
exports.checkMLServiceHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === "healthy";
  } catch (error) {
    console.warn("⚠️ ML Service health check failed:", error.message);
    return false;
  }
};

/**
 * Get ML service status
 * @returns {Promise<Object>} - Service status info
 */
exports.getMLServiceStatus = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/status`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.warn("⚠️ Failed to get ML service status:", error.message);
    return { status: "unavailable", error: error.message };
  }
};