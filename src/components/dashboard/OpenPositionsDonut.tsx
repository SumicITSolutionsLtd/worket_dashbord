import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui';
import type { TopJob } from '../../types/api.types';
import { DUMMY_OPEN_POSITIONS } from '../../data/dashboardDummyData';

const CHART_COLORS = [
  '#3b82f6', // primary-500
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
];

function toChartData(jobs: Array<{ title: string; applicants_count?: number }>) {
  return jobs.map((job) => ({
    name: job.title.length > 20 ? job.title.slice(0, 20) + '…' : job.title,
    value: Math.max(0, job.applicants_count ?? 0),
    fullName: job.title,
  }));
}

/** Fallback chart data so the donut always displays when no API data. */
const FALLBACK_CHART_DATA = toChartData([...DUMMY_OPEN_POSITIONS]);

interface OpenPositionsDonutProps {
  jobs?: TopJob[];
  isLoading?: boolean;
  /** When true, use smaller height and padding for use in the top row (e.g. with KPI cards). */
  compact?: boolean;
}

const OpenPositionsDonut: React.FC<OpenPositionsDonutProps> = ({
  jobs,
  isLoading,
  compact = false,
}) => {
  const rawChartData = jobs?.length ? toChartData(jobs) : [];
  const totalFromRaw = rawChartData.reduce((sum, d) => sum + d.value, 0);
  const useFallback = rawChartData.length === 0 || totalFromRaw === 0;
  const chartData = useFallback ? FALLBACK_CHART_DATA : rawChartData;
  const totalOpenings = chartData.reduce((sum, d) => sum + d.value, 0);

  const cardClass = compact ? 'p-3' : 'p-4';
  const chartHeightClass = compact ? 'h-32 min-h-[120px]' : 'h-40 min-h-[160px]';
  const chartMinHeight = compact ? 120 : 160;

  if (isLoading && rawChartData.length === 0) {
    return (
      <Card className={cardClass}>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">Open Position</h3>
        <div className={`${chartHeightClass} flex items-center justify-center`}>
          <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cardClass}>
      <h3 className="font-semibold text-gray-900 text-sm mb-2">Open Position</h3>
      <div className={`${chartHeightClass} relative`}>
        <ResponsiveContainer width="100%" height="100%" minHeight={chartMinHeight}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, 'Applicants']}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              labelFormatter={(_, payload) =>
                payload[0]?.payload?.fullName ?? payload[0]?.name
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-xl font-bold text-gray-900">
              {totalOpenings}
            </span>
            <p className="text-[10px] text-gray-500 mt-0.5">Total openings</p>
          </div>
        </div>
      </div>
      <div className={`${compact ? 'mt-1' : 'mt-2'} flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600`}>
        {chartData.slice(0, 5).map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {d.fullName.length > 18 ? d.fullName.slice(0, 18) + '…' : d.fullName}{' '}
            ({d.value})
          </span>
        ))}
        {chartData.length > 5 && (
          <span className="text-gray-400">+{chartData.length - 5} more</span>
        )}
      </div>
    </Card>
  );
};

export default OpenPositionsDonut;
