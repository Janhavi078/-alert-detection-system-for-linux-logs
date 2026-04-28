# 🚀 START ALL SERVICES - QUICK COMMANDS

## ⚡ FASTEST WAY TO GET RUNNING (Copy & Paste)

### Terminal 1: Start ML Service (Python)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
✅ ML service initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Terminal 2: Start Node Backend
```bash
cd server
npm install
npm start
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
✅ Connected to Elasticsearch
```

---

### Terminal 3: Start React Frontend
```bash
cd client
npm install
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms
➜ Local:   http://localhost:5173/
```

---

## 📡 VERIFY EVERYTHING WORKS

### Test 1: ML Service Health (Terminal 4)
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

### Test 2: ML Detection
```bash
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

**Expected Response:**
```json
{
  "success": true,
  "results": [
    {
      "log": "Failed password for root from 192.168.1.10 port 22",
      "anomaly": true,
      "score": 0.87,
      "reason": "Multiple failed login attempts detected"
    },
    ...
  ]
}
```

---

### Test 3: Node Integration
```bash
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
    "results": [...]
  }
}
```

---

### Test 4: Frontend
Open browser: **http://localhost:5173**

You should see:
- ✅ Dashboard with alerts
- ✅ Navigation menu
- ✅ Real-time data

---

## 🐳 Using Docker (Alternative)

### Start All Services with Docker Compose
```bash
# From root directory
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## 🧪 RUN UNIT TESTS

### Test ML Service
```bash
cd ml-service
python -m unittest discover tests/ -v
```

**Expected Output:**
```
test_clean_log ... ok
test_parse_log_failed_login ... ok
test_predict_returns_results ... ok
...
Ran 16 tests in 0.234s
OK ✅
```

---

## 🛑 STOP ALL SERVICES

### Kill All Terminals
- Ctrl+C in each terminal

### Or Manually
```bash
# Kill ML service
lsof -ti:8000 | xargs kill -9

# Kill Node backend
lsof -ti:5000 | xargs kill -9

# Kill React frontend
lsof -ti:5173 | xargs kill -9
```

---

## 📊 FULL INTEGRATION TEST

### Step 1: Get System Status
```bash
# Check all services are running
curl http://localhost:8000/status        # ML Service
curl http://localhost:5000/api/ml/status # Node Backend via ML
curl http://localhost:5173/              # React Frontend
```

### Step 2: Send Test Logs
```bash
# Real-world test with multiple scenarios
curl -X POST http://localhost:5000/api/ml/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "Failed password for root from 192.168.1.10 port 22",
      "Failed password for root from 192.168.1.10 port 22",
      "Failed password for root from 192.168.1.10 port 22",
      "Accepted password for admin from 10.0.0.5",
      "Invalid user auth from 192.168.50.100",
      "Accepted password for user from 10.0.0.10"
    ]
  }'
```

### Step 3: Check Dashboard
Open **http://localhost:5173/alert** to see results

### Step 4: Verify Logs
Check browser console for any errors

---

## 🎓 WHAT EACH SERVICE DOES

### 🤖 ML Service (Port 8000)
- Receives raw logs
- Extracts features
- Runs Isolation Forest
- Returns anomaly scores + reasons
- **Technology**: Python + FastAPI

### 🧠 Node Backend (Port 5000)
- Receives logs from frontend/Elasticsearch
- Calls ML service
- Aggregates results
- Exposes API to frontend
- **Technology**: Node.js + Express

### 🎨 React Frontend (Port 5173)
- Displays dashboard
- Shows alerts
- Allows log viewing
- Real-time updates
- **Technology**: React + Bootstrap + GSAP

---

## ⚙️ DEFAULT CONFIGURATION

| Service | Port | URL |
|---------|------|-----|
| ML Service | 8000 | http://localhost:8000 |
| Node Backend | 5000 | http://localhost:5000 |
| React Frontend | 5173 | http://localhost:5173 |

---

## 🚨 COMMON ISSUES & FIXES

### Issue: Port already in use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Issue: Python module not found
```bash
# Reinstall dependencies
pip install -r ml-service/requirements.txt --force-reinstall
```

### Issue: Node modules missing
```bash
# Clean install
rm package-lock.json
npm install
```

### Issue: React not compiling
```bash
# Clear cache and rebuild
rm -rf node_modules .vite
npm install
npm run dev
```

### Issue: ML Service connection error
```bash
# Verify ML service is running
curl http://localhost:8000/health

# Check .env configuration
cat server/.env | grep ML_SERVICE_URL
```

---

## 📚 DOCUMENTATION LINKS

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete setup with explanations |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment verification |
| [ML_SERVICE_SUMMARY.md](./ML_SERVICE_SUMMARY.md) | ML implementation details |
| [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md) | Developer quick reference |
| [ml-service/README.md](./ml-service/README.md) | ML service API docs |

---

## ✅ SUCCESS CHECKLIST

When everything is working:

- ✅ ML Service running on port 8000
- ✅ Node Backend running on port 5000
- ✅ React Frontend running on port 5173
- ✅ All health checks passing
- ✅ API tests returning data
- ✅ Dashboard displaying alerts
- ✅ Console shows no errors

---

## 🎉 YOU'RE DONE!

All three services running = **Full system operational**

**Next Steps:**
1. Test with real logs (see SETUP_GUIDE.md)
2. Configure Elasticsearch connection
3. Deploy to production
4. Monitor performance

---

**Ready? Type these 3 commands in 3 terminals and watch the magic happen! 🚀**

```bash
# Terminal 1
cd ml-service && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Terminal 2
cd server && npm install && npm start

# Terminal 3
cd client && npm install && npm run dev
```

Then open **http://localhost:5173** in your browser! 🎨
