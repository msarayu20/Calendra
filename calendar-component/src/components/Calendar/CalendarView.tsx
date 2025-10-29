import React, { useState } from 'react';
import type { CalendarEvent, CalendarViewProps } from './CalendarView.types';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView: React.FC<Partial<CalendarViewProps>> = ({
  events = [],
  onEventAdd = () => {},
  onEventUpdate = () => {},
  onEventDelete = () => {},
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [view, setView] = useState<'month' | 'week'>(initialView);

  // Placeholder for month grid (6 weeks x 7 days)
  const renderMonthGrid = () => (
    <div className="grid grid-cols-7 gap-px bg-neutral-200 rounded-xl overflow-hidden">
      {daysOfWeek.map((day) => (
        <div key={day} className="bg-neutral-50 py-2 text-center font-medium text-neutral-700">
          {day}
        </div>
      ))}
      {/* 42 day cells placeholder */}
      {Array.from({ length: 42 }).map((_, i) => (
        <div key={i} className="bg-white h-24 border border-neutral-100" />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
      {/* Navigation and controls will go here */}
      {view === 'month' && renderMonthGrid()}
      {/* Week view and modals will be added later */}
    </div>
  );
};

export default CalendarView;
