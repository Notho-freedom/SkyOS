const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,  // Largeur de la fenêtre
    height: 800,  // Hauteur de la fenêtre
    fullscreen: true,  // Plein écran
    kiosk: true,  // Mode kiosque (plein écran et sans barre de titre)
    frame: false,  // Pas de barre de titre ou de bordure
    show: false,  // Ne pas montrer la fenêtre immédiatement
    transparent: true,  // Fenêtre transparente si tu veux un effet verre
    alwaysOnTop: true,  // Toujours au-dessus des autres fenêtres
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),  // Charger un fichier préchargeant pour le processus renderer
      webSecurity: false,  // Désactiver la politique de sécurité de même origine (utile pour les apps locales, mais attention aux risques)
      allowRunningInsecureContent: true,  // Permet l'exécution de contenu non sécurisé (utile pour du dev ou certaines apps)
      nodeIntegration: true,  // Sécurité : évite l'accès aux API Node.js dans le renderer (ne jamais activer en prod !)
      contextIsolation: true,  // Sécurise le renderer en isolant son contexte
      webviewTag: true,  // Permet d'utiliser <webview> dans le HTML (si nécessaire)
    },
  });

  // Charge ton app React (ici un exemple avec une URL externe)
  mainWindow.loadURL("http://localhost:3000/");

  // Quand la page est prête, on l'affiche
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Supprimer le menu contextuel
  mainWindow.setMenu(null);

  // Désactiver la redimension du contenu (le faire en fullscreen)
  mainWindow.setResizable(false);

  // Assurer que les fenêtres restent toujours sur l'écran principal
  mainWindow.setBounds({ x: 0, y: 0, width: 1280, height: 800 });
});

// Configurations GPU pour les performances
app.commandLine.appendSwitch("ignore-gpu-blacklist");  // Ignore la liste noire GPU (utile pour certains matériels)
app.commandLine.appendSwitch("enable-accelerated-2d-canvas");  // Accélération canvas 2D
app.commandLine.appendSwitch("enable-webgl");  // WebGL activé

// Fermer l'application quand toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
