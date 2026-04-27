// // import { useGSAP } from '@gsap/react';
// // import gsap from 'gsap';
// // import { useRef } from 'react';
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// // import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

// // const Dashboard = () => {
// //   const container = useRef();
  
// //   // Sample data - in production, fetch this from /api/stats [cite: 91]
// //   const data = [
// //     { name: '10:00', logs: 400, anomalies: 2 },
// //     { name: '11:00', logs: 700, anomalies: 5 },
// //     { name: '12:00', logs: 200, anomalies: 0 },
// //   ];

// //   useGSAP(() => {
// //     gsap.from(".stat-card", { opacity: 0, y: 30, stagger: 0.2, duration: 0.8 });
// //   }, { scope: container });

// //   return (
// //     <div ref={container} className="p-4">
// //       <h2 className="mb-4">System Overview</h2>
// //       <div className="row g-4 mb-5">
// //         <div className="col-md-4">
// //           <div className="stat-card bg-secondary p-3 rounded d-flex align-items-center">
// //             <Activity className="me-3 text-info" size={40} />
// //             <div><p className="mb-0">Total Logs</p><h4>1,284</h4></div>
// //           </div>
// //         </div>
// //         <div className="col-md-4">
// //           <div className="stat-card bg-secondary p-3 rounded d-flex align-items-center">
// //             <AlertTriangle className="me-3 text-warning" size={40} />
// //             <div><p className="mb-0">Anomalies</p><h4>12</h4></div>
// //           </div>
// //         </div>
// //         <div className="col-md-4">
// //           <div className="stat-card bg-secondary p-3 rounded d-flex align-items-center">
// //             <ShieldCheck className="me-3 text-success" size={40} />
// //             <div><p className="mb-0">System Status</p><h4>Secure</h4></div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div className="bg-secondary p-4 rounded" style={{ height: '400px' }}>
// //         <h5>Log Traffic vs Anomalies</h5>
// //         <ResponsiveContainer width="100%" height="100%">
// //           <LineChart data={data}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#444" />
// //             <XAxis dataKey="name" stroke="#ccc" />
// //             <YAxis stroke="#ccc" />
// //             <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
// //             <Line type="monotone" dataKey="logs" stroke="#0dcaf0" />
// //             <Line type="monotone" dataKey="anomalies" stroke="#ffc107" />
// //           </LineChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const container = useRef();
  
  const data = [
    { name: '10:00', logs: 400, anomalies: 2 },
    { name: '11:00', logs: 710, anomalies: 5 },
    { name: '12:00', logs: 380, anomalies: 1 },
    { name: '13:00', logs: 550, anomalies: 3 },
  ];

  useGSAP(() => {
    gsap.from(".stat-card", { 
      opacity: 0, 
      scale: 0.9, 
      y: 20, 
      stagger: 0.15, 
      duration: 1, 
      ease: "power4.out" 
    });
  }, { scope: container });

  const cardStyle = {
    background: "rgba(45, 45, 55, 0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "transform 0.3s ease"
  };

  return (
    <div ref={container} className="p-4" style={{ backgroundColor: '#121218', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">System Overview</h2>
        <span className="badge bg-dark border border-secondary p-2">Live Status: Active</span>
      </div>

      <div className="row g-4 mb-5">
        {[
          { label: 'Total Logs', val: '1,284', icon: <Activity className="text-info" />, color: 'info' },
          { label: 'Anomalies', val: '12', icon: <AlertTriangle className="text-warning" />, color: 'warning' },
          { label: 'System Status', val: 'SECURE', icon: <ShieldCheck className="text-success" />, color: 'success' }
        ].map((item, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="stat-card p-4 rounded-4 shadow-sm h-100" style={cardStyle}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`p-2 rounded-3 bg-${item.color} bg-opacity-10`}>{item.icon}</div>
                <small className="text-muted">Last 24h</small>
              </div>
              <p className="text-muted small mb-1 uppercase fw-semibold">{item.label}</p>
              <h2 className="fw-bold mb-0">{item.val}</h2>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 rounded-4 shadow-lg" style={cardStyle}>
        <h5 className="mb-4 fw-bold">Log Traffic vs Anomalies</h5>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0dcaf0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0dcaf0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis dataKey="name" stroke="#6c757d" axisLine={false} tickLine={false} />
              <YAxis stroke="#6c757d" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #333', borderRadius: '8px' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="logs" stroke="#0dcaf0" strokeWidth={3} fillOpacity={1} fill="url(#colorLogs)" />
              <Area type="monotone" dataKey="anomalies" stroke="#ffc107" strokeWidth={3} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

