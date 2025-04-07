# Utiliser l'image officielle Python comme base
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet dans le conteneur
COPY . /app

# Installer les dépendances requises
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port que FastAPI utilise (par défaut 8000)
EXPOSE 8000

# Commande pour démarrer le serveur FastAPI avec Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
