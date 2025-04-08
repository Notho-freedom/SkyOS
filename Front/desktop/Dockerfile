# Étape 1 : Build de l'app React
FROM node:18 AS builder

# Création du dossier de travail
WORKDIR /app

# Copie des fichiers package.json et lock
COPY package*.json ./

# Install des dépendances
RUN npm install --force

# Copie du code source
COPY . .

# Build de l'app React pour la prod
RUN npm run build

# Étape 2 : Image finale avec Nginx
FROM nginx:stable-alpine

# Copie des fichiers de build vers Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
