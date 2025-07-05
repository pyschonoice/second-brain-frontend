// src/components/cards/ContentCard.tsx
import React, { useState, useEffect } from 'react';
import { ContentApiData } from '../../types'; // Assuming this path is correct
// Keeping your current icon paths as specified
import { ShareIcon } from '../icons/ShareIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ContentIcon } from '../icons/ContentIcon';
import { twMerge } from 'tailwind-merge';
import api from '../../api/index'; // Corrected import path for our axios instance

// Define a type for the fetched link preview data
interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  url?: string; // The canonical URL of the previewed page
  type?: string; // e.g., 'website', 'article', 'video'
}

interface ContentCardProps {
  content: ContentApiData;
  onDelete: (contentId: string) => void;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content, onDelete, className }) => {
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    const fetchLinkPreview = async () => {
      // Only fetch if the content type is 'link' and a link exists
      if (content.typeofContent === 'link' && content.link) {
        // Exclude YouTube links from fetching a generic preview, as we handle them separately with embeds
        const youtubeStandardMatch = content.link.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
        const googleusercontentYoutubeMatch = content.link.match(/http:\/\/googleusercontent\.com\/youtube\.com\/([\w-]+)(?:\/.*)?$/);

        if (youtubeStandardMatch || googleusercontentYoutubeMatch) {
          setLinkPreview(null); // No generic preview for YouTube, handled by iframe
          return;
        }

        setIsLoadingPreview(true);
        setLinkPreview(null); // Clear previous preview when link changes or loads

        try {
          // Use our axios instance 'api'
          const response = await api.get(`/preview-link?url=${encodeURIComponent(content.link)}`);
          
          const data: LinkPreviewData = response.data; // Axios puts response data in .data
          setLinkPreview(data);
        } catch (error: any) {
          console.error('Error fetching link preview:', error);
          // TODO: Replace with a custom toast notification here about the failure
          if (error.response) {
            console.error('Error response data:', error.response.data);
          }
          setLinkPreview(null); // Ensure no old or partial data is shown on error
        } finally {
          setIsLoadingPreview(false);
        }
      } else {
        setLinkPreview(null); // Clear preview if not a link type or link is removed
      }
    };

    fetchLinkPreview();
  }, [content.link, content.typeofContent]); // Re-run effect if link or type changes

  const handleCopyLink = () => {
    if (content.link) {
      navigator.clipboard.writeText(content.link)
        .then(() => {
          // TODO: Replace with a custom toast notification later
          alert('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
          // TODO: Replace with a custom toast notification later
          alert('Failed to copy link.');
        });
    }
  };

  const renderContentBody = () => {
    const { typeofContent, link, title } = content;

    switch (typeofContent) {
      case 'link':
        let videoId: string | undefined;
        let embedUrl: string | undefined;

        // Regex for standard YouTube URLs (e.g., youtube.com/watch?v=ID)
        const youtubeStandardMatch = link?.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);

        // Regex for googleusercontent.com YouTube proxy URLs
        const googleusercontentYoutubeMatch = link?.match(/http:\/\/googleusercontent\.com\/youtube\.com\/([\w-]+)(?:\/.*)?$/);


        if (youtubeStandardMatch && youtubeStandardMatch[1]) {
            videoId = youtubeStandardMatch[1];
            // Use the consistent googleusercontent.com embed prefix if that's the desired format
            embedUrl = `https://www.youtube.com/embed/${videoId}`; // Corrected template literal
        } else if (googleusercontentYoutubeMatch && googleusercontentYoutubeMatch[1]) {
            videoId = googleusercontentYoutubeMatch[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`; // Corrected template literal
            console.warn(`Attempting to embed a googleusercontent.com YouTube link. The extracted ID '${videoId}' might not be a valid 11-character YouTube video ID, which could lead to embed errors.`);
        }

        if (embedUrl) {
          return (
            <>
              <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-md">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl} // Use the constructed embed URL
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={linkPreview?.title || title || "YouTube video"}
                ></iframe>
              </div>
              {link && ( // Display original link below the embed
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 block break-all" // Added mt-2 for spacing
                >
                  {link}
                </a>
              )}
            </>
          );
        }
    
        // If we have link preview data (and it's not a YouTube embed that was handled)
        if (linkPreview) {
          return (
            <a
              href={linkPreview.url || link} // Use preview URL if available, fallback to original link
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md overflow-hidden border border-border bg-background hover:shadow-lg transition-shadow duration-200"
            >
              {linkPreview.image && (
                <img
                  src={linkPreview.image}
                  alt={linkPreview.title || "Link preview image"}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    // Fallback image if the preview image fails to load
                    e.currentTarget.src = 'https://placehold.co/400x160/cccccc/333333?text=Preview+Image+Error';
                  }}
                />
              )}
              <div className="p-3">
                <h4 className="font-semibold text-base text-card-foreground line-clamp-2">
                  {linkPreview.title || link} {/* Use preview title, fallback to original link */}
                </h4>
                {linkPreview.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {linkPreview.description}
                  </p>
                )}
                {link && ( // Only show domain if the original link exists
                  <p className="text-xs text-primary mt-2 break-all">
                    {new URL(link).hostname} {/* Display the hostname of the original link */}
                  </p>
                )}
              </div>
            </a>
          );
        } else if (isLoadingPreview) {
          return <p className="text-muted-foreground">Loading link preview...</p>;
        }
        // Fallback to simple link if no preview, loading fails, or it's not YouTube
        if (link) {
          return (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-foreground hover:underline break-all"
            >
              {link}
            </a>
          );
        }
        return <p className="text-muted-foreground">No link provided.</p>;

      case 'image':
        if (link) {
          return (
            <img
              src={link}
              alt={title || "Content Image"}
              className="w-full h-auto object-cover rounded-md max-h-60"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x200/cccccc/333333?text=Image+Load+Error';
              }}
            />
          );
        }
        return <p className="text-muted-foreground">No image URL.</p>;

      case 'video':
        if (link) {
          return (
            <video controls className="w-full h-auto rounded-md max-h-60">
              <source src={link} type="video/mp4" /> {/* Assuming mp4, adjust as needed based on your video types */}
              Your browser does not support the video tag.
            </video>
          );
        }
        return <p className="text-muted-foreground">No video URL.</p>;

      case 'text':
        // For 'text' type, the 'link' field from backend actually contains the text content
        return <p className="text-card-foreground whitespace-pre-wrap">{link}</p>;

      default:
        return <p className="text-muted-foreground">Unsupported content type.</p>;
    }
  };

  return (
    <div
      className={twMerge(
        "p-4 rounded-lg border border-border shadow-md bg-card text-card-foreground flex flex-col space-y-4",
        className
      )}
    >
      {/* Header: Icon, Title, Actions */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2 flex-grow min-w-0">
          <ContentIcon type={content.typeofContent} className="w-6 h-6 text-primary flex-shrink-0" />
          {/* Display content title or link if no title is present for links */}
          <h3 className="text-lg font-semibold truncate">
            {content.title || (content.typeofContent === 'link' ? content.link : 'Untitled')}
          </h3>
        </div>
        <div className="flex gap-3 items-center text-muted-foreground">
          {content.link && ( // Only show share icon if there's a link to copy
            <button onClick={handleCopyLink} className="hover:text-primary transition-colors" aria-label="Copy link">
              <ShareIcon className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => onDelete(content._id)} className="hover:text-destructive transition-colors" aria-label="Delete content">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-grow">
        {renderContentBody()}
      </div>

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border mt-auto">
          {content.tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium"
            >
              {tag.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};