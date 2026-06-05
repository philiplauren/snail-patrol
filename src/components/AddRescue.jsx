import React, { useState } from "react";
import { Camera, LocateFixed } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";


import snailIcon from "../utils/snailIcon";

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

export default AddRescue;