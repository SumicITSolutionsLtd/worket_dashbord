import React from 'react';
import {
  Briefcase,
  Users,
  Buildings,
  ChartLineUp,
  TrendUp,
} from '@phosphor-icons/react';
import { Card, Skeleton } from '../../components/ui';
import {
  useAnalyticsDashboard,
  useMarketInsights,
  useTrendingSkills,
} from '../../hooks/useAdmin';

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
  trend?: { value: string; isPositive: boolean };
}> = ({ icon, label, value, isLoading, trend }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendUp
              weight="bold"
              className={`w-4 h-4 ${
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.value}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
        {icon}
      </div>
    </div>
  </Card>
);

const AdminDashboardPage: React.FC = () => {
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useAnalyticsDashboard();
  const { data: marketInsights } = useMarketInsights();
  const { data: trendingSkills, isLoading: isLoadingSkills } =
    useTrendingSkills();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Briefcase weight="bold" className="w-6 h-6" />}
          label="Total Jobs"
          value={analytics?.total_jobs ?? 0}
          isLoading={isLoadingAnalytics}
        />
        <StatCard
          icon={<Users weight="bold" className="w-6 h-6" />}
          label="Total Users"
          value={analytics?.total_users ?? 0}
          isLoading={isLoadingAnalytics}
        />
        <StatCard
          icon={<Buildings weight="bold" className="w-6 h-6" />}
          label="Total Companies"
          value={analytics?.total_companies ?? 0}
          isLoading={isLoadingAnalytics}
        />
        <StatCard
          icon={<ChartLineUp weight="bold" className="w-6 h-6" />}
          label="Total Skills"
          value={analytics?.total_skills ?? 0}
          isLoading={isLoadingAnalytics}
        />
      </div>

      {/* Trending Skills */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trending Skills
        </h3>
        {isLoadingSkills ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : trendingSkills && trendingSkills.length > 0 ? (
          <div className="space-y-3">
            {trendingSkills.slice(0, 10).map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{skill.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {skill.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No trending skills</p>
        )}
      </Card>

      {/* Market Insights */}
      {analytics?.trending_skills && analytics.trending_skills.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Growing Skills
          </h3>
          <div className="space-y-3">
            {analytics.trending_skills.map((trend) => (
              <div
                key={trend.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {trend.skill.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {trend.job_count} jobs • {trend.growth_percentage}% growth
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    +{trend.growth_percentage}%
                  </p>
                  <p className="text-xs text-gray-500">Growth</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Market Insights */}
      {marketInsights && marketInsights.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Insights by Category
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Demand Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Job Openings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Salary Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marketInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900 capitalize">
                        {insight.skill_category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px] relative overflow-hidden">
                          <div
                            className="bg-primary-500 h-2 rounded-full absolute inset-y-0 left-0"
                            style={{ width: `${insight.demand_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {insight.demand_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {insight.job_openings}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {insight.salary_range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardPage;
