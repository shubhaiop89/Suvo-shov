import React, { useState, useCallback } from 'react';
import { CodeView } from './CodeView';
import { PreviewView } from './PreviewView';
import { PanelRightIcon, PanelLeftIcon, CodeIcon, DesktopIcon, RefreshCwIcon, TabletIcon, MobileIcon, MaximizeIcon } from './icons';
import type { FileSystem, AppTheme } from '../types';

type Viewport = 'desktop' | 'tablet' | 'mobile';

interface MainDisplayPanelProps {
    fileSystem: FileSystem;
    activeFile: string;
    onActiveFileChange: (path: string) => void;
    theme: AppTheme;
    isPanelHidden: boolean;
    togglePanel: () => void;
}

const ViewportButton: React.FC<{
    Icon: React.FC<{className?: string}>;
    label: Viewport;
    currentViewport: Viewport;
    onClick: (viewport: Viewport) => void;
}> = ({ Icon, label, currentViewport, onClick }) => {
    const isActive = label === currentViewport;
    return (
        <button
            onClick={() => onClick(label)}
            title={`${label.charAt(0).toUpperCase() + label.slice(1)} view`}
            className={`p-2 rounded-lg transition-colors ${
                isActive 
                ? 'bg-slate-200 text-slate-900 dark:bg-zinc-700 dark:text-white' 
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}


export const MainDisplayPanel: React.FC<MainDisplayPanelProps> = ({
    fileSystem,
    activeFile,
    onActiveFileChange,
    theme,
    isPanelHidden,
    togglePanel,
}) => {
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [viewport, setViewport] = useState<Viewport>('desktop');
    const [refreshKey, setRefreshKey] = useState(0);
    const [fullscreenTrigger, setFullscreenTrigger] = useState(0);

    const handleRefresh = useCallback(() => setRefreshKey(p => p + 1), []);
    const handleFullscreen = useCallback(() => setFullscreenTrigger(p => p + 1), []);

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-zinc-950 min-w-0">
            <div className="flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-2 h-12">
                <div className="flex items-center">
                    <button
                        onClick={togglePanel}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
                        title={isPanelHidden ? "Show Chat Panel" : "Hide Chat Panel"}
                    >
                        {isPanelHidden ? <PanelRightIcon className="h-5 w-5" /> : <PanelLeftIcon className="h-5 w-5" />}
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "code"
                                ? "bg-white text-slate-900 dark:bg-black dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-black/50"
                            }`}
                        >
                            <CodeIcon className="w-5 h-5" />
                            <span>Code</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "preview"
                                ? "bg-white text-slate-900 dark:bg-black dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-black/50"
                            }`}
                        >
                            <DesktopIcon className="w-5 h-5" />
                            <span>Preview</span>
                        </button>
                    </div>

                    {activeTab === 'preview' && (
                        <>
                            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-700 mx-1"></div>
                            <div className="flex items-center gap-1">
                                <ViewportButton Icon={DesktopIcon} label="desktop" currentViewport={viewport} onClick={setViewport} />
                                <ViewportButton Icon={TabletIcon} label="tablet" currentViewport={viewport} onClick={setViewport} />
                                <ViewportButton Icon={MobileIcon} label="mobile" currentViewport={viewport} onClick={setViewport} />
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleRefresh}
                                    title="Refresh Preview"
                                    className="p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <RefreshCwIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleFullscreen}
                                    title="Enter Fullscreen"
                                    className="p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <MaximizeIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {activeTab === "code" && (
                    <CodeView
                        fileSystem={fileSystem}
                        activeFile={activeFile}
                        onActiveFileChange={onActiveFileChange}
                        theme={theme}
                    />
                )}
                {activeTab === "preview" && (
                    <PreviewView 
                        fileSystem={fileSystem} 
                        viewport={viewport}
                        refreshKey={refreshKey}
                        fullscreenTrigger={fullscreenTrigger}
                    />
                )}
            </div>
        </div>
    );
};
