import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { BentoLayout } from '../../components/cards/BentoLayout';
import { Modal } from '../../components/modals/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { getContents, deleteContent } from '../../api/content';
import { ContentApiData } from '../../types';
import { AddContentForm } from '../../components/forms/AddContentForm';
import { ShareBrainModal } from '../../components/modals/ShareBrainModal';
import { ShareIcon } from '../../components/icons/ShareIcon';



const Dashboard: React.FC = () => {
  const [contents, setContents] = useState<ContentApiData[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentApiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'link' | 'image' | 'video' | 'text'>('all');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getContents();
      setContents(response.content);
      setFilteredContents(response.content);
    } catch (err: any) {
      // Fix: Use error.message or a generic message
      setError(err.message || 'Failed to fetch content.');
      console.error('Failed to fetch contents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredContents(contents);
    } else {
      setFilteredContents(contents.filter(content => content.typeofContent === currentFilter));
    }
  }, [contents, currentFilter]);

  const handleContentAdded = useCallback(() => {
    fetchContents();
  }, [fetchContents]);


  const handleDeleteContent = useCallback(async (contentId: string) => {
    try {
      await deleteContent({ contentId });
      fetchContents(); // Refetch contents after deletion
    } catch (err: any) {
      setError(err.message || 'Failed to delete content.');
      console.error('Failed to delete content:', err);
    }
  }, [fetchContents]);


  const handleFilterChange = useCallback((type: 'all' | 'link' | 'image' | 'video' | 'text') => {
    setCurrentFilter(type);
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
      />
      <main className="container mx-auto flex-grow py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-foreground">Your Second Brain</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddModalOpen(true)} className="px-6 py-2">
              Add New Content
            </Button>
            <Button variant="outline" onClick={() => setIsShareModalOpen(true)} className="px-6 py-2 flex items-center gap-2">
              <ShareIcon className="h-4 w-4" /> Share Brain
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center text-destructive p-4 border border-destructive rounded-md">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <BentoLayout contents={filteredContents} onDeleteContent={handleDeleteContent} />
        )}
        {!isLoading && !error && filteredContents.length === 0 && currentFilter === 'all' && (
             <div className="text-center text-muted-foreground p-8">
                <p className="text-lg">No content found. Click "Add New Content" to get started!</p>
            </div>
        )}
         {!isLoading && !error && filteredContents.length === 0 && currentFilter !== 'all' && (
             <div className="text-center text-muted-foreground p-8">
                <p className="text-lg">No {currentFilter} content found. Try a different filter or add new content.</p>
            </div>
        )}
      </main>

      {/* Add Content Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Content"
      >
        <AddContentForm onContentAdded={handleContentAdded} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Share Brain Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Your Second Brain"
      >
        <ShareBrainModal onClose={() => setIsShareModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;