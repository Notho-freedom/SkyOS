import Dexie from 'dexie';

// Créer une instance de la base de données
class WebAppDB extends Dexie {
  constructor() {
    super('WebAppDatabase');
    this.version(1).stores({
      apps: '&url, id, name, icon, createdAt', // `&` indique la clé primaire (ici l'URL)
    });
  }

  // Ajouter une application à la base de données
  async addApp(app) {
    await this.apps.put(app);
  }

  // Récupérer toutes les applications
  async getApps() {
    return await this.apps.toArray();
  }

  // Supprimer une application par son id
  async removeApp(id) {
    await this.apps.delete(id);
  }

  // Vérifier si une application existe déjà dans la base de données
  async appExists(url) {
    const app = await this.apps.get({ url });
    return app !== undefined;
  }
}

// Créer une instance de la base de données
const db = new WebAppDB();
export default db;
