import BackgroundGallery from './BackgroundGallery';
import AppDetailsCard from './AppDetailsCard';
import SettingsWindow from "./../components/settings/SettingsWindow" 

// Liste des applications et leurs fonctions
const apps = [
    { name: 'Galerie', component: () => <BackgroundGallery /> },
    { name: 'Propriétés', component: () => <AppDetailsCard /> },
    { 
      name: 'Paramètres', 
      component: (props) => <SettingsWindow {...props} />
    },
  ];
  
  export default apps;
  