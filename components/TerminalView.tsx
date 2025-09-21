import React, { useRef, useEffect, useState } from 'react';
import { ConsoleIcon, TrashIcon, SparklesIcon, ClipboardIcon, CheckIcon } from './icons';

interface TerminalViewProps {
  logs: { type: 'stdout' | 'stderr'; line: string }[];
  onClear: () => void;
  onFixRequest?: () => void;
}

const LogLine: React.FC<{ log: { type: 'stdout' | 'stderr'; line: string } }> = ({ log }) => {
    const color = log.type === 'stderr' ? 'text-red-400' : 'text-zinc-300';
    return (
        <div className="table-row">
            <span className="table-cell text-zinc-500 select-none pr-2 whitespace-nowrap align-top">{'>'}</span>
            <span className={`table-cell whitespace-pre-wrap break-all ${color}`}>{log.line}</span>
        </div>
    );
};

export const TerminalView: React.FC<TerminalViewProps> = ({ logs, onClear, onFixRequest }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleCopy = () => {
        if (isCopied) return;
        const logText = logs.map(log => log.line).join('\n');
        navigator.clipboard.writeText(logText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy logs:', err);
            alert('Failed to copy logs to clipboard.');
        });
    };

    return (
        <div className="w-full bg-black flex flex-col h-full text-xs font-mono">
            <header className="flex items-center justify-between px-4 h-12 border-b border-zinc-800 flex-shrink-0 bg-zinc-900">
                <div className="flex items-center gap-2">
                    <ConsoleIcon className="w-5 h-5 text-zinc-400" />
                    <span className="font-semibold text-sm text-white select-none">Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                    {onFixRequest && (
                        <button onClick={onFixRequest} title="Fix errors with AI" className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                            <SparklesIcon className="w-4 h-4 text-purple-400" />
                            Fix with AI
                        </button>
                    )}
                    <button onClick={handleCopy} title="Copy logs" className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md text-zinc-400 hover:bg-zinc-800 transition-colors w-20 justify-center">
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                            </>
                        ) : (
                             <>
                                <ClipboardIcon className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </button>
                    <button onClick={onClear} title="Clear terminal" className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md text-zinc-400 hover:bg-zinc-800 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                        Clear
                    </button>
                </div>
            </header>
            <div ref={scrollRef} className="overflow-y-auto flex-1 p-3">
                {logs.length === 0 ? (
                    <div className="text-zinc-500">Sandbox logs will appear here...</div>
                ) : (
                    <div className="table w-full table-fixed">
                       {logs.map((log, index) => <LogLine key={index} log={log} />)}
                    </div>
                )}
            </div>
        </div>
    );
};