import { contextBridge, ipcRenderer } from 'electron';

// Expose Electron API to renderer process
try {
  contextBridge.exposeInMainWorld('electronAPI', {
    scanDirectory: async (dirPath: string) => {
      console.log('[preload] scanDirectory called with:', dirPath);
      return ipcRenderer.invoke('scan-directory', dirPath);
    },
    selectDirectory: async () => {
      console.log('[preload] selectDirectory called');
      return ipcRenderer.invoke('select-directory');
    },
  });
  console.log('[preload] Electron API exposed successfully');
} catch (error) {
  console.error('[preload] Failed to expose Electron API:', error);
}
