
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, MapPin, Trophy, User, PlusCircle, ShieldCheck, Snail, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

const snailIcon = new L.DivIcon({
  className: 'snail-marker',
  html: '<div class="snail-marker-inner">🐌</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -14]
});

const initialRescues = [
  { id: 'demo-1', username: 'Snail Scout', species: 'Vinbergssnäcka', comment: 'Flyttad från cykelbana till gräskant.', lat: 59.3293, lng: 18.0686, createdAt: new Date().toISOString(), image: '' },
  { id: 'demo-2', username: 'Rain Patrol', species: 'Okänd snigel', comment: 'Liten snigel på väg över trottoaren.', lat: 59.347, lng: 18.075, createdAt: new Date(Date.now() - 86400000).toISOString(), image: '' }
];

function loadRescues() {
  try {
    const saved = localStorage.getItem('snail-patrol-rescues-v02');
    return saved ? JSON.parse(saved) : initialRescues;
  } catch {
    return initialRescues;
  }
}

function saveRescues(rescues) {
  localStorage.setItem('snail-patrol-rescues-v02', JSON.stringify(rescues));
}

function App() {
  const [tab, setTab] = useState('map');
  const [rescues, setRescues] = useState(loadRescues);

  function addRescue(rescue) {
    const next = [rescue, ...rescues];
    setRescues(next);
    saveRescues(next);
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

function MapView({ rescues }) {
  return (
    <section className="card">
      <h2>Räddningskarta</h2>
      <p className="muted">Zooma, dra runt och klicka på sniglarna för mer information.</p>

      <div className="real-map">
        <MapContainer center={[59.3293, 18.0686]} zoom={12} scrollWheelZoom={true} className="leaflet-map">
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {rescues.map(rescue => (
            <Marker position={[rescue.lat, rescue.lng]} icon={snailIcon} key={rescue.id}>
              <Popup>
                <div className="popup">
                  {rescue.image && <img src={rescue.image} alt="Räddad snigel" />}
                  <strong>{rescue.species || 'Okänd snigel'}</strong>
                  <p>{rescue.comment || 'Ingen kommentar.'}</p>
                  <small>Av {rescue.username}<br />{new Date(rescue.createdAt).toLocaleString('sv-SE')}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="feed">
        {rescues.map(rescue => <RescueCard rescue={rescue} key={rescue.id} />)}
      </div>
    </section>
  );
}

function RescueCard({ rescue }) {
  return (
    <article className="rescue">
      <div className="thumb">{rescue.image ? <img src={rescue.image} alt="Räddad snigel" /> : <Snail size={34}/>}</div>
      <div>
        <h3>{rescue.species || 'Okänd snigel'}</h3>
        <p>{rescue.comment || 'Ingen kommentar.'}</p>
        <small>Av {rescue.username} · {new Date(rescue.createdAt).toLocaleDateString('sv-SE')} · {rescue.lat.toFixed(4)}, {rescue.lng.toFixed(4)}</small>
      </div>
    </article>
  );
}

function LocationPicker({ lat, lng, setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(String(e.latlng.lat));
      setLng(String(e.latlng.lng));
    }
  });
  return <Marker position={[Number(lat), Number(lng)]} icon={snailIcon} />;
}

function AddRescue({ onAdd }) {
  const [username, setUsername] = useState(localStorage.getItem('snail-patrol-username') || '');
  const [species, setSpecies] = useState('');
  const [comment, setComment] = useState('');
  const [lat, setLat] = useState('59.3293');
  const [lng, setLng] = useState('18.0686');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');

  function useGps() {
    if (!navigator.geolocation) {
      setStatus('GPS stöds inte i denna webbläsare.');
      return;
    }
    setStatus('Hämtar position...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        setStatus('Position hämtad. Du kan klicka i kartan för att justera platsen.');
      },
      () => setStatus('Kunde inte hämta position. Klicka i kartan eller skriv plats manuellt.')
    );
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!username.trim()) return setStatus('Skriv ett användarnamn först.');
    if (!image) return setStatus('Ladda upp en bild på snigeln först.');
    if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return setStatus('Platsen verkar inte vara giltig.');

    localStorage.setItem('snail-patrol-username', username.trim());
    onAdd({
      id: crypto.randomUUID(),
      username: username.trim(),
      species: species.trim() || 'Okänd snigel',
      comment: comment.trim(),
      lat: Number(lat),
      lng: Number(lng),
      image,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <section className="card">
      <h2>Registrera räddning</h2>
      <p className="muted">Ta en bild, välj platsen och berätta kort vad som hände.</p>

      <form onSubmit={submit} className="form">
        <label>Användarnamn
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="t.ex. Philip" />
        </label>

        <label>Bild på snigeln
          <input type="file" accept="image/*" onChange={onFile} />
        </label>

        {image && <img className="preview" src={image} alt="Förhandsvisning" />}

        <label>Typ/art
          <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="t.ex. Vinbergssnäcka eller okänd" />
        </label>

        <label>Kommentar
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Exempel: Flyttad från cykelbana till gräskant på andra sidan." />
        </label>

        <button type="button" className="secondary" onClick={useGps}><LocateFixed size={18}/> Använd min position</button>

        <div className="small-map">
          <MapContainer center={[Number(lat), Number(lng)]} zoom={14} scrollWheelZoom={true} className="leaflet-map">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
          </MapContainer>
        </div>
        <p className="hint">Klicka i kartan för att ändra plats.</p>

        <div className="grid">
          <label>Latitud<input value={lat} onChange={e => setLat(e.target.value)} /></label>
          <label>Longitud<input value={lng} onChange={e => setLng(e.target.value)} /></label>
        </div>

        <button type="submit"><Camera size={18}/> Publicera räddning</button>
        {status && <p className="status">{status}</p>}
      </form>
    </section>
  );
}

function Ranking({ leaderboard }) {
  return (
    <section className="card">
      <h2>Topplista</h2>
      <div className="ranking">
        {leaderboard.map((row, index) => (
          <div className="rank-row" key={row.username}>
            <span className="place">#{index + 1}</span>
            <span>{row.username}</span>
            <strong>{row.count} räddningar</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function Profile({ rescues }) {
  const username = localStorage.getItem('snail-patrol-username') || 'Du';
  const mine = rescues.filter(r => r.username === username);
  return (
    <section className="card">
      <h2>Profil</h2>
      <div className="profile-box">
        <div className="avatar"><ShieldCheck size={36}/></div>
        <div>
          <h3>{username}</h3>
          <p>{mine.length} registrerade räddningar</p>
        </div>
      </div>
      <h3>Mina badges</h3>
      <div className="badges">
        <span>First Rescue</span>
        {mine.length >= 10 && <span>10 Rescues</span>}
        {mine.length >= 25 && <span>Snail Guardian</span>}
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
