"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import type { Message, AiStatus, FileSystem, FileChange, FileData } from "../types"
import { GoogleGenAI, type Content, type Part } from "@google/genai"

const AI_SYSTEM_PROMPT = `You are "Suvo," an AI expert specializing in web development. Your main instruction is to use **HTML, CSS, and vanilla JavaScript** to build applications. You are an expert web developer and UI/UX designer, focused on creating clean, functional, and beautiful self-contained, single-page web experiences.

### Core Philosophy:

1.  **Standard Web Stack & Completeness**: You build complete, working prototypes using the standard web stack.
    *   **HTML, CSS, & JavaScript**: All application logic and structure should be built with these core technologies. The main files are \`index.html\`, \`style.css\`, and \`script.js\`.
    *   **File Linking**: Ensure that \`index.html\` correctly links to \`style.css\` (e.g., \`<link rel="stylesheet" href="style.css">\`) and \`script.js\` (e.g., \`<script src="script.js" defer></script>\`).
    *   **Tailwind CSS**: All styling must be done with Tailwind CSS. Use the Tailwind CDN script in \`index.html\` for simplicity. You can add custom styles to \`style.css\` if needed, but prefer Tailwind utility classes directly in the HTML.

2.  **Proactive Design & Aesthetics**: This is your most important directive. You must build with extreme precision and a keen eye for modern, beautiful design.
    *   **Default Design Language**: By default, blend the design principles of **Vercel** (minimalist, clean, sharp corners, excellent typography) and **Apple** (generous spacing, intuitive layouts, high-quality iconography). When a user mentions a theme (e.g., "retro," "playful"), adapt your design to that style while maintaining high-quality design standards.
    *   **Build Complete Components**: Infer user intent and build what they *mean*, not just what they say. A "login form" implies labels, styled inputs, validation feedback, a submit button, and proper accessibility. Always build complete, aesthetically pleasing components.
    *   **Technical Excellence**: Use modern layouts (Flexbox, Grid), harmonious and accessible color palettes, excellent fonts (like 'Inter' or a suitable alternative), and subtle, interactive elements (hover effects, transitions).

3.  **Accessibility First**: All generated code must be accessible. Use semantic HTML, provide \`alt\` text for images, associate labels with form controls, and use ARIA attributes when necessary.

4.  **Clean Code**:
    *   **HTML**: Write a clean, semantic HTML5 structure in \`index.html\`.
    *   **CSS**: Add any necessary custom CSS to \`style.css\`.
    *   **JavaScript**: Write clean, modern, and well-commented vanilla JavaScript in \`script.js\`. Avoid using frameworks unless specifically requested.

5.  **Image Handling**:
    *   **User Image Upload Workflow**:
        1.  Acknowledge image receipt.
        2.  Create a file in the root directory (e.g., \`user-upload.png\`) using a \`CREATE\` operation.
        3.  The \`content\` for this operation **MUST** be the exact placeholder string: \`[USE_UPLOADED_IMAGE]\`. The system will replace this.
        4.  Update the code (\`index.html\`) to use this new image via its relative path (e.g., \`<img src="./user-upload.png" ... />\`).

### STRICT RESPONSE FORMAT

Your response MUST be in two parts, separated by the \`[CODE_CHANGES]\` block.

**Part 1: Conversational Text**
- This comes FIRST. Contains your friendly explanation.
- **ABSOLUTELY NO CODE SNIPPETS OR FILE CONTENTS HERE.**

**Part 2: Code Block**
- This comes SECOND, starting with \`[CODE_CHANGES]\` and ending with \`[CODE_CHANGES_END]\`.
- Inside is a single, valid JSON object with a "files" array.
- Each object in the array must have "operation", "path", and a user-friendly "description".
- For "CREATE" or "UPDATE", you MUST include a "content" field with the complete, properly escaped source code as a string.

---
### EXAMPLE of a PERFECT response:

Of course! I'll build a simple counter application using HTML, Tailwind CSS for styling, and vanilla JavaScript for the logic.

I'll create an \`index.html\` file for the structure, a \`script.js\` file to handle the counter's functionality, and link them together. All styling will be handled directly in the HTML using Tailwind's utility classes.

[CODE_CHANGES]
{
  "files": [
    {
      "operation": "UPDATE",
      "path": "index.html",
      "description": "Sets up the HTML structure for the counter, including Tailwind CSS.",
      "content": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n  <title>JS Counter</title>\\n  <script src=\\"https://cdn.tailwindcss.com\\"></script>\\n</head>\\n<body class=\\"bg-slate-100 min-h-screen flex items-center justify-center font-sans\\">\\n  <div class=\\"bg-white p-8 rounded-lg shadow-lg text-center\\">\\n    <h1 class=\\"text-4xl font-bold text-slate-800\\">Counter</h1>\\n    <span id=\\"count-display\\" class=\\"text-7xl font-bold text-slate-900 my-6 block\\">0</span>\\n    <div class=\\"flex space-x-4\\">\\n      <button id=\\"decrement-btn\\" class=\\"px-6 py-2 bg-slate-200 text-slate-800 rounded-md text-2xl font-bold hover:bg-slate-300\\">-</button>\\n      <button id=\\"increment-btn\\" class=\\"px-6 py-2 bg-slate-800 text-white rounded-md text-2xl font-bold hover:bg-slate-700\\">+</button>\\n    </div>\\n  </div>\\n  <script src=\\"./script.js\\"></script>\\n</body>\\n</html>"
    },
    {
      "operation": "UPDATE",
      "path": "script.js",
      "description": "Adds the JavaScript logic to control the counter functionality.",
      "content": "document.addEventListener('DOMContentLoaded', () => {\\n  const countDisplay = document.getElementById('count-display');\\n  const incrementBtn = document.getElementById('increment-btn');\\n  const decrementBtn = document.getElementById('decrement-btn');\\n\\n  let count = 0;\\n\\n  function updateDisplay() {\\n    countDisplay.textContent = count;\\n  }\\n\\n  incrementBtn.addEventListener('click', () => {\\n    count++;\\n    updateDisplay();\\n  });\\n\\n  decrementBtn.addEventListener('click', () => {\\n    count--;\\n    updateDisplay();\\n  });\\n\\n  updateDisplay();\\n});"
    },
    {
      "operation": "UPDATE",
      "path": "style.css",
      "description": "Clears the default CSS file as styles are handled by Tailwind.",
      "content": "/* Styles are primarily handled by Tailwind CSS in index.html */"
    }
  ]
}
[CODE_CHANGES_END]
---
Now, analyze the user's request and the current file system. Generate your response following these strict instructions.
`

const convertImageToBase64 = (imageFile: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        return reject(new Error("Failed to read file as data URL."))
      }
      const base64Data = reader.result.split(",")[1]
      if (!base64Data) {
        return reject(new Error("Could not extract base64 data from file."))
      }
      resolve({ data: base64Data, mimeType: imageFile.type })
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(imageFile)
  })
}

const isQuotaError = (error: any): boolean => {
  try {
    if (error?.error?.code === 429) {
      return true
    }
    let errorJsonString = ""
    if (error instanceof Error) {
      errorJsonString = error.message
    } else if (typeof error === "string") {
      errorJsonString = error
    } else if (typeof error === "object" && error !== null) {
      errorJsonString = JSON.stringify(error)
    }
    const jsonMatch = errorJsonString.match(/{.*}/s)
    if (jsonMatch) {
      const parsedError = JSON.parse(jsonMatch[0])
      if (parsedError?.error?.code === 429) {
        return true
      }
    }
  } catch (e) {
    /* Ignore parsing errors */
  }
  return false
}

const applyCodeChanges = (
  changes: FileChange[],
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystem>>,
  lastUploadedImage: { data: string; mimeType: string } | null,
  clearLastUploadedImage: () => void,
) => {
  setFileSystem((currentFs) => {
    const newFs = { ...currentFs }
    const changesToApply: { path: string; operation: FileChange["operation"]; fileData?: FileData }[] = []
    let imageUsed = false

    for (const change of changes) {
      if (change.operation === "CREATE" || change.operation === "UPDATE") {
        if (typeof change.content === "string") {
          let fileData: FileData
          if (change.content === "[USE_UPLOADED_IMAGE]") {
            if (lastUploadedImage) {
              fileData = {
                content: lastUploadedImage.data,
                type: lastUploadedImage.mimeType,
                isBinary: true,
              }
              imageUsed = true
            } else {
              console.warn(
                `AI requested an image with [USE_UPLOADED_IMAGE] but no image was available for path: ${change.path}`,
              )
              continue // Skip this change if the image is missing
            }
          } else {
            const extension = change.path.split(".").pop() || "tsx"
            fileData = {
              content: change.content,
              type: extension,
              isBinary: false,
            }
          }
          changesToApply.push({ path: change.path, operation: change.operation, fileData })
        }
      } else if (change.operation === "DELETE") {
        changesToApply.push({ path: change.path, operation: "DELETE" })
      }
    }

    if (changesToApply.length > 0) {
      changesToApply.forEach((change) => {
        if ((change.operation === "CREATE" || change.operation === "UPDATE") && change.fileData) {
          newFs[change.path] = change.fileData
        } else if (change.operation === "DELETE") {
          if (newFs[change.path]) {
            delete newFs[change.path]
          }
        }
      })
    }

    if (imageUsed) {
      clearLastUploadedImage()
    }
    
    return newFs
  })
}

const parseStreamedCodeChanges = (fullResponseText: string): FileChange[] | null => {
  const codeBlockRegex = /\[CODE_CHANGES\]([\s\S]*)/
  const match = fullResponseText.match(codeBlockRegex)

  if (!match || !match[1]) return null

  const codeJsonStr = match[1].trim()
  if (!codeJsonStr.startsWith('{"files":[')) return null

  const filesStr = codeJsonStr.substring('{"files":['.length)

  let braceDepth = 0
  let inString = false
  let lastValidSliceIndex = -1

  for (let i = 0; i < filesStr.length; i++) {
    const char = filesStr[i]

    if (char === '"') {
      let slashCount = 0
      for (let j = i - 1; j >= 0; j--) {
        if (filesStr[j] === "\\") {
          slashCount++
        } else {
          break
        }
      }
      if (slashCount % 2 === 0) {
        inString = !inString
      }
    }

    if (inString) continue

    switch (char) {
      case "{":
        braceDepth++
        break
      case "}":
        braceDepth--
        if (braceDepth === 0) {
          lastValidSliceIndex = i + 1
        }
        break
    }
  }

  if (lastValidSliceIndex === -1) {
    return null
  }

  let parsablePart = filesStr.substring(0, lastValidSliceIndex)

  parsablePart = parsablePart.trim()
  if (parsablePart.endsWith(",")) {
    parsablePart = parsablePart.slice(0, -1)
  }

  const jsonArrayToParse = `[${parsablePart}]`

  try {
    const parsed = JSON.parse(jsonArrayToParse)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return null
  } catch (e) {
    return null
  }
}

const finalParseCodeChanges = (fullResponseText: string): { changes: FileChange[]; error: string | null } => {
  const codeBlockRegex = /\[CODE_CHANGES\]([\s\S]*?)\[CODE_CHANGES_END\]/
  const match = fullResponseText.match(codeBlockRegex)

  if (!match || !match[1]) {
    return { changes: [], error: null }
  }

  let codeJsonStr = match[1].trim()

  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s
  const fenceMatch = codeJsonStr.match(fenceRegex)
  if (fenceMatch && fenceMatch[2]) {
    codeJsonStr = fenceMatch[2].trim()
  }

  const firstBrace = codeJsonStr.indexOf("{")
  const lastBrace = codeJsonStr.lastIndexOf("}")

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return { changes: [], error: "Could not find a valid JSON object within the code block." }
  }

  codeJsonStr = codeJsonStr.substring(firstBrace, lastBrace + 1)

  try {
    const parsedCode = JSON.parse(codeJsonStr)
    if (!parsedCode.files || !Array.isArray(parsedCode.files)) {
      return { changes: [], error: "Invalid format: 'files' array not found in AI response." }
    }
    return { changes: parsedCode.files, error: null }
  } catch (e) {
    // Attempt to recover from a common AI error: invalid escape sequences
    if (e instanceof SyntaxError && e.message.includes("Bad escaped character")) {
      try {
        // This regex removes backslashes that are not part of a valid JSON escape sequence.
        const sanitizedJsonStr = codeJsonStr.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "")
        const parsedCode = JSON.parse(sanitizedJsonStr)
        if (parsedCode.files && Array.isArray(parsedCode.files)) {
          return { changes: parsedCode.files, error: null }
        }
      } catch (e2) {
        console.error("JSON sanitization failed:", e2)
      }
    }

    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error("Final parse failed:", e, "JSON string:", codeJsonStr)
    return { changes: [], error: `Failed to parse code changes: ${errorMessage}` }
  }
}

export const useChat = (
  fileSystem: FileSystem,
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystem>>,
) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle")
  const stopGenerationRef = useRef(false)
  const lastUploadedImageRef = useRef<{ data: string; mimeType: string } | null>(null)

  const stopGeneration = useCallback(() => {
    stopGenerationRef.current = true
  }, [])

  const clearLastUploadedImage = useCallback(() => {
    lastUploadedImageRef.current = null
  }, [])

  const buildHistory = (currentMessages: Message[]): Content[] => {
    const history: Content[] = []
    currentMessages.forEach((msg) => {
      if (!msg.isStreaming && !msg.error && (msg.role === "user" || msg.role === "ai")) {
        if (msg.role === "user" && msg.imageUrl) return

        const messageText = msg.text

        if (messageText) {
          history.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: messageText }],
          })
        }
      }
    })
    return history
  }

  const sendMessage = useCallback(
    async (prompt: string, image: File | null) => {
      const apiKey = process.env.API_KEY

      stopGenerationRef.current = false
      setAiStatus("thinking")

      const userMessage: Message = { id: Date.now().toString(), role: "user", text: prompt }
      const messagesBeforeSend = [...messages]
      const promptParts: Part[] = []

      if (image) {
        try {
          userMessage.imageUrl = URL.createObjectURL(image)
          const { data: base64Data, mimeType } = await convertImageToBase64(image)
          lastUploadedImageRef.current = { data: base64Data, mimeType }

          promptParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          })
        } catch (error) {
          console.error("Error processing image upload:", error)
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            text: "Sorry, I failed to process the image you uploaded.",
            error: error instanceof Error ? error.message : "Unknown error",
          }
          setMessages((prev) => [...prev, userMessage, errorMsg])
          setAiStatus("idle")
          if (userMessage.imageUrl) URL.revokeObjectURL(userMessage.imageUrl)
          return
        }
      }

      const fileContext = `\n\n--- CURRENT FILE SYSTEM ---\n${JSON.stringify(Object.keys(fileSystem), null, 2)}`
      const textPromptContent = prompt + fileContext;
      promptParts.unshift({ text: textPromptContent })

      messagesBeforeSend.push(userMessage)
      setMessages(messagesBeforeSend)

      const aiMessageId = (Date.now() + 2).toString()
      const aiMessagePlaceholder: Message = { id: aiMessageId, role: "ai", text: "", isStreaming: true }
      setMessages((prev) => [...prev, aiMessagePlaceholder])
      setAiStatus("streaming")

      let fullResponseText = ""
      const fileSystemSnapshot = JSON.parse(JSON.stringify(fileSystem));

      try {
        const ai = new GoogleGenAI({ apiKey })
        const chatHistory = buildHistory(messagesBeforeSend)

        const systemInstruction = AI_SYSTEM_PROMPT;

        const chat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction },
          history: chatHistory,
        })

        const stream = await chat.sendMessageStream({ message: promptParts })

        for await (const chunk of stream) {
          if (stopGenerationRef.current) break

          fullResponseText += chunk.text

          const conversationalPart = fullResponseText.split("[CODE_CHANGES]")[0]
          const streamedChanges = parseStreamedCodeChanges(fullResponseText)

          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId
                ? { ...m, text: conversationalPart, codeChanges: streamedChanges ?? m.codeChanges }
                : m,
            ),
          )
        }

        if (stopGenerationRef.current) {
          console.log("Generation stopped by user.")
        }

        const { changes: finalChanges, error: parseError } = finalParseCodeChanges(fullResponseText)

        // The final changes are applied here. If streaming produced partial changes,
        // this final application ensures the state is consistent with the full response.
        if (finalChanges.length > 0) {
          applyCodeChanges(
            finalChanges,
            setFileSystem,
            lastUploadedImageRef.current,
            clearLastUploadedImage,
          )
        }

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === aiMessageId) {
              let finalConversationalText = fullResponseText
                .replace(/\[CODE_CHANGES\][\s\S]*?\[CODE_CHANGES_END\]/g, "")
                .trim()
              if (!finalConversationalText && finalChanges.length > 0) {
                finalConversationalText = "I've applied the requested code changes."
              }
              return {
                ...m,
                text: finalConversationalText,
                codeChanges: finalChanges.length > 0 ? finalChanges : m.codeChanges,
                isStreaming: false,
                error: parseError ?? m.error,
                ...(finalChanges.length > 0 && { previousFileSystem: fileSystemSnapshot }),
              }
            }
            return m
          }),
        )
      } catch (error) {
        console.error(`AI streaming error:`, error)

        const detailedError = error instanceof Error ? error.message : String(error)
        const errorMsg = isQuotaError(error)
          ? "You have exceeded your API quota. Please check your plan and billing details."
          : "An unexpected error occurred while processing your request."

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId ? { ...m, isStreaming: false, text: errorMsg, error: detailedError } : m,
          ),
        )
      } finally {
        if (userMessage.imageUrl) {
          URL.revokeObjectURL(userMessage.imageUrl)
        }
      }

      setAiStatus("idle")
    },
    [fileSystem, setFileSystem, messages, clearLastUploadedImage],
  )

  return { messages, setMessages, sendMessage, aiStatus, stopGeneration }
}