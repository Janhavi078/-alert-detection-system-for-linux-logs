# 🧠 Backend Server - Alert Detection System

Express.js backend server that handles log processing, real-time communication, and integration with machine learning services.

---

## 📋 Overview

The backend server is responsible for:
- **Log Management**: Retrieve and manage logs from Elasticsearch
- **Real-time Communication**: WebSocket integration for live updates
- **Alert Processing**: Handle alert generation and acknowledgment
- **ML Integration**: Communicate with Python ML service for anomaly detection
- **API Endpoints**: Provide REST API for frontend consumption

---

## ⚙️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **Elasticsearch Client** - Log database connectivity
- **Axios** - HTTP client for ML service
- **Cors** - Cross-Origin Resource Sharing
- **Dotenv** - Environment configuration
- **Nodemon** - Development auto-reload

---

## 📁 Project Structure

```
server/
├── controllers/          # Business logic controllers
├── routes/              # API route definitions
├── services/            # Service layer (data access, utilities)
├── config/              # Configuration files
├── server.js            # Main server entry point
├── app.js               # Express app setup (optional)
├── package.json         # Dependencies
├── .env                 # Environment variables (local)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

---

## 🚀 Quick Start

### 1. Installation

```bash
cd server
npm install
```

### 2. Environment Setup

Create `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Elasticsearch Configuration
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_INDEX=linux-logs
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=

# ML Service Configuration
ML_SERVICE_URL=http://localhost:8000

# Logging
LOG_LEVEL=debug
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload enabled.

### 4. Start Production Server

```bash
npm start
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
  "status": "Server is running",
  "timestamp": "2026-04-27T10:30:00.000Z"
}
```

### Logs

#### Fetch All Logs
```http
GET /api/logs
```

**Query Parameters:**
- `limit`: Number of logs to fetch (default: 100)
- `offset`: Pagination offset (default: 0)
- `sort`: Sort field (default: timestamp)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "log-id",
      "timestamp": "2026-04-27T10:30:00Z",
      "source": "auth.log",
      "message": "Failed password for user",
      "severity": "warning",
      "anomalyScore": 0.85
    }
  ],
  "total": 1500
}
```

#### Filter Logs
```http
POST /api/logs/filter
```

**Request Body:**
```json
{
  "source": "auth.log",
  "severity": "critical",
  "dateRange": {
    "from": "2026-04-27T00:00:00Z",
    "to": "2026-04-27T23:59:59Z"
  },
  "keywords": "failed"
}
```

### Alerts

#### Fetch All Alerts
```http
GET /api/alerts
```

**Query Parameters:**
- `status`: Filter by status (pending, acknowledged, resolved)
- `severity`: Filter by severity (low, medium, high, critical)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "alert-id",
      "logId": "log-id",
      "message": "Suspicious login detected",
      "severity": "high",
      "status": "pending",
      "anomalyScore": 0.92,
      "timestamp": "2026-04-27T10:30:00Z"
    }
  ]
}
```

#### Acknowledge Alert
```http
POST /api/alerts/acknowledge
```

**Request Body:**
```json
{
  "alertId": "alert-id",
  "notes": "Manual review completed"
}
```

### Statistics

#### Get Dashboard Stats
```http
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLogs": 5000,
    "totalAlerts": 45,
    "alertsPending": 12,
    "alertsAcknowledged": 33,
    "anomalyRate": 0.009,
    "topThreats": [
      {
        "type": "brute-force",
        "count": 15
      }
    ]
  }
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Incoming Events

#### New Alert
```javascript
socket.on('new-alert', (alert) => {
  console.log('New alert:', alert);
});
```

#### Log Update
```javascript
socket.on('log-update', (log) => {
  console.log('New log received:', log);
});
```

### Outgoing Events

#### Request Real-time Logs
```javascript
socket.emit('subscribe-logs', {
  source: 'auth.log',
  severity: 'warning'
});
```

---

## 📚 Controllers

### Log Controller
Handles all log-related operations:
- Fetch logs
- Filter logs
- Get log details
- Delete logs (admin only)

### Alert Controller
Manages alert operations:
- Create alerts
- Fetch alerts
- Acknowledge alerts
- Resolve alerts
- Get alert history

### Stats Controller
Provides dashboard statistics:
- Total log count
- Alert metrics
- Anomaly rates
- Top threats

---

## 🔧 Services

### Elasticsearch Service
Wrapper for Elasticsearch operations:
- Connect to Elasticsearch
- Query logs
- Index documents
- Aggregations

### ML Service
Integration with Python ML service:
- Send logs for prediction
- Get anomaly scores
- Batch processing

### Alert Service
Business logic for alerts:
- Generate alerts
- Score determination
- Notification handling

---

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (dev/prod) | `development` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:5173` |
| `ELASTICSEARCH_HOST` | ES endpoint | `http://localhost:9200` |
| `ELASTICSEARCH_INDEX` | ES index name | `linux-logs` |
| `ML_SERVICE_URL` | ML service endpoint | `http://localhost:8000` |
| `LOG_LEVEL` | Logging level | `info` |

---

## 🚀 Deployment

### Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install --production
   ```

2. **Set environment variables**:
   ```bash
   export PORT=5000
   export NODE_ENV=production
   export ELASTICSEARCH_HOST=your-es-host
   ```

3. **Start server**:
   ```bash
   npm start
   ```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t alert-detection-server .
docker run -p 5000:5000 --env-file .env alert-detection-server
```

### PM2 Management

```bash
npm install -g pm2

# Start
pm2 start server.js --name "alert-detection"

# Monitor
pm2 monit

# Logs
pm2 logs alert-detection

# Restart on reboot
pm2 startup
pm2 save
```

---

## 🧪 Testing

### Setup Test Environment

```bash
npm install --save-dev jest supertest
```

### Run Tests

```bash
npm test
```

### Example Test
```javascript
describe('GET /health', () => {
  it('should return server status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Server is running');
  });
});
```

---

## 🐛 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message",
    "details": {}
  }
}
```

### Common Errors

| Code | Message | Solution |
|------|---------|----------|
| `ES_CONNECTION_ERROR` | Cannot connect to Elasticsearch | Check ES_HOST and network |
| `ML_SERVICE_ERROR` | ML service unavailable | Check ML_SERVICE_URL |
| `VALIDATION_ERROR` | Invalid request data | Check request parameters |
| `UNAUTHORIZED` | Authentication required | Provide valid credentials |

---

## 📊 Monitoring & Logging

### Log Levels
- `debug` - Detailed debugging information
- `info` - General information
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal errors

### Example Logging
```javascript
logger.info('Processing log batch', { count: 100 });
logger.error('Elasticsearch connection failed', { error: err });
```

---

## 🔐 Security Best Practices

✅ **Environment Variables**: Never commit `.env` files
✅ **CORS Configuration**: Restrict to known domains
✅ **Input Validation**: Sanitize all inputs
✅ **Rate Limiting**: Implement rate limits (TODO)
✅ **Authentication**: Add JWT or OAuth (TODO)
✅ **HTTPS**: Enable SSL/TLS in production
✅ **Secrets Management**: Use vault for sensitive data

---

## 🚨 Common Issues

### Issue: Cannot connect to Elasticsearch
```bash
# Check if ES is running
curl http://localhost:9200

# If not running, start Docker container
docker run -d -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.5.0
```

### Issue: ML Service connection errors
```bash
# Verify ML service is running on correct port
curl http://localhost:8000/health

# Check ML_SERVICE_URL in .env
```

### Issue: Port already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port in .env
```

---

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/)
- [Elasticsearch Client Documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes following code style guidelines
3. Test your changes
4. Commit with descriptive messages
5. Push and create a Pull Request

---

## 📞 Support

For issues or questions:
- Check existing documentation
- Review error logs
- Open an issue on GitHub
- Contact the development team

---

**Last Updated**: April 2026
