import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { Button } from '../ui';
import { Users, TrendUp, Funnel } from '@phosphor-icons/react';
import type { DashboardStats } from '../../types/api.types';

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

/** Aggregate application_trend (daily) into monthly buckets, last 7 months. */
function buildMonthlyDataFromTrend(
  application_trend: Array<{ date: string; count: number }>
): { month: string; applicants: number }[] {
  const byMonth: Record<string, number> = {};
  for (const { date, count } of application_trend) {
    const monthKey = date.slice(0, 7); // YYYY-MM
    byMonth[monthKey] = (byMonth[monthKey] ?? 0) + count;
  }
  const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b));
  const last7 = sorted.slice(-7);
  return last7.map(([ym]) => {
    const monthNum = ym.slice(5, 7);
    return {
      month: MONTH_LABELS[monthNum] ?? monthNum,
      applicants: byMonth[ym] ?? 0,
    };
  });
}

/** Compute simple period trend: last 7 days vs previous 7 days. Returns null if not enough data. */
function computeTrendPercent(
  application_trend: Array<{ date: string; count: number }>
): number | null {
  if (!application_trend.length) return null;
  const sorted = [...application_trend].sort((a, b) => a.date.localeCompare(b.date));
  const mid = Math.floor(sorted.length / 2);
  const prev = sorted.slice(0, mid).reduce((s, d) => s + d.count, 0);
  const curr = sorted.slice(mid).reduce((s, d) => s + d.count, 0);
  if (prev === 0) return curr > 0 ? 100 : null;
  return Math.round(((curr - prev) / prev) * 100);
}

const BAR_FILL = '#3b82f6';
const LINE_STROKE = '#3b82f6';

interface ApplicationsOverviewChartProps {
  stats?: DashboardStats | null;
  isLoading?: boolean;
}

const ApplicationsOverviewChart: React.FC<ApplicationsOverviewChartProps> = ({
  stats,
}) => {
  const { chartData, total, trendPercent } = useMemo(() => {
    if (stats == null || !stats.application_trend?.length) {
      return { chartData: [] as { month: string; applicants: number }[], total: 0, trendPercent: null as number | null };
    }
    const chartData = buildMonthlyDataFromTrend(stats.application_trend);
    const total = stats.total_applications ?? chartData.reduce((s, d) => s + d.applicants, 0);
    const trendPercent = computeTrendPercent(stats.application_trend);
    return { chartData, total, trendPercent };
  }, [stats]);

  const showChart = chartData.length > 0 && chartData.some((d) => d.applicants > 0);

  if (!showChart) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2">Overviews</h3>
        <div className="h-48 flex flex-col items-center justify-center text-gray-500">
          <Users weight="light" className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">No applications yet</p>
          <Link
            to="/jobs/create"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-2"
          >
            Create a job to get started
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Overviews</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-900">
              {total.toLocaleString()}
            </span>
            {trendPercent != null && (
              <span className={`flex items-center gap-1 text-xs font-medium ${trendPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendUp weight="bold" className="w-3.5 h-3.5" />
                {trendPercent >= 0 ? '+' : ''}{trendPercent}% vs previous period
              </span>
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="!py-1.5 !text-xs"
          leftIcon={<Funnel weight="bold" className="w-3.5 h-3.5" />}
        >
          Filters
        </Button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={32}
              domain={[0, (max: number) => Math.ceil((max * 1.15) / 50) * 50]}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value} Applicant${value !== 1 ? 's' : ''}`,
                'Applicants',
              ]}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey="applicants"
              fill={BAR_FILL}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
            <Line
              type="monotone"
              dataKey="applicants"
              stroke={LINE_STROKE}
              strokeWidth={1.5}
              dot={{ fill: LINE_STROKE, r: 3 }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ApplicationsOverviewChart;
