import ReactPlayer from 'react-player';

import GroqAIWithModelSelection from './chatbot/GroqAIManager';

import BackgroundGallery from './BackgroundGallery';
import AppDetailsCard from './AppDetailsCard';
import SettingsWindow from "./../components/settings/SettingsWindow";
import RealisticAI from "./Ai";

const apps = [
  { name: 'Galerie', component: () => <BackgroundGallery /> },
  { name: 'Propriétés', component: () => <AppDetailsCard /> },
  { name: 'Paramètres', component: (props) => <SettingsWindow {...props} /> },
  { name: 'IA', component: () => <RealisticAI /> },

  { name: 'Lecteur de musique', component: () => (
    <ReactPlayer url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" controls />
  )},

  { name: 'Chatbot', component: () => <GroqAIWithModelSelection />}
];

export default apps;
