"""FastAPI ML Service - Main Application."""

import logging
import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from models.isolation_forest import IsolationForestModel
from models.predictor import Predictor

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ML Anomaly Detection Service",
    description="Detects anomalies in Linux logs using Isolation Forest",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor instance
predictor: Predictor = None


# ============================================================================
# Pydantic Models
# ============================================================================


class DetectRequest(BaseModel):
    """Request model for /detect endpoint."""

    logs: List[str] = Field(..., min_items=1, description="List of log strings")

    class Config:
        """Pydantic config."""

        example = {
            "logs": [
                "Failed password for root from 192.168.1.10 port 22",
                "Accepted password for user from 10.0.0.5",
            ]
        }


class DetectResult(BaseModel):
    """Single anomaly detection result."""

    log: str = Field(..., description="Original log string")
    anomaly: bool = Field(..., description="Whether this is an anomaly")
    score: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    reason: str = Field(..., description="Human-readable explanation")


class DetectResponse(BaseModel):
    """Response model for /detect endpoint."""

    success: bool
    results: List[DetectResult]


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = False
    error: str


# ============================================================================
# Lifecycle Events
# ============================================================================


@app.on_event("startup")
async def startup_event():
    """Initialize ML model on startup."""
    global predictor
    try:
        logger.info("🚀 Initializing ML service...")

        # Load or create model
        model_path = os.getenv("MODEL_PATH", "./data/trained_model.pkl")
        contamination = float(os.getenv("CONTAMINATION", "0.05"))

        model = IsolationForestModel(
            contamination=contamination, model_path=model_path
        )

        # Initialize predictor
        predictor = Predictor(model=model)

        logger.info("✅ ML service initialized successfully")

    except Exception as e:
        logger.error(f"❌ Failed to initialize ML service: {e}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("🛑 Shutting down ML service...")


# ============================================================================
# API Endpoints
# ============================================================================


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - health check."""
    return {
        "status": "online",
        "service": "ML Anomaly Detection",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint."""
    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML service not initialized",
        )

    return {"status": "healthy", "model_loaded": predictor.model is not None}


@app.post(
    "/detect",
    response_model=DetectResponse,
    tags=["Detection"],
    responses={
        200: {"description": "Detection successful"},
        400: {"description": "Invalid request", "model": ErrorResponse},
        500: {"description": "Server error", "model": ErrorResponse},
    },
)
async def detect_anomalies(request: DetectRequest):
    """
    Detect anomalies in logs.

    **Request:**
    - logs: List of log strings to analyze

    **Response:**
    - success: Whether detection was successful
    - results: List of anomaly detection results with:
      - log: Original log string
      - anomaly: Boolean indicating if anomalous
      - score: Confidence score (0-1)
      - reason: Human-readable explanation
    """
    try:
        if predictor is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML service not initialized",
            )

        logger.info(f"📨 Received detection request for {len(request.logs)} logs")

        # Run prediction
        results = predictor.predict(request.logs)

        if not results:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to process logs",
            )

        logger.info(
            f"✅ Detection complete. Found {sum(1 for r in results if r['anomaly'])} anomalies"
        )

        # Convert results to DetectResult objects
        detect_results = [
            DetectResult(
                log=r["log"],
                anomaly=r["anomaly"],
                score=r["score"],
                reason=r["reason"],
            )
            for r in results
        ]

        return DetectResponse(success=True, results=detect_results)

    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"⚠️ Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )
    except Exception as e:
        logger.error(f"❌ Detection failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during detection",
        )


@app.post("/train", tags=["Model Management"])
async def train_model(request: DetectRequest):
    """
    Train/retrain the model on provided logs.

    **Request:**
    - logs: List of log strings to train on

    **Response:**
    - success: Whether training was successful
    - message: Status message
    """
    try:
        if predictor is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ML service not initialized",
            )

        logger.info(f"🔄 Training model on {len(request.logs)} logs...")

        predictor.train_on_batch(request.logs)

        return {"success": True, "message": "Model training complete"}

    except Exception as e:
        logger.error(f"❌ Training failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Training failed",
        )


@app.get("/status", tags=["Model Management"])
async def model_status():
    """Get current model status."""
    if predictor is None:
        return {"status": "not_initialized"}

    return {
        "status": "ready",
        "model_type": "IsolationForest",
        "contamination": predictor.model.contamination,
        "model_path": predictor.model.model_path,
    }


# ============================================================================
# Error Handlers
# ============================================================================


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP Exception: {exc.detail}")
    return {"success": False, "error": exc.detail}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
    )
