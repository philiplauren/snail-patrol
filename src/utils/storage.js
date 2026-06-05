import initialRescues from "../data/demorescues";

export function loadRescues() {
  try {
    const saved = localStorage.getItem('snail-patrol-rescues-v02');
    return saved ? JSON.parse(saved) : initialRescues;
  } catch {
    return initialRescues;
  }
}

export function saveRescues(rescues) {
  localStorage.setItem('snail-patrol-rescues-v02', JSON.stringify(rescues));
}
