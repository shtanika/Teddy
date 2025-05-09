'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function JournalEntryPage() {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const data = await apiClient.getJournalEntry(entryId, userData.id);
      setEntry(data);
    } catch (error) {
      console.error('Failed to fetch journal entry:', error);
      router.push('/journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userData || !entry) return;
    
    if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await apiClient.deleteJournalEntry(entry.id, userData.id);
        router.push('/journal');
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
        alert('Failed to delete journal entry. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageContainer 
      title="Journal Entry"
      backLink="/journal"
      backText="Back to Journal"
    >
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teddy-brown"></div>
          <p className="mt-2 text-teddy-accent">Loading journal entry...</p>
        </div>
      ) : entry ? (
        <div className="card p-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-teddy-accent mb-1">
                {formatDate(entry.date)}
              </p>
              {entry.updatedAt && entry.updatedAt !== entry.date && (
                <p className="text-xs text-teddy-accent/70">
                  Edited: {formatDate(entry.updatedAt)}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/journal/${entry.id}/edit`}
                className="px-3 py-1 bg-white/80 border border-teddy-muted/20 text-teddy-accent rounded-lg hover:bg-teddy-beige/30 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-50 border border-red-200 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          
          {entry.mood && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-teddy-beige/50 text-teddy-brown rounded-full text-sm">
                Mood: {entry.mood}
              </span>
            </div>
          )}
          
          <div className="mb-6">
            <p className="whitespace-pre-wrap text-teddy-brown leading-relaxed">
              {entry.content}
            </p>
          </div>
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-teddy-muted/10">
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
      ) : (
        <div className="text-center py-12">
          <p className="text-teddy-accent">Journal entry not found</p>
          <Link 
            href="/journal" 
            className="mt-4 inline-block px-4 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors"
          >
            Return to Journal
          </Link>
        </div>
      )}
    </PageContainer>
  );
}