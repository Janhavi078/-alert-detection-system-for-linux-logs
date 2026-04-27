import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, ClipboardList, BrainCircuit, Activity } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/alerts', name: 'Alerts', icon: <Bell size={20} /> },
    { path: '/logs', name: 'Logs Viewer', icon: <ClipboardList size={20} /> },
    { path: '/insights', name: 'ML Insights', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <div className="bg-dark border-end border-secondary vh-100 p-3" style={{ width: '250px' }}>
      <div className="d-flex align-items-center mb-5 text-info">
        <Activity className="me-2" />
        <span className="fw-bold fs-5">LogGuard AI</span>
      </div>
      <nav className="nav flex-column">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link d-flex align-items-center mb-2 rounded p-2 ${isActive ? 'bg-primary text-white' : 'text-light opacity-75'}`
            }
          >
            <span className="me-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;