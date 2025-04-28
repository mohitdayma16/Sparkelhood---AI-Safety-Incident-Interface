import React, { useState, useEffect } from 'react';
import { Incident } from '../types';

interface IncidentFormProps {
  onSubmit: (incident: Omit<Incident, 'id' | 'reported_at'>) => void;
  onClose: () => void;
}

export function IncidentForm({ onSubmit, onClose }: IncidentFormProps) {
  const [formData, setFormData] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Low',
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDescriptionLength = 500;
  const minDescriptionLength = 50;

  const errors = {
    title: touched.title && formData.title.length < 5 ? 'Title must be at least 5 characters' : '',
    description: touched.description && formData.description.length < minDescriptionLength 
      ? `Description must be at least ${minDescriptionLength} characters` 
      : '',
  };

  const isValid = !errors.title && !errors.description && 
    formData.description.length >= minDescriptionLength &&
    formData.description.length <= maxDescriptionLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      onSubmit(formData);
      setFormData({ title: '', description: '', severity: 'Low' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: 'title' | 'description') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Report New Incident</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={() => handleBlur('title')}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a descriptive title"
              disabled={isSubmitting}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, maxDescriptionLength) })}
                onBlur={() => handleBlur('description')}
                rows={4}
                className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Provide detailed description of the incident"
                disabled={isSubmitting}
                required
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {formData.description.length}/{maxDescriptionLength}
              </div>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              id="severity"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as Incident['severity'] })}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 