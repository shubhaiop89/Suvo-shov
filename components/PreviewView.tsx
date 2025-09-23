import React, { useState, useEffect, useRef } from 'react';
import type { FileSystem } from '../types';
import { Buffer } from 'buffer';

type Viewport = 'desktop' | 'tablet' | 'mobile';

interface PreviewViewProps {
  fileSystem: FileSystem;
  viewport: Viewport;
  refreshKey: number;
  fullscreenTrigger: number;
}

const getMimeType = (type: string): string => {
  switch (type) {
    case 'html': return 'text/html';
    case 'css': return 'text/css';
    case 'js': return 'text/javascript';
    case 'ts':
    case 'tsx': return 'text/javascript'; // Browsers handle TS/JSX via module loaders as JS
    case 'json': return 'application/json';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    default: return 'text/plain';
  }
};

export const PreviewView: React.FC<PreviewViewProps> = ({ fileSystem, viewport, refreshKey, fullscreenTrigger }) => {
  const [iframeSrc, setIframeSrc] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fullscreenTrigger > 0 && containerRef.current) {
        containerRef.current.requestFullscreen().catch(err => {
            console.error("Failed to enter fullscreen mode:", err);
        });
    }
  }, [fullscreenTrigger]);

  useEffect(() => {
    const indexHtmlFile = fileSystem['index.html'];
    if (!indexHtmlFile || indexHtmlFile.isBinary) {
      setIframeSrc('');
      return;
    }

    const blobUrls = new Map<string, string>();
    const createdUrls: string[] = [];

    // Create blob URLs for all files except index.html
    for (const path in fileSystem) {
      if (path !== 'index.html') {
        const file = fileSystem[path];
        const mimeType = file.isBinary ? file.type : getMimeType(file.type);
        const content = file.isBinary ? Buffer.from(file.content, 'base64') : file.content;
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        blobUrls.set(path, url);
        createdUrls.push(url);
      }
    }
    
    // Replace relative paths in index.html with blob URLs
    let finalHtml = indexHtmlFile.content;
    finalHtml = finalHtml.replace(/(src|href)=["'](\.\/|)([a-zA-Z0-9_./-]+)["']/g, (match, attr, prefix, path) => {
      if (blobUrls.has(path)) {
        return `${attr}="${blobUrls.get(path)}"`;
      }
      return match; // Keep original if not in file system (e.g., external URLs)
    });

    // Create the final blob for index.html
    const finalBlob = new Blob([finalHtml], { type: 'text/html' });
    const finalUrl = URL.createObjectURL(finalBlob);
    createdUrls.push(finalUrl);

    setIframeSrc(finalUrl);

    // Cleanup blob URLs on unmount or when dependencies change
    return () => {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [fileSystem, refreshKey]);

  const viewportWidths: Record<Viewport, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="h-full w-full bg-slate-100 dark:bg-zinc-950 flex flex-col">
        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div
                ref={containerRef}
                className="preview-container w-full h-full max-w-full max-h-full bg-white shadow-lg rounded-md transition-all duration-300 ease-in-out"
                style={{ width: viewportWidths[viewport] }}
            >
                <iframe
                    key={refreshKey}
                    src={iframeSrc}
                    title="Live Preview"
                    className="w-full h-full border-0 rounded-md"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
            </div>
        </div>
    </div>
  );
};