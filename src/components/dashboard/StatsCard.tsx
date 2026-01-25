import React from 'react';
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
}

const colorClasses = {
  blue: 'bg-primary-100/80 text-primary-600',
  green: 'bg-green-100/80 text-green-600',
  purple: 'bg-purple-100/80 text-purple-600',
  amber: 'bg-amber-100/80 text-amber-600',
  rose: 'bg-rose-100/80 text-rose-600',
  cyan: 'bg-cyan-100/80 text-cyan-600',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
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
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{title}</p>
    </Card>
  );
};

export default StatsCard;
