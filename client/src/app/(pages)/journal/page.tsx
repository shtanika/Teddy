'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEntries, setDayEntries] = useState<JournalEntry[]>([]);

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

  // Extract all unique tags from entries
  useEffect(() => {
    if (entries.length > 0) {
      const tags = new Set<string>();
      entries.forEach(entry => {
        entry.tags?.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    }
  }, [entries]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show tag suggestions if the user types #
    if (value.includes('#')) {
      const lastHashtagIndex = value.lastIndexOf('#');
      const partialTag = value.slice(lastHashtagIndex + 1).split(' ')[0];
      
      if (partialTag) {
        const matchingTags = allTags
          .filter(tag => tag.toLowerCase().includes(partialTag.toLowerCase()))
          .map(tag => `#${tag}`);
        
        setSearchSuggestions(matchingTags);
        setShowSuggestions(matchingTags.length > 0);
      } else {
        setSearchSuggestions(allTags.map(tag => `#${tag}`));
        setShowSuggestions(allTags.length > 0);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    // Replace the last hashtag and partial tag with the selected suggestion
    const lastHashtagIndex = searchQuery.lastIndexOf('#');
    const beforeHashtag = searchQuery.substring(0, lastHashtagIndex);
    const afterPartialTag = searchQuery.substring(lastHashtagIndex).split(' ');
    afterPartialTag[0] = suggestion;
    
    setSearchQuery(beforeHashtag + afterPartialTag.join(' '));
    setShowSuggestions(false);
    
    // Focus back on the input
    const searchInput = document.getElementById('journal-search');
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Enhanced filtering to handle hashtag searches
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Check if we're searching for tags with hashtag
      const hashtagSearches = searchQuery.match(/#(\w+)/g);
      
      if (hashtagSearches && hashtagSearches.length > 0) {
        // For each hashtag in the search query, check if the entry has that tag
        const hasAllTags = hashtagSearches.every(hashtagSearch => {
          const tagName = hashtagSearch.substring(1).toLowerCase();
          return entry.tags?.some(tag => tag.toLowerCase() === tagName);
        });
        
        // If searching only with hashtags, return based on tag match
        if (searchQuery.trim().split(' ').every(term => term.startsWith('#'))) {
          return hasAllTags;
        }
        
        // If mixed search (hashtags and text), check both
        const textToSearch = searchQuery.replace(/#\w+/g, '').trim().toLowerCase();
        return hasAllTags && (
          textToSearch === '' || 
          entry.content.toLowerCase().includes(textToSearch) ||
          entry.mood?.toLowerCase().includes(textToSearch)
        );
      }
      
      // Regular search (no hashtags)
      return entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        entry.mood?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [entries, searchQuery]);

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

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // If clicking the same day, toggle the selection off
    if (selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === clickedDate.getMonth() && 
        selectedDate.getFullYear() === clickedDate.getFullYear()) {
      setSelectedDate(null);
      setDayEntries([]);
      return;
    }
    
    setSelectedDate(clickedDate);
    
    // Find entries for this day
    const entriesForDay = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getDate() === day && 
             entryDate.getMonth() === clickedDate.getMonth() && 
             entryDate.getFullYear() === clickedDate.getFullYear();
    });
    
    setDayEntries(entriesForDay);
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
      
      // Check if this day is selected
      const isSelected = selectedDate && 
                        selectedDate.getDate() === i && 
                        selectedDate.getMonth() === currentMonth.getMonth() && 
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`aspect-square p-2 text-center text-sm hover:bg-teddy-beige/50 rounded-lg cursor-pointer ${
            hasEntries ? 'bg-teddy-beige/30 font-semibold' : ''
          } ${isSelected ? 'ring-2 ring-teddy-brown' : ''}`}
          onClick={() => handleDayClick(i)}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="card p-6 mb-4">
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
        
        {/* Day entries preview */}
        {selectedDate && dayEntries.length > 0 && (
          <div className="card p-4 mb-4 animate-fadeIn">
            <h3 className="font-medium text-teddy-brown mb-3">
              Entries for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {dayEntries.map(entry => (
                <Link 
                  key={entry.id} 
                  href={`/journal/${entry.id}`}
                  className="block p-3 bg-white/80 hover:bg-teddy-beige/20 rounded-lg border border-teddy-beige/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-teddy-accent mb-1">
                        {new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="line-clamp-2 text-teddy-brown">
                        {entry.content}
                      </p>
                    </div>
                    {entry.mood && (
                      <span className="px-2 py-1 bg-teddy-beige/30 text-teddy-brown rounded-full text-xs">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-1.5 py-0.5 bg-teddy-beige/20 text-teddy-accent rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-teddy-beige/10 text-teddy-accent rounded-full text-xs">
                          +{entry.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async (entryId: string) => {
    if (!userData) return;
    
    if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      setIsDeleting(entryId);
      try {
        await apiClient.deleteJournalEntry(entryId, userData.id);
        // Update the entries list by filtering out the deleted entry
        setEntries(entries.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
        alert('Failed to delete journal entry. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
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
              id="journal-search"
              type="text" 
              placeholder="Search entries or #tags..." 
              className="pl-10 pr-4 py-2 bg-white/80 border border-teddy-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teddy-accent/20 w-64"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => {
                if (searchQuery.includes('#')) setShowSuggestions(true);
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow for clicks
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            
            {/* Tag suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-teddy-beige/30 cursor-pointer"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <span className="font-medium text-teddy-brown">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link 
            href="/journal/new" 
            className="px-4 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors"
          >
            New Entry
          </Link>
        </div>
      </div>

      {/* Render search info if searching */}
      {searchQuery && (
        <div className="mb-4 px-4 py-2 bg-teddy-beige/20 rounded-lg">
          <p className="text-teddy-accent">
            Showing results for: 
            <span className="ml-2 font-medium">
              {searchQuery.split(' ').map((term, i) => (
                <span key={i}>
                  {term.startsWith('#') ? (
                    <span className="inline-block px-2 py-0.5 bg-teddy-beige/50 text-teddy-brown rounded-full mx-1">
                      {term}
                    </span>
                  ) : (
                    <span className="mx-1">{term}</span>
                  )}
                </span>
              ))}
            </span>
          </p>
          <p className="text-xs text-teddy-accent/70 mt-1">
            Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && renderCalendar()}

      {/* Journal Entries */}
      {viewMode === 'list' && (
        <div className="space-y-10"> {/* Changed from space-y-6 to space-y-10 */}
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
              <div key={entry.id} className="journal-entry card p-6 relative"> {/* Added relative positioning */}
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
                      <button className="text-teddy-accent hover:text-teddy-brown p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ transitionDelay: '150ms' }}
                      >
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
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          onClick={() => handleDelete(entry.id)}
                          disabled={isDeleting === entry.id}
                        >
                          {isDeleting === entry.id ? 'Deleting...' : 'Delete Entry'}
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
