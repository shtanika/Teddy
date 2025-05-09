'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import PageContainer from '@/components/layout/PageContainer';
import Link from 'next/link';

interface JournalEntry {
  id: string;
  content: string;
  mood?: string;
  tags?: string[];
  date: string;
  updatedAt?: string;
}

interface UserData {
  name: string;
  id: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.name) {
        setUserData({
          name: session.user.name,
          id: session.session.userId,
        });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchJournalEntries();
    }
  }, [userData]);

  const fetchJournalEntries = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      const data = await apiClient.getJournalEntries(userData.id);
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    entry.mood?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get the first day of the month
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the number of days in the month
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create calendar days array
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square p-2 text-center text-sm text-gray-300"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      // Check if there are entries for this day
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const hasEntries = entries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getDate() === i && 
               entryDate.getMonth() === currentMonth.getMonth() && 
               entryDate.getFullYear() === currentMonth.getFullYear();
      });
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`aspect-square p-2 text-center text-sm hover:bg-teddy-beige/50 rounded-lg cursor-pointer ${
            hasEntries ? 'bg-teddy-beige/30 font-semibold' : ''
          }`}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Entry Calendar</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-teddy-beige/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-medium">{monthName}</span>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-teddy-beige/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          <div className="text-center text-sm text-teddy-accent">Sun</div>
          <div className="text-center text-sm text-teddy-accent">Mon</div>
          <div className="text-center text-sm text-teddy-accent">Tue</div>
          <div className="text-center text-sm text-teddy-accent">Wed</div>
          <div className="text-center text-sm text-teddy-accent">Thu</div>
          <div className="text-center text-sm text-teddy-accent">Fri</div>
          <div className="text-center text-sm text-teddy-accent">Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  return (
    <PageContainer title="Journal">
      {/* Header with search and new entry button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-teddy-brown text-white' 
                : 'bg-white/80 text-teddy-accent hover:bg-teddy-beige/50'
            }`}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'calendar' 
                ? 'bg-teddy-brown text-white' 
                : 'bg-white/80 text-teddy-accent hover:bg-teddy-beige/50'
            }`}
          >
            Calendar View
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-teddy-accent absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search entries..." 
              className="pl-10 pr-4 py-2 bg-white/80 border border-teddy-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teddy-accent/20 w-64"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Link 
            href="/journal/new" 
            className="px-4 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors"
          >
            New Entry
          </Link>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && renderCalendar()}

      {/* Journal Entries */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teddy-brown"></div>
              <p className="mt-2 text-teddy-accent">Loading journal entries...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-teddy-beige/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teddy-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No journal entries found</h3>
              <p className="text-teddy-accent mb-6">Start documenting your wellness journey today</p>
              <Link 
                href="/journal/new" 
                className="px-4 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors"
              >
                Create Your First Entry
              </Link>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div key={entry.id} className="journal-entry card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teddy-beige/50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {entry.content.length > 30 
                          ? entry.content.substring(0, 30) + '...' 
                          : entry.content}
                      </h3>
                      <p className="text-sm text-teddy-accent">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.mood && (
                      <span className="px-3 py-1 bg-teddy-beige/50 text-teddy-brown rounded-full text-sm">
                        {entry.mood}
                      </span>
                    )}
                    <div className="relative group">
                      <button className="text-teddy-accent hover:text-teddy-brown">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
                        <Link 
                          href={`/journal/${entry.id}`}
                          className="block px-4 py-2 text-teddy-accent hover:bg-teddy-beige/50 hover:text-teddy-brown"
                        >
                          View Entry
                        </Link>
                        <Link 
                          href={`/journal/${entry.id}/edit`}
                          className="block px-4 py-2 text-teddy-accent hover:bg-teddy-beige/50 hover:text-teddy-brown"
                        >
                          Edit Entry
                        </Link>
                        <button 
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this entry?')) {
                              // Delete functionality would go here
                              console.log('Delete entry:', entry.id);
                            }
                          }}
                        >
                          Delete Entry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-teddy-accent mb-4">{entry.content}</p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-teddy-beige/30 text-teddy-accent rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </PageContainer>
  );
}
