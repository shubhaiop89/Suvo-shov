import React, { useState } from 'react';
import { Message as MessageType, FileChange, FileSystem } from '../types';
import { SparklesIcon, ChevronDownIcon, SpinnerIcon, ArrowLeftIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1.5 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-zinc-600 animate-typing-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-zinc-600 animate-typing-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-zinc-600 animate-typing-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const getOperationText = (operation: FileChange['operation']) => {
    switch (operation) {
        case 'CREATE': return 'Creating';
        case 'UPDATE': return 'Editing';
        case 'DELETE': return 'Deleting';
        default: return 'Changing';
    }
}

const CodeVersionBlock: React.FC<{ changes: FileChange[], version: number, isStreaming?: boolean }> = ({ changes, version, isStreaming }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    return (
        <div className="mt-4 border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 rounded-lg overflow-hidden">
            <div 
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-zinc-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <h4 className="font-semibold text-slate-900 dark:text-white">Version {version}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-slate-200 text-slate-800 dark:bg-zinc-200 dark:text-black px-2 py-0.5 rounded-full">Latest</span>
                    <span className="text-xs font-medium bg-transparent text-slate-500 dark:text-zinc-400 border border-slate-300 dark:border-zinc-500 px-3 py-1 rounded-full">Viewing</span>
                </div>
            </div>
            {isExpanded && (
                <div className="border-t border-slate-200 dark:border-zinc-700 p-2 bg-white dark:bg-black/20">
                  <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {changes.map((change, index) => (
                        <div key={index} className="py-2 px-1">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {isStreaming && index === changes.length - 1 ? (
                                        <SpinnerIcon className="w-4 h-4 text-slate-800 dark:text-white flex-shrink-0" />
                                    ) : (
                                        <SparklesIcon className="w-4 h-4 text-slate-800 dark:text-white flex-shrink-0" />
                                    )}
                                    <span className="font-mono text-sm text-slate-500 dark:text-zinc-400 truncate">{change.path}</span>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-zinc-400 font-medium flex-shrink-0">{getOperationText(change.operation)}</span>
                            </div>
                            {change.description && (
                                <p className="pl-7 text-sm text-slate-500 dark:text-zinc-400 mt-1">{change.description}</p>
                            )}
                        </div>
                    ))}
                  </div>
                </div>
            )}
        </div>
    );
};

const UserMessage: React.FC<{ message: MessageType }> = ({ message }) => {
    return (
        <div className="bg-blue-600 dark:bg-zinc-800 px-4 py-3 rounded-xl">
            {message.imageUrl && (
                <div className="mb-2">
                    <img src={message.imageUrl} alt="User upload" className="max-w-full h-auto max-h-64 rounded-lg" />
                </div>
            )}
            
            {message.text && (
                <div className="user-message-content text-base text-white">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

const AiMessage: React.FC<{ message: MessageType, onRestoreFileSystem: (fs: FileSystem) => void; }> = ({ message, onRestoreFileSystem }) => {
    if (message.isStreaming && !message.text && (!message.codeChanges || message.codeChanges.length === 0)) {
        return <TypingIndicator />;
    }

    const handleRestore = () => {
        if (message.previousFileSystem && window.confirm('Are you sure you want to restore to this checkpoint? All changes made after this version will be lost.')) {
            onRestoreFileSystem(message.previousFileSystem);
        }
    };

    return (
        <div className="text-base">
            {message.text && (
                <div className={`ai-message-content ${message.isStreaming && message.text ? 'is-streaming' : ''}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                    </ReactMarkdown>
                </div>
            )}

            {message.codeChanges && message.codeChanges.length > 0 && message.version && (
                <CodeVersionBlock 
                    changes={message.codeChanges} 
                    version={message.version} 
                    isStreaming={message.isStreaming} 
                />
            )}
            
            {message.previousFileSystem && !message.isStreaming && (
                <div className="mt-4">
                    <button 
                        onClick={handleRestore}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Restore to this checkpoint</span>
                    </button>
                </div>
            )}
            
            {message.error && (
                 <div className="mt-4 border border-red-500/50 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-red-700 dark:text-red-200 mb-2">Error Occurred</h4>
                    <p className="text-sm text-red-800 dark:text-red-300 font-mono whitespace-pre-wrap break-all">{message.error}</p>
                </div>
            )}
        </div>
    );
};


export const Message: React.FC<{ message: MessageType; onRestoreFileSystem: (fs: FileSystem) => void; }> = ({ message, onRestoreFileSystem }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl w-full`}>
        {isUser ? <UserMessage message={message} /> : <AiMessage message={message} onRestoreFileSystem={onRestoreFileSystem} />}
      </div>
    </div>
  );
};