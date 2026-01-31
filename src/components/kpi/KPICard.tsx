import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'primary',
}: KPICardProps) => {
  const colorClasses = {
    primary: 'bg-white border-primary-200',
    success: 'bg-white border-green-200',
    warning: 'bg-white border-yellow-200',
    error: 'bg-white border-red-200',
  };

  const valueColors = {
    primary: 'text-primary-700',
    success: 'text-success-main',
    warning: 'text-warning-main',
    error: 'text-error-main',
  };

  return (
    <div className={`rounded-lg border-2 p-6 shadow-sm transition-shadow hover:shadow-md ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColors[color]}`}>{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-3 flex items-center">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success-main" />
              ) : (
                <TrendingDown className="h-4 w-4 text-error-main" />
              )}
              <span
                className={`ml-1 text-sm font-medium ${
                  trend.isPositive ? 'text-success-main' : 'text-error-main'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="ml-1 text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-primary-500 opacity-80">{icon}</div>
        )}
      </div>
    </div>
  );
};
