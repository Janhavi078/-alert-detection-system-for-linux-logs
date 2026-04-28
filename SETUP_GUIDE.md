# 🚀 PRODUCTION ML SERVICE + NODE INTEGRATION SETUP

## ✅ WHAT'S BEEN COMPLETED

### ✨ Python ML Service (COMPLETE)
- ✅ `main.py` - FastAPI entry point with full API
- ✅ `models/isolation_forest.py` - Isolation Forest model with persistence
- ✅ `models/predictor.py` - Full ML pipeline orchestration + reasoning engine
- ✅ `utils/preprocessor.py` - Log parsing with regex patterns
- ✅ `utils/feature_extractor.py` - Feature engineering (10 features)
- ✅ `tests/test_predictor.py` - Comprehensive unit tests
- ✅ `requirements.txt` - All dependencies
- ✅ `.instructions.md` - GitHub Copilot structured prompt

### ✨ Node.js Integration (COMPLETE)
- ✅ `server/services/mlService.js` - Updated with full integration
- ✅ `server/routes/mlRoutes.js` - New ML route handlers
- ✅ `server/app.js` - Updated to register ML routes

### ✨ Documentation
- ✅ `.instructions.md` - Production-grade Copilot prompt
- ✅ Full README in ml-service/

---

## 🎯 QUICK START (5 MINUTES)

### Step 1: Setup Python ML Service

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Start ML Service

```bash
# Option A: Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Option B: Production
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
✅ ML service initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Test ML Service

```bash
# Health check
curl http://localhost:8000/health

# Test detection
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "Failed password for root from 192.168.1.10 port 22",
      "Failed password for root from 192.168.1.10 port 22",
      "Accepted password for user from 10.0.0.5"
    ]
  }'
```

### Step 4: Start Node.js Backend

```bash
cd ../server

# Install dependencies (if needed)
npm install

# Start server
npm start
```

### Step 5: Test Integration

```bash
# Call Node backend (which calls Python ML service)
curl -X POST http://localhost:5000/api/ml/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "Failed password for root from 192.168.1.10 port 22",
      "Accepted password for user from 10.0.0.5"
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_logs": 2,
    "anomalies_detected": 1,
    "normal_logs": 1,
    "average_score": 0.50,
    "results": [
      {
        "log": "Failed password for root from 192.168.1.10 port 22",
        "anomaly": true,
        "score": 0.87,
        "reason": "Multiple failed login attempts detected"
      },
      {
        "log": "Accepted password for user from 10.0.0.5",
        "anomaly": false,
        "score": 0.12,
        "reason": "Normal login activity"
      }
    ]
  }
}
```

---

## 📡 API ENDPOINTS

### Python ML Service (Port 8000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check |
| GET | `/health` | Detailed health info |
| POST | `/detect` | Analyze logs for anomalies |
| POST | `/train` | Train/retrain model |
| GET | `/status` | Model status info |

### Node.js Backend (Port 5000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ml/analyze` | Analyze logs (calls ML service) |
| POST | `/api/ml/batch-analyze` | Analyze multiple sources |
| GET | `/api/ml/status` | Check ML service status |
| GET | `/api/ml/health` | Health check |

---

## 🧠 ML PIPELINE FLOW

```
Raw Log String
    ↓
┌─────────────────────────────────┐
│ 1. PREPROCESSOR                 │
│ - Clean text                    │
│ - Extract IP, user, port, status│
└─────────────────────────────────┘
    ↓
Parsed Log Dict
    ↓
┌─────────────────────────────────┐
│ 2. FEATURE EXTRACTOR            │
│ - failed_login_count            │
│ - success_login_count           │
│ - ip_frequency                  │
│ - unique_ip_flag                │
│ - failed_ratio                  │
│ - etc (10 features total)       │
└─────────────────────────────────┘
    ↓
Pandas DataFrame (numerical)
    ↓
┌─────────────────────────────────┐
│ 3. ISOLATION FOREST             │
│ - Load/train model              │
│ - Predict: -1 or 1              │
│ - Score: 0-1 confidence         │
└─────────────────────────────────┘
    ↓
Predictions + Scores
    ↓
┌─────────────────────────────────┐
│ 4. REASON GENERATOR             │
│ - Analyze parsed log            │
│ - Match to anomaly patterns     │
│ - Generate explanation          │
└─────────────────────────────────┘
    ↓
Results (log, anomaly, score, reason)
```

---

## 🧪 TESTING

### Test ML Service Directly

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Single detection
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"logs": ["Failed password for root from 192.168.1.10 port 22"]}'

# 3. Multiple logs
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "Failed password for root from 192.168.1.10 port 22",
      "Failed password for root from 192.168.1.10 port 22",
      "Failed password for root from 192.168.1.10 port 22",
      "Accepted password for user from 10.0.0.5"
    ]
  }'

# 4. Train model
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"logs": ["Your training logs here"]}'
```

### Test Node Integration

```bash
# 1. Call analyze endpoint
curl -X POST http://localhost:5000/api/ml/analyze \
  -H "Content-Type: application/json" \
  -d '{"logs": ["Failed password for root from 192.168.1.10 port 22"]}'

# 2. Check ML service status
curl http://localhost:5000/api/ml/status

# 3. Batch analyze
curl -X POST http://localhost:5000/api/ml/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [
      {
        "name": "auth.log",
        "logs": ["Failed password for root from 192.168.1.10 port 22"]
      },
      {
        "name": "syslog",
        "logs": ["Accepted password for user from 10.0.0.5"]
      }
    ]
  }'
```

### Run Python Unit Tests

```bash
cd ml-service

# Run all tests
python -m unittest discover tests/ -v

# Run specific test
python -m unittest tests.test_predictor.TestPredictor.test_predict_returns_results -v
```

---

## 📊 FEATURES DETECTED BY ML

### Authentication Logs
- **Failed Logins** - Multiple failed attempts from same IP
- **Brute Force** - Rapid repeated failures
- **Unusual IPs** - New IP addresses (unique_ip_flag)
- **Port Anomalies** - Non-standard SSH ports

### Example Detections

| Log | Anomaly | Score | Reason |
|-----|---------|-------|--------|
| Failed password for root from 192.168.1.10 port 22 | ✅ | 0.87 | Multiple failed login attempts detected |
| Failed password for root from 192.168.1.10 port 22 | ✅ | 0.85 | Multiple failed login attempts detected |
| Failed password for root from 192.168.1.10 port 22 | ✅ | 0.88 | Multiple failed login attempts detected |
| Accepted password for user from 10.0.0.5 | ❌ | 0.12 | Normal login activity |

---

## 🔌 ENVIRONMENT VARIABLES

### ML Service (.env)
```
HOST=0.0.0.0
PORT=8000
CONTAMINATION=0.05
MODEL_PATH=./data/trained_model.pkl
LOG_LEVEL=INFO
```

### Node Backend (.env)
```
ML_SERVICE_URL=http://localhost:8000
ML_TIMEOUT=30000
```

---

## 🐛 TROUBLESHOOTING

### ML Service won't start

```bash
# Check Python version
python --version  # Need 3.8+

# Verify pip packages
pip list | grep fastapi

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### "Connection refused" errors

```bash
# Check if ML service is running
curl http://localhost:8000/health

# Check if port 8000 is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux
```

### Feature mismatch error

```bash
# Delete model and retrain
rm ml-service/data/trained_model.pkl

# Service will auto-retrain on next request
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"logs": ["test log"]}'
```

### Node can't reach ML service

```bash
# Verify ML_SERVICE_URL in Node .env
cat server/.env | grep ML_SERVICE_URL

# Update if needed
echo "ML_SERVICE_URL=http://localhost:8000" >> server/.env

# Restart Node service
npm restart
```

---

## 🚀 DOCKER SETUP (Optional)

### Run ML Service in Docker

```bash
cd ml-service

# Build image
docker build -t ml-service:latest .

# Run container
docker run -p 8000:8000 -v $(pwd)/data:/app/data ml-service:latest
```

### Docker Compose (Both Services)

```bash
# From root directory
docker-compose up -d

# Check logs
docker-compose logs -f
```

---

## 📈 NEXT STEPS

### Phase 2 Enhancements
- 🔄 Real-time WebSocket alerts (Socket.io)
- 🔄 Model retraining scheduler
- 🔄 Time-series anomaly detection
- 🔄 User behavior profiling
- 🔄 Geo-IP anomaly detection

### Phase 3 Advanced
- 🔄 LSTM for sequential anomalies
- 🔄 Ensemble models (Forest + KNN + LOF)
- 🔄 Federated learning
- 🔄 AutoML pipeline

---

## ✅ VERIFICATION CHECKLIST

- [ ] Python venv created
- [ ] ML dependencies installed (`pip install -r requirements.txt`)
- [ ] ML service starts on port 8000
- [ ] `/health` endpoint responds
- [ ] `/detect` endpoint works with test logs
- [ ] Node backend running on port 5000
- [ ] `/api/ml/analyze` endpoint works
- [ ] Dashboard displays alerts from ML service
- [ ] Logs show "✅ Anomalies detected"

---

## 🎉 YOU'RE DONE!

Your alert detection system now has **production-ready ML anomaly detection**:

✅ Full Python ML microservice  
✅ Node.js integration layer  
✅ Feature engineering pipeline  
✅ Explainable anomaly detection  
✅ API endpoints for both services  
✅ Comprehensive testing & logging  

**Now you can:**
1. Feed real Linux logs
2. Get anomaly scores + explanations
3. Display alerts in your React dashboard
4. Monitor security threats in real-time

---

**Built with FastAPI + Isolation Forest 🚀**
