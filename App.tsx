"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { Header } from "./components/Header"
import { SideDrawer } from "./components/SideDrawer"
import { ChatPanel } from "./components/ChatPanel"
import { ResizablePanel } from "./components/ResizablePanel"
import { useChat } from "./hooks/useChat"
import type { FileSystem, AppTheme } from "./types"
import { HomePage } from "./components/HomePage"
import { ImportZipModal, type ZipFileEntry } from "./components/ImportZipModal"
import JSZip from "jszip"
import { SettingsPage } from "./components/SettingsPage"
import { PrivacyPolicyPage, TermsOfServicePage } from "./components/LegalPages"
import { PricingModal } from "./components/PricingModal"
import { MainDisplayPanel } from "./components/MainDisplayPanel"

const initialFileSystem: FileSystem = {
  'index.html': {
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Suvo App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-900 text-white">
  <div class="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold mb-4">Hello, World!</h1>
    <p class="text-lg text-slate-300">This is your new application. Ask me to build something!</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    type: 'html'
  },
  'script.js': {
    content: `// Your JavaScript code goes here!
console.log("Hello from script.js!");
`,
    type: 'js'
  },
  'style.css': {
    content: `/* Your custom CSS goes here */
`,
    type: 'css'
  }
};

// Using a global-like variable is a simple way to pass the initial prompt 
// from the homepage to the workspace without complex state management across routes.
let initialPromptForWorkspace: string | undefined = undefined;

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<AppTheme>("dark")
  const [isApiPanelHidden, setApiPanelHidden] = useState(false)
  const [isImportModalOpen, setImportModalOpen] = useState(false)
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [isPricingModalOpen, setPricingModalOpen] = useState(false)
  const [zipContents, setZipContents] = useState<ZipFileEntry[]>([])
  
  const importFileInputRef = useRef<HTMLInputElement>(null)

  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem)
  const [activeFile, setActiveFile] = useState<string>("index.html")

  const { messages, sendMessage, aiStatus, stopGeneration, setMessages } = useChat(
    fileSystem,
    setFileSystem,
  )
  
  useEffect(() => {
    const applyTheme = (t: AppTheme) => {
      const root = document.documentElement
      root.classList.remove("light", "dark")

      let effectiveTheme = t
      if (t === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      }

      root.classList.add(effectiveTheme)
      document.body.className = effectiveTheme
    }

    applyTheme(theme)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Send initial prompt after launch
  useEffect(() => {
    if (initialPromptForWorkspace) {
      sendMessage(initialPromptForWorkspace, null)
      initialPromptForWorkspace = undefined // Reset after sending
    }
  }, [sendMessage])

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev)
  }, [])

  const toggleApiPanel = useCallback(() => {
    setApiPanelHidden((prev) => !prev)
  }, [])

  const handleUpgradeClick = useCallback(() => {
    setPricingModalOpen(true)
    setDrawerOpen(false) // Close drawer if open
    setSettingsOpen(false) // Close settings if open
  }, [])

  const handleImportClick = useCallback(() => {
    importFileInputRef.current?.click()
  }, [])

  const handleOpenSettings = useCallback(() => {
    setDrawerOpen(false)
    setSettingsOpen(true)
  }, [])

  const handleClearChat = useCallback(() => {
    if (confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        setMessages([]);
        return true;
    }
    return false;
  }, [setMessages]);

  const handleZipFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const zip = await JSZip.loadAsync(file)
      const contents: ZipFileEntry[] = []
      for (const path in zip.files) {
        if (!path.startsWith("__MACOSX/") && path.trim() !== "" && !path.endsWith("/.")) {
          const zipObject = zip.files[path]
          contents.push({
            path: zipObject.name,
            isDirectory: zipObject.dir,
            getContent: () => zipObject.async("string"),
          })
        }
      }
      contents.sort((a, b) => a.path.localeCompare(b.path))
      setZipContents(contents)
      setImportModalOpen(true)
    } catch (error) {
      console.error("Error reading zip file:", error)
      alert("Sorry, there was an error processing that ZIP file. Please ensure it's a valid archive.")
    }

    if (e.target) {
      e.target.value = "" // Allow re-selecting the same file
    }
  }, [])

  const handleImportConfirm = useCallback(
    async (filesToImport: ZipFileEntry[]) => {
      const newFileSystem: FileSystem = {}
      const contentPromises = filesToImport.map(async (file) => {
        try {
          const content = await file.getContent()
          const type = (file.path.split(".").pop() as any) || "tsx"
          if (typeof content === "string") {
            newFileSystem[file.path] = { content, type }
          }
        } catch (e) {
          console.warn(`Could not read content for ${file.path}`, e)
        }
      })

      await Promise.all(contentPromises)

      setFileSystem(newFileSystem)
      setMessages([
        {
          id: Date.now().toString(),
          role: "ai",
          text: "I've successfully loaded your project files. What would you like to edit or build next?",
        },
      ])

      const preferredFiles = ["src/App.tsx", "src/index.js", "index.html"]
      const firstFile = preferredFiles.find((f) => newFileSystem[f]) || Object.keys(newFileSystem)[0]
      setActiveFile(firstFile || "")

      setImportModalOpen(false)
    },
    [setMessages, setFileSystem, setActiveFile],
  )
  
  const handleRestoreFileSystem = useCallback((fs: FileSystem) => {
    setFileSystem(fs);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'ai',
        text: 'I have restored the project to the selected checkpoint.'
      }
    ]);
  }, [setFileSystem, setMessages]);

  const handleDownloadZip = useCallback(async () => {
    const zip = new JSZip()
    for (const path in fileSystem) {
      zip.file(path, fileSystem[path].content)
    }
    const blob = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "suvo-project.zip"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }, [fileSystem])

  const handleAddIntegration = useCallback(
    (integration: "figma" | "stripe" | "shov") => {
      let prompt = ""
      if (integration === "figma") {
        prompt = `Please add an integration with Figma. I want to be able to provide a Figma file URL and an access token. 
1. Add a new UI section in the app where I can input a Figma file URL and an access token.
2. Explain that the user needs to generate a personal access token from their Figma account settings.
3. Create a button that, when clicked, would theoretically fetch the Figma file data and then generate the code from it.
4. For now, just create the UI for this, and I will ask you to implement the fetching and generation logic in a later step.`
      } else if (integration === 'stripe') {
        prompt = `Please integrate Stripe for payments. I need a simple checkout page. Create a form with fields for credit card number, expiry date, and CVC. Add a 'Pay Now' button. For now, just create the frontend UI for this. I will ask you to implement the backend logic in a later step.`
      } else if (integration === 'shov') {
        prompt = `Please add an integration with a service called 'Shov'. I need a UI to input an API key for Shov and a button to 'Sync with Shov'. Create a simple settings-like page for this.`
      }

      if (prompt) {
        sendMessage(prompt, null)
        setSettingsOpen(false)
        setDrawerOpen(false)
      }
    },
    [sendMessage],
  )
  
  return (
    <>
      <input
        type="file"
        ref={importFileInputRef}
        onChange={handleZipFileChange}
        className="hidden"
        accept=".zip,application/zip,application/x-zip-compressed"
      />
      <div
        className={`relative h-screen w-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col overflow-hidden`}
      >
        <Header
          onMenuClick={toggleDrawer}
          onUpgradeClick={handleUpgradeClick}
          onAddIntegration={handleAddIntegration}
          onDownloadZip={handleDownloadZip}
        />
        <main className="flex-1 flex overflow-hidden pt-16">
          <ResizablePanel isLeftPanelHidden={isApiPanelHidden}>
            <ChatPanel
              messages={messages}
              onSendMessage={sendMessage}
              aiStatus={aiStatus}
              stopGeneration={stopGeneration}
              onImportProjectClick={handleImportClick}
              onImportFigmaClick={() => handleAddIntegration("figma")}
              onRestoreFileSystem={handleRestoreFileSystem}
              onClearChat={handleClearChat}
            />
            <MainDisplayPanel
              fileSystem={fileSystem}
              activeFile={activeFile}
              onActiveFileChange={setActiveFile}
              theme={theme}
              isPanelHidden={isApiPanelHidden}
              togglePanel={toggleApiPanel}
            />
          </ResizablePanel>
        </main>
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={toggleDrawer}
          onOpenSettings={handleOpenSettings}
          onUpgradeClick={handleUpgradeClick}
          theme={theme}
          setTheme={setTheme}
        />
        <ImportZipModal
          isOpen={isImportModalOpen}
          onClose={() => setImportModalOpen(false)}
          files={zipContents}
          onConfirm={handleImportConfirm}
        />
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setPricingModalOpen(false)} />
      </div>
      
      {isSettingsOpen && (
        <SettingsPage
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          setTheme={setTheme}
          onClearChat={handleClearChat}
          onUpgradeClick={handleUpgradeClick}
          onAddIntegration={handleAddIntegration}
        />
      )}
    </>
  )
}

const MainApplication: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLaunchWorkspace = useCallback((prompt?: string) => {
      initialPromptForWorkspace = prompt;
      if (!location.pathname.startsWith('/w')) {
          navigate('/w');
      }
  }, [navigate, location.pathname]);

  if (location.pathname.startsWith('/w')) {
      return <Workspace />;
  }

  return <HomePage onLaunchWorkspace={handleLaunchWorkspace} />;
};


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/*" element={<MainApplication />} />
    </Routes>
  )
}

export default App