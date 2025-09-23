import React from 'react';
import { TerminalView } from './TerminalView';

interface LogsViewProps {
    logs: { type: 'stdout' | 'stderr'; line: string }[];
    onClear: () => void;
    onFixRequest: (logsText: string) => void;
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, onClear, onFixRequest }) => {
    const handleFix = () => {
        const logText = logs.map(log => log.line).join('\n');
        onFixRequest(logText);
    };

    const hasErrors = logs.some(log => log.type === 'stderr');

    return (
        <div className="h-full w-full bg-black">
            <TerminalView
                logs={logs}
                onClear={onClear}
                onFixRequest={hasErrors ? handleFix : undefined}
            />
        </div>
    );
};