import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis, Cell } from 'recharts';
import { Card } from '../ui';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

interface KPICardProps {
  title: string;
  value: number | undefined;
  /** When not provided, trend row and mini chart are hidden. */
  trend?: { value: number; isPositive: boolean } | null;
  icon: React.ReactNode;
}

/** Generate 6 points for mini bar chart; last bar is tallest (positive) or shortest (negative). */
function miniBarData(value: number, isPositive: boolean): { v: number; index: number }[] {
  const max = Math.max(value, 50);
  const points = isPositive
    ? [0.35, 0.5, 0.45, 0.65, 0.8, 1]
    : [0.9, 0.75, 0.7, 0.55, 0.4, 0.3];
  return points.map((p, i) => ({ v: Math.round(max * p), index: i }));
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon }) => {
  const hasTrend = trend != null;
  const barData = hasTrend ? miniBarData(trend.value, trend.isPositive) : [];
  const barColor = hasTrend && trend.isPositive ? '#10b981' : '#ef4444';
  const barColorLight = hasTrend && trend.isPositive ? '#6ee7b7' : '#fca5a5';

  return (
    <Card className="p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-full bg-primary-100/80 text-primary-600 flex-shrink-0">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' && !Number.isNaN(value) ? value.toLocaleString() : '—'}
      </div>
      {hasTrend && (
        <>
          <div
            className={`flex items-center gap-1 text-sm font-medium mb-4 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? (
              <TrendUp weight="bold" className="w-4 h-4" />
            ) : (
              <TrendDown weight="bold" className="w-4 h-4" />
            )}
            <span>
              {trend.isPositive ? '+' : '-'}
              {trend.value}% last month
            </span>
          </div>
          <div className="mt-auto h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <YAxis hide domain={[0, 'auto']} />
                <Bar dataKey="v" radius={[2, 2, 0, 0]} maxBarSize={12}>
                  {barData.map((entry, i) => (
                    <Cell
                      key={entry.index}
                      fill={i === barData.length - 1 ? barColor : barColorLight}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
};

export default KPICard;
