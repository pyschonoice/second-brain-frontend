
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedContent } from '../../api/brain';
import { ContentApiData } from '../../types';
import { BentoLayout } from '../../components/cards/BentoLayout';
import { Spinner } from '../../components/ui/Spinner';

const SharedBrainPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>(); 
  const [contents, setContents] = useState<ContentApiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const fetchSharedContents = useCallback(async () => {
    if (!hash) {
      setError('Invalid share link.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getSharedContent(hash);
      if (response.success && response.content) {
        setContents(response.content);
        setUsername(response.username || 'Shared User'); 
      } else {
        setError(response.message || 'Failed to load shared content.');
      }
    } catch (err: any) {
      console.error('Error fetching shared content:', err);
      
      
      setError(err?.message || 'An unexpected error occurred while loading shared content. The link might be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  }, [hash]);

  useEffect(() => {
    fetchSharedContents();
  }, [fetchSharedContents]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-card shadow-sm p-4 md:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {username ? `${username}'s Second Brain` : 'Shared Second Brain'}
          </h1>
          {}
          {}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center text-destructive p-4 border border-destructive rounded-md">
            <p>{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">Please ensure the share link is correct.</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {contents.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                <p className="text-lg">This Second Brain currently has no shared content.</p>
              </div>
            ) : (
              
              <BentoLayout contents={contents} onDeleteContent={() => {  }} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SharedBrainPage;