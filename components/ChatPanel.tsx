import React, { useRef, useEffect } from 'react';
import { Message as MessageType, AiStatus, FileSystem } from '../types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { TrashIcon, SparklesIcon } from './icons';

interface ChatPanelProps {
  messages: MessageType[];
  onSendMessage: (prompt: string, image: File | null) => void;
  aiStatus: AiStatus;
  stopGeneration: () => void;
  onImportProjectClick: () => void;
  onImportFigmaClick: () => void;
  onRestoreFileSystem: (fs: FileSystem) => void;
  onClearChat: () => boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
    messages, 
    onSendMessage, 
    aiStatus, 
    stopGeneration,
    onImportProjectClick,
    onImportFigmaClick,
    onRestoreFileSystem,
    onClearChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Calculate versions for AI messages with code changes
  let codeChangeVersion = 0;
  const messagesWithVersions = messages.map(msg => {
    if (msg.role === 'ai' && msg.codeChanges && msg.codeChanges.length > 0) {
      codeChangeVersion++;
      return { ...msg, version: codeChangeVersion };
    }
    return msg;
  });

  return (
    <div className="h-full w-full bg-white dark:bg-zinc-900 flex flex-col border-r border-slate-200 dark:border-zinc-800">
      <div className="flex-1 overflow-y-auto p-4">
        {messagesWithVersions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-zinc-500">
            <SparklesIcon className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Start a new conversation</h3>
            <p className="max-w-xs mt-1 text-sm">Describe what you want to build or change, and I'll get to work.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messagesWithVersions.map((msg) => (
              <Message key={msg.id} message={msg} onRestoreFileSystem={onRestoreFileSystem} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-zinc-900">
        <ChatInput 
            onSendMessage={onSendMessage} 
            aiStatus={aiStatus} 
            stopGeneration={stopGeneration}
            onImportFigmaClick={onImportFigmaClick}
            onImportProjectClick={onImportProjectClick}
        />
      </div>
    </div>
  );
};