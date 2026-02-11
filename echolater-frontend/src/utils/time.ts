import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { TimeCategory, Idea } from '@/types';

dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

export function categorizeByTime(extractedTime: string | null): TimeCategory {
  if (!extractedTime) return 'inbox';
  const date = dayjs(extractedTime);
  if (!date.isValid()) return 'inbox';

  const todayEnd = dayjs().endOf('day');
  const weekEnd = dayjs().endOf('week');

  if (date.isSameOrBefore(todayEnd)) return 'today';
  if (date.isSameOrBefore(weekEnd)) return 'thisWeek';
  return 'future';
}

export function groupIdeasByCategory(ideas: Idea[]): Record<TimeCategory, Idea[]> {
  return {
    today: ideas.filter((i) => i.timeCategory === 'today'),
    thisWeek: ideas.filter((i) => i.timeCategory === 'thisWeek'),
    future: ideas.filter((i) => i.timeCategory === 'future'),
    inbox: ideas.filter((i) => i.timeCategory === 'inbox'),
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatRelativeTime(dateStr: string): string {
  return dayjs(dateStr).fromNow();
}

export function formatDateTime(dateStr: string): string {
  return dayjs(dateStr).format('MMM D, YYYY h:mm A');
}

export const CATEGORY_LABELS: Record<TimeCategory | 'all', string> = {
  all: 'All',
  today: 'Today',
  thisWeek: 'This Week',
  future: 'Future',
  inbox: 'Inbox',
};

export const CATEGORY_COLORS: Record<TimeCategory, string> = {
  today: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  thisWeek: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  future: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  inbox: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};
