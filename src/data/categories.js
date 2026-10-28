/* Each `images` entry is an Unsplash photo id (the part after "photo-" in images.unsplash.com/photo-<id>).
   Hand-picked and visually checked per category so the dummy photos actually match what the category sells. */
export const CATEGORIES = [
  { id: 'food', name: 'Food & Beverages', short: 'Food', micon: 'restaurant', bg: '#FEF3C7', fg: '#B45309',
    images: ['1504674900247-0877df9cc836', '1546069901-ba9599a7e63c', '1565299624946-b28f40a0ae38', '1540189549336-e6e99c3679fe', '1601050690597-df0568f70950', '1631452180519-c014fe946bc7', '1567188040759-fb8a883dc6d8'] },
  { id: 'edu', name: 'Tuition & Education', short: 'Education', micon: 'school', bg: '#E0E7FF', fg: '#4338CA',
    images: ['1503676260728-1c00da094a0b', '1513258496099-48168024aec0', '1522202176988-66273c2fd55f', '1588072432836-e10032774350'] },
  { id: 'beauty', name: 'Beauty & Wellness', short: 'Beauty', micon: 'spa', bg: '#FCE7F3', fg: '#BE185D',
    images: ['1522337360788-8b13dee7a37e', '1560066984-138dadb4c035', '1487412947147-5cebf100ffc2', '1512290923902-8a9f81dc236c', '1595476108010-b4d1f102b1b1'] },
  { id: 'fashion', name: 'Fashion & Clothing', short: 'Fashion', micon: 'styler', bg: '#FFEDD5', fg: '#C2410C',
    images: ['1558769132-cb1aea458c5e', '1490481651871-ab68de25d43d', '1521577352947-9bb58764b69a'] },
  { id: 'grocery', name: 'Groceries & Essentials', short: 'Groceries', micon: 'local_grocery_store', bg: '#DCFCE7', fg: '#15803D',
    images: ['1506617420156-8e4536971650', '1542838132-92c53300491e', '1534483509719-3feaee7c30da', '1579113800032-c38bd7635818'] },
  { id: 'home', name: 'Home Services', short: 'Home services', micon: 'home_repair_service', bg: '#E0F2FE', fg: '#0369A1',
    images: ['1581094288338-2314dddb7ece', '1621905251189-08b45d6a269e', '1556911220-bff31c812dba'] },
  { id: 'fitness', name: 'Health & Fitness', short: 'Fitness', micon: 'fitness_center', bg: '#CCFBF1', fg: '#0F766E',
    images: ['1517836357463-d25dfeac3438', '1571019613454-1cb2f99b2d8b', '1540497077202-7c8a3999166f', '1544367567-0f2fcb009e0b', '1517963879433-6ad2b056d712'] },
  { id: 'other', name: 'Other Services', short: 'Other', micon: 'storefront', bg: '#F3E8FF', fg: '#7E22CE',
    images: ['1441986300917-64674bd600d8', '1556742049-0cfed4f6a45d', '1556740749-887f6717d7e4', '1555529669-e69e7aa0ba9a'] }
];

/* Shared pool of residential/apartment exteriors used for society photos. */
export const SOCIETY_IMAGES = ['1512917774080-9991f1c4c750', '1545324418-cc1a3fa10c00', '1494526585095-c41746248156', '1570129477492-45c003edd2be'];

export function catOf(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[7];
}
