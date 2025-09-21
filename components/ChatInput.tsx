import React, { useState, useRef, useEffect } from 'react';
import { StopIcon, PlusIcon, CloseIcon, ArrowRightIcon, UploadIcon, PhotoIcon, FigmaIcon } from './icons/index';
import { AiStatus } from '../types';

interface ChatInputProps {
  onSendMessage: (prompt: string, image: File | null) => void;
  aiStatus: AiStatus;
  stopGeneration: () => void;
  onImportProjectClick: () => void;
  onImportFigmaClick: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    aiStatus, 
    stopGeneration,
    onImportProjectClick,
    onImportFigmaClick,
}) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isAddMenuOpen, setAddMenuOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
       if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Auto-resize textarea.
    // We use requestAnimationFrame to prevent a ResizeObserver loop error.
    // This synchronizes the resize with the browser's rendering cycle,
    // which is a more robust way to prevent layout-related race conditions.
    const textarea = textareaRef.current;
    if (textarea) {
      const animationFrameId = requestAnimationFrame(() => {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 200; // Approx 8 lines
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      });
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [prompt]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    if (e.target) e.target.value = '';
  };
  
  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
  };

  const isGenerating = aiStatus === 'thinking' || aiStatus === 'streaming';

  const handleSend = () => {
    if (isGenerating) return;
    onSendMessage(prompt, image);
    setPrompt('');
    handleRemoveImage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-white/80 dark:bg-zinc-800/80 border border-slate-300/80 dark:border-zinc-700/80 flex flex-col text-slate-900 dark:text-white shadow-2xl shadow-black/50 backdrop-blur-md rounded-2xl">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      {imagePreview && image && (
        <div className="p-3 border-b border-slate-200 dark:border-zinc-700">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img src={imagePreview} alt="Upload preview" className="h-20 w-20 object-cover rounded-md" />
              <button 
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all"
                aria-label="Remove image"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title={image.name}>{image.name}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{`${(image.size / 1024).toFixed(1)} KB`}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build or change..."
          className="w-full bg-transparent resize-none focus:outline-none text-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-500 max-h-48 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
          rows={1}
          disabled={isGenerating}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div ref={addMenuRef} className="relative">
              <button 
                onClick={() => setAddMenuOpen(prev => !prev)}
                className={`w-11 h-11 flex items-center justify-center transition-all duration-300 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 rounded-lg ${isAddMenuOpen ? 'bg-slate-300 dark:bg-zinc-600' : 'bg-slate-200/80 dark:bg-zinc-700/80 hover:bg-slate-300 dark:hover:bg-zinc-700'}`}
                disabled={isGenerating}
                aria-label={isAddMenuOpen ? 'Close menu' : 'Add content'}
                title={isAddMenuOpen ? 'Close menu' : 'Add content'}
              >
                <PlusIcon className={`h-5 w-5 transition-transform duration-300 ease-in-out ${isAddMenuOpen ? 'rotate-45' : ''}`} />
              </button>
              {isAddMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-xl z-10 p-2 space-y-1 rounded-xl">
                  <button onClick={() => { onImportFigmaClick(); setAddMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                    <FigmaIcon className="w-5 h-5"/> <span>Import from Figma</span>
                  </button>
                  <button onClick={() => { fileInputRef.current?.click(); setAddMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                    <PhotoIcon className="w-5 h-5"/> <span>Attach Image</span>
                  </button>
                  <button onClick={() => { onImportProjectClick(); setAddMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                    <UploadIcon className="w-5 h-5"/> <span>Import Project (.zip)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-red-600/80 hover:bg-red-600 text-white transition-colors rounded-lg"
                aria-label="Stop generation"
              >
                 <StopIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={isGenerating}
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-black transition-colors rounded-lg disabled:bg-slate-200 dark:disabled:bg-zinc-700 disabled:text-slate-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};