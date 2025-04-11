import Dexie from 'dexie';

// Créer une base de données pour les fonds d'écran
class BackgroundDB extends Dexie {
  constructor() {
    super('BackgroundDatabase');
    this.version(1).stores({
      backgrounds: '++id, dataUrl'  // La clé auto-incrémentée et le dataUrl
    });
  }

  // Ajouter un fond d'écran (si non déjà présent)
  async addBackground(dataUrl) {
    // On peut vérifier l'existence d'un fond identique
    const exists = await this.backgrounds.where('dataUrl').equals(dataUrl).first();
    if (!exists) {
      await this.backgrounds.add({ dataUrl });
    }
  }

  // Récupérer tous les fonds d'écran
  async getAllBackgrounds() {
    return await this.backgrounds.toArray();
  }
}

const db = new BackgroundDB();
export default db;
