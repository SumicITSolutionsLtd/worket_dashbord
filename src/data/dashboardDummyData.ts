/**
 * Dummy data for dashboard layout preview. Replace or override with API data when available.
 */

export const DUMMY_KPI = {
  applicants: 198,
  interviewed: 105,
  hired: 28,
  trendApplicants: { value: 18.5, isPositive: true },
  trendInterviewed: { value: 12.3, isPositive: true },
  trendHired: { value: 8.2, isPositive: false },
} as const;

export const DUMMY_OPEN_POSITIONS = [
  { id: 1, title: 'UI Designer', applicants_count: 18 },
  { id: 2, title: 'Marketing', applicants_count: 32 },
  { id: 3, title: 'Graphic Design', applicants_count: 12 },
  { id: 4, title: 'Engineering', applicants_count: 33 },
] as const;

export const DUMMY_MONTHLY_OVERVIEW = [
  { month: 'Jan', applicants: 24 },
  { month: 'Feb', applicants: 38 },
  { month: 'Mar', applicants: 52 },
  { month: 'Apr', applicants: 68 },
  { month: 'May', applicants: 85 },
  { month: 'Jun', applicants: 98 },
  { month: 'Jul', applicants: 112 },
] as const;

export const DUMMY_OVERVIEW_TOTAL = 1056;
export const DUMMY_OVERVIEW_TREND_PERCENT = 28;

export interface ScheduleEvent {
  time: string;
  name: string;
  role: string;
  description: string;
}

/** Events keyed by date string (YYYY-MM-DD) for the schedule card. */
export const DUMMY_SCHEDULE_EVENTS: Record<string, ScheduleEvent[]> = {
  '2025-07-08': [
    {
      time: '08:00',
      name: 'Alex Chen',
      role: 'UI Designer',
      description:
        'Highly motivated and results-oriented UI/UX designer with a passion for crafting user-friendly digital experiences.',
    },
    {
      time: '10:30',
      name: 'Jordan Lee',
      role: 'Frontend Developer',
      description:
        'Experienced frontend developer with strong React and TypeScript skills.',
    },
  ],
  '2025-07-09': [
    {
      time: '14:00',
      name: 'Sam Taylor',
      role: 'Marketing Manager',
      description:
        'Strategic marketer with 5+ years in B2B and growth campaigns.',
    },
  ],
  '2025-07-10': [
    {
      time: '09:00',
      name: 'Morgan Reed',
      role: 'Graphic Designer',
      description:
        'Creative graphic designer with expertise in brand identity and digital assets.',
    },
    {
      time: '11:00',
      name: 'Casey Kim',
      role: 'UI Designer',
      description:
        'Detail-oriented designer focused on accessibility and design systems.',
    },
  ],
};

export const DUMMY_SCHEDULE_MONTH = new Date(2025, 6, 1); // July 2025
export const DUMMY_SCHEDULE_INTERVIEW_COUNT = 3;
export const DUMMY_SCHEDULE_MEETING_COUNT = 2;
