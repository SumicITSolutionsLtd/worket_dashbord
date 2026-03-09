import React from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Clock, Briefcase, ArrowRight } from '@phosphor-icons/react';
import { Card } from '../ui';
import type { DashboardStats } from '../../types/api.types';

interface QuickTasksCardProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

const QuickTasksCard: React.FC<QuickTasksCardProps> = ({ stats, isLoading }) => {
  const pending = stats?.pending_applications ?? 0;
  const activeJobs = stats?.active_jobs ?? 0;
  const hasTasks = pending > 0 || activeJobs > 0;

  if (isLoading || !hasTasks) return null;

  const tasks: { icon: React.ReactNode; label: string; to: string }[] = [];
  if (pending > 0) {
    tasks.push({
      icon: <Clock weight="bold" className="w-5 h-5 text-amber-600" />,
      label: `Review ${pending} pending application${pending === 1 ? '' : 's'}`,
      to: '/jobs',
    });
  }
  if (activeJobs > 0) {
    tasks.push({
      icon: <Briefcase weight="bold" className="w-5 h-5 text-primary-600" />,
      label: `${activeJobs} open position${activeJobs === 1 ? '' : 's'}`,
      to: '/jobs',
    });
  }

  if (tasks.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks weight="bold" className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Quick tasks</h3>
      </div>
      <ul className="space-y-2">
        {tasks.map((task, i) => (
          <li key={i}>
            <Link
              to={task.to}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-gray-50/80 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0">{task.icon}</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {task.label}
                </span>
              </div>
              <ArrowRight
                weight="bold"
                className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default QuickTasksCard;
