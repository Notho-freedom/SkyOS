const { contextBridge } = require("electron");
const { app } = require("@electron/remote");

contextBridge.exposeInMainWorld("skyos", {
  getAppName: () => app.getName(), // Expose une fonction sécurisée
  getVersion: () => app.getVersion()
});
