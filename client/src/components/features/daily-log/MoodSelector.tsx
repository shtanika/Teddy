'use client';

import { Card } from '@/components/common/Card';
import { useState } from 'react';

interface MoodOption {
  value: string;
  label: string;
  icon: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { value: 'terrible', label: 'Terrible', icon: '😢', color: 'bg-red-100 text-red-700' },
  { value: 'bad', label: 'Bad', icon: '😕', color: 'bg-orange-100 text-orange-700' },
  { value: 'okay', label: 'Okay', icon: '😐', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'good', label: 'Good', icon: '🙂', color: 'bg-blue-100 text-blue-700' },
  { value: 'great', label: 'Great', icon: '😄', color: 'bg-green-100 text-green-700' },
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: string) => void;
  className?: string;
}

export function MoodSelector({ onMoodSelect, className }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-teddy-brown mb-4">How are you feeling?</h3>
        <div className="grid grid-cols-5 gap-4">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                selectedMood === mood.value
                  ? `${mood.color} scale-105 shadow-md`
                  : 'bg-white hover:bg-teddy-beige/30'
              }`}
            >
              <span className="text-3xl mb-2">{mood.icon}</span>
              <span className="text-sm font-medium text-teddy-brown">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
} 