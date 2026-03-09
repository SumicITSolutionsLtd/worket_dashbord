import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import { Card } from '../ui';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'cyan';
  variant?: 'large' | 'small';
  sparkline?: number[];
}

const colorClasses = {
  blue: 'bg-primary-100/80 text-primary-600',
  green: 'bg-green-100/80 text-green-600',
  purple: 'bg-purple-100/80 text-purple-600',
  amber: 'bg-amber-100/80 text-amber-600',
  rose: 'bg-rose-100/80 text-rose-600',
  cyan: 'bg-cyan-100/80 text-cyan-600',
};

const sparklineFillColors: Record<string, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
  variant = 'large',
  sparkline,
}) => {
  const sparklineData =
    sparkline?.map((v, i) => ({ value: v, index: i })) ?? [];

  if (variant === 'small') {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <p className="text-sm text-gray-500 truncate">{title}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`p-3 rounded-xl flex-shrink-0 ${colorClasses[color]}`}>
          {icon}
        </div>
        {sparklineData.length > 0 && (
          <div className="absolute top-4 right-4 w-24 h-10 opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sparklineData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id={`sparkline-${color}-${title.replace(/\s+/g, '-')}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={sparklineFillColors[color]}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={sparklineFillColors[color]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip content={<></>} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineFillColors[color]}
                  strokeWidth={1.5}
                  fill={`url(#sparkline-${color}-${title.replace(/\s+/g, '-')})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
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
            {Math.abs(trend.value)}% last month
          </span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
