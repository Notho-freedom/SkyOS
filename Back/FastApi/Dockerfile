# Utiliser l'image officielle Python comme base
FROM python:3.11-slim

# Mettre à jour pip, setuptools et wheel
RUN pip install --upgrade pip setuptools wheel

# Installer les outils de construction nécessaires
RUN apt-get update && apt-get install -y build-essential

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet dans le conteneur
COPY . /app

# Installer les dépendances requises avec option de log détaillé
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt --verbose

# Exposer le port que FastAPI utilise (par défaut 8000)
EXPOSE 8000

# Commande pour démarrer le serveur FastAPI avec Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
