import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  addMonths,
  subMonths,
  addDays,
  format,
  startOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import { Card } from '../ui';
import { Button } from '../ui';
import { CaretLeft, CaretRight, VideoCamera } from '@phosphor-icons/react';
import type { ScheduleEvent } from '../../data/dashboardDummyData';
import { getInitials } from '../../lib/utils';

interface ScheduleCardProps {
  initialMonth?: Date;
  eventsByDate: Record<string, ScheduleEvent[]>;
  interviewCount?: number;
  meetingCount?: number;
  className?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  initialMonth = new Date(2025, 6, 1),
  eventsByDate,
  interviewCount = 3,
  meetingCount = 2,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [activeTab, setActiveTab] = useState<'interview' | 'meeting'>('interview');
  const [selectedDay, setSelectedDay] = useState<Date>(() =>
    addDays(startOfMonth(initialMonth), 7)
  );

  const daysInStrip = useMemo(() => {
    const start = startOfMonth(currentMonth);
    return eachDayOfInterval({ start, end: addDays(start, 13) });
  }, [currentMonth]);

  const dateKey = format(selectedDay, 'yyyy-MM-dd');
  const allEvents = eventsByDate[dateKey] ?? [];
  const interviewEvents = allEvents.slice(0, interviewCount);
  const meetingEvents = allEvents.slice(interviewCount, interviewCount + meetingCount);

  const displayEvents = activeTab === 'interview' ? interviewEvents : meetingEvents;
  const emptyMessage = activeTab === 'interview' ? 'No interviews' : 'No meetings';

  return (
    <Card className={`p-3 flex flex-col h-[280px] overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 text-sm">Schedule</h3>
        <Link
          to="/jobs"
          className="text-[11px] font-medium text-primary-600 hover:text-primary-700"
        >
          See All
        </Link>
      </div>

      <div className="flex items-center justify-between gap-1 mb-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            const next = subMonths(currentMonth, 1);
            setCurrentMonth(next);
            setSelectedDay(startOfMonth(next));
          }}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Previous month"
        >
          <CaretLeft weight="bold" className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium text-gray-900">
          {format(currentMonth, 'MMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => {
            const next = addMonths(currentMonth, 1);
            setCurrentMonth(next);
            setSelectedDay(startOfMonth(next));
          }}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Next month"
        >
          <CaretRight weight="bold" className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5 mb-1.5 flex-shrink-0">
        {daysInStrip.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          return (
            <button
              key={day.getTime()}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                isSelected
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="block">{format(day, 'dd')}</span>
              <span className="block text-[9px] opacity-90">{format(day, 'EEE')}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('interview')}
          className={`px-2 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'interview'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Interview {interviewCount}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('meeting')}
          className={`px-2 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'meeting'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Meeting {meetingCount}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        {displayEvents.length === 0 ? (
          <p className="text-[11px] text-gray-500 py-2">{emptyMessage}</p>
        ) : (
          <div className="flex gap-2 pb-0.5">
            {displayEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[140px] min-w-[140px] p-2 rounded-md border border-gray-100 bg-gray-50/50 flex flex-col"
              >
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 text-xs font-medium">
                    {getInitials(event.name)}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="!py-1.5 !px-2 !text-[10px] font-medium rounded-lg flex-shrink-0 shadow-sm"
                    leftIcon={<VideoCamera weight="bold" className="w-3.5 h-3.5" />}
                  >
                    Join
                  </Button>
                </div>
                <p className="text-[10px] text-gray-500">{event.time}</p>
                <p className="font-medium text-gray-900 text-xs truncate">{event.name}</p>
                <p className="text-[10px] text-gray-600 truncate">{event.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScheduleCard;
