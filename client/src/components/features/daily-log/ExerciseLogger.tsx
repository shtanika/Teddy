'use client';

import { Card } from '@/components/common/Card';
import { useState } from 'react';

interface Exercise {
  id: string;
  type: string;
  duration: number;
  intensity: number;
}

interface ExerciseLoggerProps {
  onExerciseUpdate?: (exercises: Exercise[]) => void;
  exercises?: Exercise[];
  className?: string;
}

const exerciseTypes = [
  { value: 'walking', label: 'Walking', icon: '🚶' },
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'cycling', label: 'Cycling', icon: '🚴' },
  { value: 'swimming', label: 'Swimming', icon: '🏊' },
  { value: 'yoga', label: 'Yoga', icon: '🧘' },
  { value: 'strength', label: 'Strength', icon: '💪' },
  { value: 'other', label: 'Other', icon: '⚡' },
];

export function ExerciseLogger({
  onExerciseUpdate,
  exercises: exercisesProp = [],
  className,
}: ExerciseLoggerProps) {
  const [exercises, setExercises] = useState<Exercise[]>(exercisesProp ?? []);
  const [selectedType, setSelectedType] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [intensity, setIntensity] = useState<number>(3);

  const handleAddExercise = () => {
    if (!selectedType) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      type: selectedType,
      duration,
      intensity,
    };

    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    onExerciseUpdate?.(updatedExercises);

    // Reset form
    setSelectedType('');
    setDuration(30);
    setIntensity(3);
  };

  const handleRemoveExercise = (id: string) => {
    const updatedExercises = exercises.filter(ex => ex.id !== id);
    setExercises(updatedExercises);
    onExerciseUpdate?.(updatedExercises);
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-teddy-brown mb-6">Exercise Logger</h3>

        {/* Exercise Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-teddy-brown mb-2">
            Exercise Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {exerciseTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  selectedType === type.value
                    ? 'bg-teddy-accent text-white'
                    : 'bg-white hover:bg-teddy-beige/30'
                }`}
              >
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-teddy-brown mb-2">
            Duration (minutes)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-teddy-beige rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-semibold text-teddy-brown min-w-[3rem] text-right">
              {duration}m
            </span>
          </div>
        </div>

        {/* Intensity Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-teddy-brown mb-2">
            Intensity
          </label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setIntensity(value)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  intensity === value
                    ? 'bg-teddy-accent text-white'
                    : 'bg-white hover:bg-teddy-beige/30'
                }`}
              >
                <span className="text-2xl mb-1">
                  {value === 1 ? '🌱' : value === 2 ? '🌿' : value === 3 ? '🌳' : value === 4 ? '🌲' : '🌴'}
                </span>
                <span className="text-xs font-medium">
                  {value === 1 ? 'Light' : value === 2 ? 'Moderate' : value === 3 ? 'Medium' : value === 4 ? 'Hard' : 'Very Hard'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Exercise Button */}
        <button
          onClick={handleAddExercise}
          disabled={!selectedType}
          className="w-full py-2 px-4 bg-teddy-accent text-white rounded-lg font-medium hover:bg-teddy-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Exercise
        </button>

        {/* Exercise List */}
        {exercises.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-teddy-brown mb-2">Today's Exercises</h4>
            <div className="space-y-2">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-teddy-beige"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {exerciseTypes.find(t => t.value === exercise.type)?.icon}
                    </span>
                    <div>
                      <div className="font-medium text-teddy-brown">
                        {exerciseTypes.find(t => t.value === exercise.type)?.label}
                      </div>
                      <div className="text-sm text-teddy-muted">
                        {exercise.duration}m • {exercise.intensity}/5 intensity
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="text-teddy-muted hover:text-teddy-brown"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 