const { app, BrowserWindow} = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL("http://localhost:3001");
  mainWindow.setMenu(null);
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});