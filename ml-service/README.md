# 🤖 ML Service - Alert Detection System

Python FastAPI-based machine learning service for anomaly detection in Linux logs using Isolation Forest algorithm.

---

## 📋 Overview

The ML service is responsible for:
- **Anomaly Detection**: Identify suspicious patterns in logs
- **Scoring**: Generate anomaly scores (0-1)
- **Real-time Processing**: Process logs on-demand or in batches
- **Model Management**: Train, update, and manage ML models
- **Predictions**: Provide confidence scores and reasoning

---

## ⚙️ Tech Stack

- **Python 3.8+** - Language
- **FastAPI** - Web framework
- **Scikit-learn** - Machine learning library
- **Pandas** - Data processing
- **NumPy** - Numerical computing
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python-dotenv** - Configuration management

---

## 📁 Project Structure

```
ml-service/
├── main.py                  # FastAPI app entry point
├── models/
│   ├── __init__.py
│   ├── isolation_forest.py  # Isolation Forest implementation
│   └── predictor.py         # Prediction logic
├── utils/
│   ├── __init__.py
│   ├── preprocessor.py      # Log preprocessing
│   └── feature_extractor.py # Feature engineering
├── data/
│   └── trained_model.pkl    # Serialized model
├── tests/
│   ├── __init__.py
│   └── test_predictor.py    # Unit tests
├── requirements.txt         # Dependencies
├── .env                     # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🚀 Quick Start

### 1. Installation

```bash
cd ml-service
pip install -r requirements.txt
```

### 2. Environment Setup

Create `.env` file in the `ml-service/` directory:

```env
API_PORT=8000
ML_MODEL=isolation-forest
ANOMALY_THRESHOLD=0.7
RANDOM_STATE=42
CONTAMINATION=0.1
```

### 3. Start Development Server

```bash
uvicorn main:app --reload
```

The service will start on `http://localhost:8000`

**Interactive API documentation**: http://localhost:8000/docs

### 4. Production Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ML service is running",
  "model": "isolation-forest",
  "version": "1.0.0"
}
```

### Single Log Prediction

```http
POST /predict
```

**Request Body:**
```json
{
  "log_entry": {
    "timestamp": "2026-04-27T10:30:00Z",
    "source": "auth.log",
    "message": "Failed password for user root from 192.168.1.100",
    "user": "root",
    "severity": "warning"
  }
}
```

**Response:**
```json
{
  "anomaly_score": 0.85,
  "is_anomaly": true,
  "confidence": 0.92,
  "reasoning": "Multiple failed login attempts detected from unusual IP address",
  "risk_level": "high"
}
```

### Batch Prediction

```http
POST /batch-predict
```

**Request Body:**
```json
{
  "logs": [
    {
      "timestamp": "2026-04-27T10:30:00Z",
      "source": "auth.log",
      "message": "Failed password for user",
      "user": "user1",
      "severity": "warning"
    },
    {
      "timestamp": "2026-04-27T10:31:00Z",
      "source": "syslog",
      "message": "Unauthorized access attempt",
      "user": "user2",
      "severity": "critical"
    }
  ]
}
```

**Response:**
```json
{
  "predictions": [
    {
      "log_index": 0,
      "anomaly_score": 0.75,
      "is_anomaly": true,
      "risk_level": "medium"
    },
    {
      "log_index": 1,
      "anomaly_score": 0.92,
      "is_anomaly": true,
      "risk_level": "high"
    }
  ],
  "total_processed": 2,
  "anomalies_detected": 2,
  "processing_time_ms": 45
}
```

### Model Information

```http
GET /model-info
```

**Response:**
```json
{
  "model_type": "isolation-forest",
  "algorithm": "Isolation Forest",
  "contamination": 0.1,
  "n_estimators": 100,
  "max_samples": 256,
  "random_state": 42,
  "training_samples": 5000,
  "last_updated": "2026-04-20T12:00:00Z"
}
```

### Retrain Model

```http
POST /retrain
```

**Request Body:**
```json
{
  "training_data": [
    {
      "timestamp": "2026-04-27T10:30:00Z",
      "source": "auth.log",
      "message": "Failed login",
      "user": "user1",
      "severity": "warning",
      "is_anomaly": true
    }
  ],
  "test_size": 0.2,
  "contamination": 0.1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Model retrained successfully",
  "accuracy": 0.89,
  "training_time_ms": 324,
  "samples_used": 4000
}
```

---

## 🔍 Feature Engineering

### Log Features Extracted

1. **Text Features**
   - Message length
   - Word count
   - Special character count
   - Entropy score

2. **Categorical Features**
   - Log source (auth, syslog, etc.)
   - Severity level (critical, warning, etc.)
   - User type (root, admin, regular user)

3. **Temporal Features**
   - Hour of day
   - Day of week
   - Time since last similar log

4. **Network Features** (if available)
   - IP address reputation
   - Connection frequency
   - Port anomaly

---

## 🤖 Anomaly Detection Algorithm

### Isolation Forest

**How it works:**
1. Randomly selects features and split values
2. Isolates observations through recursive partitioning
3. Anomalies are easier to isolate (shorter paths)
4. Normal points require more splits

**Hyperparameters:**
- `n_estimators`: Number of trees (default: 100)
- `max_samples`: Number of samples per tree (default: 256)
- `contamination`: Expected proportion of anomalies (default: 0.1)
- `random_state`: Seed for reproducibility (default: 42)

**Anomaly Score:**
- Range: 0 to 1
- < 0.5: Normal (score < threshold)
- ≥ 0.5: Anomaly (score ≥ threshold)
- Higher score = stronger anomaly

---

## 📚 Model Training

### Training Data Requirements

```python
# Minimum features per log
{
    "timestamp": str,      # ISO 8601 format
    "source": str,         # Log source
    "message": str,        # Log message
    "user": str,           # User who generated log
    "severity": str        # Log severity
}
```

### Train New Model

```python
from models.isolation_forest import IsolationForestModel

model = IsolationForestModel(
    contamination=0.1,
    n_estimators=100
)

# Fit model
model.fit(training_data)

# Save model
model.save('data/trained_model.pkl')
```

### Cross-Validation

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model,
    X_train,
    cv=5,
    scoring='roc_auc'
)
print(f"CV Score: {scores.mean()}")
```

---

## 🚀 Deployment

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build & Run:**
```bash
docker build -t alert-detection-ml .
docker run -p 8000:8000 --env-file .env alert-detection-ml
```

### Production with Gunicorn

```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 🧪 Testing

### Run Tests

```bash
pip install pytest pytest-cov

# Run all tests
pytest

# With coverage
pytest --cov=models tests/
```

### Example Test

```python
def test_prediction():
    model = IsolationForestModel()
    log = {
        "timestamp": "2026-04-27T10:30:00Z",
        "source": "auth.log",
        "message": "Failed login",
        "user": "user1",
        "severity": "warning"
    }
    result = model.predict(log)
    assert "anomaly_score" in result
    assert 0 <= result["anomaly_score"] <= 1
```

---

## 📊 Performance Optimization

### Caching Predictions

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def predict_cached(log_hash):
    return model.predict(log)
```

### Batch Processing

```python
# Process in batches for efficiency
batch_size = 100
for i in range(0, len(logs), batch_size):
    batch = logs[i:i+batch_size]
    predictions = model.predict_batch(batch)
```

### Model Optimization

```python
# Use smaller contamination for production
model = IsolationForestModel(
    contamination=0.05,  # Fewer false positives
    n_estimators=50      # Faster inference
)
```

---

## 🐛 Common Issues

### Issue: Slow predictions
**Solution**:
- Reduce number of features
- Use smaller max_samples
- Enable caching
- Run with multiple workers

### Issue: Too many false positives
**Solution**:
- Decrease anomaly threshold
- Increase contamination parameter
- Retrain with more representative data

### Issue: Model not converging
**Solution**:
- Ensure training data quality
- Increase n_estimators
- Check for data normalization

---

## 📈 Monitoring & Metrics

### Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Precision | > 0.85 | % of detected anomalies that are true |
| Recall | > 0.80 | % of actual anomalies detected |
| F1-Score | > 0.82 | Harmonic mean of precision & recall |
| Inference Time | < 50ms | Time to predict single log |
| Throughput | > 1000/s | Logs processed per second |

### Health Monitoring

```bash
# Check API health
curl http://localhost:8000/health

# View model info
curl http://localhost:8000/model-info

# Check metrics
curl http://localhost:8000/metrics
```

---

## 🔄 Model Updates

### Scheduled Retraining

```python
# Retrain model weekly with new data
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(retrain_model, 'cron', day_of_week='sun', hour=2)
scheduler.start()
```

### Continuous Learning

```python
# Add new anomalies to training data
def add_to_training_data(log, label):
    training_data.append({**log, "is_anomaly": label})
    if len(training_data) > 10000:
        retrain_model()
```

---

## 📖 Additional Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Isolation Forest Paper](https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08.pdf)
- [Pandas Documentation](https://pandas.pydata.org/)

---

## 🤝 Contributing

1. Create a new branch for your feature
2. Implement changes following code style
3. Add tests for new functionality
4. Run tests and ensure they pass
5. Commit with descriptive messages
6. Push and create a Pull Request

---

## 📞 Support

For issues or questions:
- Check documentation
- Review error logs
- Open an issue on GitHub
- Contact development team

---

**Last Updated**: April 2026
**Version**: 1.0.0
