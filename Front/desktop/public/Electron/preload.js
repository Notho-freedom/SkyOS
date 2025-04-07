const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("skyAPI", {
  openWindow: (url, bounds) => ipcRenderer.invoke("open-view", url, bounds),
});
