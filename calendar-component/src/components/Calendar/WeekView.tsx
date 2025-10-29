import React from 'react';
import { format, addDays } from 'date-fns';
import { CalendarEvent } from './CalendarView.types';
import { getWeekStart, isSameDay } from '../../utils/date.utils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: DAYS_IN_WEEK }, (_, i) =>
    addDays(weekStart, i)
  );

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventStyle = (event: CalendarEvent) => {
    const startHour = event.time ? parseInt(event.time.split(':')[0]) : 0;
    const duration = event.duration || 1; // Default 1 hour duration
    
    return {
      top: `${(startHour / HOURS_IN_DAY) * 100}%`,
      height: `${(duration / HOURS_IN_DAY) * 100}%`,
      minHeight: '32px',
    };
  };

  const getEventColor = (category?: string) => {
    const colors = {
      work: 'bg-blue-500',
      personal: 'bg-green-500',
      health: 'bg-red-500',
      social: 'bg-purple-500',
      default: 'bg-gray-500',
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        {/* Time column header */}
        <div className="p-2 text-center text-sm font-medium text-gray-700 bg-gray-50">
          Time
        </div>
        
        {/* Day headers */}
        {weekDays.map((day, index) => (
          <div key={index} className="p-2 text-center border-l border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              {format(day, 'EEE')}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-h-full">
          {/* Time column */}
          <div className="bg-gray-50">
            {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-200 flex items-start justify-center pt-1"
              >
                <span className="text-xs text-gray-600">
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-gray-200">
              {/* Hour slots */}
              {Array.from({ length: HOURS_IN_DAY }, (_, hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTimeSlotClick?.(day, hour)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTimeSlotClick?.(day, hour);
                    }
                  }}
                  aria-label={`Time slot ${format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')} on ${format(day, 'EEEE, MMMM d')}`}
                />
              ))}

              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {getEventsForDay(day).map((event) => (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 ${getEventColor(event.category)} text-white text-xs p-1 rounded pointer-events-auto cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                    style={getEventStyle(event)}
                    onClick={() => onEventClick?.(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick?.(event);
                      }
                    }}
                    aria-label={`Event: ${event.title} at ${event.time} on ${format(day, 'EEEE, MMMM d')}`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {event.time && (
                      <div className="opacity-90 truncate">{event.time}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
