import React, { useState } from 'react';
import { AppTheme } from '../types';
import { 
    CloseIcon,
    SunIcon,
    MoonIcon,
    DesktopIcon,
    FigmaIcon,
    CreditCardIcon,
    ShovIcon,
} from './icons';
import { 
    SettingsAppearanceIcon, 
    SettingsIntegrationsIcon, 
    SettingsMemoryIcon, 
    SettingsSubscriptionIcon 
} from './icons/settings-icons';

type SettingsTab = 'appearance' | 'integrations' | 'subscription' | 'memory';

interface SettingsPageProps {
  onClose: () => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  onClearChat: () => boolean;
  onUpgradeClick: () => void;
  onAddIntegration: (integration: 'figma' | 'stripe' | 'shov') => void;
}

const SettingsHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="pb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{description}</p>
    </div>
);

const SettingsRow: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="py-5 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-1">
            <h3 className="font-medium text-slate-800 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">{description}</p>
        </div>
        <div className="md:col-span-2">{children}</div>
    </div>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose,
  theme,
  setTheme,
  onClearChat,
  onUpgradeClick,
  onAddIntegration,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  const settingsTabs: { id: SettingsTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'appearance', label: 'Appearance', icon: SettingsAppearanceIcon },
    { id: 'integrations', label: 'Integrations', icon: SettingsIntegrationsIcon },
    { id: 'subscription', label: 'Subscription', icon: SettingsSubscriptionIcon },
    { id: 'memory', label: 'Memory', icon: SettingsMemoryIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <>
            <SettingsHeader title="Appearance" description="Customize the look and feel of the application." />
            <SettingsRow title="Theme" description="Select your preferred interface theme.">
                <div className="flex items-center gap-2 bg-slate-200 dark:bg-black p-1 max-w-xs rounded-xl">
                    <button onClick={() => setTheme('light')} className={`flex-1 p-2 text-sm transition-colors flex items-center justify-center gap-2 font-medium rounded-lg ${theme === 'light' ? 'bg-white text-black' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'}`}>
                      <SunIcon className="w-5 h-5"/> Light
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex-1 p-2 text-sm transition-colors flex items-center justify-center gap-2 font-medium rounded-lg ${theme === 'dark' ? 'bg-white text-black' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'}`}>
                      <MoonIcon className="w-5 h-5"/> Dark
                    </button>
                    <button onClick={() => setTheme('system')} className={`flex-1 p-2 text-sm transition-colors flex items-center justify-center gap-2 font-medium rounded-lg ${theme === 'system' ? 'bg-white text-black' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'}`}>
                      <DesktopIcon className="w-5 h-5"/> System
                    </button>
                </div>
            </SettingsRow>
          </>
        );
      case 'memory':
        return (
            <>
                <SettingsHeader title="Memory" description="Manage chat history and context." />
                <SettingsRow title="Chat History" description="Clearing history will remove all messages from the current session.">
                    <button 
                        onClick={() => {
                            if (onClearChat()) {
                                alert('Chat history has been cleared.');
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                        Clear Chat History
                    </button>
                </SettingsRow>
            </>
        );
      case 'integrations':
        return (
            <>
                <SettingsHeader title="Integrations" description="Connect Suvo to your favorite third-party services." />
                 <SettingsRow title="Shov" description="Connect to the Shov service.">
                    <button onClick={() => onAddIntegration('shov')} className="px-4 py-2 font-medium bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-white rounded-md transition-colors flex items-center gap-2">
                        <ShovIcon className="w-5 h-5" />
                        Connect Shov
                    </button>
                </SettingsRow>
                <SettingsRow title="Stripe" description="Enable payments by connecting to Stripe.">
                    <button onClick={() => onAddIntegration('stripe')} className="px-4 py-2 font-medium bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-white rounded-md transition-colors flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5" />
                        Connect Stripe
                    </button>
                </SettingsRow>
                <SettingsRow title="Figma" description="Import designs from Figma to generate code.">
                    <button onClick={() => onAddIntegration('figma')} className="px-4 py-2 font-medium bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-white rounded-md transition-colors flex items-center gap-2">
                        <FigmaIcon className="w-5 h-5" />
                        Connect Figma
                    </button>
                </SettingsRow>
            </>
        );
      case 'subscription':
        return (
             <>
                <SettingsHeader title="Subscription" description="Manage your billing information and plan." />
                <SettingsRow title="Current Plan" description="You are currently on the Free plan.">
                    <div className="p-4 bg-slate-100 dark:bg-zinc-900 flex items-center justify-between rounded-xl">
                        <div>
                            <p className="font-semibold text-lg text-slate-900 dark:text-white">Free</p>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">5 chats per day</p>
                        </div>
                        <button onClick={onUpgradeClick} className="px-4 py-2 font-medium text-white bg-slate-900 hover:bg-slate-700 dark:text-black dark:bg-white dark:hover:bg-zinc-200 rounded-md transition-colors">
                            Upgrade Plan
                        </button>
                    </div>
                </SettingsRow>
            </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
        <div 
            className="w-full max-w-4xl h-full max-h-[80vh] bg-white dark:bg-[#111111] text-slate-900 dark:text-white shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Settings</h1>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <CloseIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <aside className="w-60 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 p-4">
                    <nav className="flex flex-col space-y-1">
                        {settingsTabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-left rounded-md transition-colors ${activeTab === tab.id ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? 'text-slate-700 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};