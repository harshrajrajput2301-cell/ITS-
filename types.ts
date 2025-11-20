export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // Roll Number (Student) or Emp ID (Teacher)
}

export interface ClassSession {
  id: string;
  subject: string;
  teacherName: string;
  room: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm 24hr format
  endTime: string;
  isCancelled: boolean;
  substituteTeacher?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  senderName: string;
  type: 'info' | 'warning' | 'alert';
  read: boolean;
}

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00"
];