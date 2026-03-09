import React from 'react';
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
import {
  DUMMY_MONTHLY_OVERVIEW,
  DUMMY_OVERVIEW_TOTAL,
  DUMMY_OVERVIEW_TREND_PERCENT,
} from '../../data/dashboardDummyData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

function buildMonthlyData(total: number): { month: string; applicants: number }[] {
  const useTotal = total <= 0 ? 112 : total;
  const points = [0.21, 0.34, 0.46, 0.61, 0.76, 0.88, 1].map((p) =>
    Math.round(useTotal * p)
  );
  return MONTHS.map((month, i) => ({ month, applicants: points[i] }));
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
  const total =
    stats == null
      ? DUMMY_OVERVIEW_TOTAL
      : (stats.pending_applications ?? 0) +
        (stats.shortlisted_applications ?? 0) +
        (stats.hired_applications ?? 0);
  const trendPercent = DUMMY_OVERVIEW_TREND_PERCENT;
  const chartData =
    stats == null
      ? [...DUMMY_MONTHLY_OVERVIEW]
      : buildMonthlyData(
          (stats.pending_applications ?? 0) +
            (stats.shortlisted_applications ?? 0) +
            (stats.hired_applications ?? 0)
        );
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
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendUp weight="bold" className="w-3.5 h-3.5" />
              +{trendPercent}% last year
            </span>
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
