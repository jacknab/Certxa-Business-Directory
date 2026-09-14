export type Business = {
  id: number;
  slug: string;
  name: string;
  category: string;
  city: string;
  neighborhood: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceTier: string;
  description: string;
  tagline: string;
  image: string;
  tags: string[];
  services: string[];
  hours: string[];
  phone: string;
  website: string;
  verified: boolean;
  featured: boolean;
  coordinates: { lat: number; lng: number };
};

export type Professional = {
  id: number;
  name: string;
  slug: string;
  specialty: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  setup: 'Independent studio' | 'Booth renter' | 'Suite inside salon';
  businessName: string;
  businessSlug: string;
  image: string;
  bio: string;
  services: string[];
  price: string;
  verified: boolean;
};

export const categoryMeta: Record<string, { label: string; eyebrow: string; copy: string; icon: string }> = {
  salons: { label: 'Salons', eyebrow: 'Hair, considered', copy: 'Independent hair studios with a point of view, a calm chair, and work worth coming back to.', icon: 'Scissors' },
  barbers: { label: 'Barbers', eyebrow: 'A better cut', copy: 'The neighborhood barbers who know your shape, your style, and the difference between the two.', icon: 'Sparkles' },
  nails: { label: 'Nails', eyebrow: 'Hands in good hands', copy: 'Polished, thoughtful nail studios for a little maintenance or a full change of pace.', icon: 'Hand' },
  massage: { label: 'Massage', eyebrow: 'Make room to exhale', copy: 'Bodywork studios that take the long view: skilled hands, quiet rooms, real relief.', icon: 'Waves' },
  fitness: { label: 'Fitness', eyebrow: 'Move well', copy: 'Small-group gyms and movement spaces where showing up feels like the best part.', icon: 'Dumbbell' },
  skincare: { label: 'Skincare', eyebrow: 'Skin, understood', copy: 'Facialists and skin studios with patient advice, excellent hands, and no hard sell.', icon: 'SunMedium' },
  wellness: { label: 'Wellness', eyebrow: 'A local reset', copy: 'Saunas, recovery rooms, and rituals for the days when your calendar needs a pause.', icon: 'Leaf' },
};

export const businesses: Business[] = [
  {
    id: 1, slug: 'fieldwork-studio-denver', name: 'Fieldwork Studio', category: 'wellness', city: 'Denver', neighborhood: 'RiNo',
    address: '2936 Larimer St, Denver, CO 80205', rating: 4.9, reviewCount: 86, priceTier: '$$$',
    tagline: 'A brighter way to come back to yourself.', description: 'A sunlit recovery studio pairing contrast therapy with a warm, unhurried welcome. Fieldwork feels like a neighborhood clubhouse for your nervous system.',
    image: '/images/denver-studio.jpg', tags: ['Contrast therapy', 'Infrared sauna', 'Independent'], services: ['Contrast therapy — 60 min', 'Infrared sauna — 45 min', 'Recovery membership'],
    hours: ['Mon–Fri 6:00 AM–9:00 PM', 'Sat–Sun 8:00 AM–8:00 PM'], phone: '(303) 555-0148', website: 'https://fieldwork.example.com', verified: true, featured: true, coordinates: { lat: 39.7614, lng: -104.9694 },
  },
  {
    id: 2, slug: 'lumen-hair-denver', name: 'Lumen Hair', category: 'salons', city: 'Denver', neighborhood: 'Highland',
    address: '3421 W 32nd Ave, Denver, CO 80211', rating: 4.8, reviewCount: 114, priceTier: '$$',
    tagline: 'Good hair, less fuss.', description: 'A small, light-filled hair studio known for lived-in color, careful cuts, and a refreshingly low-pressure appointment.',
    image: '/images/portland-salon.jpg', tags: ['Lived-in color', 'Low-pressure', 'Quiet studio'], services: ['Signature cut', 'Gloss + shape', 'Dimensional color'],
    hours: ['Tue–Fri 9:00 AM–7:00 PM', 'Sat 9:00 AM–4:00 PM'], phone: '(303) 555-0182', website: 'https://lumen.example.com', verified: true, featured: true, coordinates: { lat: 39.7628, lng: -105.0254 },
  },
  {
    id: 3, slug: 'common-ground-movement-austin', name: 'Common Ground Movement', category: 'fitness', city: 'Austin', neighborhood: 'East Austin',
    address: '1801 E 5th St, Austin, TX 78702', rating: 4.9, reviewCount: 67, priceTier: '$$',
    tagline: 'Strong enough for real life.', description: 'An intimate movement studio blending strength, mobility, and breathwork in classes that meet you where you are.',
    image: '/images/austin-movement.jpg', tags: ['Small groups', 'Strength', 'Mobility'], services: ['Foundation class', '1:1 movement session', 'Monthly studio pass'],
    hours: ['Mon–Thu 6:00 AM–8:00 PM', 'Fri 6:00 AM–12:00 PM', 'Sat 8:00 AM–1:00 PM'], phone: '(512) 555-0136', website: 'https://commonground.example.com', verified: true, featured: true, coordinates: { lat: 30.2609, lng: -97.7267 },
  },
  {
    id: 4, slug: 'morrow-skin-austin', name: 'Morrow Skin', category: 'skincare', city: 'Austin', neighborhood: 'South Congress',
    address: '1504 S Congress Ave, Austin, TX 78704', rating: 4.7, reviewCount: 91, priceTier: '$$$',
    tagline: 'Patient care for your actual skin.', description: 'A thoughtful facial studio for skin that needs clarity, hydration, and a practitioner who listens before reaching for a product.',
    image: '/images/denver-studio.jpg', tags: ['Facials', 'Sensitive skin', 'Ingredient-led'], services: ['The Morrow facial', 'Barrier reset', 'Consultation + plan'],
    hours: ['Wed–Sat 10:00 AM–6:00 PM'], phone: '(512) 555-0197', website: 'https://morrow.example.com', verified: true, featured: false, coordinates: { lat: 30.2494, lng: -97.7497 },
  },
  {
    id: 5, slug: 'juniper-and-ash-portland', name: 'Juniper & Ash', category: 'salons', city: 'Portland', neighborhood: 'Kerns',
    address: '1120 SE Morrison St, Portland, OR 97214', rating: 4.9, reviewCount: 138, priceTier: '$$',
    tagline: 'Color with a little room to breathe.', description: 'A warm, plant-filled salon for expressive cuts and dimensional color, with playlists that never try too hard.',
    image: '/images/portland-salon.jpg', tags: ['Color', 'Curly hair', 'Plant-filled'], services: ['Shape + style', 'Color session', 'Curl consult'],
    hours: ['Tue–Sat 9:00 AM–6:00 PM'], phone: '(503) 555-0114', website: 'https://juniperash.example.com', verified: true, featured: true, coordinates: { lat: 45.5166, lng: -122.6531 },
  },
  {
    id: 6, slug: 'northline-barber-portland', name: 'Northline Barber', category: 'barbers', city: 'Portland', neighborhood: 'Mississippi',
    address: '425 N Mississippi Ave, Portland, OR 97227', rating: 4.8, reviewCount: 73, priceTier: '$$',
    tagline: 'Sharp work. Easy chair.', description: 'A two-chair barbershop with precise fades, old-school hot towels, and a very good record collection.',
    image: '/images/austin-movement.jpg', tags: ['Fades', 'Hot towel', 'Walk-ins welcome'], services: ['Classic cut', 'Skin fade', 'Beard shape + towel'],
    hours: ['Mon–Sat 10:00 AM–7:00 PM'], phone: '(503) 555-0161', website: 'https://northline.example.com', verified: true, featured: false, coordinates: { lat: 45.5538, lng: -122.6758 },
  },
  {
    id: 7, slug: 'slow-burn-massage-denver', name: 'Slow Burn Massage', category: 'massage', city: 'Denver', neighborhood: 'Baker',
    address: '2020 S Broadway, Denver, CO 80210', rating: 4.9, reviewCount: 52, priceTier: '$$$',
    tagline: 'The hour your body has been asking for.', description: 'Focused therapeutic massage in a quiet Baker studio. Come with a knot, leave with a little more room.',
    image: '/images/denver-studio.jpg', tags: ['Deep tissue', 'Prenatal', 'By appointment'], services: ['Therapeutic massage — 60 min', 'Deep tissue — 90 min', 'Prenatal massage'],
    hours: ['Mon–Fri 9:00 AM–7:00 PM', 'Sat 10:00 AM–3:00 PM'], phone: '(303) 555-0175', website: 'https://slowburn.example.com', verified: false, featured: false, coordinates: { lat: 39.7183, lng: -104.9874 },
  },
  {
    id: 8, slug: 'tender-form-nails-austin', name: 'Tender Form Nails', category: 'nails', city: 'Austin', neighborhood: 'Bouldin',
    address: '705 S Lamar Blvd, Austin, TX 78704', rating: 4.8, reviewCount: 44, priceTier: '$$',
    tagline: 'A very good reason to slow down.', description: 'A design-minded nail studio for clean shaping, small details, and a genuinely relaxing hour.',
    image: '/images/portland-salon.jpg', tags: ['Nail art', 'Natural nails', 'Non-toxic'], services: ['Signature manicure', 'Builder gel', 'Custom detail set'],
    hours: ['Tue–Sat 10:00 AM–6:00 PM'], phone: '(512) 555-0121', website: 'https://tenderform.example.com', verified: true, featured: false, coordinates: { lat: 30.2557, lng: -97.7662 },
  },
  {
    id: 9, slug: 'the-good-room-portland', name: 'The Good Room', category: 'wellness', city: 'Portland', neighborhood: 'Alberta Arts',
    address: '2710 NE Alberta St, Portland, OR 97211', rating: 4.7, reviewCount: 38, priceTier: '$$',
    tagline: 'A soft place to land.', description: 'Community acupuncture, sound baths, and quiet rituals in a converted Alberta bungalow.',
    image: '/images/austin-movement.jpg', tags: ['Acupuncture', 'Sound bath', 'Community care'], services: ['Community acupuncture', 'Sound bath', 'Private treatment'],
    hours: ['Wed–Sun 11:00 AM–7:00 PM'], phone: '(503) 555-0190', website: 'https://thegoodroom.example.com', verified: true, featured: false, coordinates: { lat: 45.5585, lng: -122.6364 },
  },
  {
    id: 10, slug: 'westward-barber-denver', name: 'Westward Barber Co.', category: 'barbers', city: 'Denver', neighborhood: 'Berkeley',
    address: '4450 Tennyson St, Denver, CO 80212', rating: 4.8, reviewCount: 61, priceTier: '$$',
    tagline: 'The neighborhood shape-up.', description: 'Friendly, unfussy barbering on Tennyson with a knack for classic cuts and modern texture.',
    image: '/images/austin-movement.jpg', tags: ['Classic cuts', 'Texture', 'Local favorite'], services: ['Classic cut', 'Scissor cut', 'Beard trim'],
    hours: ['Tue–Sat 9:00 AM–6:00 PM'], phone: '(303) 555-0108', website: 'https://westward.example.com', verified: true, featured: false, coordinates: { lat: 39.7775, lng: -105.0446 },
  },
  {
    id: 11, slug: 'sunroom-skincare-portland', name: 'Sunroom Skincare', category: 'skincare', city: 'Portland', neighborhood: 'Sellwood',
    address: '808 SE Tacoma St, Portland, OR 97202', rating: 4.9, reviewCount: 48, priceTier: '$$$',
    tagline: 'Good skin starts with good listening.', description: 'Slow, restorative facials and practical routines from a licensed esthetician in a tiny sunroom.',
    image: '/images/denver-studio.jpg', tags: ['Facials', 'Restorative', 'One-on-one'], services: ['Sunroom signature', 'Gentle peel', 'Skin mapping'],
    hours: ['Tue–Fri 10:00 AM–6:00 PM'], phone: '(503) 555-0154', website: 'https://sunroom.example.com', verified: true, featured: false, coordinates: { lat: 45.4726, lng: -122.6501 },
  },
  {
    id: 12, slug: 'rise-cycle-austin', name: 'Rise Cycle', category: 'fitness', city: 'Austin', neighborhood: 'Clarksville',
    address: '1201 W Lynn St, Austin, TX 78703', rating: 4.6, reviewCount: 29, priceTier: '$$',
    tagline: 'Loud music, kind coaching.', description: 'A bright, beat-led cycling room where first timers and regulars get the same warm welcome.',
    image: '/images/austin-movement.jpg', tags: ['Cycling', 'Beginner-friendly', 'Early classes'], services: ['45-minute ride', 'Express ride', 'Intro pack'],
    hours: ['Mon–Sun 6:00 AM–8:00 PM'], phone: '(512) 555-0168', website: 'https://risecycle.example.com', verified: false, featured: false, coordinates: { lat: 30.2796, lng: -97.7632 },
  },
];

export const professionals: Professional[] = [
  {
    id: 101, name: 'Mara Ellis', slug: 'mara-ellis', specialty: 'Lived-in color', city: 'Denver', neighborhood: 'Highland',
    rating: 4.9, reviewCount: 47, setup: 'Booth renter', businessName: 'Lumen Hair', businessSlug: 'lumen-hair-denver',
    image: '/images/portland-salon.jpg', bio: 'Soft dimension, thoughtful consultations, and color that grows out as beautifully as it starts.',
    services: ['Dimensional color', 'Gloss + shape', 'Color correction'], price: '$$', verified: true,
  },
  {
    id: 102, name: 'Jules Okafor', slug: 'jules-okafor', specialty: 'Strength & mobility', city: 'Austin', neighborhood: 'East Austin',
    rating: 4.8, reviewCount: 62, setup: 'Independent studio', businessName: 'Common Ground Movement', businessSlug: 'common-ground-movement-austin',
    image: '/images/austin-movement.jpg', bio: 'A patient, practical coach for building strength that follows you into real life.',
    services: ['1:1 movement session', 'Strength foundations', 'Mobility reset'], price: '$$$', verified: true,
  },
  {
    id: 103, name: 'Anika Shah', slug: 'anika-shah', specialty: 'Facials & barrier care', city: 'Austin', neighborhood: 'South Congress',
    rating: 4.7, reviewCount: 39, setup: 'Suite inside salon', businessName: 'Morrow Skin', businessSlug: 'morrow-skin-austin',
    image: '/images/denver-studio.jpg', bio: 'Skin-first treatments for sensitive, changing skin, with a plan you can actually keep.',
    services: ['Barrier reset', 'The Morrow facial', 'Skin consultation'], price: '$$$', verified: true,
  },
  {
    id: 104, name: 'Tessa Nguyen', slug: 'tessa-nguyen', specialty: 'Natural nails', city: 'Austin', neighborhood: 'Bouldin',
    rating: 4.9, reviewCount: 33, setup: 'Independent studio', businessName: 'Tender Form Nails', businessSlug: 'tender-form-nails-austin',
    image: '/images/portland-salon.jpg', bio: 'Clean shaping and tiny details for people who want their hands to feel like themselves.',
    services: ['Signature manicure', 'Builder gel', 'Custom detail set'], price: '$$', verified: true,
  },
  {
    id: 105, name: 'Rae Bell', slug: 'rae-bell', specialty: 'Therapeutic massage', city: 'Denver', neighborhood: 'Baker',
    rating: 4.9, reviewCount: 51, setup: 'Independent studio', businessName: 'Slow Burn Massage', businessSlug: 'slow-burn-massage-denver',
    image: '/images/denver-studio.jpg', bio: 'Focused bodywork for busy bodies, with enough quiet to notice what your shoulders are saying.',
    services: ['Deep tissue', 'Prenatal massage', 'Therapeutic massage'], price: '$$$', verified: false,
  },
  {
    id: 106, name: 'Noah Mercer', slug: 'noah-mercer', specialty: 'Classic barbering', city: 'Portland', neighborhood: 'Mississippi',
    rating: 4.8, reviewCount: 28, setup: 'Booth renter', businessName: 'Northline Barber', businessSlug: 'northline-barber-portland',
    image: '/images/austin-movement.jpg', bio: 'Classic cuts, modern texture, and the kind of chair where the conversation can stay easy.',
    services: ['Scissor cut', 'Skin fade', 'Beard shape'], price: '$$', verified: true,
  },
  {
    id: 107, name: 'Sloane Reed', slug: 'sloane-reed', specialty: 'Restorative skincare', city: 'Portland', neighborhood: 'Sellwood',
    rating: 4.9, reviewCount: 42, setup: 'Suite inside salon', businessName: 'Sunroom Skincare', businessSlug: 'sunroom-skincare-portland',
    image: '/images/denver-studio.jpg', bio: 'Slow facials and practical routines for skin that wants less noise and more consistency.',
    services: ['Sunroom signature', 'Gentle peel', 'Skin mapping'], price: '$$$', verified: true,
  },
  {
    id: 108, name: 'Priya Hart', slug: 'priya-hart', specialty: 'Cycling & conditioning', city: 'Austin', neighborhood: 'Clarksville',
    rating: 4.6, reviewCount: 24, setup: 'Booth renter', businessName: 'Rise Cycle', businessSlug: 'rise-cycle-austin',
    image: '/images/austin-movement.jpg', bio: 'Bright energy, clear coaching, and a first class that never makes you feel like the new person.',
    services: ['45-minute ride', 'Express ride', 'Intro pack'], price: '$$', verified: false,
  },
];

export const cities = [
  { slug: 'denver', name: 'Denver', note: 'Mile-high and deeply local', count: 4 },
  { slug: 'austin', name: 'Austin', note: 'Good energy, better independents', count: 4 },
  { slug: 'portland', name: 'Portland', note: 'Thoughtful places, no rush', count: 4 },
];

export const categoryLabels = Object.fromEntries(Object.entries(categoryMeta).map(([key, value]) => [key, value.label]));

export function titleCase(value: string) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}