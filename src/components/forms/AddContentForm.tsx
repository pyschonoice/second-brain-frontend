// src/components/forms/AddContentForm.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'; // Assuming you have a Select component
import { ContentApiData, CreateContentPayload, PopulatedTag } from '../../types';
import { createContent } from '../../api/content';
import { createTag, getTagByTitle } from '../../api/tag';


// A simple utility for a basic toast message, can be replaced by a proper toast library
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


interface AddContentFormProps {
  onContentAdded: () => void;
  onClose: () => void; // Added to close the modal after submission
}

export const AddContentForm: React.FC<AddContentFormProps> = ({ onContentAdded, onClose }) => {
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>(''); // For link/text/image/video URL/content
  const [typeofContent, setTypeofContent] = useState<ContentApiData['typeofContent']>('link');
  const [tagInput, setTagInput] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<PopulatedTag[]>([]); // Stores tag objects with _id and title
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = async () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    // Prevent duplicate tags from being added
    if (selectedTags.some(tag => tag.title.toLowerCase() === trimmedTag.toLowerCase())) {
      setTagInput('');
      showTemporaryMessage(`Tag "${trimmedTag}" is already added.`, 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // 1. Try to get existing tag by title
      let tagResponse;
      try {
        tagResponse = await getTagByTitle(trimmedTag);
      } catch (e: any) {
        // If not found (e.g., 404 error from getTagByTitle), it means it doesn't exist
        if (e && typeof e === 'object' && 'message' in e && e.message.includes('Tag not found')) {
          tagResponse = null; // Mark as not found
        } else {
          // Re-throw other unexpected errors from getTagByTitle
          throw e;
        }
      }

      let tagToAdd: PopulatedTag;

      if (tagResponse && tagResponse.success) {
        // Tag exists, use its ID
        tagToAdd = { _id: tagResponse.tag._id, title: tagResponse.tag.title };
        showTemporaryMessage(`Using existing tag: "${tagResponse.tag.title}"`, 'success');
      } else {
        // Tag does not exist, create it
        const newTagResponse = await createTag({ title: trimmedTag });
        if (newTagResponse.success) {
          tagToAdd = { _id: newTagResponse.tag._id, title: newTagResponse.tag.title };
          showTemporaryMessage(`New tag "${newTagResponse.tag.title}" created.`, 'success');
        } else {
          setError(newTagResponse.message || `Failed to create tag: ${trimmedTag}`);
          return;
        }
      }

      setSelectedTags(prev => [...prev, tagToAdd]);
      setTagInput(''); // Clear input after adding
    } catch (err: any) {
      console.error('Error adding tag:', err);
      setError(err?.message || 'Failed to add tag.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag._id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!link.trim() && typeofContent !== 'text') { // link is required unless type is 'text'
        setError('Link is required for selected content type.');
        return;
    }
    if (typeofContent === 'link' || typeofContent === 'image' || typeofContent === 'video') {
        try {
            new URL(link.trim()); // Basic URL validation
        } catch (_) {
            setError('Please enter a valid URL for the link/image/video.');
            return;
        }
    }


    setIsLoading(true);

    const payload: CreateContentPayload = {
      title: title.trim(),
      typeofContent,
      link: link.trim(), // Send link even for text, as per backend structure
      tags: selectedTags.map(tag => tag._id), // Send array of tag IDs
    };

    try {
      const response = await createContent(payload);
      if (response.success) {
        showTemporaryMessage(response.message, 'success');
        onContentAdded(); // Notify parent to refresh content
        onClose(); // Close the modal
        // Reset form
        setTitle('');
        setLink('');
        setTypeofContent('link');
        setTagInput('');
        setSelectedTags([]);
      } else {
        setError(response.message || 'Failed to add content.');
        showTemporaryMessage(response.message || 'Failed to add content.', 'error');
      }
    } catch (err: any) {
      console.error('Error adding content:', err);
      setError(err?.message || 'An unexpected error occurred.');
      showTemporaryMessage(err?.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=' dark:text-white'>
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <div  className='pl-2 dark:text-white mb-2'>
         <Label htmlFor="title">Title</Label>
        </div>
       
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My amazing article"
          required
        />
      </div>

      {/* Type of Content Select */}
      <div className='dark:text-white'>
        <div  className='pl-2 mb-2'>
          <Label htmlFor="typeofContent">Type of Content</Label>
        </div>
 
        <Select value={typeofContent} onValueChange={(value: ContentApiData['typeofContent']) => setTypeofContent(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="link">Link</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Link/Text Input - dynamic label/placeholder */}
      <div>
        <div  className='pl-2 mb-2'>
           <Label htmlFor="link">
          {typeofContent === 'text' ? 'Content Text' : 'Link/URL'}
        </Label>
        </div>
       
        {typeofContent === 'text' ? (
          <textarea
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter your text content here..."
            className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required={true} // Always required for non-text content types
          />
        ) : (
          <Input
            id="link"
            type="url" // Use type="url" for browser-level validation hints
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={
              typeofContent === 'link' ? 'https://example.com/article' :
              typeofContent === 'image' ? 'https://example.com/image.jpg' :
              'https://example.com/video.mp4'
            }
            required={true} // Make required only if not text
          />
        )}
      </div>

      {/* Tag Input */}
      <div>
        <div  className='pl-2 mb-2'>
          <Label htmlFor="tags">Tags (Press Enter to add)</Label>
        </div>
        
        <div className="flex gap-4 justify-center items-center">
          <Input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleAddTag();
              }
            }}
            placeholder="e.g., programming, design"
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddTag}  disabled={isLoading || !tagInput.trim()}>
          +Tag
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag._id}
              className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag.title}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag._id)}
                className="ml-1 text-primary-foreground/80 hover:text-primary-foreground focus:outline-none"
                aria-label={`Remove tag ${tag.title}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Spinner /> : 'Add Content'}
      </Button>
    </form>
    </div>
  );
};