import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Snail } from "lucide-react";

import snailIcon from "../utils/snailIcon";

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

export default MapView;
