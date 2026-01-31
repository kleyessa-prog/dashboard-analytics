// Generate date range
const generateDateRange = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const generateHourlyRange = () => {
  const hours = [];
  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(hour.toISOString());
  }
  return hours;
};

// Overview Dashboard Sample Data
export const overviewData = {
  kpis: {
    servers: { total: 4, healthy: 4 },
    vms: { total: 32, healthy: 30 },
    queueSize: 245,
    totalPatients: 12450,
    activeAlerts: 3,
    successRate: 94.2,
    avgProcessTime: 4.2,
    newPatientsToday: 145,
  },
  charts: {
    systemHealthTrend: generateHourlyRange().map((time) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      healthyServers: 4,
      healthyVms: 30 + Math.floor(Math.random() * 3) - 1,
    })),
    processingThroughput: generateDateRange(7).map((date) => ({
      date,
      processed: 40 + Math.floor(Math.random() * 20),
      target: 480,
    })),
    queueStatus: {
      pending: 180,
      processing: 15,
      done: 45,
      error: 5,
    },
    patientGrowth: generateDateRange(30).map((date) => ({
      date,
      new: 120 + Math.floor(Math.random() * 50),
    })),
    alertSeverity: {
      critical: 3,
      warning: 5,
      info: 4,
    },
    resourceUsage: [
      { serverId: 'Server 1', cpu: 45.2, memory: 62.8, disk: 30.1 },
      { serverId: 'Server 2', cpu: 52.3, memory: 58.4, disk: 35.2 },
      { serverId: 'Server 3', cpu: 38.7, memory: 65.1, disk: 28.9 },
      { serverId: 'Server 4', cpu: 48.9, memory: 60.3, disk: 32.5 },
    ],
  },
};

// Patient Analytics Sample Data
export const patientData = {
  kpis: {
    totalPatients: 12450,
    newToday: 145,
    emrAssignmentRate: 98.5,
    avgPerDay: 132,
  },
  charts: {
    growthTrend: generateDateRange(30).map((date, i) => ({
      date,
      total: 10000 + i * 150 + Math.floor(Math.random() * 50),
      new: 120 + Math.floor(Math.random() * 50),
    })),
    byLocation: [
      { locationName: 'Downtown Clinic', count: 3240 },
      { locationName: 'North Medical Center', count: 2890 },
      { locationName: 'South Health Center', count: 2150 },
      { locationName: 'East Hospital', count: 1980 },
      { locationName: 'West Clinic', count: 1520 },
      { locationName: 'Central Medical', count: 670 },
    ],
  },
};

// Queue Processing Sample Data
export const queueData = {
  kpis: {
    queueSize: 245,
    processingRate: 48,
    successRate: 94.2,
    avgProcessingTime: 4.2,
  },
  charts: {
    statusDistribution: {
      pending: 180,
      processing: 15,
      done: 45,
      error: 5,
    },
    successFailureRate: generateDateRange(7).map((date) => ({
      date,
      success: 85 + Math.floor(Math.random() * 10),
      failure: 5 + Math.floor(Math.random() * 5),
    })),
    processingTimeTrend: generateDateRange(7).map((date) => ({
      date,
      avgTime: 3.8 + Math.random() * 0.8,
    })),
  },
};

// VM Health Sample Data
export const vmHealthData = {
  kpis: {
    totalVms: 32,
    healthyVms: 30,
    processingVms: 15,
    uipathRunning: 28,
  },
  charts: {
    vmHeatmap: Array.from({ length: 32 }, (_, i) => {
      const serverNum = Math.floor(i / 8) + 1;
      const vmNum = (i % 8) + 1;
      const statuses = ['healthy', 'healthy', 'healthy', 'idle', 'unhealthy'];
      return {
        vmId: `server${serverNum}-vm${vmNum}`,
        serverId: `server${serverNum}`,
        status: statuses[Math.floor(Math.random() * statuses.length)] as 'healthy' | 'idle' | 'unhealthy',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
      };
    }),
    uipathStatus: {
      running: 28,
      stopped: 3,
      error: 1,
    },
  },
};

// Server Health Sample Data
export const serverHealthData = {
  kpis: {
    totalServers: 4,
    healthyServers: 4,
    avgCpuUsage: 46.3,
    avgMemoryUsage: 61.7,
  },
  charts: {
    servers: [
      {
        serverId: 'Server 1',
        status: 'healthy',
        cpu: 45.2,
        memory: 62.8,
        disk: 30.1,
        vmCount: 8,
        healthyVmCount: 8,
      },
      {
        serverId: 'Server 2',
        status: 'healthy',
        cpu: 52.3,
        memory: 58.4,
        disk: 35.2,
        vmCount: 8,
        healthyVmCount: 7,
      },
      {
        serverId: 'Server 3',
        status: 'healthy',
        cpu: 38.7,
        memory: 65.1,
        disk: 28.9,
        vmCount: 8,
        healthyVmCount: 8,
      },
      {
        serverId: 'Server 4',
        status: 'healthy',
        cpu: 48.9,
        memory: 60.3,
        disk: 32.5,
        vmCount: 8,
        healthyVmCount: 7,
      },
    ],
    resourceTrends: generateHourlyRange().map((time) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      servers: [
        { serverId: 'Server 1', cpu: 40 + Math.random() * 15, memory: 55 + Math.random() * 15, disk: 25 + Math.random() * 10 },
        { serverId: 'Server 2', cpu: 45 + Math.random() * 15, memory: 50 + Math.random() * 15, disk: 30 + Math.random() * 10 },
        { serverId: 'Server 3', cpu: 35 + Math.random() * 15, memory: 60 + Math.random() * 15, disk: 25 + Math.random() * 10 },
        { serverId: 'Server 4', cpu: 42 + Math.random() * 15, memory: 55 + Math.random() * 15, disk: 28 + Math.random() * 10 },
      ],
    })),
    vmDistribution: [
      { serverId: 'Server 1', healthy: 8, unhealthy: 0, idle: 0 },
      { serverId: 'Server 2', healthy: 7, unhealthy: 1, idle: 0 },
      { serverId: 'Server 3', healthy: 8, unhealthy: 0, idle: 0 },
      { serverId: 'Server 4', healthy: 7, unhealthy: 0, idle: 1 },
    ],
  },
};

// Alert Analytics Sample Data
export const alertData = {
  kpis: {
    activeAlerts: 12,
    criticalAlerts: 3,
    warningAlerts: 5,
    resolutionRate: 85.2,
  },
  charts: {
    alertTrend: generateDateRange(7).map((date) => ({
      date,
      created: 8 + Math.floor(Math.random() * 10),
      resolved: 6 + Math.floor(Math.random() * 8),
    })),
    severityDistribution: {
      critical: 3,
      warning: 5,
      info: 4,
    },
    bySource: [
      { source: 'VM', critical: 1, warning: 2, info: 1 },
      { source: 'Server', critical: 1, warning: 1, info: 1 },
      { source: 'UiPath', critical: 1, warning: 1, info: 1 },
      { source: 'Monitor', critical: 0, warning: 1, info: 1 },
    ],
  },
};
