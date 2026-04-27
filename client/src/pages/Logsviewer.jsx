import { useState, useEffect } from 'react';
import { logService } from '../services/api';

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    logService.getLogs().then(res => setLogs(res.data)); // [cite: 83, 84]
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4">System Logs</h2>
      <div className="table-responsive bg-secondary p-3 rounded">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Source</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td>{log.source}</td> {/* [cite: 47, 48] */}
                <td className="text-truncate" style={{ maxWidth: '400px' }}>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsViewer;