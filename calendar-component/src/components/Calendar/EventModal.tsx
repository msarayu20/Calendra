import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from './CalendarView.types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  event?: CalendarEvent | null;
  initialDate?: Date;
}

const predefinedColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
];

const categories = [
  'Meeting',
  'Work',
  'Personal',
  'Health',
  'Social',
  'Learning',
  'Travel',
  'Other',
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    startDate: initialDate || new Date(),
    endDate: initialDate || new Date(),
    color: predefinedColors[0].value,
    category: categories[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        });
      } else {
        const startDate = initialDate || new Date();
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
        setFormData({
          title: '',
          description: '',
          startDate,
          endDate,
          color: predefinedColors[0].value,
          category: categories[0],
        });
      }
      setErrors({});
    }
  }, [isOpen, event, initialDate]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const eventToSave: CalendarEvent = {
      id: event?.id || Date.now().toString(),
      title: formData.title!.trim(),
      description: formData.description?.trim(),
      date: formData.startDate!.toISOString().split('T')[0],
      time: formData.startDate!.toTimeString().slice(0, 5),
      duration: (formData.endDate!.getTime() - formData.startDate!.getTime()) / (1000 * 60 * 60),
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      color: formData.color,
      category: formData.category,
    };

    onSave(eventToSave);
    onClose();
  }, [formData, event, validateForm, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (event?.id && onDelete) {
      if (confirm('Are you sure you want to delete this event?')) {
        onDelete(event.id);
        onClose();
      }
    }
  }, [event, onDelete, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="event-title"
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event title"
                maxLength={100}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              {event && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
              
              <div className="flex space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {event ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
