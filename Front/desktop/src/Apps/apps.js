import BackgroundGallery from './BackgroundGallery';
import AppDetailsCard from './AppDetailsCard';

// Liste des applications et leurs fonctions
const apps = [
    { name: 'Galerie', component: () => <BackgroundGallery /> },
    { name: 'Propriétés', component: () => <AppDetailsCard /> },
  ];
  
  export default apps;
  