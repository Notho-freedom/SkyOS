import ReactPlayer from 'react-player';
import GroqAIWithModelSelection from './chatbot/GroqAIManager';
import BackgroundGallery from './BackgroundGallery';
import AppDetailsCard from './AppDetailsCard';
import SettingsWindow from './../components/settings/SettingsWindow';
import ChatInterface from './Ai';

const apps = [
  {
    id: 'gallery',
    name: 'Galerie',
    component: () => <BackgroundGallery />
  },
  {
    id: 'properties',
    name: 'Propriétés',
    component: () => <AppDetailsCard />
  },
  {
    id: 'settings',
    name: 'Paramètres',
    component: (props) => <SettingsWindow {...props} />
  },
  {
    id: 'ai',
    name: 'IA',
    component: () => <ChatInterface />
  },
  {
    id: 'music-player',
    name: 'Lecteur de musique',
    component: () => (
      <ReactPlayer
        url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        controls
        width="100%"
        height="50px"
      />
    )
  },
  {
    id: 'chatbot',
    name: 'Chatbot',
    component: () => <GroqAIWithModelSelection />
  }
];

export default apps;
