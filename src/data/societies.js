export const SOCIETIES = [
  { id: 'prestige', name: 'Prestige Lakeside Habitat', place: 'Whitefield, Bengaluru', bg: '#E0E7FF', fg: '#4338CA' },
  { id: 'purva', name: 'Purva Riviera', place: 'Marathahalli, Bengaluru', bg: '#DCFCE7', fg: '#15803D' },
  { id: 'mantri', name: 'Mantri Serenity', place: 'Kanakapura Road, Bengaluru', bg: '#FEF3C7', fg: '#B45309' },
  { id: 'hiranandani', name: 'Hiranandani Gardens', place: 'Powai, Mumbai', bg: '#FCE7F3', fg: '#BE185D' },
  { id: 'magarpatta', name: 'Magarpatta City', place: 'Hadapsar, Pune', bg: '#E0F2FE', fg: '#0369A1' },
  { id: 'dlf', name: 'DLF The Camellias', place: 'Sector 42, Gurugram', bg: '#CCFBF1', fg: '#0F766E' },
  { id: 'lodha', name: 'Lodha Palava', place: 'Dombivli, Mumbai', bg: '#FFEDD5', fg: '#C2410C' },
  { id: 'brigade', name: 'Brigade Meadows', place: 'Kanakapura, Bengaluru', bg: '#F3E8FF', fg: '#7E22CE' }
];

export function socOf(id) {
  return SOCIETIES.find((s) => s.id === id) || SOCIETIES[0];
}

export function socShort(id) {
  return socOf(id).name.replace(' Habitat', '');
}
