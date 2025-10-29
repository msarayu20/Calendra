import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import CalendarView from './CalendarView';
import type { CalendarEvent } from './CalendarView.types';

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample events for current month (October 2025)
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    date: '2025-10-15',
    time: '09:00',
    duration: 0.5,
    startDate: new Date(2025, 9, 15, 9, 0), // Oct 15, 9:00 AM
    endDate: new Date(2025, 9, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: '2',
    title: 'Design Review',
    description: 'Review new component designs',
    date: '2025-10-15',
    time: '14:00',
    duration: 1.5,
    startDate: new Date(2025, 9, 15, 14, 0), // Oct 15, 2:00 PM
    endDate: new Date(2025, 9, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: '3',
    title: 'Client Presentation',
    date: '2025-10-16',
    time: '10:00',
    duration: 1.5,
    startDate: new Date(2025, 9, 16, 10, 0), // Oct 16, 10:00 AM
    endDate: new Date(2025, 9, 16, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: '4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    date: '2025-10-17',
    time: '09:00',
    duration: 8,
    startDate: new Date(2025, 9, 17, 9, 0), // Oct 17, 9:00 AM
    endDate: new Date(2025, 9, 17, 17, 0),
    color: '#8b5cf6',
    category: 'Work',
  },
];

// Large dataset with 20+ events
const largeDatasetEvents: CalendarEvent[] = [
  ...sampleEvents,
  // Week 1
  { id: '5', title: 'Morning Workout', date: '2025-10-01', time: '07:00', duration: 1, startDate: new Date(2025, 9, 1, 7, 0), endDate: new Date(2025, 9, 1, 8, 0), color: '#ef4444', category: 'Personal' },
  { id: '6', title: 'Product Demo', date: '2025-10-02', time: '11:00', duration: 1, startDate: new Date(2025, 9, 2, 11, 0), endDate: new Date(2025, 9, 2, 12, 0), color: '#06b6d4', category: 'Meeting' },
  { id: '7', title: 'Code Review', date: '2025-10-03', time: '15:00', duration: 1, startDate: new Date(2025, 9, 3, 15, 0), endDate: new Date(2025, 9, 3, 16, 0), color: '#8b5cf6', category: 'Work' },
  { id: '8', title: 'Lunch Meeting', date: '2025-10-04', time: '12:30', duration: 1, startDate: new Date(2025, 9, 4, 12, 30), endDate: new Date(2025, 9, 4, 13, 30), color: '#f59e0b', category: 'Meeting' },
  // Week 2
  { id: '9', title: 'All Hands', date: '2025-10-07', time: '10:00', duration: 1, startDate: new Date(2025, 9, 7, 10, 0), endDate: new Date(2025, 9, 7, 11, 0), color: '#3b82f6', category: 'Meeting' },
  { id: '10', title: 'Workshop', date: '2025-10-08', time: '14:00', duration: 3, startDate: new Date(2025, 9, 8, 14, 0), endDate: new Date(2025, 9, 8, 17, 0), color: '#10b981', category: 'Learning' },
  { id: '11', title: 'Doctor Appointment', date: '2025-10-09', time: '16:00', duration: 1, startDate: new Date(2025, 9, 9, 16, 0), endDate: new Date(2025, 9, 9, 17, 0), color: '#ef4444', category: 'Personal' },
  { id: '12', title: 'Team Dinner', date: '2025-10-10', time: '19:00', duration: 2, startDate: new Date(2025, 9, 10, 19, 0), endDate: new Date(2025, 9, 10, 21, 0), color: '#f59e0b', category: 'Social' },
  // Week 3
  { id: '13', title: 'Project Kickoff', date: '2025-10-14', time: '09:00', duration: 1.5, startDate: new Date(2025, 9, 14, 9, 0), endDate: new Date(2025, 9, 14, 10, 30), color: '#8b5cf6', category: 'Work' },
  { id: '14', title: 'Sprint Planning', date: '2025-10-18', time: '13:00', duration: 2, startDate: new Date(2025, 9, 18, 13, 0), endDate: new Date(2025, 9, 18, 15, 0), color: '#06b6d4', category: 'Work' },
  { id: '15', title: 'Conference Call', date: '2025-10-19', time: '11:00', duration: 1, startDate: new Date(2025, 9, 19, 11, 0), endDate: new Date(2025, 9, 19, 12, 0), color: '#3b82f6', category: 'Meeting' },
  // Week 4
  { id: '16', title: 'Marketing Review', date: '2025-10-21', time: '14:00', duration: 1, startDate: new Date(2025, 9, 21, 14, 0), endDate: new Date(2025, 9, 21, 15, 0), color: '#10b981', category: 'Meeting' },
  { id: '17', title: 'Customer Demo', date: '2025-10-22', time: '10:00', duration: 1.5, startDate: new Date(2025, 9, 22, 10, 0), endDate: new Date(2025, 9, 22, 11, 30), color: '#f59e0b', category: 'Demo' },
  { id: '18', title: 'Technical Interview', date: '2025-10-23', time: '15:00', duration: 1.5, startDate: new Date(2025, 9, 23, 15, 0), endDate: new Date(2025, 9, 23, 16, 30), color: '#8b5cf6', category: 'HR' },
  { id: '19', title: 'Product Launch', date: '2025-10-24', time: '09:00', duration: 8, startDate: new Date(2025, 9, 24, 9, 0), endDate: new Date(2025, 9, 24, 17, 0), color: '#ef4444', category: 'Launch' },
  { id: '20', title: 'Weekend Project', date: '2025-10-26', time: '10:00', duration: 5, startDate: new Date(2025, 9, 26, 10, 0), endDate: new Date(2025, 9, 26, 15, 0), color: '#06b6d4', category: 'Personal' },
  // Additional events for stress testing
  { id: '21', title: 'Early Meeting', date: '2025-10-28', time: '08:00', duration: 1, startDate: new Date(2025, 9, 28, 8, 0), endDate: new Date(2025, 9, 28, 9, 0), color: '#3b82f6', category: 'Meeting' },
  { id: '22', title: 'Lunch & Learn', date: '2025-10-29', time: '12:00', duration: 1, startDate: new Date(2025, 9, 29, 12, 0), endDate: new Date(2025, 9, 29, 13, 0), color: '#10b981', category: 'Learning' },
  { id: '23', title: 'Evening Event', date: '2025-10-30', time: '18:00', duration: 2, startDate: new Date(2025, 9, 30, 18, 0), endDate: new Date(2025, 9, 30, 20, 0), color: '#f59e0b', category: 'Social' },
];

// Story: Default - Current month with sample events
export const Default: Story = {
  args: {
    events: sampleEvents,
    initialDate: new Date(2025, 9, 29), // October 29, 2025 (current date)
    initialView: 'month',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
};

// Story: Week View - Show calendar in week view mode
export const WeekView: Story = {
  args: {
    events: sampleEvents,
    initialDate: new Date(2025, 9, 15), // October 15, 2025 - middle of week with events
    initialView: 'week',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
};

// Story: Empty State - Calendar with no events
export const Empty: Story = {
  args: {
    events: [], // Show truly empty calendar
    initialDate: new Date(2025, 9, 29),
    initialView: 'month',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
};

// Story: Large Dataset - Calendar with 20+ events
export const WithManyEvents: Story = {
  args: {
    events: largeDatasetEvents,
    initialDate: new Date(2025, 9, 29),
    initialView: 'month',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
};

// Story: Interactive Demo - Fully functional event management
export const InteractiveDemo: Story = {
  render: (args) => {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

    const handleAdd = (event: CalendarEvent) => {
      setEvents((prev) => [...prev, { ...event, id: String(Date.now()) }]);
    };
    const handleUpdate = (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) => prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev));
    };
    const handleDelete = (id: string) => {
      setEvents((prev) => prev.filter(ev => ev.id !== id));
    };

    return (
      <CalendarView
        {...args}
        events={events}
        onEventAdd={handleAdd}
        onEventUpdate={handleUpdate}
        onEventDelete={handleDelete}
      />
    );
  },
  args: {
    initialDate: new Date(2025, 9, 29),
    initialView: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version with event management. Click on empty cells to add events, click on events to edit them.',
      },
    },
  },
};

// Story: Mobile View - Responsive layout demonstration
export const MobileView: Story = {
  args: {
    events: sampleEvents,
    initialDate: new Date(2025, 9, 29),
    initialView: 'month',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Calendar optimized for mobile devices with responsive layout.',
      },
    },
  },
};

// Story: Accessibility - Keyboard navigation demonstration
export const AccessibilityDemo: Story = {
  args: {
    events: sampleEvents,
    initialDate: new Date(2025, 9, 29),
    initialView: 'month',
    onEventAdd: (event: CalendarEvent) => console.log('Add event:', event),
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => console.log('Update event:', id, updates),
    onEventDelete: (id: string) => console.log('Delete event:', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation: Tab to move between elements, Arrow keys to navigate calendar grid, Enter/Space to activate, Escape to close modals.',
      },
    },
  },
};
