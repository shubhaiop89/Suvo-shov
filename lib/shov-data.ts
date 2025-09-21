// Shov Data Layer for Suvo
// Provides CRUD functions for users, projects, messages, files using Shov API

const SHOV_API_URL = 'https://api.shov.com';
const SHOV_API_KEY = process.env.SHOV_API_KEY || '';

async function shovRequest(endpoint: string, method: string, body?: any) {
  const res = await fetch(`${SHOV_API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SHOV_API_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// USERS
export async function addUser(user: { email: string; name?: string }) {
  return shovRequest('/add', 'POST', { collection: 'users', value: user });
}
export async function getUserByEmail(email: string) {
  return shovRequest('/where', 'POST', { collection: 'users', filter: { email } });
}
export async function updateUser(id: string, updates: any) {
  return shovRequest('/update', 'POST', { collection: 'users', id, value: updates });
}
export async function removeUser(id: string) {
  return shovRequest('/remove', 'POST', { collection: 'users', id });
}

// PROJECTS
export async function addProject(project: { ownerId: string; name: string; description?: string }) {
  return shovRequest('/add', 'POST', { collection: 'projects', value: project });
}
export async function getProjectsByOwner(ownerId: string) {
  return shovRequest('/where', 'POST', { collection: 'projects', filter: { ownerId } });
}
export async function updateProject(id: string, updates: any) {
  return shovRequest('/update', 'POST', { collection: 'projects', id, value: updates });
}
export async function removeProject(id: string) {
  return shovRequest('/remove', 'POST', { collection: 'projects', id });
}

// MESSAGES
export async function addMessage(message: { projectId: string; userId: string; role: string; text: string }) {
  return shovRequest('/add', 'POST', { collection: 'messages', value: message });
}
export async function getMessagesByProject(projectId: string) {
  return shovRequest('/where', 'POST', { collection: 'messages', filter: { projectId } });
}
export async function updateMessage(id: string, updates: any) {
  return shovRequest('/update', 'POST', { collection: 'messages', id, value: updates });
}
export async function removeMessage(id: string) {
  return shovRequest('/remove', 'POST', { collection: 'messages', id });
}

// FILES
export async function addFile(file: { projectId: string; name: string; type: string; content: string; isBinary?: boolean }) {
  return shovRequest('/add', 'POST', { collection: 'files', value: file });
}
export async function getFilesByProject(projectId: string) {
  return shovRequest('/where', 'POST', { collection: 'files', filter: { projectId } });
}
export async function updateFile(id: string, updates: any) {
  return shovRequest('/update', 'POST', { collection: 'files', id, value: updates });
}
export async function removeFile(id: string) {
  return shovRequest('/remove', 'POST', { collection: 'files', id });
}

// SETTINGS (Key/Value)
export async function setSetting(key: string, value: any) {
  return shovRequest('/set', 'POST', { key, value });
}
export async function getSetting(key: string) {
  return shovRequest('/get', 'POST', { key });
}
export async function forgetSetting(key: string) {
  return shovRequest('/forget', 'POST', { key });
}
