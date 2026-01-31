import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
  const location = useLocation();

  const breadcrumbMap: Record<string, string> = {
    '/': 'Dashboard',
    '/patients': 'Patient Analytics',
    '/queue': 'Queue Processing',
    '/vm-health': 'VM Health',
    '/server-health': 'Server Health',
    '/alerts': 'Alerts',
  };

  const getBreadcrumbs = () => {
    if (location.pathname === '/') {
      return [{ label: 'Dashboard', path: '/' }];
    }

    const segments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, index, arr) => ({
      label: breadcrumbMap[`/${segment}`] || segment,
      path: '/' + arr.slice(0, index + 1).join('/'),
    }));

    return [{ label: 'Dashboard', path: '/' }, ...breadcrumbs];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-6">
        <Breadcrumb items={getBreadcrumbs()} />
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
