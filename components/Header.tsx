import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, DownloadIcon, IntegrationsIcon, FigmaIcon, CloseIcon, ShovIcon, CreditCardIcon } from './icons/index';

interface HeaderProps {
  onMenuClick: () => void;
  onUpgradeClick: () => void;
  onAddIntegration: (integration: 'figma' | 'stripe' | 'shov') => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onUpgradeClick, 
  onAddIntegration,
  onDownloadZip
}) => {
  const [isIntegrationsMenuOpen, setIntegrationsMenuOpen] = useState(false);
  const integrationsMenuRef = useRef<HTMLDivElement>(null);
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (integrationsMenuRef.current && !integrationsMenuRef.current.contains(event.target as Node)) {
        setIntegrationsMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 h-16 z-30">
      <div className="flex items-center gap-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white select-none font-logo">Suvo</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative" ref={integrationsMenuRef}>
          <button
            onClick={() => setIntegrationsMenuOpen(prev => !prev)}
            title="Add Integration"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 backdrop-blur-sm hover:text-slate-900 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80 dark:hover:text-white transition-colors"
          >
            <IntegrationsIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
            <span>Integrations</span>
          </button>
          {isIntegrationsMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 p-2">
                <div className="p-2">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Add Integration</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Add connections to other services.</p>
                </div>
                <div className="mt-1 space-y-1">
                    <button 
                        onClick={() => { onAddIntegration('shov'); setIntegrationsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <ShovIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Shov</span>
                    </button>
                     <button 
                        onClick={() => { onAddIntegration('stripe'); setIntegrationsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <CreditCardIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Stripe</span>
                    </button>
                    <button 
                        onClick={() => { onAddIntegration('figma'); setIntegrationsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <FigmaIcon className="w-5 h-5" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Figma</span>
                    </button>
                </div>
            </div>
          )}
        </div>

        <div className="relative" ref={downloadMenuRef}>
            <button
                onClick={() => setDownloadMenuOpen(prev => !prev)}
                title="Download"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 backdrop-blur-sm hover:text-slate-900 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700/80 dark:hover:text-white transition-colors"
            >
                <DownloadIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
                <span>Export</span>
            </button>
            {isDownloadMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 p-2">
                    <div className="space-y-1">
                        <button 
                            onClick={() => { onDownloadZip(); setDownloadMenuOpen(false); }}
                            className="w-full flex items-center gap-3 p-2 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <DownloadIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">Download Project (.zip)</span>
                        </button>
                    </div>
                </div>
            )}
        </div>

        <button
          onClick={onUpgradeClick}
          className="font-logo uppercase tracking-wider text-sm font-semibold bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Upgrade
        </button>
        
        <div className="h-6 w-px bg-slate-200/50 dark:bg-zinc-800/50 mx-1"></div>
        
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-slate-100/80 backdrop-blur-sm dark:hover:bg-zinc-800/80 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6 text-slate-600 dark:text-zinc-300" />
        </button>
      </div>
    </header>
  );
};
