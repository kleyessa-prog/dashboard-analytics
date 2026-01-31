import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Overview } from './pages/Overview';
import { PatientAnalytics } from './pages/PatientAnalytics';
import { QueueAnalytics } from './pages/QueueAnalytics';
import { VmHealthAnalytics } from './pages/VmHealthAnalytics';
import { ServerHealthAnalytics } from './pages/ServerHealthAnalytics';
import { AlertAnalytics } from './pages/AlertAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="patients" element={<PatientAnalytics />} />
          <Route path="queue" element={<QueueAnalytics />} />
          <Route path="vm-health" element={<VmHealthAnalytics />} />
          <Route path="server-health" element={<ServerHealthAnalytics />} />
          <Route path="alerts" element={<AlertAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
