import { useEffect, useState } from 'react';
import Lesson from './pages/Lesson.jsx';
import VisualizerPage from './pages/Visualizer.jsx';
import Welcome from './pages/Welcome.jsx';

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash || '#welcome');

  useEffect(() => {
    function updateRoute() {
      setRoute(window.location.hash || '#welcome');
    }

    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  if (route === '#visualizer') return <VisualizerPage />;
  if (route === '#lesson') return <Lesson />;
  return <Welcome />;
}
