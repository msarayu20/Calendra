import React, { useMemo, useCallback } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { getCalendarGrid, isTodayUtil } from '../../utils/date.utils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  focusedDateIndex: number;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  isFocused: boolean;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  events,
  isToday,
  isCurrentMonth,
  isFocused,
  onDateClick,
  onEventClick,
  onKeyDown,
}) => {
  const dayNumber = date.getDate();

  // Get events for this date
  const dateString = date.toISOString().split('T')[0];
  const dayEvents = useMemo(() =>
    events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateString;
    }), [events, dateString]
  );

  const handleDateClick = useCallback(() => {
    onDateClick(date);
  }, [date, onDateClick]);

  const handleEventClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateClick();
    } else {
      // Pass keyboard navigation to parent
      onKeyDown(e);
    }
  }, [handleDateClick, onKeyDown]);

  return (
    <div
      className={`
        min-h-[120px] p-2 border border-neutral-100 bg-white hover:bg-neutral-50 
        transition-colors cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-primary-500
        ${!isCurrentMonth ? 'text-neutral-400 bg-neutral-50' : ''}
        ${isFocused ? 'ring-2 ring-primary-500' : ''}
      `}
      onClick={handleDateClick}
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={handleKeyDown}
      data-calendar-cell
      aria-label={`${date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}${dayEvents.length > 0 ? `, ${dayEvents.length} events` : ''}`}
      aria-selected={isToday}
    >
      {/* Day number */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${isToday ? 'text-white' : ''}`}>
          {isToday ? (
            <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs">
              {dayNumber}
            </span>
          ) : (
            dayNumber
          )}
        </span>
      </div>

      {/* Events */}
      <div className="space-y-1 overflow-hidden">
        {dayEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
            onClick={(e) => handleEventClick(event, e)}
            title={`${event.title}${event.time ? ` at ${event.time}` : ''}`}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <button
            className="text-xs text-primary-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              // Could open a day view or show all events
            }}
          >
            +{dayEvents.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  focusedDateIndex,
  onDateClick,
  onEventClick,
  onKeyDown,
}) => {
  const calendarGrid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
  }, [currentDate]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-neutral-700 bg-neutral-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7"
        role="grid"
        aria-label={`Calendar for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
      >
        {calendarGrid.map((date, index) => (
          <CalendarCell
            key={date.toISOString()}
            date={date}
            events={events}
            isToday={isTodayUtil(date)}
            isCurrentMonth={isCurrentMonth(date)}
            isFocused={focusedDateIndex === index}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onKeyDown={onKeyDown}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthView;
