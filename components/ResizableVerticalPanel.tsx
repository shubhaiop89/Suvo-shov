import React, { useState, useRef, useCallback, ReactNode } from 'react';

interface ResizableVerticalPanelProps {
  children: [ReactNode, ReactNode];
  topPanelMinHeight?: number;
  bottomPanelMinHeight?: number;
  initialTopPanelHeight?: string;
}

export const ResizableVerticalPanel: React.FC<ResizableVerticalPanelProps> = ({
  children,
  topPanelMinHeight = 100,
  bottomPanelMinHeight = 48,
  initialTopPanelHeight = '70%',
}) => {
  const [topPanelHeight, setTopPanelHeight] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = containerRef.current?.querySelector<HTMLDivElement>(':first-child')?.offsetHeight ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;
        const containerHeight = containerRef.current.offsetHeight;
        const deltaY = moveEvent.clientY - startY;
        let newHeight = startHeight + deltaY;

        newHeight = Math.max(topPanelMinHeight, newHeight);
        newHeight = Math.min(newHeight, containerHeight - bottomPanelMinHeight);
        
        setTopPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
    
    document.body.style.cursor = 'row-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [topPanelMinHeight, bottomPanelMinHeight]);


  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      <div style={{ height: topPanelHeight ? `${topPanelHeight}px` : initialTopPanelHeight }} className="min-h-0 flex-grow-0 flex-shrink-0">
        {children[0]}
      </div>
      <div 
        onMouseDown={handleMouseDown} 
        className="w-full h-1.5 cursor-row-resize flex-shrink-0 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-purple-500 transition-colors duration-200"
      />
      <div className="flex-1 min-h-0">
        {children[1]}
      </div>
    </div>
  );
};