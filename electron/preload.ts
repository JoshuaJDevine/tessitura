import { contextBridge, ipcRenderer } from 'electron';
import { readdir } from 'fs/promises';
import { stat } from 'fs/promises';

contextBridge.exposeInMainWorld('electronAPI', {
  scanDirectory: async (dirPath: string) => {
    return ipcRenderer.invoke('scan-directory', dirPath);
  },
  selectDirectory: async () => {
    return ipcRenderer.invoke('select-directory');
  },
});
