/**
 * ML Service Routes
 * Integration endpoints for anomaly detection
 */

const express = require("express");
const router = express.Router();
const { analyzeLogs, getMLServiceStatus, checkMLServiceHealth } = require("../services/mlService");

/**
 * POST /api/ml/analyze
 * Analyze logs for anomalies using ML service
 */
router.post("/analyze", async (req, res) => {
  try {
    const { logs } = req.body;

    // Validate input
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Logs must be a non-empty array",
      });
    }

    if (logs.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Maximum 1000 logs per request",
      });
    }

    console.log(`\n🔍 Analyzing ${logs.length} logs for anomalies...`);

    // Call ML service
    const results = await analyzeLogs(logs);

    // Extract statistics
    const anomalyCount = results.filter((r) => r.anomaly).length;
    const avgScore = (
      results.reduce((sum, r) => sum + r.score, 0) / results.length
    ).toFixed(2);

    return res.json({
      success: true,
      data: {
        total_logs: results.length,
        anomalies_detected: anomalyCount,
        normal_logs: results.length - anomalyCount,
        average_score: parseFloat(avgScore),
        results: results,
      },
    });
  } catch (error) {
    console.error("❌ Error analyzing logs:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ml/status
 * Check ML service status
 */
router.get("/status", async (req, res) => {
  try {
    const isHealthy = await checkMLServiceHealth();
    const status = await getMLServiceStatus();

    return res.json({
      success: true,
      data: {
        service_healthy: isHealthy,
        ...status,
      },
    });
  } catch (error) {
    console.error("❌ Error getting ML service status:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ml/batch-analyze
 * Analyze multiple log sources
 */
router.post("/batch-analyze", async (req, res) => {
  try {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Sources array required",
      });
    }

    console.log(`\n📦 Batch analyzing ${sources.length} sources...`);

    const batchResults = [];

    for (const source of sources) {
      if (!source.logs || !Array.isArray(source.logs)) {
        continue;
      }

      try {
        const results = await analyzeLogs(source.logs);
        batchResults.push({
          source: source.name || "unknown",
          success: true,
          results: results,
        });
      } catch (error) {
        batchResults.push({
          source: source.name || "unknown",
          success: false,
          error: error.message,
        });
      }
    }

    return res.json({
      success: true,
      data: {
        sources_processed: batchResults.length,
        results: batchResults,
      },
    });
  } catch (error) {
    console.error("❌ Error in batch analysis:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ml/health
 * Simple health check (no external calls)
 */
router.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
