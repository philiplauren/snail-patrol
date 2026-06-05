const initialRescues = [
  {
    id: "demo-1",
    username: "Snail Scout",
    species: "Vinbergssnäcka",
    comment: "Flyttad från cykelbana till gräskant.",
    lat: 59.3293,
    lng: 18.0686,
    createdAt: new Date().toISOString(),
    image: "",
  },
  {
    id: "demo-2",
    username: "Rain Patrol",
    species: "Okänd snigel",
    comment: "Liten snigel på väg över trottoaren.",
    lat: 59.347,
    lng: 18.075,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    image: "",
  },
];

export default initialRescues;