const { app, BrowserWindow} = require("electron");
const path = require('path');
//require('../../node/server.js');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.setMenu(null);
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});