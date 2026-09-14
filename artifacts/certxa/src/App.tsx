import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useMemo, useState, type ChangeEvent, type ElementType, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import {
  AlertCircle, ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, ChevronDown, ChevronRight, CircleCheck,
  BadgeCheck, Briefcase, Clock3, Compass, Dumbbell, ExternalLink, FileImage, Hand, ImagePlus, Leaf, ListFilter, LocateFixed,
  LockKeyhole, Mail, MapPin, Menu, Phone, Search, Scissors, Send, ShieldCheck, SlidersHorizontal, Sparkles, Star,
  SunMedium, Upload, UserRound, Waves, X,
} from 'lucide-react';
import { businesses, categoryLabels, categoryMeta, cities, getSubmittedProfessionals, professionals, saveSubmittedProfessional, type Business, type Professional } from '@/lib/data';

const queryClient = new QueryClient();
const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
const placeCount = (count: number) => `${count} ${count === 1 ? 'place' : 'places'}`;

function Seo({ title, description, path = '/', jsonLd }: { title: string; description: string; path?: string; jsonLd?: object | object[] }) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
      Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
    };
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: `${siteUrl}${path}` });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: `${siteUrl}/images/denver-studio.jpg` });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: `${siteUrl}/images/denver-studio.jpg` });
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${siteUrl}${path}`;
    const existing = document.head.querySelector('script[data-certxa-schema]');
    existing?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json'; script.dataset.certxaSchema = 'true';
      script.textContent = JSON.stringify(jsonLd); document.head.appendChild(script);
    }
  }, [title, description, path, jsonLd]);
  return null;
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="breadcrumbs" data-testid="nav-breadcrumbs">
    <Link href="/" data-testid="link-breadcrumb-home">Home</Link>
    {items.map((item, index) => <span key={item.label} className="breadcrumb-item"><ChevronRight size={13} />{item.href ? <Link href={item.href} data-testid={`link-breadcrumb-${index}`}>{item.label}</Link> : <span>{item.label}</span>}</span>)}
  </nav>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return <>
    <div className="promo-strip"><span className="promo-badge">certxa+</span><strong>Find your next favorite place, without the guesswork</strong><span className="promo-detail">Explore trusted local businesses near you</span><ArrowRight size={15} /></div>
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" data-testid="link-logo"><span>certxa.</span></Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link href="/search" className={location === '/search' ? 'active' : ''} data-testid="link-discover">Discover</Link>
          <Link href="/city/denver" className={location.includes('/city') ? 'active' : ''} data-testid="link-cities">Cities</Link>
          <Link href="/professionals" className={location === '/professionals' ? 'active' : ''} data-testid="link-professionals">Professionals</Link>
        </nav>
        <div className="header-actions">
          <a href="mailto:hello@certxa.com" className="business-link" data-testid="link-header-business">For businesses</a>
          <Link href="/search?view=saved" className="saved-link" data-testid="link-saved"><Bookmark size={17} /><span className="saved-word">Saved</span></Link>
          <span className="header-avatar" aria-label="Certxa member">C</span>
        </div>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div><Link href="/" className="brand footer-brand" data-testid="link-footer-logo"><span className="brand-mark"><Compass size={17} /></span><span>certxa</span></Link><p className="footer-intro">A more considered way to find your next favorite local place.</p></div>
      <div><p className="footer-label">Explore</p><Link href="/search" data-testid="link-footer-all-places">All places</Link><Link href="/professionals" data-testid="link-footer-professionals">Professionals</Link><Link href="/category/salons" data-testid="link-footer-salons">Salons</Link><Link href="/category/fitness" data-testid="link-footer-fitness">Fitness</Link></div>
      <div><p className="footer-label">Cities</p>{cities.map(city => <Link key={city.slug} href={`/city/${city.slug}`} data-testid={`link-footer-city-${city.slug}`}>{city.name}</Link>)}</div>
      <div><p className="footer-label">For owners</p><Link href="/professionals/list" data-testid="link-list-place">List your practice</Link><a href="mailto:hello@certxa.com" data-testid="link-editorial-standards">Editorial standards</a></div>
    </div>
    <div className="footer-bottom"><span>© 2025 Certxa Guide</span><span>Independent places, thoughtfully found.</span></div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Header />{children}<Footer /></div>;
}

function SearchBar({ initial = '', city = '' }: { initial?: string; city?: string }) {
  const [value, setValue] = useState(initial);
  const [where, setWhere] = useState(city);
  const [timeframe, setTimeframe] = useState('Anytime');
  const [, setLocation] = useLocation();
  const submit = (event: FormEvent) => { event.preventDefault(); setLocation(`/search?q=${encodeURIComponent(value)}${where ? `&city=${encodeURIComponent(where)}` : ''}`); };
  return <form className="hero-search" onSubmit={submit} role="search">
    <div className="search-field search-field-wide"><Search size={20} /><input value={value} onChange={e => setValue(e.target.value)} placeholder="Business name, service, or class" aria-label="What are you looking for?" data-testid="input-search-query" /></div>
    <div className="search-divider" />
    <div className="search-field where"><MapPin size={19} /><select value={where} onChange={e => setWhere(e.target.value)} aria-label="Choose a city" data-testid="select-search-city"><option value="">Business or location</option>{cities.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}</select><ChevronDown size={15} /></div>
    <div className="search-divider" />
    <div className="search-field when"><Clock3 size={18} /><select value={timeframe} onChange={e => setTimeframe(e.target.value)} aria-label="Choose a time" data-testid="select-search-time"><option>Anytime</option><option>Today</option><option>This weekend</option></select><ChevronDown size={15} /></div>
    <button className="button button-dark search-button" type="submit" data-testid="button-search-submit">Search <ArrowRight size={16} /></button>
  </form>;
}

function SaveButton({ business }: { business: Business }) {
  const [saved, setSaved] = useState(() => typeof window !== 'undefined' && JSON.parse(localStorage.getItem('certxa-saved') || '[]').includes(business.id));
  const toggle = () => {
    const current: number[] = JSON.parse(localStorage.getItem('certxa-saved') || '[]');
    const next = saved ? current.filter(id => id !== business.id) : [...current, business.id];
    localStorage.setItem('certxa-saved', JSON.stringify(next)); setSaved(!saved);
  };
  return <button className={`save-button ${saved ? 'saved' : ''}`} onClick={toggle} aria-label={saved ? `Remove ${business.name} from saved` : `Save ${business.name}`} data-testid={`button-save-${business.id}`}>{saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button>;
}

function Rating({ business, large = false }: { business: Business; large?: boolean }) {
  return <span className={`rating ${large ? 'rating-large' : ''}`}><Star size={large ? 18 : 14} fill="currentColor" /><strong>{business.rating}</strong><span className="review-count">({business.reviewCount})</span></span>;
}

function BusinessCard({ business, compact = false }: { business: Business; compact?: boolean }) {
  return <article className={`business-card ${compact ? 'compact-card' : ''}`} data-testid={`card-business-${business.id}`}>
    <Link href={`/business/${business.slug}`} className="card-image-link" data-testid={`link-business-image-${business.id}`}>
      <div className="card-image"><img src={business.image} alt={`${business.name} interior in ${business.city}`} width="800" height="600" loading="lazy" /><span className="card-category">{categoryLabels[business.category]}</span>{business.featured && <span className="featured-pill">Featured</span>}</div>
    </Link>
    <div className="card-body"><div className="card-heading"><div><p className="eyebrow">{business.neighborhood} · {business.city}</p><Link href={`/business/${business.slug}`} className="card-title" data-testid={`link-business-${business.id}`}>{business.name}</Link></div><SaveButton business={business} /></div><p className="card-tagline">{business.tagline}</p><div className="card-meta"><Rating business={business} /><span className="dot-separator">·</span><span>{business.priceTier}</span></div><div className="tag-row">{business.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div></div>
  </article>;
}

function IconFor({ name }: { name: string }) {
  const icons: Record<string, ElementType> = { Scissors, Sparkles, Hand, Waves, Dumbbell, SunMedium, Leaf };
  const Icon = icons[name] || Compass;
  return <Icon size={20} strokeWidth={1.7} />;
}

function Home() {
  const featured = businesses.filter(b => b.featured);
  const schema = useMemo(() => [{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Certxa', url: siteUrl, description: 'A trusted local guide to independent salons, wellness studios, and fitness spaces.' }, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Certxa', url: siteUrl, potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }], []);
  return <Shell><Seo title="Certxa — Find your next favorite local place" description="Discover independent salons, wellness studios, fitness spaces, and service providers worth your time in Denver, Austin, and Portland." jsonLd={schema} />
    <main>
       <section className="home-hero"><div className="hero-backdrop" aria-hidden="true" /><div className="hero-overlay" aria-hidden="true" /><div className="hero-content"><p className="kicker"><span className="kicker-line" />The local guide for good days</p><h1>Find your next<br /><em>great day.</em></h1><p className="hero-summary">Discover independent salons, studios, and practitioners worth making time for.</p><SearchBar /><div className="hero-pills" aria-label="Browse by service">{Object.entries(categoryMeta).map(([key, meta]) => <Link key={key} href={`/search?category=${key}`} data-testid={`link-hero-category-${key}`}>{meta.label}</Link>)}<Link href="/search" data-testid="link-hero-more">More <ChevronRight size={13} /></Link></div></div></section>
       <section className="section shell-section category-section"><div className="section-head"><div><p className="eyebrow">Start somewhere good</p><h2>What are you in the mood for?</h2></div><Link href="/search" className="text-link" data-testid="link-browse-all">Browse all places <ArrowRight size={15} /></Link></div><div className="category-grid">{Object.entries(categoryMeta).map(([key, meta]) => <Link href={`/search?category=${key}`} className="category-tile" key={key} data-testid={`link-category-${key}`}><span className="category-icon"><IconFor name={meta.icon} /></span><span><strong>{meta.label}</strong><small>{placeCount(businesses.filter(b => b.category === key).length)}</small></span><ArrowRight className="tile-arrow" size={16} /></Link>)}</div></section>
      <section className="section featured-section"><div className="section-head"><div><p className="eyebrow">On our radar</p><h2>Places we’d tell a friend about.</h2></div><span className="section-aside">A few especially good finds <span className="accent-dot" /></span></div><div className="featured-grid">{featured.map(b => <BusinessCard key={b.id} business={b} />)}</div></section>
      <section className="city-band"><div className="city-band-inner"><div><p className="eyebrow">The guide, by city</p><h2>Local looks different<br /><em>everywhere.</em></h2><p>Small businesses are the texture of a city. Start with one neighborhood and see where it leads.</p></div><div className="city-list">{cities.map((city, index) => <Link href={`/city/${city.slug}`} key={city.slug} className="city-row" data-testid={`link-city-${city.slug}`}><span className="city-index">0{index + 1}</span><span><strong>{city.name}</strong><small>{city.note}</small></span><ArrowRight size={18} /></Link>)}</div></div></section>
      <section className="section journal-section"><div className="journal-mark">A note from<br /><em>the guide</em></div><div className="journal-copy"><p className="eyebrow">Why Certxa exists</p><h2>The best local places<br />usually have a story.</h2><p>Not every place needs to be the loudest, newest, or most booked. We look for the ones with care in the details: the practitioner who remembers your name, the room that lets you exhale, the owner who has stayed curious.</p><Link href="/search" className="button button-outline" data-testid="button-read-guide">Explore the guide <ArrowRight size={16} /></Link></div><div className="journal-stat"><strong>12</strong><span>independent places<br />to start with</span></div></section>
    </main>
  </Shell>;
}

function FilterPill({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) { return <button className={`filter-pill ${active ? 'active' : ''}`} onClick={onClick} data-testid={`button-filter-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}{active && <X size={13} />}</button>; }

function DirectoryResultCard({ business, index }: { business: Business; index: number }) {
  const distance = ['0.8 mi', '1.4 mi', '2.1 mi', '2.7 mi'][index % 4];
  return <article className="directory-result-card" data-testid={`directory-result-${business.id}`}>
    <Link href={`/business/${business.slug}`} className="directory-result-image" data-testid={`directory-result-image-${business.id}`}><img src={business.image} alt={`${business.name} in ${business.city}`} width="160" height="120" loading="lazy" /></Link>
    <div className="directory-result-content">
      <div className="directory-result-heading"><Link href={`/business/${business.slug}`} className="directory-result-title" data-testid={`directory-result-link-${business.id}`}>{business.name}</Link><SaveButton business={business} /></div>
      <Rating business={business} />
      <p className="directory-result-location">{business.city}, CO <span>·</span> {distance}</p>
      <p className="directory-result-services">{categoryLabels[business.category]} · {business.tags.slice(0, 2).join(' · ')}</p>
      <p className="directory-result-description">{business.description}</p>
      <div className="directory-result-footer"><span className="directory-open-status">{index % 3 === 1 ? 'Closed now' : 'Open today'}</span><span>{business.priceTier} · {business.verified ? 'Verified' : 'Independent'}</span></div>
    </div>
  </article>;
}

function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialQ = query.get('q') || '';
  const initialCity = query.get('city') || '';
  const [q, setQ] = useState(initialQ);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(query.get('category') || '');
  const [sort, setSort] = useState('recommended');
  const [savedOnly, setSavedOnly] = useState(query.get('view') === 'saved');
  const [locationText, setLocationText] = useState(initialCity);
  const [showFilters, setShowFilters] = useState(false);
  const [, setLocation] = useLocation();
  useEffect(() => {
    const next = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    setQ(next.get('q') || '');
    setCity(next.get('city') || '');
    setCategory(next.get('category') || '');
    setSavedOnly(next.get('view') === 'saved');
    setLocationText(next.get('city') || '');
  }, [location]);
  const filtered = useMemo(() => {
    const saved: number[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('certxa-saved') || '[]') : [];
    const results = businesses.filter(b => (!q || `${b.name} ${categoryLabels[b.category]} ${b.category} ${b.neighborhood} ${b.city} ${b.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) && (!city || b.city.toLowerCase() === city.toLowerCase()) && (!category || b.category === category) && (!savedOnly || saved.includes(b.id)));
    return [...results].sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'reviews' ? b.reviewCount - a.reviewCount : Number(b.featured) - Number(a.featured));
  }, [q, city, category, sort, savedOnly]);
  const clear = () => { setQ(''); setCity(''); setCategory(''); setSavedOnly(false); setLocationText(''); setLocation('/search'); };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    if (savedOnly) params.set('view', 'saved');
    setLocation(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };
  const submitLocation = (event: FormEvent) => {
    event.preventDefault();
    const matchingCity = cities.find(item => item.name.toLowerCase() === locationText.trim().toLowerCase());
    setCity(matchingCity?.name || '');
    setLocationText(matchingCity?.name || locationText.trim());
  };
  const title = category ? `Best ${categoryLabels[category]} near you` : q ? `Results for “${q}”` : 'Discover local businesses';
  const locationLabel = city || 'Denver, CO';
  return <Shell><Seo title={`${title} — Certxa`} description={`Browse trusted independent ${q ? `${q} ` : ''}places in Denver, Austin, and Portland. Compare ratings, services, and local details on Certxa.`} path={`/search${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`} />
    <main className="directory-page">
      <div className="directory-topbar">
        <form className="directory-location-form" onSubmit={submitLocation}><Search size={17} /><input value={locationText} onChange={e => setLocationText(e.target.value)} placeholder="City, Zip / Postal code" aria-label="Search by location" data-testid="input-directory-location" /></form>
        <div className="directory-mode-tabs" role="tablist" aria-label="Directory mode"><button className="active" type="button" data-testid="button-at-business"><span>▰</span> At Business</button><button type="button" data-testid="button-mobile-services">▣ Mobile Services</button><button type="button" data-testid="button-live-stream">▮ Live Stream</button></div>
        <form className="directory-service-form" onSubmit={submitSearch}><Search size={17} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search Services and Classes" aria-label="Search services and classes" data-testid="input-directory-search" /></form>
        <button className={`directory-filter-button ${showFilters ? 'active' : ''}`} type="button" onClick={() => setShowFilters(!showFilters)} data-testid="button-directory-filters"><ListFilter size={16} /> Filters</button>
        {category && <button className="directory-active-chip" type="button" onClick={() => { setCategory(''); submitSearch(new Event('submit') as unknown as FormEvent); }} data-testid="button-directory-category">{categoryLabels[category]} <X size={14} /></button>}
      </div>
      {showFilters && <div className="directory-filter-drawer"><div><span>City</span>{cities.map(item => <button key={item.slug} className={city === item.name ? 'selected' : ''} onClick={() => setCity(city === item.name ? '' : item.name)}>{item.name} <small>{item.count}</small></button>)}</div><div><span>Business type</span>{Object.entries(categoryLabels).map(([key, label]) => <button key={key} className={category === key ? 'selected' : ''} onClick={() => setCategory(category === key ? '' : key)}>{label} <small>{businesses.filter(b => b.category === key).length}</small></button>)}</div><button className={`directory-saved-filter ${savedOnly ? 'selected' : ''}`} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} /> Saved places</button></div>}
      <div className="directory-results-layout">
        <section className="directory-list-panel" aria-label="Business results">
          <div className="directory-list-header"><div><h1>{title}</h1><p>{filtered.length} Businesses Available in <button type="button" onClick={() => setLocationText(locationLabel)}>{locationLabel}</button></p></div><label className="directory-sort">Sort <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort results" data-testid="select-sort-results"><option value="recommended">Recommended</option><option value="rating">Rating</option><option value="reviews">Reviews</option></select><ChevronDown size={13} /></label></div>
          <div className="directory-list">{filtered.length ? filtered.map((business, index) => <DirectoryResultCard key={business.id} business={business} index={index} />) : <div className="directory-empty"><Compass size={25} /><h2>No places match that yet.</h2><p>Try a broader search or clear a filter.</p><button className="button button-outline" onClick={clear} data-testid="button-empty-clear">Clear search</button></div>}</div>
        </section>
        <aside className="directory-map" aria-label="Map of business results"><div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-road road-four" /><span className="map-neighborhood n-one">HIGHLAND</span><span className="map-neighborhood n-two">FIVE POINTS</span><span className="map-neighborhood n-three">CAPITOL HILL</span><span className="map-neighborhood n-four">CHERRY CREEK</span><span className="map-neighborhood n-five">WASHINGTON PARK</span>{filtered.map((business, index) => <Link key={business.id} href={`/business/${business.slug}`} className="map-marker" style={{ left: `${14 + ((index * 17) % 73)}%`, top: `${17 + ((index * 23) % 66)}%` }} aria-label={`View ${business.name}`} data-testid={`map-marker-${business.id}`}><MapPin size={29} fill="currentColor" /></Link>)}<div className="map-label">Map data <span>© Certxa</span></div><button className="map-expand" type="button" aria-label="Expand map"><LocateFixed size={18} /></button></aside>
      </div>
    </main>
  </Shell>;
}

function ProfessionalRating({ professional }: { professional: Professional }) {
  return <span className="professional-rating" data-testid={`rating-professional-${professional.id}`}><Star size={14} fill="currentColor" /><strong>{professional.rating.toFixed(1)}</strong><span>({professional.reviewCount})</span></span>;
}

function ProfessionalSaveButton({ professional }: { professional: Professional }) {
  const [saved, setSaved] = useState(() => typeof window !== 'undefined' && JSON.parse(localStorage.getItem('certxa-saved-professionals') || '[]').includes(professional.id));
  const toggle = () => {
    const current: number[] = JSON.parse(localStorage.getItem('certxa-saved-professionals') || '[]');
    const next = saved ? current.filter(id => id !== professional.id) : [...current, professional.id];
    localStorage.setItem('certxa-saved-professionals', JSON.stringify(next));
    setSaved(!saved);
  };
  return <button className={`professional-save ${saved ? 'saved' : ''}`} type="button" onClick={toggle} aria-label={saved ? `Remove ${professional.name} from saved` : `Save ${professional.name}`} data-testid={`button-save-professional-${professional.id}`}>{saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}</button>;
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  const destination = professional.submitted ? '/professionals' : `/business/${professional.businessSlug}`;
  return <article className="professional-card" data-testid={`card-professional-${professional.id}`}>
    <div className="professional-card-media">
      <Link href={destination} data-testid={`link-professional-image-${professional.id}`}><img src={professional.image} alt={`${professional.name}, ${professional.specialty}`} width="720" height="560" loading="lazy" /></Link>
      <span className="professional-city" data-testid={`text-professional-city-${professional.id}`}><MapPin size={12} />{professional.city}</span>
      <ProfessionalSaveButton professional={professional} />
    </div>
    <div className="professional-card-body">
      <div className="professional-card-heading">
        <div><p className="eyebrow">{professional.submitted ? 'Submitted for review' : professional.neighborhood}</p><Link href={destination} className="professional-name" data-testid={`link-professional-${professional.id}`}>{professional.name}</Link></div>
        {professional.verified && <span className="professional-verified" title="Verified on Certxa" data-testid={`status-professional-verified-${professional.id}`}><BadgeCheck size={16} /></span>}
      </div>
      <p className="professional-specialty" data-testid={`text-professional-specialty-${professional.id}`}>{professional.specialty}</p>
      {professional.submitted ? <span className="professional-pending"><CircleCheck size={14} />Under editorial review</span> : <ProfessionalRating professional={professional} />}
      <p className="professional-bio">{professional.bio}</p>
      <div className="professional-card-foot"><span className="professional-setup"><Briefcase size={13} /> {professional.setup}</span><span>{professional.price}</span></div>
      <div className="professional-services">{professional.services.slice(0, 2).map(service => <span key={service}>{service}</span>)}</div>
      <Link href={destination} className="professional-business-link" data-testid={`link-professional-business-${professional.id}`}>{professional.submitted ? 'View the professional directory' : `Works from ${professional.businessName}`} <ArrowRight size={14} /></Link>
    </div>
  </article>;
}

function ProfessionalsPage() {
  const [location, setLocation] = useLocation();
  const initialParams = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), []);
  const [search, setSearch] = useState(initialParams.get('q') || '');
  const [city, setCity] = useState(initialParams.get('city') || '');
  const [specialty, setSpecialty] = useState(initialParams.get('specialty') || '');
  const [setup, setSetup] = useState(initialParams.get('setup') || '');
  const [minimumRating, setMinimumRating] = useState(initialParams.get('rating') || '');
  const [sort, setSort] = useState('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [submittedProfessionals, setSubmittedProfessionals] = useState<Professional[]>(() => getSubmittedProfessionals());

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    setSearch(params.get('q') || '');
    setCity(params.get('city') || '');
    setSpecialty(params.get('specialty') || '');
    setSetup(params.get('setup') || '');
    setMinimumRating(params.get('rating') || '');
  }, [location]);

  useEffect(() => {
    const refreshSubmitted = () => setSubmittedProfessionals(getSubmittedProfessionals());
    window.addEventListener('certxa-professional-submitted', refreshSubmitted);
    return () => window.removeEventListener('certxa-professional-submitted', refreshSubmitted);
  }, []);

  const allProfessionals = useMemo(() => [...submittedProfessionals, ...professionals], [submittedProfessionals]);
  const specialties = useMemo(() => [...new Set(allProfessionals.map(professional => professional.specialty))].sort(), [allProfessionals]);
  const filteredProfessionals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const minimum = minimumRating ? Number(minimumRating) : 0;
    const results = allProfessionals.filter(professional => {
      const searchable = [professional.name, professional.specialty, professional.city, professional.neighborhood, professional.businessName, professional.bio, ...professional.services].join(' ').toLowerCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch))
        && (!city || professional.city === city)
        && (!specialty || professional.specialty === specialty)
        && (!setup || professional.setup === setup)
        && professional.rating >= minimum;
    });
    return [...results].sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'reviews' ? b.reviewCount - a.reviewCount : sort === 'name' ? a.name.localeCompare(b.name) : Number(b.verified) - Number(a.verified) || b.rating - a.rating);
  }, [allProfessionals, city, minimumRating, search, setup, sort, specialty]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (city) params.set('city', city);
    if (specialty) params.set('specialty', specialty);
    if (setup) params.set('setup', setup);
    if (minimumRating) params.set('rating', minimumRating);
    if (value) params.set(key, value); else params.delete(key);
    setLocation(`/professionals${params.toString() ? `?${params.toString()}` : ''}`);
  };
  const clearFilters = () => {
    setSearch(''); setCity(''); setSpecialty(''); setSetup(''); setMinimumRating(''); setSort('recommended');
    setLocation('/professionals');
  };
  const activeCount = [city, specialty, setup, minimumRating].filter(Boolean).length;
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Certxa Professionals',
    description: 'Discover independent beauty, wellness, and fitness professionals in Denver, Austin, and Portland.',
     url: `${siteUrl}/professionals`,
     mainEntity: { '@type': 'ItemList', numberOfItems: allProfessionals.length, itemListElement: allProfessionals.map((professional, index) => ({ '@type': 'ListItem', position: index + 1, name: professional.name, url: `${siteUrl}/business/${professional.businessSlug}` })) },
   }), [allProfessionals]);

  return <Shell><Seo title="Find independent professionals — Certxa" description="Meet independent beauty, wellness, and fitness professionals in Denver, Austin, and Portland. Search by specialty, setup, rating, and city on Certxa." path="/professionals" jsonLd={schema} />
    <main className="professionals-page">
      <section className="professionals-hero">
        <div className="professionals-hero-copy">
          <p className="kicker"><span className="kicker-line" />The people behind the places</p>
          <h1>Meet your next<br /><em>favorite practitioner.</em></h1>
          <p>Find the solo artists, booth renters, and independent pros who make local beauty, wellness, and movement feel personal.</p>
          <Link href="/professionals/list" className="button button-dark professional-list-button" data-testid="link-list-professional"><UserRound size={16} /> List your practice <ArrowRight size={15} /></Link>
        </div>
        <div className="professionals-hero-note"><span className="hero-note-number">{String(allProfessionals.length).padStart(2, '0')}</span><span>people to know<br /><em>and book again</em></span></div>
      </section>
      <section className="professionals-controls" aria-label="Search professionals">
        <div className="professionals-search-wrap"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search a name, service, or neighborhood" aria-label="Search professionals" data-testid="input-professionals-search" /><button type="button" onClick={() => setSearch('')} aria-label="Clear professional search" data-testid="button-clear-professional-search"><X size={15} /></button></div>
        <label className="professional-select"><span>City</span><select value={city} onChange={event => { setCity(event.target.value); updateParam('city', event.target.value); }} aria-label="Filter professionals by city" data-testid="select-professionals-city"><option value="">All cities</option>{cities.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}</select><ChevronDown size={14} /></label>
        <label className="professional-select"><span>Specialty</span><select value={specialty} onChange={event => { setSpecialty(event.target.value); updateParam('specialty', event.target.value); }} aria-label="Filter professionals by specialty" data-testid="select-professionals-specialty"><option value="">All specialties</option>{specialties.map(item => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
        <button className={`professionals-filter-toggle ${filtersOpen ? 'active' : ''}`} type="button" onClick={() => setFiltersOpen(value => !value)} aria-expanded={filtersOpen} data-testid="button-toggle-professional-filters"><SlidersHorizontal size={16} /> Filters {activeCount > 0 && <span>{activeCount}</span>}</button>
      </section>
      {filtersOpen && <div className="professional-filter-drawer" data-testid="panel-professional-filters">
        <div><span className="professional-filter-label">Work setup</span><div className="professional-filter-options">{['Independent studio', 'Booth renter', 'Suite inside salon'].map(option => <button key={option} className={setup === option ? 'selected' : ''} type="button" onClick={() => { const next = setup === option ? '' : option; setSetup(next); updateParam('setup', next); }} data-testid={`button-professional-setup-${option.toLowerCase().replaceAll(' ', '-')}`}>{option}</button>)}</div></div>
        <div><span className="professional-filter-label">Rating</span><div className="professional-filter-options">{[['', 'Any rating'], ['4.5', '4.5 and up'], ['4.8', '4.8 and up']].map(([value, label]) => <button key={value || 'any'} className={minimumRating === value ? 'selected' : ''} type="button" onClick={() => { setMinimumRating(value); updateParam('rating', value); }} data-testid={`button-professional-rating-${value || 'any'}`}>{label}</button>)}</div></div>
        {activeCount > 0 && <button className="professional-clear-filters" type="button" onClick={clearFilters} data-testid="button-clear-professional-filters">Clear all filters</button>}
      </div>}
      <div className="professionals-content">
        <div className="professionals-toolbar"><div><p className="eyebrow">A considered shortlist</p><h2 data-testid="text-professional-results-count">{filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'professional' : 'professionals'} to know</h2></div><label className="professional-sort"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort professionals" data-testid="select-professionals-sort"><option value="recommended">Recommended</option><option value="rating">Highest rated</option><option value="reviews">Most reviewed</option><option value="name">Name A–Z</option></select><ChevronDown size={13} /></label></div>
        {filteredProfessionals.length ? <div className="professionals-grid">{filteredProfessionals.map(professional => <ProfessionalCard key={professional.id} professional={professional} />)}</div> : <div className="professionals-empty" data-testid="empty-professionals"><div className="empty-icon"><Search size={22} /></div><p className="eyebrow">A quieter search</p><h2>No one here yet.</h2><p>Try a different city, specialty, or a broader search. The right person may be one filter away.</p><button className="button button-outline" type="button" onClick={clearFilters} data-testid="button-empty-professionals-clear">Clear filters <ArrowRight size={15} /></button></div>}
      </div>
      <section className="professionals-note"><div className="professionals-note-mark"><Briefcase size={18} /><span>Independent by design</span></div><p>Some work from a private studio. Some rent a chair inside a place you already love. Certxa makes room for both — because the person you book matters as much as the place.</p><Link href="/search" className="text-link" data-testid="link-professionals-explore-places">Explore places <ArrowRight size={15} /></Link></section>
    </main>
  </Shell>;
}

type ListingForm = {
  name: string;
  phone: string;
  email: string;
  about: string;
  image: string;
  imageName: string;
};

type ListingErrors = Partial<Record<keyof ListingForm, string>>;

const initialListingForm: ListingForm = { name: '', phone: '', email: '', about: '', image: '', imageName: '' };
const unsafeListingText = /(https?:\/\/|www\.|javascript:|vbscript:|data:text\/html|<[^>]*>|on\w+\s*=|\{\{|\}\}|\$\{|\/\*|--|\b(?:union|select|insert|update|delete|drop)\b.{0,24}\b(?:from|into|table|where|select)\b)/i;

function ProfessionalListingPage() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState<ListingForm>(initialListingForm);
  const [errors, setErrors] = useState<ListingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);

  const updateField = (field: keyof ListingForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(current => ({ ...current, image: 'Choose a JPG, PNG, or WebP image.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(current => ({ ...current, image: 'Please choose an image smaller than 5 MB.' }));
      return;
    }
    setIsReadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm(current => ({ ...current, image: reader.result as string, imageName: file.name }));
        setErrors(current => ({ ...current, image: undefined }));
      }
      setIsReadingImage(false);
    };
    reader.onerror = () => {
      setErrors(current => ({ ...current, image: 'That image could not be read. Please try another.' }));
      setIsReadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): ListingErrors => {
    const next: ListingErrors = {};
    const name = form.name.trim();
    const about = form.about.trim();
    if (!name) next.name = 'Add the name you would like people to find you by.';
    else if (name.length < 2) next.name = 'Use at least two characters.';
    else if (unsafeListingText.test(name)) next.name = 'Please use plain text only. Website links and markup are not accepted.';
    if (!form.phone.trim()) next.phone = 'Add a phone number where a client can reach you.';
    else if (!/^[+()\d\s./-]{7,24}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.';
    else if (unsafeListingText.test(form.phone)) next.phone = 'Please use plain text only.';
    if (!form.email.trim()) next.email = 'Add an email address for editorial follow-up.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    else if (unsafeListingText.test(form.email)) next.email = 'Please use a standard email address.';
    if (!form.image) next.image = 'Add one clear profile photo.';
    if (!about) next.about = 'Tell us a little about your practice.';
    else if (about.length < 40) next.about = 'A little more detail helps us understand your practice (40 characters minimum).';
    else if (about.length > 700) next.about = 'Keep your introduction under 700 characters.';
    else if (unsafeListingText.test(about)) next.about = 'Please remove links, markup, or code-like text. Keep it about your practice.';
    return next;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstError = Object.keys(nextErrors)[0] as keyof ListingForm;
      document.getElementById(`listing-${firstError}`)?.focus();
      return;
    }
    saveSubmittedProfessional({ name: form.name, phone: form.phone, email: form.email, image: form.image, bio: form.about });
    setSubmitted(true);
  };

  if (submitted) {
    return <Shell><Seo title="Submitted for review — Certxa" description="Your Certxa professional listing has been submitted for editorial review." path="/professionals/list" /><main className="listing-page"><section className="listing-success" aria-live="polite"><div className="listing-success-icon"><CircleCheck size={34} /></div><p className="kicker"><span className="kicker-line" />Thank you for putting your work forward</p><h1>Your practice is<br /><em>with our editors.</em></h1><p>We have your details and will take a thoughtful look before anything goes live. Your contact information stays private while we review your submission.</p><div className="listing-success-details"><div><LockKeyhole size={17} /><span><strong>Private by default</strong>Only our small editorial team can see your contact details.</span></div><div><BadgeCheck size={17} /><span><strong>Reviewed with care</strong>We check every listing for fit, clarity, and trust.</span></div></div><div className="listing-success-actions"><button type="button" className="button button-dark" onClick={() => setLocation('/professionals')} data-testid="button-view-professionals">Back to professionals <ArrowRight size={16} /></button><button type="button" className="button button-outline" onClick={() => { setForm(initialListingForm); setErrors({}); setSubmitted(false); }} data-testid="button-submit-another">Submit another listing</button></div></section></main></Shell>;
  }

  return <Shell><Seo title="List your practice — Certxa" description="Put your independent beauty, wellness, or movement practice in front of people who value thoughtful local work." path="/professionals/list" /><main className="listing-page">
    <div className="listing-wrap">
      <Link href="/professionals" className="listing-back"><ArrowLeft size={15} /> Back to professionals</Link>
      <div className="listing-intro"><div><p className="kicker"><span className="kicker-line" />For independent practitioners</p><h1>Make room for<br /><em>your good work.</em></h1><p>Tell us a little about what you do. We will review your submission with the same care we bring to every place in the guide.</p></div><div className="listing-intro-note"><span>01</span><p>Share the work.<br /><em>We’ll handle the rest.</em></p></div></div>
      <div className="listing-grid">
        <form className="listing-form" onSubmit={submit} noValidate>
          <div className="form-section-heading"><span>01</span><div><p className="eyebrow">Your details</p><h2>Start with the basics.</h2></div></div>
          <div className="listing-field-grid">
            <div className={`listing-field ${errors.name ? 'has-error' : ''}`}><label htmlFor="listing-name">Professional name <span>Required</span></label><div className="listing-input-wrap"><UserRound size={16} /><input id="listing-name" value={form.name} onChange={event => updateField('name', event.target.value)} placeholder="The name clients know you by" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'listing-name-error' : undefined} data-testid="input-listing-name" /></div>{errors.name && <p className="listing-error" id="listing-name-error"><AlertCircle size={14} />{errors.name}</p>}</div>
            <div className={`listing-field ${errors.phone ? 'has-error' : ''}`}><label htmlFor="listing-phone">Phone <span>Private during review</span></label><div className="listing-input-wrap"><Phone size={16} /><input id="listing-phone" type="tel" value={form.phone} onChange={event => updateField('phone', event.target.value)} placeholder="(303) 555-0148" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'listing-phone-error' : undefined} data-testid="input-listing-phone" /></div>{errors.phone && <p className="listing-error" id="listing-phone-error"><AlertCircle size={14} />{errors.phone}</p>}</div>
            <div className={`listing-field ${errors.email ? 'has-error' : ''}`}><label htmlFor="listing-email">Email <span>Private during review</span></label><div className="listing-input-wrap"><Mail size={16} /><input id="listing-email" type="email" value={form.email} onChange={event => updateField('email', event.target.value)} placeholder="hello@yourpractice.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'listing-email-error' : undefined} data-testid="input-listing-email" /></div>{errors.email && <p className="listing-error" id="listing-email-error"><AlertCircle size={14} />{errors.email}</p>}</div>
          </div>
          <div className="form-section-heading form-section-heading-spaced"><span>02</span><div><p className="eyebrow">A first impression</p><h2>Show us the person behind the practice.</h2></div></div>
          <div className={`listing-field ${errors.image ? 'has-error' : ''}`}><label htmlFor="listing-image">Profile photo <span>JPG, PNG, or WebP · 5 MB max</span></label><div className={`listing-upload ${form.image ? 'has-image' : ''}`}><input id="listing-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? 'listing-image-error' : 'listing-image-help'} data-testid="input-listing-image" />{form.image ? <><img src={form.image} alt="Preview of your profile photo" /><div className="listing-upload-overlay"><ImagePlus size={17} /><span>{form.imageName || 'Replace photo'}</span></div></> : <div className="listing-upload-prompt">{isReadingImage ? <FileImage size={25} /> : <Upload size={25} />}<strong>{isReadingImage ? 'Reading your photo…' : 'Choose a profile photo'}</strong><span>One clear, recent image works best.</span></div>}</div>{errors.image && <p className="listing-error" id="listing-image-error"><AlertCircle size={14} />{errors.image}</p>}{!errors.image && <p className="listing-help" id="listing-image-help"><LockKeyhole size={13} />Your photo is stored in this browser for this first release.</p>}</div>
          <div className={`listing-field ${errors.about ? 'has-error' : ''}`}><label htmlFor="listing-about">About your practice <span>40–700 characters</span></label><textarea id="listing-about" value={form.about} onChange={event => updateField('about', event.target.value)} placeholder="What do you offer, and what can a first-time client expect?" rows={6} maxLength={700} aria-invalid={Boolean(errors.about)} aria-describedby={errors.about ? 'listing-about-error' : 'listing-about-help'} data-testid="input-listing-about" />{errors.about && <p className="listing-error" id="listing-about-error"><AlertCircle size={14} />{errors.about}</p>}{!errors.about && <p className="listing-help" id="listing-about-help"><ShieldCheck size={13} />Please keep it personal and specific. No booking links, website addresses, markup, or code.</p>}<span className="listing-character-count">{form.about.length}/700</span></div>
          <div className="listing-privacy-callout"><ShieldCheck size={18} /><div><strong>A quiet, careful review.</strong><p>We use your phone and email only to follow up about this listing. They are not published on your profile. We never ask for a password, payment, or a website link here.</p></div></div>
          <button className="button button-dark listing-submit" type="submit" disabled={isReadingImage} data-testid="button-submit-listing">Send for editorial review <ArrowRight size={16} /></button>
        </form>
        <aside className="listing-aside"><div className="listing-aside-card"><p className="eyebrow">What happens next</p><h2>Good work deserves a considered introduction.</h2><ol><li><span>1</span><div><strong>We read your note.</strong><p>A person on our editorial team reviews the details you share.</p></div></li><li><span>2</span><div><strong>We may reach out.</strong><p>We will use your private contact details if we need to clarify anything.</p></div></li><li><span>3</span><div><strong>Your listing finds its place.</strong><p>If it is a fit, your profile will appear alongside other independent professionals.</p></div></li></ol></div><div className="listing-aside-quote"><span>“</span><p>Certxa is for the people whose care is felt in the details.</p><small>— The Certxa editorial promise</small></div></aside>
      </div>
    </div>
  </main></Shell>;
}

function CategoryPage() {
  const { category = '' } = useParams<{ category: string }>();
  const meta = categoryMeta[category];
  const [city, setCity] = useState('');
  if (!meta) return <NotFound />;
  const results = businesses.filter(b => b.category === category && (!city || b.city.toLowerCase() === city.toLowerCase()));
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: meta.label, item: `${siteUrl}/category/${category}` }] };
  return <Shell><Seo title={`${meta.label} — Independent places on Certxa`} description={`${meta.copy} Explore trusted ${meta.label.toLowerCase()} in Denver, Austin, and Portland on Certxa.`} path={`/category/${category}`} jsonLd={schema} /><main className="landing-page"><div className="landing-hero"><Breadcrumbs items={[{ label: meta.label }]} /><p className="kicker"><span className="kicker-line" />{meta.eyebrow}</p><h1>{meta.label}<br /><em>with a point of view.</em></h1><p>{meta.copy}</p></div><div className="landing-content"><div className="landing-toolbar"><div><p className="eyebrow">The shortlist</p><h2>{placeCount(results.length)} to know</h2></div><div className="city-tabs"><button className={!city ? 'active' : ''} onClick={() => setCity('')} data-testid="button-category-all">All cities</button>{cities.map(c => <button key={c.slug} className={city === c.name ? 'active' : ''} onClick={() => setCity(c.name)} data-testid={`button-category-city-${c.slug}`}>{c.name}</button>)}</div></div><div className="results-grid">{results.map(b => <BusinessCard key={b.id} business={b} />)}</div></div></main></Shell>;
}

function CityPage() {
  const { city: citySlug = '' } = useParams<{ city: string }>();
  const city = cities.find(c => c.slug === citySlug);
  if (!city) return <NotFound />;
  const listings = businesses.filter(b => b.city.toLowerCase() === city.name.toLowerCase());
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: city.name, item: `${siteUrl}/city/${city.slug}` }] };
  return <Shell><Seo title={`${city.name} local guide — Certxa`} description={`Find trusted independent salons, studios, and practitioners in ${city.name}. Certxa's considered local guide to places worth visiting.`} path={`/city/${city.slug}`} jsonLd={schema} /><main className="landing-page city-page"><div className="landing-hero city-hero"><Breadcrumbs items={[{ label: city.name }]} /><p className="kicker"><span className="kicker-line" />The city guide</p><h1>Good places<br /><em>in {city.name}.</em></h1><p>{city.note}. A shortlist of independent businesses with care in the details.</p><div className="city-hero-stamp"><span>EST.</span><strong>2025</strong><small>CERTXA GUIDE</small></div></div><div className="landing-content"><div className="city-category-links"><p className="eyebrow">Browse {city.name} by category</p><div>{Object.entries(categoryLabels).filter(([key]) => listings.some(b => b.category === key)).map(([key, label]) => <Link key={key} href={`/search?city=${city.name}&category=${key}`} data-testid={`link-city-category-${key}`}>{label} <ArrowUpRightIcon /></Link>)}</div></div><div className="landing-toolbar"><div><p className="eyebrow">Selected for you</p><h2>{placeCount(listings.length)} worth knowing</h2></div></div><div className="results-grid">{listings.map(b => <BusinessCard key={b.id} business={b} />)}</div></div></main></Shell>;
}
function ArrowUpRightIcon() { return <ArrowRight size={15} />; }

function BusinessPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const business = businesses.find(b => b.slug === slug);
  if (!business) return <NotFound />;
  const schema = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: business.name, description: business.description, image: `${siteUrl}${business.image}`, telephone: business.phone, url: `${siteUrl}/business/${business.slug}`, address: { '@type': 'PostalAddress', streetAddress: business.address, addressLocality: business.city, addressCountry: 'US' }, aggregateRating: { '@type': 'AggregateRating', ratingValue: business.rating, reviewCount: business.reviewCount }, geo: { '@type': 'GeoCoordinates', latitude: business.coordinates.lat, longitude: business.coordinates.lng } };
  return <Shell><Seo title={`${business.name} — ${business.neighborhood}, ${business.city} | Certxa`} description={`${business.tagline} ${business.name} in ${business.neighborhood}, ${business.city}. See services, hours, reviews, and contact details on Certxa.`} path={`/business/${business.slug}`} jsonLd={[schema, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: categoryLabels[business.category], item: `${siteUrl}/category/${business.category}` }, { '@type': 'ListItem', position: 3, name: business.name, item: `${siteUrl}/business/${business.slug}` }] }]} /><main className="profile-page"><div className="profile-wrap"><Breadcrumbs items={[{ label: categoryLabels[business.category], href: `/category/${business.category}` }, { label: business.name }]} /><div className="profile-top"><div className="profile-photo"><img src={business.image} alt={`${business.name} interior`} width="1000" height="750" /><span className="verified-badge"><ShieldCheck size={14} /> Certxa verified</span></div><div className="profile-intro"><p className="eyebrow">{business.neighborhood} · {business.city} · {categoryLabels[business.category]}</p><div className="profile-title-row"><h1>{business.name}</h1><SaveButton business={business} /></div><p className="profile-tagline">{business.tagline}</p><Rating business={business} large /><div className="profile-actions"><a href={`tel:${business.phone.replace(/\D/g, '')}`} className="button button-dark" data-testid="button-call-business"><Phone size={16} /> Call {business.name}</a><a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-outline" data-testid="button-visit-business">Visit website <ExternalLink size={15} /></a></div><p className="profile-note"><CircleCheck size={16} /> A place we’d recommend to a friend.</p></div></div><div className="profile-grid"><div className="profile-main"><section className="profile-section"><p className="eyebrow">Why go</p><h2>The short version</h2><p className="body-large">{business.description}</p><div className="profile-tags">{business.tags.map(tag => <span key={tag}><Check size={14} />{tag}</span>)}</div></section><section className="profile-section"><p className="eyebrow">Services</p><h2>What they do</h2><ul className="service-list">{business.services.map((service, index) => <li key={service}><span>0{index + 1}</span><strong>{service}</strong><ArrowRight size={16} /></li>)}</ul></section><section className="profile-section review-section"><p className="eyebrow">The word on the street</p><h2>{business.rating} out of 5, locally loved.</h2><div className="quote-card"><div className="quote-mark">“</div><blockquote>Thoughtful, talented, and exactly the kind of independent place I want to keep in my neighborhood.</blockquote><cite>— A Certxa editor</cite></div></section></div><aside className="profile-aside"><div className="aside-card"><div className="aside-card-head"><Clock3 size={18} /><h3>Hours</h3></div>{business.hours.map(hour => <p key={hour}>{hour}</p>)}</div><div className="aside-card"><div className="aside-card-head"><MapPin size={18} /><h3>Find it</h3></div><p>{business.address}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="aside-link" data-testid="link-get-directions">Get directions <ArrowRight size={15} /></a><div className="map-placeholder"><LocateFixed size={22} /><span>{business.coordinates.lat.toFixed(3)}° N<br />{Math.abs(business.coordinates.lng).toFixed(3)}° W</span></div></div><div className="aside-card contact-card"><div className="aside-card-head"><Send size={18} /><h3>Say hello</h3></div><p>Questions are welcome. Reach out before your visit.</p><a href={`mailto:hello@${business.slug.split('-')[0]}.example.com`} className="aside-link" data-testid="link-email-business">Email the studio <ArrowRight size={15} /></a></div></aside></div></div></main></Shell>;
}

function NotFound() {
  return <Shell><main className="not-found"><Compass size={34} /><p className="eyebrow">A wrong turn</p><h1>That place isn’t<br /><em>on the map.</em></h1><p>We couldn’t find the page you were looking for. Let’s get you back to the good stuff.</p><Link href="/" className="button button-dark" data-testid="link-not-found-home">Back to the guide <ArrowRight size={16} /></Link></main></Shell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/search" component={SearchPage} /><Route path="/professionals/list" component={ProfessionalListingPage} /><Route path="/professionals" component={ProfessionalsPage} /><Route path="/category/:category" component={CategoryPage} /><Route path="/city/:city" component={CityPage} /><Route path="/business/:slug" component={BusinessPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;