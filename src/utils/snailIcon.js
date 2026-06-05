import L from 'leaflet';

const snailIcon = new L.DivIcon({
  className: 'snail-marker',
  html: '<div class="snail-marker-inner">🐌</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -14]
});

export default snailIcon;