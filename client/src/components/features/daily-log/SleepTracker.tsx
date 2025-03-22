'use client';

import { Card } from '@/components/common/Card';
import { useState } from 'react';

interface SleepTrackerProps {
  onSleepUpdate?: (duration: number, quality: number) => void;
  className?: string;
}

export function SleepTracker({ onSleepUpdate, className }: SleepTrackerProps) {
  const [duration, setDuration] = useState<number>(8);
  const [quality, setQuality] = useState<number>(3);

  const handleDurationChange = (value: number) => {
    setDuration(value);
    onSleepUpdate?.(value, quality);
  };

  const handleQualityChange = (value: number) => {
    setQuality(value);
    onSleepUpdate?.(duration, value);
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-teddy-brown mb-6">Sleep Tracker</h3>
        
        {/* Sleep Duration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-teddy-brown mb-2">
            Sleep Duration (hours)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={duration}
              onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-teddy-beige rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-semibold text-teddy-brown min-w-[3rem] text-right">
              {duration}h
            </span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-medium text-teddy-brown mb-2">
            Sleep Quality
          </label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleQualityChange(value)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  quality === value
                    ? 'bg-teddy-accent text-white'
                    : 'bg-white hover:bg-teddy-beige/30'
                }`}
              >
                <span className="text-2xl mb-1">
                  {value === 1 ? '😴' : value === 2 ? '😪' : value === 3 ? '😌' : value === 4 ? '😊' : '😃'}
                </span>
                <span className="text-xs font-medium">
                  {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
} 