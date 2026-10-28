/* [name, category id, society id, area, description, verified, offer] */
const RAW_BUSINESSES = [
  ['Annapurna Home Kitchen', 'food', 'prestige', 'Tower B', 'Homestyle North Indian thalis and tiffin plans, cooked fresh every morning.', true, '10% off your first weekly tiffin plan'],
  ['Sharma Tuition Hub', 'edu', 'prestige', 'Tower D', 'Maths and science coaching for classes 6 to 10 in small batches.', true, 'Free demo class for new students'],
  ['Glow by Meera', 'beauty', 'prestige', 'Tower A', 'Bridal and party makeup, threading and facials at home or studio.', false, ''],
  ['Rangoli Fashion Studio', 'fashion', 'prestige', 'Clubhouse Lane', 'Custom blouses, kurtis and alterations with quick turnaround.', true, ''],
  ['Fresh Basket Grocers', 'grocery', 'prestige', 'Gate 2 Arcade', 'Daily vegetables, dairy and pantry staples with society delivery.', true, 'Free delivery on orders above ₹300'],
  ['FixIt Home Services', 'home', 'prestige', 'Main Road', 'Plumbing, electrical and AC servicing by trained technicians.', false, ''],
  ['FitFlow with Arjun', 'fitness', 'prestige', 'Clubhouse Terrace', 'Morning strength and yoga batches for adults and seniors.', false, ''],
  ["Priya's Bake Studio", 'food', 'prestige', 'Tower C', 'Eggless cakes, cookies and festival hampers made on order.', false, ''],
  ['Nair Maths Classes', 'edu', 'prestige', 'Tower E', 'Weekend maths batches for classes 8 to 12.', true, ''],
  ['Sundar Tiffin Service', 'food', 'prestige', 'Tower F', 'Daily lunch and dinner tiffins with weekly plans.', false, ''],
  ['Kavita Yoga Studio', 'fitness', 'purva', 'Block 2', 'Beginner yoga and breathing classes for all ages.', true, ''],
  ['Studio Aarna Salon', 'beauty', 'purva', 'Clubhouse', 'Haircuts, spa and grooming for the whole family.', false, ''],
  ['Threads and Trends', 'fashion', 'purva', 'Block 4', 'Ethnic wear and festive collections, sold from home.', true, ''],
  ['GreenLeaf Organics', 'grocery', 'mantri', 'Gate 1', 'Organic produce delivered twice a week.', true, ''],
  ['CoolBreeze AC Care', 'home', 'mantri', 'Tower 3', 'AC service, gas refill and repairs.', false, ''],
  ['Little Scholars Art Class', 'edu', 'mantri', 'Tower 1', 'Drawing and craft sessions for kids on weekends.', false, ''],
  ['Spice Route Caterers', 'food', 'hiranandani', 'Central Plaza', 'Party and festival catering for small groups.', true, ''],
  ['Tailor Master Raju', 'fashion', 'hiranandani', 'Lane 5', 'Stitching and alterations in two days.', false, ''],
  ['Daily Dairy Direct', 'grocery', 'magarpatta', 'Gate 3', 'Fresh milk and curd, delivered by 7 am.', true, ''],
  ['Sparkle Cleaners', 'home', 'dlf', 'Tower 9', 'Deep cleaning for flats and kitchens.', false, '']
];

export const DEFAULT_ITEMS = {
  food: [['Veg thali', 'Dal, sabzi, roti, rice, salad', '₹160'], ['Rajma chawal combo', 'With raita and papad', '₹130'], ['Paneer butter masala combo', 'With 3 rotis and rice', '₹190'], ['Weekly lunch tiffin plan', 'Monday to Saturday, per week', '₹900']],
  edu: [['Maths, classes 6 to 8', 'Mon, Wed, Fri, 5 pm', '₹1,500 / month'], ['Science, classes 9 to 10', 'Tue, Thu, 5 pm', '₹1,800 / month'], ['Doubt-clearing session', 'Saturday, 11 am', '₹300 / session']],
  beauty: [['Party makeup', 'At home or studio', '₹2,500'], ['Threading', 'Per session', '₹60'], ['Facial', 'Basic cleanup', '₹700']],
  fashion: [['Blouse stitching', '3 to 5 day turnaround', '₹450'], ['Kurti stitching', 'Custom fit', '₹600'], ['Alterations', 'Hemming and fitting', 'From ₹80']],
  grocery: [['Daily vegetable basket', 'Delivered by 8 am', '₹250'], ['Milk and curd subscription', 'Monthly', '₹1,800'], ['Pantry staples', 'Order via WhatsApp', 'As per list']],
  home: [['Plumbing visit', 'Includes inspection', '₹250'], ['Electrical repair', 'Per visit', '₹300'], ['AC service', 'Split AC, per unit', '₹599']],
  fitness: [['Morning strength batch', '6:30 am, Mon to Fri', '₹1,800 / month'], ['Yoga for seniors', '8 am, Tue and Thu', '₹1,200 / month'], ['Trial class', 'First session', 'Free']],
  other: [['Service enquiry', 'Message for details', 'On request']]
};

export const BUSINESSES = RAW_BUSINESSES.map((r, i) => ({
  id: 'b' + (i + 1), name: r[0], cat: r[1], society: r[2], area: r[3], desc: r[4], verified: r[5], offer: r[6], rank: i + 1,
  items: DEFAULT_ITEMS[r[1]],
  phone: '+91 98XXX XXX' + String(10 + i),
  hours: { open: i % 7 !== 6, from: '8:00 am', to: '9:00 pm' }
}));

export const OFFERS_VALID = ['Valid till 15 Nov', 'This month', 'Valid till 30 Nov'];

export function defaultVendor() {
  return {
    id: 'mine', name: 'Kavya Home Kitchen', cat: 'food', society: 'prestige', area: 'Tower G',
    desc: 'A home kitchen serving fresh North Indian meals to families and working professionals in the society.',
    verified: false, offer: '10% off your first order', offerValid: '15 Nov 2026',
    items: DEFAULT_ITEMS.food.map((r) => r.slice()),
    phone: '+91 98XXX XXX99', whatsapp: '+91 98XXX XXX99', hidePhone: true,
    hours: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ day: d, open: i < 6, from: '8:00 am', to: '9:00 pm' })),
    served: ['prestige'], published: false
  };
}
