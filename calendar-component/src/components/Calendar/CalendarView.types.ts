// CalendarView types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD) for filtering
  time?: string; // Time in HH:MM format for week view
  duration?: number; // Duration in hours for week view
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
}
