import React, { useState } from 'react';
import { CloseIcon, TrashIcon, CreditCardIcon, SettingsIcon, HelpCircleIcon, SunIcon, MoonIcon, DesktopIcon } from './icons/index';
import { AppTheme } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onUpgradeClick: () => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const NavLink: React.FC<{ onClick?: () => void; href?: string; children: React.ReactNode; icon: React.FC<{ className?: string }>; }> = ({ onClick, href, children, icon: Icon }) => {
    const commonProps = {
        className: "group flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
    };

    const content = (
        <>
            <Icon className="w-5 h-5 text-slate-500 dark:text-zinc-400 flex-shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{children}</span>
        </>
    );

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    if (href) {
        return <a href={href} {...commonProps}>{content}</a>;
    }
    return <button onClick={handleClick} {...commonProps}>{content}</button>;
};

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
    isOpen, 
    onClose, 
    onOpenSettings, 
    onUpgradeClick, 
    theme,
    setTheme
}) => {
  // In a real app, projects would be fetched.
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleDeleteProject = (e: React.MouseEvent, project: { id: number; name: string }) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    onClose();
  };
  
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    setProjects(currentProjects => currentProjects.filter(p => p.id !== projectToDelete.id));
    setProjectToDelete(null);
  };


  const handleConfirmCreate = () => {
    if (newProjectName.trim()) {
        const newProject = { id: Date.now(), name: newProjectName.trim() };
        setProjects(current => [newProject, ...current]);
        setNewProjectName('');
        setIsCreatingProject(false);
    }
  };

  const handleCancelCreate = () => {
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  const handleSettingsClick = () => {
      onClose();
      onOpenSettings();
  }
  
  const handleUpgradeClick = () => {
      onClose();
      onUpgradeClick();
  }

  return (
    <>
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-zinc-800 shadow-xl w-full max-w-md rounded-xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete Project</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                        Are you sure you want to delete the project "{projectToDelete.name}"? This action cannot be undone.
                    </p>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900 flex justify-end gap-3 rounded-b-xl">
                    <button 
                        onClick={() => setProjectToDelete(null)}
                        className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete Project
                    </button>
                </div>
            </div>
        </div>
      )}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full text-slate-900 dark:text-white">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white select-none font-logo">Suvo</h1>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {isCreatingProject ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Your new project name..."
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleConfirmCreate()}
                        className="w-full p-2.5 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                        autoFocus
                    />
                    <div className="flex items-center justify-end gap-2">
                         <button onClick={handleCancelCreate} className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleConfirmCreate} disabled={!newProjectName.trim()} className="px-3 py-1.5 text-sm font-semibold text-white dark:text-black bg-slate-900 dark:bg-white rounded-md hover:bg-slate-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                            Create
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsCreatingProject(true)} 
                    className="w-full text-center p-3 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors font-semibold shadow-sm"
                >
                    Create New Project
                </button>
            )}
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2 px-3 pt-3 pb-1">Project History</h3>
              {projects.length > 0 ? (
                <ul className="space-y-2">
                    {projects.map((project) => (
                        <li key={project.id}>
                           <div className="group relative">
                               <button type="button" className="block w-full text-left p-3 pr-10 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 shadow-sm transition-colors font-semibold">
                                   <span className="truncate">{project.name}</span>
                               </button>
                               <button 
                                 onClick={(e) => handleDeleteProject(e, project)} 
                                 className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                 title={`Delete ${project.name}`}
                               >
                                   <TrashIcon className="w-4 h-4" />
                               </button>
                           </div>
                        </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 dark:text-zinc-500 px-3 py-2 text-center">
                    No projects yet.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 p-4 space-y-3 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button onClick={() => setTheme('light')} title="Light Theme" className={`w-full p-2 rounded-lg flex justify-center items-center transition-colors ${theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'hover:bg-slate-200 text-slate-500 dark:hover:bg-zinc-700 dark:text-zinc-400'}`}>
                    <SunIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => setTheme('dark')} title="Dark Theme" className={`w-full p-2 rounded-lg flex justify-center items-center transition-colors ${theme === 'dark' ? 'bg-black text-white shadow-sm' : 'hover:bg-slate-200 text-slate-500 dark:hover:bg-zinc-700 dark:text-zinc-400'}`}>
                    <MoonIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => setTheme('system')} title="System Theme" className={`w-full p-2 rounded-lg flex justify-center items-center transition-colors ${theme === 'system' ? 'bg-slate-500 text-white shadow-sm' : 'hover:bg-slate-200 text-slate-500 dark:hover:bg-zinc-700 dark:text-zinc-400'}`}>
                    <DesktopIcon className="w-5 h-5"/>
                </button>
            </div>
            <div className="space-y-1 !mt-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                <NavLink onClick={handleUpgradeClick} icon={CreditCardIcon}>My Subscription</NavLink>
                <NavLink onClick={handleSettingsClick} icon={SettingsIcon}>Settings</NavLink>
                <NavLink href="#" icon={HelpCircleIcon}>Help Center</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};