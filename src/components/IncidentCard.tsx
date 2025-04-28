import React from 'react';
import { format } from 'date-fns';
import { Incident } from '../types';
import clsx from 'clsx';

interface IncidentCardProps {
  incident: Incident;
  isExpanded: boolean;
  onToggle: () => void;
}

export function IncidentCard({ incident, isExpanded, onToggle }: IncidentCardProps) {
  const severityColors = {
    Low: 'bg-green-100 text-severity-low',
    Medium: 'bg-yellow-100 text-severity-medium',
    High: 'bg-red-100 text-severity-high',
  };

  return (
    <div className="card group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {incident.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className={clsx('severity-badge', severityColors[incident.severity])}>
              {incident.severity}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(incident.reported_at), 'PPP')}
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {incident.description}
          </p>
        </div>
      )}
    </div>
  );
}