/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openDialog: () => ipcRenderer.send('openDialog'),
  handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  getContextMenuCommand: (callback) => ipcRenderer.on('context-menu-command', callback),
})