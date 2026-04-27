# 🚨 Alert Detection System for Linux Logs

## 🧠 Overview

This project is a **Machine Learning–based alert detection system** designed to monitor and analyze Linux system logs in real-time. It identifies suspicious activities such as unauthorized login attempts, abnormal behavior, and potential security threats.

The system integrates **React (frontend)**, **Node.js (backend)**, and a **Python-based ML service** to provide intelligent insights and alerts.

---

## ⚙️ Tech Stack

### 🎨 Frontend
- React.js
- Bootstrap
- GSAP + ScrollTrigger
- Recharts (data visualization)

### 🧠 Backend
- Node.js
- Express.js

### 🤖 Machine Learning
- Python (FastAPI)
- Scikit-learn (Isolation Forest / anomaly detection)

### 📊 Log Management
- Elasticsearch
- Logstash / Filebeat
- Kibana (optional)

---

## 🔄 Workflow

```
Linux Logs → Logstash → Elasticsearch → Node.js → Python ML → Node.js → React UI
```

---

## 🚀 Features

- 📊 Real-time dashboard
- 🚨 Alert detection system
- 📜 Log monitoring & filtering
- 🤖 ML-based anomaly detection
- 📈 Insights with anomaly score & reasoning
- ⚡ Scalable and modular architecture
- 🔄 Real-time updates via WebSocket
- 📊 Advanced analytics & insights

---

## 📁 Project Structure

```
├── client/        → React frontend (Vite)
├── server/        → Node.js Express backend
├── ml-service/    → Python FastAPI ML service
└── README.md      → Documentation
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** >= 16.x
- **Python** >= 3.8
- **Docker** (optional, for Elasticsearch)

### 1. Clone Repository

```bash
git clone https://github.com/Janhavi078/-alert-detection-system-for-linux-logs.git
cd -alert-detection-system-for-linux-logs
```

### 2. Setup Elasticsearch (via Docker - Recommended)

```bash
docker run -d --name elasticsearch \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:8.5.0
```

### 3. Install Frontend

```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Install Backend

```bash
cd ../server
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 5. Run ML Service

```bash
cd ../ml-service
pip install -r requirements.txt
uvicorn main:app --reload
# ML Service runs on http://localhost:8000
```

### 🎯 Usage

1. **Start Elasticsearch**: `http://localhost:9200`
2. **Start Backend**: `npm run dev` in `server/`
3. **Start Frontend**: `npm run dev` in `client/`
4. **Start ML Service**: `uvicorn main:app --reload` in `ml-service/`

Access the application at: **http://localhost:5173**

---

## 📋 API Endpoints

### Backend (Node.js)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/logs` | Fetch all logs |
| POST | `/api/logs/filter` | Filter logs by criteria |
| GET | `/api/alerts` | Fetch all alerts |
| POST | `/api/alerts/acknowledge` | Mark alert as acknowledged |
| GET | `/api/stats` | Get dashboard statistics |

### ML Service (Python)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Get anomaly prediction |
| POST | `/batch-predict` | Process batch of logs |
| GET | `/health` | ML service health |

---

## 📊 Available Scripts

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Backend
```bash
npm start         # Start production server
npm run dev       # Start with nodemon (auto-reload)
npm test          # Run tests
```

### ML Service
```bash
uvicorn main:app --reload                          # Development
uvicorn main:app --host 0.0.0.0 --port 8000       # Production
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- Elasticsearch (port 9200)
- Backend (port 5000)
- ML Service (port 8000)

### Individual Docker Build

```bash
# Build backend
cd server && docker build -t alert-detection-server .

# Build ML service
cd ../ml-service && docker build -t alert-detection-ml .

# Build frontend
cd ../client && docker build -t alert-detection-client .
```

---

## 📚 Documentation

- [Frontend Setup](./client/README.md) - React components and configuration
- [Backend Setup](./server/README.md) - API endpoints and architecture
- [ML Service Guide](./ml-service/README.md) - Model training and predictions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Environment Templates](./.env.example) - Configuration reference

---

## 📌 Future Enhancements

- 🔐 User authentication & role-based access control
- 📡 Advanced WebSocket features for real-time collaboration
- 📊 Advanced analytics dashboard with ML insights
- ☁️ Cloud deployment templates (AWS, GCP, Azure)
- 📱 Mobile application
- 🎓 Interactive model training interface
- 💾 Data persistence optimization
- 🔔 Email/SMS notifications

---

## 🔒 Security Features

- ✅ CORS protection
- ✅ Environment variable management (no hardcoded secrets)
- ✅ Input validation
- ✅ Rate limiting (ready to implement)
- ✅ SSL/TLS support (ready to implement)

---

## 🧪 Testing

### Backend Tests
```bash
cd server && npm test
```

### Frontend Tests
```bash
cd client && npm test
```

### ML Service Tests
```bash
cd ml-service && pytest tests/
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend can't connect to Elasticsearch | Ensure Elasticsearch is running on `http://localhost:9200` |
| Frontend shows "Connection refused" | Verify backend is running and `VITE_API_URL` in `.env` is correct |
| ML predictions return errors | Check Python dependencies: `pip install -r requirements.txt` |
| Socket.io connection fails | Verify `CLIENT_URL` in backend `.env` matches frontend URL |

---

## 📈 Performance Tips

- Use Elasticsearch aggregations for faster queries
- Implement caching for frequently accessed data
- Optimize ML model inference time
- Enable gzip compression in production
- Use CDN for static assets
- Implement database indexing

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📜 License & Copyright

© 2026 **Janhavi**. All Rights Reserved.

This project and its source code are the intellectual property of the author. No part of this project may be copied, modified, distributed, or used without explicit permission.

---

## 💡 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Janhavi078/-alert-detection-system-for-linux-logs/issues)
- Check existing [Documentation](./README.md)
- Contact the author

---


---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: ✅ Active Development
