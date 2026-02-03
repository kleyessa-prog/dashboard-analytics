import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
  showCenter?: boolean;
  centerValue?: string | number;
}

export const DonutChart = ({
  data,
  colors = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  showCenter = true,
  centerValue,
}: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const displayValue = centerValue !== undefined ? centerValue : total;

  return (
    <div className="relative w-full" style={{ height, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={showCenter ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {showCenter && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{displayValue}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      )}
    </div>
  );
};
