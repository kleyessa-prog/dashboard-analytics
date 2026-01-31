interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  thresholds?: { warning: number; critical: number };
  height?: number;
}

export const GaugeChart = ({
  value,
  max = 100,
  label,
  thresholds = { warning: 80, critical: 95 },
  height = 200,
}: GaugeChartProps) => {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage >= thresholds.critical) return 'text-error-main';
    if (percentage >= thresholds.warning) return 'text-warning-main';
    return 'text-success-main';
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center" style={{ height }}>
      <div className="relative">
        <svg width="160" height="160" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke={percentage >= thresholds.critical ? '#ef4444' : percentage >= thresholds.warning ? '#f59e0b' : '#10b981'}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getColor()}`}>
              {value.toFixed(1)}%
            </div>
            {label && (
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
