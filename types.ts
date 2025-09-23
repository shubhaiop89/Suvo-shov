export type MessageRole = 'user' | 'ai';

export interface FileChange {
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  path: string;
  description: string;
  content?: string; // Raw file content as a string
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  codeChanges?: FileChange[];
  version?: number;
  error?: string;
  isStreaming?: boolean;
  imageUrl?: string;
  previousFileSystem?: FileSystem;
}

export interface FileData {
  content: string; // For text files: raw text. For binary files: base64 data.
  type: string; // e.g., 'tsx', 'html', 'css', or a mime-type like 'image/png'
  isBinary?: boolean;
}

export interface FileSystem {
  [path: string]: FileData;
}

export type AiStatus = 'idle' | 'thinking' | 'streaming';

export type AppTheme = 'light' | 'dark' | 'system';

export interface LinkedRepo {
    owner: string;
    repo: string;
    branch: string;
}

export interface SyncStatus {
    status: 'idle' | 'syncing' | 'success' | 'error';
    message: string;
}