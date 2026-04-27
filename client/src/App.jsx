import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Layout Components
import Sidebar from './components/layout/Sidebar'; // Changed 'Layout' to 'layout'
import AlertToast from './components/common/AlertToast'; // Changed 'Common' to 'common'

// Pages - EXACT MATCH to your filenames
import Dashboard from './pages/Dashboard.jsx'; 
import Alerts from './pages/alert.jsx';        // Your file is 'alert.jsx'
import LogsViewer from './pages/Logsviewer.jsx'; // Your file is 'Logsviewer.jsx'
import Insights from './pages/insights.jsx';    // Your file is 'insights.jsx'



// Initialize Socket connection to your Node.js Backend 
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

function App() {
  const appContainer = useRef();
  const [activeAlert, setActiveAlert] = useState(null);

  // Real-time listener for ML anomalies [cite: 142, 148]
  useEffect(() => {
    socket.on("anomaly-detected", (data) => {
      // data contains: { anomaly: true, score: 0.95, reason: "..." } [cite: 69, 70, 71]
      setActiveAlert(data);
      
      // Auto-clear alert after 6 seconds
      setTimeout(() => setActiveAlert(null), 6000);
    });

    return () => socket.off("anomaly-detected");
  }, []);

  // Professional entry animation [cite: 149]
  useGSAP(() => {
    gsap.from(".app-content", { 
      opacity: 0, 
      y: 20, 
      duration: 1, 
      ease: "power3.out" 
    });
  }, { scope: appContainer });

  // src/App.jsx
return (
  <Router>
    {/* min-vh-100 ensures it takes the full height of the screen */}
    <div ref={appContainer} className="d-flex bg-dark text-light min-vh-100 w-100">
      
      {/* Sidebar - Fixed width [cite: 152] */}
      <Sidebar />
      
      {/* Main Content - flex-grow-1 forces this to take all remaining space */}
      <div className="flex-grow-1 app-content overflow-auto">
        {activeAlert && (
          <AlertToast 
            message={activeAlert.reason} 
            onClose={() => setActiveAlert(null)} 
          />
        )}
        
        <main className="container-fluid p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/logs" element={<LogsViewer />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </div>
  </Router>
);
}

export default App;