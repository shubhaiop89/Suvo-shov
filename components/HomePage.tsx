import React, { useState } from 'react';
import { ChatInput } from './ChatInput';
import { Link } from 'react-router-dom';
import { AuthPage } from './AuthPage';

interface HomePageProps {
  onLaunchWorkspace: (prompt?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLaunchWorkspace }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Called after successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleSendMessage = (prompt: string, image: File | null) => {
    const isInputProvided = prompt.trim() !== '' || image !== null;
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    onLaunchWorkspace(isInputProvided ? prompt : undefined);
  };

  const handleImportProject = () => {
    // On the homepage, importing a project launches the workspace,
    // where the user can then use the import functionality.
    onLaunchWorkspace();
  };

  const handleImportFigma = () => {
    // This is an action that generates code. It should behave like sending a prompt.
    const figmaPrompt = `Please add an integration with Figma. I want to be able to provide a Figma file URL and an access token. 
1. Add a new UI section in the app where I can input a Figma file URL and an access token.
2. Explain that the user needs to generate a personal access token from their Figma account settings.
3. Create a button that, when clicked, would theoretically fetch the Figma file data and then generate the code from it.
4. For now, just create the UI for this, and I will ask you to implement the fetching and generation logic in a later step.`;
    onLaunchWorkspace(figmaPrompt);
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col">
        <header className="flex-shrink-0 z-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
                <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white select-none font-logo">Suvo</Link>
                <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="px-4 py-2 bg-slate-800 text-white dark:bg-slate-200 dark:text-black rounded-md hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors font-semibold"
                >
                    Get Started
                </button>
            </div>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto grid-pattern">
            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto z-10 px-4 pt-10 pb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">
                Build for the web, instantly.
              </h1>
              <p className="mt-4 text-xl text-slate-500 dark:text-zinc-400 max-w-2xl">
                Describe your idea, and watch it come to life with HTML, CSS, and JavaScript.
              </p>

              <div className="relative w-full max-w-2xl mx-auto mt-12">
                  <ChatInput
                      onSendMessage={handleSendMessage}
                      aiStatus={'idle'}
                      stopGeneration={() => {}}
                      onImportProjectClick={handleImportProject}
                      onImportFigmaClick={handleImportFigma}
                  />
              </div>
            </main>
            
            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap z-10 mt-auto">
              <Link to="/terms" className="text-sm text-slate-500 dark:text-zinc-400 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-sm text-slate-500 dark:text-zinc-400 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</Link>
            </footer>
        </div>
        
  {isAuthOpen && <AuthPage onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};