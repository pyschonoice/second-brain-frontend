// src/components/modals/ShareBrainModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';
import { createShareLink } from '../../api/brain';

// Assuming a simple toast message utility as implemented in AddContentForm
const showTemporaryMessage = (message: string, type: 'success' | 'error') => {
  const div = document.createElement('div');
  div.textContent = message;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  `;
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = '1';
  }, 10); // Small delay to trigger transition

  setTimeout(() => {
    div.style.opacity = '0';
    div.addEventListener('transitionend', () => div.remove());
  }, 3000); // Message disappears after 3 seconds
};

interface ShareBrainModalProps {
  onClose: () => void;
}

export const ShareBrainModal: React.FC<ShareBrainModalProps> = ({ onClose }) => {
  const [shareLink, setShareLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [linkGenerated, setLinkGenerated] = useState<boolean>(false); // To manage UI state

  const generateLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass `true` to create a share link
      const response = await createShareLink(true);
      if (response.success && response.hash) {
        // Construct the full shareable URL
        // In a real app, this should be the deployed frontend URL + /shared/:hash
        // For development, we'll use localhost.
        const currentOrigin = window.location.origin;
        setShareLink(`${currentOrigin}/shared/${response.hash}`);
        setLinkGenerated(true);
        showTemporaryMessage('Share link generated successfully!', 'success');
      } else {
        setError(response.message || 'Failed to generate share link.');
        showTemporaryMessage(response.message || 'Failed to generate share link.', 'error');
      }
    } catch (err: any) {
      console.error('Error generating share link:', err);
      setError(err?.message || 'An unexpected error occurred.');
      showTemporaryMessage(err?.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass `false` to delete the share link
      const response = await createShareLink(false); // Backend handles deleting if share is false
      if (response.success) {
        setShareLink('');
        setLinkGenerated(false);
        showTemporaryMessage('Share link deleted successfully!', 'success');
      } else {
        setError(response.message || 'Failed to delete share link.');
        showTemporaryMessage(response.message || 'Failed to delete share link.', 'error');
      }
    } catch (err: any) {
      console.error('Error deleting share link:', err);
      setError(err?.message || 'An unexpected error occurred.');
      showTemporaryMessage(err?.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
        .then(() => {
          showTemporaryMessage('Link copied to clipboard!', 'success');
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
          showTemporaryMessage('Failed to copy link.', 'error');
        });
    }
  };

  // On modal open, try to fetch existing link immediately
  useEffect(() => {
    const fetchExistingLink = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await createShareLink(true); // Attempt to get existing link
        if (response.success && response.hash) {
            const currentOrigin = window.location.origin;
            setShareLink(`${currentOrigin}/shared/${response.hash}`);
            setLinkGenerated(true);
        } else {
            // If no link exists or failed to retrieve, just set initial state
            setShareLink('');
            setLinkGenerated(false);
        }
      } catch (err) {
        console.error('Error fetching existing share link:', err);
        setShareLink('');
        setLinkGenerated(false);
        // Don't show error toast on initial load if no link exists, only on explicit actions
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingLink();
  }, []); // Run once on mount

  return (
    <div className="space-y-6 p-4 dark:text-white">
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {!linkGenerated ? (
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">Generate a unique link to share your entire Second Brain with anyone!</p>
              <Button onClick={generateLink} className="w-full">
                Generate Share Link
              </Button>
            </div>
          ) : (
            <div>
              <Label htmlFor="share-link" className='mb-2 pl-2'>Your Shareable Link</Label>
              <div className="flex  justify-center items-center gap-2">
                <Input
                  id="share-link"
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow bg-muted cursor-not-allowed"
                />
                <Button onClick={copyToClipboard} variant="secondary">
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Anyone with this link can view your content.
              </p>
              <div className="flex justify-between items-center mt-4">
                <Button onClick={deleteLink} variant="destructive" className="flex-grow mr-2">
                  Delete Link
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-grow ml-2">
                  Close
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};