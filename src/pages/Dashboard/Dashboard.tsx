// src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { BentoLayout } from '../../components/cards/BentoLayout';
import { Modal } from '../../components/modals/Modal'; // Ensure this path is correct
import { Spinner } from '../../components/ui/Spinner';
import { getContents, deleteContent } from '../../api/content';
import { ContentApiData } from '../../types';
import { AddContentForm } from '../../components/forms/AddContentForm';
import { ShareBrainModal } from '../../components/modals/ShareBrainModal'; // Import the new share modal
import { ShareIcon } from '../../components/icons/ShareIcon'; // Import the share icon


// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [contents, setContents] = useState<ContentApiData[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentApiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false); // New state for share modal
  const [currentFilter, setCurrentFilter] = useState<'all' | 'link' | 'image' | 'video' | 'text'>('all');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no preference is saved, or if it's explicitly 'dark'
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode class on initial load and when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getContents();
      if (response.success) {
        setContents(response.content);
      } else {
        setError(response.message || 'Failed to fetch content.');
      }
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch contents on component mount
  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Effect to filter contents when 'contents' or 'currentFilter' changes
  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredContents(contents);
    } else {
      setFilteredContents(contents.filter(item => item.typeofContent === currentFilter));
    }
  }, [contents, currentFilter]);

  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const response = await deleteContent({ contentId });
        if (response.success) {
          alert(response.message); // Replace with toast
          fetchContents(); // Re-fetch content to update the list
        } else {
          alert(response.message || 'Failed to delete content.'); // Replace with toast
        }
      } catch (err: any) {
        console.error('Error deleting content:', err);
        alert(err?.message || 'An error occurred during deletion.'); // Replace with toast
      }
    }
  };

  const handleContentAdded = () => {
    setIsAddModalOpen(false); // Close modal
    fetchContents(); // Re-fetch content to show the newly added item
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onFilterChange={setCurrentFilter}
        currentFilter={currentFilter}
      />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex justify-end items-center mb-6">
          <div className="flex space-x-2"> {/* Flex container for buttons */}
            <Button onClick={() => setIsShareModalOpen(true)} variant="outline" size="md">
              <ShareIcon className="mr-2" /> Share Brain
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="md">
              Add New Content
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