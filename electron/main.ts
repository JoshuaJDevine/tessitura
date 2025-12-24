import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdir, stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'default',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC Handlers - Register before app.whenReady()
console.log('[main] Registering IPC handlers...');

ipcMain.handle('select-directory', async () => {
  console.log('[main] select-directory IPC called');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('scan-directory', async (_event, dirPath: string) => {
  console.log('[main] scan-directory IPC called with:', dirPath);
  try {
    const items: Array<{ name: string; path: string; isDirectory: boolean }> = [];

    async function scanDir(currentPath: string, depth = 0) {
      if (depth > 5) return; // Limit recursion depth

      const entries = await readdir(currentPath);

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry);
        try {
          const stats = await stat(fullPath);
          if (stats.isDirectory()) {
            items.push({ name: entry, path: fullPath, isDirectory: true });
            await scanDir(fullPath, depth + 1);
          } else {
            items.push({ name: entry, path: fullPath, isDirectory: false });
          }
        } catch (error) {
          // Skip files we can't access
          continue;
        }
      }
    }

    await scanDir(dirPath);
    return items;
  } catch (error) {
    console.error('Error scanning directory:', error);
    return [];
  }
});

app.whenReady().then(() => {
  console.log('[main] App ready, creating window...');
  console.log('[main] Preload path:', path.join(__dirname, 'preload.js'));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
