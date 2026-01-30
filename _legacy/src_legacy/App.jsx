import React, { useState } from 'react';
import Scene from './components/Scene';
import Timeline from './components/Timeline';
import Overlay from './components/Overlay';
import { works, characters } from './utils/data';

function App() {
  const [selectedWork, setSelectedWork] = useState(null);

  const handleSelectWork = (work) => {
    setSelectedWork(work);
  };

  const handleDeselect = () => {
    setSelectedWork(null);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Scene
        works={works}
        characters={characters}
        selectedWork={selectedWork}
        onSelectWork={handleSelectWork}
      />

      <Overlay
        selectedWork={selectedWork}
        onDeselect={handleDeselect}
      />

      <Timeline
        works={works}
        selectedWork={selectedWork}
        onSelectWork={handleSelectWork}
      />
    </div>
  );
}

export default App;
