interface HeatmapProps {
  data: { vmId: string; serverId: string; status: 'healthy' | 'idle' | 'unhealthy' }[];
  cols?: number;
}

export const Heatmap = ({ data, cols = 8 }: HeatmapProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-success-main';
      case 'idle':
        return 'bg-warning-main';
      case 'unhealthy':
        return 'bg-error-main';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {data.map((item, index) => (
        <div
          key={item.vmId}
          className={`${getStatusColor(item.status)} h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
          title={`${item.vmId}\n${item.serverId}\nStatus: ${item.status}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};
