# 🚨 Alert Detection System for Linux Logs

A **Machine Learning–based alert detection system** designed to monitor and analyze Linux system logs in real-time, identifying suspicious activities, unauthorized login attempts, abnormal behavior, and potential security threats.

## 🧠 Overview

The system integrates **React (frontend)**, **Node.js (backend)**, and a **Python-based ML service** to provide intelligent insights and alerts with automated anomaly detection.

---

## ⚙️ Tech Stack

### 🎨 Frontend
- **React.js** - UI framework
- **Bootstrap** - CSS framework
- **GSAP + ScrollTrigger** - Animations
- **Recharts** - Data visualization
- **Socket.io** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation

### 🧠 Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time events
- **Elasticsearch** - Log storage & search
- **Axios** - HTTP requests

### 🤖 Machine Learning
- **Python** - ML language
- **FastAPI** - API framework
- **Scikit-learn** - Anomaly detection (Isolation Forest)
- **Pandas** - Data processing

### 📊 Log Management
- **Elasticsearch** - Distributed search & analytics
- **Logstash** - Log pipeline
- **Filebeat** - Log shipper
- **Kibana** - Optional visualization (alternative to our UI)

---

## 🔄 Workflow Architecture

```
Linux Logs → Logstash → Elasticsearch 
    ↓
Node.js Backend (Log aggregation & real-time streaming)
    ↓
Python ML Service (Anomaly detection & scoring)
    ↓
React Frontend (Visualization & Alerts)
```

---

## 🚀 Features

✨ **Real-time Dashboard** - Live monitoring with auto-refresh
🚨 **Alert Detection System** - Intelligent threat identification
📜 **Log Monitoring & Filtering** - Advanced search and filtering
🤖 **ML-based Anomaly Detection** - Isolation Forest algorithms
📈 **Insights & Scoring** - Anomaly scores with detailed reasoning
⚡ **Scalable Architecture** - Modular & extensible design
🔄 **Real-time Updates** - WebSocket integration
📊 **Analytics** - Historical trends and patterns

---

## 📁 Project Structure

```
├── client/                    # React frontend (Vite)
│   ├── src/                   # React components & pages
│   ├── public/                # Static assets
│   ├── index.html             # Entry point
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Environment variables
│
├── server/                    # Node.js Express backend
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── services/              # Service layer
│   ├── config/                # Configuration
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
│
├── ml-service/                # Python FastAPI service
│   ├── main.py                # FastAPI app
│   ├── models/                # ML models
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
└── README.md                  # Project documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** >= 16.x
- **Python** >= 3.8
- **Docker** (optional, for Elasticsearch)
- **Git**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Janhavi078/-alert-detection-system-for-linux-logs.git
cd -alert-detection-system-for-linux-logs
```

### 2️⃣ Setup Elasticsearch (Recommended using Docker)

```bash
docker run -d --name elasticsearch \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:8.5.0
```

Or manually [download Elasticsearch](https://www.elastic.co/downloads/elasticsearch)

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4️⃣ Setup Backend

```bash
cd ../server
npm install
npm run dev
# Backend runs on http://localhost:5000
```

Create `.env` file in `server/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Elasticsearch Configuration
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_INDEX=linux-logs

# ML Service Configuration
ML_SERVICE_URL=http://localhost:8000
```

### 5️⃣ Setup ML Service

```bash
cd ../ml-service
pip install -r requirements.txt
uvicorn main:app --reload
# ML Service runs on http://localhost:8000
```

Create `.env` file in `ml-service/` directory:
```env
API_PORT=8000
ML_MODEL=isolation-forest
ANOMALY_THRESHOLD=0.7
```

---

## 🎯 Usage

1. **Start Elasticsearch**: Ensure it's running on `http://localhost:9200`
2. **Start Backend**: `cd server && npm run dev`
3. **Start Frontend**: `cd client && npm run dev` (in a new terminal)
4. **Start ML Service**: `cd ml-service && uvicorn main:app --reload` (in a new terminal)

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

## 🔒 Security Features

✅ CORS protection
✅ Environment variable management (no hardcoded secrets)
✅ Input validation
✅ Rate limiting (ready to implement)
✅ SSL/TLS support (ready to implement)

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
npm test          # Run tests (configure as needed)
```

### ML Service
```bash
uvicorn main:app --reload                    # Development
uvicorn main:app --host 0.0.0.0 --port 8000 # Production
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build frontend image
cd client && docker build -t alert-detection-client .

# Build backend image
cd server && docker build -t alert-detection-server .

# Build ML service image
cd ml-service && docker build -t alert-detection-ml .

# Run all services with docker-compose
docker-compose up -d
```

### Cloud Platforms
- **AWS**: Deploy with EC2, ECS, or Elastic Beanstalk
- **Google Cloud**: Use App Engine or Cloud Run
- **Azure**: Deploy to Azure App Service
- **Heroku**: Simple deployment with buildpacks

---

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### ML Service Tests
```bash
cd ml-service
pytest tests/
```

---

## 📚 Documentation

- [Frontend Setup Guide](./client/README.md)
- [Backend Setup Guide](./server/README.md)
- [ML Service Documentation](./ml-service/README.md)
- [API Documentation](./API.md)
- [Architecture Diagram](./ARCHITECTURE.md)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Guidelines
- Follow the existing code style
- Write descriptive commit messages
- Update README if adding new features
- Test your changes before submitting PR

---

## 🐛 Troubleshooting

### Issue: Backend can't connect to Elasticsearch
**Solution**: Ensure Elasticsearch is running on the configured host and port

### Issue: Frontend shows "Connection refused" error
**Solution**: Verify backend is running and `VITE_API_URL` in `.env` is correct

### Issue: ML predictions return errors
**Solution**: Check Python dependencies are installed: `pip install -r requirements.txt`

### Issue: Socket.io connection fails
**Solution**: Verify `CLIENT_URL` in backend `.env` matches frontend URL

---

## 📈 Performance Optimization Tips

- Use Elasticsearch aggregations for faster queries
- Implement caching for frequently accessed data
- Optimize ML model inference time
- Enable gzip compression in production
- Use CDN for static assets
- Implement database indexing

---

## 🔄 Future Enhancements

- 🔐 User authentication & role-based access control
- 📡 Advanced WebSocket features for real-time collaboration
- 📊 Advanced analytics dashboard with machine learning insights
- ☁️ Cloud deployment templates
- 📱 Mobile application
- 🎓 Model training interface
- 💾 Data persistence optimization
- 🔔 Email/SMS notifications

---

## 📜 License & Copyright

© 2026 **Janhavi**. All Rights Reserved.

This project and its source code are the intellectual property of the author. No part of this project may be copied, modified, distributed, or used without explicit permission.

---

## 💡 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Janhavi078/-alert-detection-system-for-linux-logs/issues)
- Contact the author
- Check existing documentation

---

## 👨‍💻 Author

**Janhavi**

- GitHub: [Janhavi078](https://github.com/Janhavi078)
- Email: [Contact]

---

**Last Updated**: April 2026
**Version**: 1.0.0
