import React, { useState } from 'react';
import { Incident, SortOrder } from './types';
import { initialIncidents } from './mockData';
import { IncidentCard } from './components/IncidentCard';
import { IncidentForm } from './components/IncidentForm';

function App() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showForm, setShowForm] = useState(false);

  const toggleExpanded = (id: number) => {
    const newExpandedIds = new Set(expandedIds);
    if (expandedIds.has(id)) {
      newExpandedIds.delete(id);
    } else {
      newExpandedIds.add(id);
    }
    setExpandedIds(newExpandedIds);
  };

  const handleSubmit = (newIncident: Omit<Incident, 'id' | 'reported_at'>) => {
    const incident: Incident = {
      ...newIncident,
      id: Math.max(...incidents.map(i => i.id)) + 1,
      reported_at: new Date().toISOString()
    };
    setIncidents([incident, ...incidents]);
    setShowForm(false);
  };

  const filteredAndSortedIncidents = incidents
    .filter(incident => filterSeverity === 'All' || incident.severity === filterSeverity)
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Safety Incident Dashboard</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Close Form' : 'Report New Incident'}
          </button>
        </div>

        {showForm && (
          <IncidentForm
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        )}

        <div className="card mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="severity" className="text-sm font-medium text-gray-700">
                Filter by Severity:
              </label>
              <select
                id="severity"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="form-select"
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by Date:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="form-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              isExpanded={expandedIds.has(incident.id)}
              onToggle={() => toggleExpanded(incident.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;