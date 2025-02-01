export type DailyTask = { daysComplete?: boolean[]; id: string; name: string; points: number; weeklyMax?: number };

export type WeekTask = { complete?: boolean; id: string; name: string; points: number };

export type WeeklyPlanner = { dailyTasks: DailyTask[]; weekStart: string; weekTasks: WeekTask[] };
