// src/components/cards/BentoLayout.tsx
import React, { useState, useMemo } from 'react'; // Import useMemo for performance
import { ContentApiData } from '../../types';
import { ContentCard } from './ContentCard';
import { twMerge } from 'tailwind-merge';

interface BentoLayoutProps {
  contents: ContentApiData[];
  onDeleteContent: (contentId: string) => void;
  className?: string; // For additional styling on the grid container
}

export const BentoLayout: React.FC<BentoLayoutProps> = ({ contents, onDeleteContent, className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Display 12 items per page for a 4-column grid (3 rows)

  // Calculate the total number of pages
  const totalPages = useMemo(() => Math.ceil(contents.length / itemsPerPage), [contents.length, itemsPerPage]);

  // Calculate the items for the current page
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return contents.slice(indexOfFirstItem, indexOfLastItem);
  }, [contents, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (contents.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p className="text-lg">No content found. Add some content to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className={twMerge(
          `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4 p-4`,
          className
        )}
      >
        {currentItems.map((content) => (
          <ContentCard
            key={content._id}
            content={content}
            onDelete={onDeleteContent}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 p-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Previous
          </button>
          <span className="text-lg text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};