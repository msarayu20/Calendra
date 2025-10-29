import React, { useState, useCallback, useMemo } from 'react';
import type { CalendarEvent, CalendarViewProps } from './CalendarView.types';
import WeekView from './WeekView';
import EventModal from './EventModal';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
  const [focusedDateIndex, setFocusedDateIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();

  // Modal handlers
  const openCreateModal = useCallback((date: Date) => {
    setSelectedEvent(null);
    setModalInitialDate(date);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalInitialDate(undefined);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalInitialDate(undefined);
  }, []);

  const handleModalSave = useCallback((event: CalendarEvent) => {
    if (selectedEvent) {
      onEventUpdate(event.id, event);
    } else {
      onEventAdd(event);
    }
  }, [selectedEvent, onEventAdd, onEventUpdate]);
  const handleCalendarKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (view !== 'month') return;

    const currentIndex = focusedDateIndex;
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(41, currentIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(41, currentIndex + 7);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = 41;
        break;
      default:
        return;
    }

    setFocusedDateIndex(newIndex);
    
    // Focus the new cell
    const cells = document.querySelectorAll('[data-calendar-cell]');
    const targetCell = cells[newIndex] as HTMLElement;
    if (targetCell) {
      targetCell.focus();
    }
  }, [view, focusedDateIndex]);

  // Get calendar grid dates (42 cells for 6 weeks)
  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    // Start from the Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const dates: Date[] = [];
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    
    return dates;
  };

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }, [currentDate]);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  }, [currentDate]);

  const calendarDates = useMemo(() => getCalendarDates(), [currentDate]);

  // Memoized CalendarCell component for performance
  const CalendarCell = React.memo<{
    date: Date;
    events: CalendarEvent[];
    isToday: boolean;
    isCurrentMonth: boolean;
    onDateClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
    isFocused: boolean;
  }>(({ date, events, isToday, isCurrentMonth, onDateClick, onEventClick, isFocused }) => {
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
        handleCalendarKeyDown(e);
      }
    }, [handleDateClick, handleCalendarKeyDown]);

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
        <div className="flex justify-between items-start mb-1">
          <span
            className={`
              text-sm font-medium
              ${isToday 
                ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' 
                : isCurrentMonth 
                  ? 'text-neutral-900' 
                  : 'text-neutral-400'
              }
            `}
          >
            {dayNumber}
          </span>
        </div>
        
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="text-xs px-2 py-1 rounded text-white truncate cursor-pointer hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-white"
              style={{ backgroundColor: event.color || '#3b82f6' }}
              onClick={(e) => handleEventClick(event, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onEventClick(event);
                }
              }}
              aria-label={`Event: ${event.title}${event.time ? ` at ${event.time}` : ''}`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <button 
              className="text-xs text-primary-600 hover:underline focus:outline-none focus:underline px-2"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Show all ${dayEvents.length} events for ${date.toDateString()}`);
              }}
              aria-label={`Show ${dayEvents.length - 3} more events`}
            >
              +{dayEvents.length - 3} more
            </button>
          )}
        </div>
      </div>
    );
  });

  const renderCalendarCell = (date: Date, index: number) => {
    return (
      <CalendarCell
        key={date.toISOString()}
        date={date}
        events={events}
        isToday={isToday(date)}
        isCurrentMonth={isCurrentMonth(date)}
        isFocused={focusedDateIndex === index}
        onDateClick={(clickedDate) => {
          openCreateModal(clickedDate);
        }}
        onEventClick={(event) => {
          openEditModal(event);
        }}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-neutral-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView(view === 'month' ? 'week' : 'month')}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            {view === 'month' ? 'Month' : 'Week'}
            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {view === 'month' ? (
          <>
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-200">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-3 text-center text-sm font-medium text-neutral-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar dates grid */}
            <div className="grid grid-cols-7" role="grid">
              {calendarDates.map((date, index) => renderCalendarCell(date, index))}
            </div>
          </>
        ) : (
          <div className="h-[600px]">
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={(event) => {
                openEditModal(event);
              }}
              onTimeSlotClick={(date, hour) => {
                const slotDate = new Date(date);
                slotDate.setHours(hour, 0, 0, 0);
                openCreateModal(slotDate);
              }}
            />
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        onDelete={onEventDelete}
        event={selectedEvent}
        initialDate={modalInitialDate}
      />
    </div>
  );
};

export default CalendarView;
