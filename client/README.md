# 🚨 Alert Detection System for Linux Logs

## 🧠 Overview

This project is a **Machine Learning–based alert detection system** designed to monitor and analyze Linux system logs in real-time. It identifies suspicious activities such as unauthorized login attempts, abnormal behavior, and potential security threats.

The system integrates **React (frontend)**, **Node.js (backend)**, and a **Python-based ML service** to provide intelligent insights and alerts.

---

## ⚙️ Tech Stack

### 🎨 Frontend

* React.js
* Bootstrap
* GSAP + ScrollTrigger

### 🧠 Backend

* Node.js
* Express.js

### 🤖 Machine Learning

* Python (FastAPI)
* Scikit-learn (Isolation Forest / anomaly detection)

### 📊 Log Management

* Elasticsearch
* Logstash / Filebeat
* Kibana (optional)

---

## 🔄 Workflow

```plaintext
Linux Logs → Logstash → Elasticsearch → Node.js → Python ML → Node.js → React UI
```

---

## 🚀 Features

* 📊 Real-time dashboard
* 🚨 Alert detection system
* 📜 Log monitoring & filtering
* 🤖 ML-based anomaly detection
* 📈 Insights with anomaly score & reasoning
* ⚡ Scalable and modular architecture

---

## 📁 Project Structure

```plaintext
client/        → React frontend  
server/        → Node.js backend  
ml-service/    → Python ML API  
```

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/alert-detection-system-for-linux-logs.git
cd alert-detection-system-for-linux-logs
```

---

### 2. Install Frontend

```bash
cd client
npm install
npm run dev
```

---

### 3. Install Backend

```bash
cd server
npm install
npm start
```

---

### 4. Run ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📌 Future Enhancements

* 🔐 User authentication system
* 📡 Real-time alerts using WebSockets
* 📊 Advanced analytics dashboard
* ☁️ Cloud deployment

---

## 📜 License & Copyright

© 2026 Janhavi. All Rights Reserved.

This project and its source code are the intellectual property of the author.
No part of this project may be copied, modified, distributed, or used without explicit permission.
---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

---

## 💡 Author

Developed by **Janhavi**
