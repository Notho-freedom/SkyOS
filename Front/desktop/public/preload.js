const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: (id) => ipcRenderer.send("close-app", id),
  minimizeApp: (id) => ipcRenderer.send("minimize-app", id),
  maximizeApp: (id) => ipcRenderer.send("maximize-app", id),
});
