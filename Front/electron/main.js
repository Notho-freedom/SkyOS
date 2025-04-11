const { app, BrowserWindow } = require("electron");
const path = require("path");
const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    kiosk: true,
    frame: false,
    show: false,
    resizable: false,
    backgroundColor: "#000000", 
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nodeIntegration: false,
      webviewTag: true,
      webSecurity: true,
      sandbox: true,
    }
  });

  remoteMain.enable(mainWindow.webContents);
  mainWindow.loadURL("https://www.skyos.genesis-company.net/");
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.setMenu(null);
});

app.commandLine.appendSwitch("enable-accelerated-2d-canvas");
app.commandLine.appendSwitch("enable-webgl");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});