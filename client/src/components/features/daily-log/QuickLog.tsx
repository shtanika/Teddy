'use client';

import { Card } from '@/components/common/Card';
import { useState } from 'react';

interface QuickLogEntry {
  id: string;
  type: 'mood' | 'exercise' | 'sleep';
  value: number;
  timestamp: Date;
  isIncrement: boolean;
}

interface QuickLogProps {
  onLogUpdate?: (entries: QuickLogEntry[]) => void;
  className?: string;
}

const quickActions = [
  {
    type: 'mood' as const,
    label: 'Mood',
    icon: '😊',
    increment: 1,
    unit: 'level',
    color: 'bg-yellow-100 text-yellow-700',
    min: 1,
    max: 5,
  },
  {
    type: 'exercise' as const,
    label: 'Exercise',
    icon: '🏃',
    increment: 5,
    unit: 'min',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    type: 'sleep' as const,
    label: 'Sleep',
    icon: '😴',
    increment: 1,
    unit: 'hour',
    color: 'bg-indigo-100 text-indigo-700',
  },
];

export function QuickLog({ onLogUpdate, className }: QuickLogProps) {
  const [entries, setEntries] = useState<QuickLogEntry[]>([
    {
      id: 'initial-mood',
      type: 'mood',
      value: 1,
      timestamp: new Date(),
      isIncrement: true,
    }
  ]);
  const [selectedType, setSelectedType] = useState<QuickLogEntry['type'] | null>(null);

  const handleQuickAction = (type: QuickLogEntry['type'], increment: number, isIncrement: boolean) => {
    const action = quickActions.find(a => a.type === type);
    if (!action) return;

    let newValue: number;
    if (type === 'mood') {
      const currentTotal = getTotalForType(type);
      newValue = isIncrement 
        ? Math.min(currentTotal + 1, action.max || 5)
        : Math.max(currentTotal - 1, action.min || 1);
    } else {
      // For other types, add or subtract the increment from current total, but prevent negative values
      const currentTotal = getTotalForType(type);
      const change = isIncrement ? increment : -increment;
      newValue = Math.max(0, currentTotal + change);
    }

    const newEntry: QuickLogEntry = {
      id: Date.now().toString(),
      type,
      value: newValue,
      timestamp: new Date(),
      isIncrement,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    onLogUpdate?.(updatedEntries);
  };

  const getTotalForType = (type: QuickLogEntry['type']) => {
    const entriesForType = entries.filter(entry => entry.type === type);
    if (entriesForType.length === 0) return 0;
    return entriesForType[entriesForType.length - 1].value;
  };

  const isActionDisabled = (type: QuickLogEntry['type'], isIncrement: boolean) => {
    const action = quickActions.find(a => a.type === type);
    if (!action) return false;
    
    if (type === 'mood') {
      const currentTotal = getTotalForType(type);
      return isIncrement 
        ? currentTotal >= (action.max || 5)
        : currentTotal <= (action.min || 1);
    } else {
      // Disable decrement button if current value is 0
      const currentTotal = getTotalForType(type);
      return !isIncrement && currentTotal === 0;
    }
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-teddy-brown mb-6">Quick Log</h3>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {quickActions.map((action) => {
            const total = getTotalForType(action.type);
            const isDecrementDisabled = isActionDisabled(action.type, false);
            const isIncrementDisabled = isActionDisabled(action.type, true);
            
            return (
              <div
                key={action.type}
                className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                  selectedType === action.type
                    ? `${action.color} scale-105`
                    : 'bg-white hover:bg-teddy-beige/30'
                }`}
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm font-medium text-teddy-brown">{action.label}</span>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuickAction(action.type, action.increment, false)}
                    disabled={isDecrementDisabled}
                    className={`p-1 rounded-full hover:bg-teddy-beige/50 text-teddy-muted hover:text-teddy-brown disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    -
                  </button>
                  <span className="text-xs font-medium">
                    {total} {action.unit}
                  </span>
                  <button
                    onClick={() => handleQuickAction(action.type, action.increment, true)}
                    disabled={isIncrementDisabled}
                    className={`p-1 rounded-full hover:bg-teddy-beige/50 text-teddy-muted hover:text-teddy-brown disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-teddy-muted mt-1">
                  {action.type === 'mood' ? `${action.min}-${action.max}` : `±${action.increment}`} {action.unit}
                </span>
              </div>
            );
          })}
        </div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-teddy-brown mb-2">Recent Entries</h4>
            <div className="space-y-2">
              {entries.slice(-3).reverse().map((entry) => {
                const action = quickActions.find(a => a.type === entry.type);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.isIncrement 
                        ? 'bg-green-50 border-green-100' 
                        : 'bg-red-50 border-red-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg ${action?.color}`}>
                        {action?.icon}
                      </span>
                      <div>
                        <div className="font-medium text-teddy-brown">
                          {action?.label}
                        </div>
                        <div className={`text-sm flex items-center gap-1 ${
                          entry.isIncrement ? 'text-green-700' : 'text-red-700'
                        }`}>
                          <span>{entry.isIncrement ? '↑' : '↓'}</span>
                          <span>{Math.abs(entry.value)} {action?.unit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-teddy-muted">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 