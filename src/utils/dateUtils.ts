export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString === today;
};

export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 6),
  );

  return date >= startOfWeek && date <= endOfWeek;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const getMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
};

export const calculateStreak = (completions: string[]): number => {
  if (completions.length === 0) return 0;

  const sortedDates = completions.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  let streak = 0;
  let currentDate = new Date();

  for (const dateString of sortedDates) {
    const completionDate = new Date(dateString);
    const diffTime = currentDate.getTime() - completionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak++;
      currentDate = new Date(completionDate);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
