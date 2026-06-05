import React, { useEffect, useMemo, useState } from "react";
import { getRescues, createRescue } from "./supabase.js";
import { createRoot } from "react-dom/client";
import { MapPin, Trophy, User, PlusCircle, Snail } from "lucide-react";

import 'leaflet/dist/leaflet.css';
import './styles.css';

import MapView from "./components/MapView";
import AddRescue from "./components/AddRescue";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";

function App() {
  const [tab, setTab] = useState('map');
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
  async function loadData() {
    const data = await getRescues();
    setRescues(data);
  }

  loadData();
}, []);

  async function addRescue(rescue) {
  const saved = await createRescue({
    username: rescue.username,
    species: rescue.species,
    comment: rescue.comment,
    lat: rescue.lat,
    lng: rescue.lng,
    image_url: rescue.image,
  });

  setRescues([saved[0], ...rescues]);
  setTab('map');
}

  const leaderboard = useMemo(() => {
    const counts = {};
    for (const rescue of rescues) counts[rescue.username] = (counts[rescue.username] || 0) + 1;
    return Object.entries(counts).map(([username, count]) => ({ username, count })).sort((a, b) => b.count - a.count);
  }, [rescues]);

  return (
    <div className="app">
      <header className="hero">
        <div className="brand">
          <div className="logo"><Snail size={30} /></div>
          <div>
            <h1>Snail Patrol</h1>
            <p>Rädda sniglar. Sätt dem på kartan.</p>
          </div>
        </div>
        <div className="stats">
          <div><strong>{rescues.length}</strong><span>räddningar</span></div>
          <div><strong>{leaderboard.length}</strong><span>patruller</span></div>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'map' ? 'active' : ''} onClick={() => setTab('map')}><MapPin size={18}/> Karta</button>
        <button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}><PlusCircle size={18}/> Ny räddning</button>
        <button className={tab === 'rank' ? 'active' : ''} onClick={() => setTab('rank')}><Trophy size={18}/> Ranking</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><User size={18}/> Profil</button>
      </nav>

      <main>
        {tab === 'map' && <MapView rescues={rescues} />}
        {tab === 'add' && <AddRescue onAdd={addRescue} />}
        {tab === 'rank' && <Ranking leaderboard={leaderboard} />}
        {tab === 'profile' && <Profile rescues={rescues} />}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
