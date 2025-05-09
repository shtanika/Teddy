'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import PageContainer from '@/components/layout/PageContainer';

interface JournalEntry {
  id: string;
  content: string;
  mood?: string;
  tags?: string[];
  date: string;
}

interface UserData {
  name: string;
  id: string;
}

export default function EditJournalEntryPage() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const params = useParams();
  const entryId = params.id as string;

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.name) {
        setUserData({
          name: session.user.name,
          id: session.session.userId,
        });
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (userData && entryId) {
      fetchJournalEntry();
    }
  }, [userData, entryId]);

  const fetchJournalEntry = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      const entry = await apiClient.getJournalEntry(entryId, userData.id);
      setContent(entry.content);
      setMood(entry.mood || '');
      setTags(entry.tags ? entry.tags.join(', ') : '');
    } catch (error) {
      console.error('Failed to fetch journal entry:', error);
      router.push('/journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      alert('You must be logged in to edit a journal entry');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter some content for your journal entry');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      await apiClient.updateJournalEntry(entryId, {
        userId: userData.id,
        content,
        mood: mood || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });
      
      router.push(`/journal/${entryId}`);
    } catch (error) {
      console.error('Failed to update journal entry:', error);
      alert('Failed to update journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodOptions = [
    'happy', 'content', 'neutral', 'anxious', 'sad', 'angry', 'excited', 'tired', 'grateful'
  ];

  return (
    <PageContainer 
      title="Edit Journal Entry"
      backLink={`/journal/${entryId}`}
      backText="Cancel Edit"
    >
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teddy-brown"></div>
          <p className="mt-2 text-teddy-accent">Loading journal entry...</p>
        </div>
      ) : (
        <div className="card p-6 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="content" className="block text-teddy-brown font-medium mb-2">
                Journal Entry
              </label>
              <textarea
                id="content"
                className="w-full h-64 p-4 bg-white/80 border border-teddy-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teddy-accent/20"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="mood" className="block text-teddy-brown font-medium mb-2">
                How are you feeling?
              </label>
              <select
                id="mood"
                className="w-full p-3 bg-white/80 border border-teddy-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teddy-accent/20"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">Select a mood (optional)</option>
                {moodOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-8">
              <label htmlFor="tags" className="block text-teddy-brown font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                className="w-full p-3 bg-white/80 border border-teddy-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teddy-accent/20"
                placeholder="e.g. work, exercise, meditation"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="mt-1 text-sm text-teddy-accent">
                Add tags to help organize your entries (optional)
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push(`/journal/${entryId}`)}
                className="px-4 py-2 mr-3 bg-white border border-teddy-muted/20 text-teddy-accent rounded-lg hover:bg-teddy-beige/30 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
}
