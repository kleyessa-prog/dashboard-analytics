import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Server,
  Activity,
  AlertTriangle,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patient Analytics', icon: Users },
  { path: '/queue', label: 'Queue Processing', icon: ListTodo },
  { path: '/vm-health', label: 'VM Health', icon: Activity },
  { path: '/server-health', label: 'Server Health', icon: Server },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary-900 text-white shadow-lg">
      <div className="p-6 border-b border-primary-800">
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
        <p className="text-sm text-primary-300 mt-1">Operational Dashboard</p>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-accent-600 text-white border-r-4 border-accent-400'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
