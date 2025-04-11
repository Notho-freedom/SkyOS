module.exports = {
    appId: 'com.skyos.desktop',
    productName: 'SkyOS',
    copyright: 'Copyright © 2025 Genesis Company',
    
    // Configuration du build pour chaque plateforme
    win: {
      target: ['nsis'], // Utilisation de NSIS pour la construction de l'installateur Windows
      icon: 'assets/icon.ico', // Icône pour l'installateur Windows
      publisherName: 'Genesis Company',
      // Définir les options d'installateur Windows
      nsis: {
        oneClick: false, // Permet à l'utilisateur de choisir où installer
        perMachine: true, // Installation pour toute la machine
        allowToChangeInstallationDirectory: true, // Permet à l'utilisateur de choisir le répertoire d'installation
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'SkyOS'
      }
    },
    
    mac: {
      target: 'dmg', // Construction pour DMG sur macOS
      category: 'public.app-category.productivity', // Catégorie de l'application sur le Mac App Store
      icon: 'assets/icon.icns', // Icône macOS
    },
  
    linux: {
      target: ['deb'], // Construction pour Debian et autres systèmes basés sur Debian
      category: 'Utility', // Catégorie de l'application Linux
      icon: 'assets/icon.png', // Icône Linux
    },
  
    // Configuration des fichiers à inclure dans le build
    files: [
      'dist/**/*',
      'public/Electron/**/*',
      'assets/**/*'
    ],
  
    // Indiquer où se trouvent les ressources de construction (comme les icônes)
    directories: {
      buildResources: 'assets'
    },
  
    // Inclure/exclure certains fichiers/dossiers
    extraResources: [
      'resources/**/*' // Ajoute d'autres ressources si nécessaire
    ],
  
    // Configuration pour auto-update (si tu prévois une mise à jour automatique de ton app)
    publish: [
      {
        provider: 'github', // Utilisation de GitHub pour la publication de versions
        owner: 'Notho-freedom',
        repo: 'SkyOS',
        releaseType: 'release',
        private: false
      }
    ],
  
    // Option pour la compression et le packaging des fichiers ASAR
    asar: true,
    compression: 'maximum',
  
    // Paramètres spécifiques à Electron
    electronVersion: '35.0.3', // Version d'Electron à utiliser
    nodeIntegration: true, // Active Node.js dans le rendu (attention aux implications de sécurité)
    
    // Autres paramètres de configuration pour le build
    dmg: {
      background: 'assets/background.png', // Image d'arrière-plan pour l'installateur DMG
      iconSize: 80,
      icon: 'assets/icon.icns'
    },
    
    // Gérer le processus de build pour les systèmes de fichiers (en ajoutant une application distante si nécessaire)
    remoteRebuild: false,
    // Utilisation d'une commande spéciale pour le lancement de l'application après l'installation
    //afterInstall: 'scripts/afterInstall.sh',
    //afterUninstall: 'scripts/afterUninstall.sh',
  };
  