// Importation des composants directement depuis les modules
import ReactPlayer from 'react-player';  // Lecteur de musique
import { Chatbot } from 'react-chatbot-kit';  // Chatbot

import BackgroundGallery from './BackgroundGallery';
import AppDetailsCard from './AppDetailsCard';
import SettingsWindow from "./../components/settings/SettingsWindow";
import RealisticAI from "./Ai";

// Liste des applications et leurs fonctions
const apps = [
  { name: 'Galerie', component: () => <BackgroundGallery /> },
  { name: 'Propriétés', component: () => <AppDetailsCard /> },
  { 
    name: 'Paramètres', 
    component: (props) => <SettingsWindow {...props} />
  },
  { name: 'IA', component: () => <RealisticAI /> },

  { name: 'Lecteur de musique', component: () => <ReactPlayer url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" controls /> },
  { name: 'Chatbot', component: () => (
    <Chatbot
      config={{
        botName: 'SkyBot',
        initialMessages: [{ type: 'text', text: 'Hello, how can I help you today?' }],
      }}
    />
  )}
];

export default apps;
