import { useState, useCallback } from 'react';
import { getNextMonth, getPreviousMonth } from '../utils/date.utils';

interface CalendarState {
  currentDate: Date;
  view: 'month' | 'week';
  selectedDate: Date | null;
}

interface UseCalendarReturn extends CalendarState {
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  setView: (view: 'month' | 'week') => void;
  setSelectedDate: (date: Date | null) => void;
  setCurrentDate: (date: Date) => void;
}

export const useCalendar = (initialDate: Date = new Date()): UseCalendarReturn => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: 'month',
    selectedDate: null,
  });

  const goToNextMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getNextMonth(prev.currentDate),
    }));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getPreviousMonth(prev.currentDate),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(),
    }));
  }, []);

  const setView = useCallback((view: 'month' | 'week') => {
    setState(prev => ({
      ...prev,
      view,
    }));
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
    }));
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      currentDate: date,
    }));
  }, []);

  return {
    ...state,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    setView,
    setSelectedDate,
    setCurrentDate,
  };
};
