import { useEffect, useState } from 'react';
import { logService } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetches alerts from Node.js Backend [cite: 89, 131]
    logService.getAlerts().then(res => setAlerts(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4">Security Alerts</h2>
      <div className="list-group">
        {alerts.map((alert, index) => (
          <div key={index} className="list-group-item bg-secondary text-white mb-2 border-start border-danger border-4">
            <div className="d-flex justify-content-between">
              <h5 className="mb-1">Anomaly Detected</h5>
              <span className="badge bg-danger">Score: {alert.score}</span> {/* [cite: 70, 106] */}
            </div>
            <p className="mb-1">{alert.reason}</p> {/* [cite: 71, 107] */}
            <small className="text-light opacity-50">Timestamp: {alert.timestamp}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;