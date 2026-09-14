import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useMemo, useState, type ElementType, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import {
  ArrowRight, Bookmark, BookmarkCheck, Check, ChevronDown, ChevronRight, CircleCheck,
  Clock3, Compass, Dumbbell, ExternalLink, Hand, Leaf, ListFilter, LocateFixed,
  MapPin, Menu, Phone, Search, Scissors, Send, ShieldCheck, Sparkles, Star,
  SunMedium, Waves, X,
} from 'lucide-react';
import { businesses, categoryLabels, categoryMeta, cities, type Business } from '@/lib/data';

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
        <Link href="/" className="brand" data-testid="link-logo"><span className="brand-mark"><Compass size={17} /></span><span>certxa</span></Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link href="/search" className={location === '/search' ? 'active' : ''} data-testid="link-discover">Discover</Link>
          <Link href="/city/denver" className={location.includes('/city') ? 'active' : ''} data-testid="link-cities">Cities</Link>
          <Link href="/category/wellness" className={location.includes('/category') ? 'active' : ''} data-testid="link-categories">Categories</Link>
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
      <div><p className="footer-label">Explore</p><Link href="/search" data-testid="link-footer-all-places">All places</Link><Link href="/category/salons" data-testid="link-footer-salons">Salons</Link><Link href="/category/fitness" data-testid="link-footer-fitness">Fitness</Link></div>
      <div><p className="footer-label">Cities</p>{cities.map(city => <Link key={city.slug} href={`/city/${city.slug}`} data-testid={`link-footer-city-${city.slug}`}>{city.name}</Link>)}</div>
      <div><p className="footer-label">For owners</p><a href="mailto:hello@certxa.com" data-testid="link-list-place">List your place</a><a href="mailto:hello@certxa.com" data-testid="link-editorial-standards">Editorial standards</a></div>
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
       <section className="home-hero"><div className="hero-backdrop" aria-hidden="true" /><div className="hero-overlay" aria-hidden="true" /><div className="hero-content"><p className="kicker"><span className="kicker-line" />The local guide for good days</p><h1>Find your next<br /><em>great day.</em></h1><p className="hero-summary">Discover independent salons, studios, and practitioners worth making time for.</p><SearchBar /><div className="hero-pills" aria-label="Browse by service">{Object.entries(categoryMeta).map(([key, meta]) => <Link key={key} href={`/category/${key}`} data-testid={`link-hero-category-${key}`}>{meta.label}</Link>)}<Link href="/search" data-testid="link-hero-more">More <ChevronRight size={13} /></Link></div></div></section>
      <section className="section shell-section category-section"><div className="section-head"><div><p className="eyebrow">Start somewhere good</p><h2>What are you in the mood for?</h2></div><Link href="/search" className="text-link" data-testid="link-browse-all">Browse all places <ArrowRight size={15} /></Link></div><div className="category-grid">{Object.entries(categoryMeta).map(([key, meta]) => <Link href={`/category/${key}`} className="category-tile" key={key} data-testid={`link-category-${key}`}><span className="category-icon"><IconFor name={meta.icon} /></span><span><strong>{meta.label}</strong><small>{placeCount(businesses.filter(b => b.category === key).length)}</small></span><ArrowRight className="tile-arrow" size={16} /></Link>)}</div></section>
      <section className="section featured-section"><div className="section-head"><div><p className="eyebrow">On our radar</p><h2>Places we’d tell a friend about.</h2></div><span className="section-aside">A few especially good finds <span className="accent-dot" /></span></div><div className="featured-grid">{featured.map(b => <BusinessCard key={b.id} business={b} />)}</div></section>
      <section className="city-band"><div className="city-band-inner"><div><p className="eyebrow">The guide, by city</p><h2>Local looks different<br /><em>everywhere.</em></h2><p>Small businesses are the texture of a city. Start with one neighborhood and see where it leads.</p></div><div className="city-list">{cities.map((city, index) => <Link href={`/city/${city.slug}`} key={city.slug} className="city-row" data-testid={`link-city-${city.slug}`}><span className="city-index">0{index + 1}</span><span><strong>{city.name}</strong><small>{city.note}</small></span><ArrowRight size={18} /></Link>)}</div></div></section>
      <section className="section journal-section"><div className="journal-mark">A note from<br /><em>the guide</em></div><div className="journal-copy"><p className="eyebrow">Why Certxa exists</p><h2>The best local places<br />usually have a story.</h2><p>Not every place needs to be the loudest, newest, or most booked. We look for the ones with care in the details: the practitioner who remembers your name, the room that lets you exhale, the owner who has stayed curious.</p><Link href="/search" className="button button-outline" data-testid="button-read-guide">Explore the guide <ArrowRight size={16} /></Link></div><div className="journal-stat"><strong>12</strong><span>independent places<br />to start with</span></div></section>
    </main>
  </Shell>;
}

function FilterPill({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) { return <button className={`filter-pill ${active ? 'active' : ''}`} onClick={onClick} data-testid={`button-filter-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}{active && <X size={13} />}</button>; }

function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1] || '');
  const initialQ = query.get('q') || '';
  const initialCity = query.get('city') || '';
  const [q, setQ] = useState(initialQ);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(query.get('category') || '');
  const [sort, setSort] = useState('recommended');
  const [savedOnly, setSavedOnly] = useState(query.get('view') === 'saved');
  const filtered = useMemo(() => {
    const saved: number[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('certxa-saved') || '[]') : [];
    const results = businesses.filter(b => (!q || `${b.name} ${b.category} ${b.neighborhood} ${b.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) && (!city || b.city.toLowerCase() === city.toLowerCase()) && (!category || b.category === category) && (!savedOnly || saved.includes(b.id)));
    return [...results].sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'reviews' ? b.reviewCount - a.reviewCount : Number(b.featured) - Number(a.featured));
  }, [q, city, category, sort, savedOnly]);
  const clear = () => { setQ(''); setCity(''); setCategory(''); setSavedOnly(false); };
  return <Shell><Seo title={`${q || 'Discover local places'} — Certxa`} description={`Browse trusted independent ${q ? `${q} ` : ''}places in Denver, Austin, and Portland. Compare ratings, services, and local details on Certxa.`} path={`/search${location.includes('?') ? `?${location.split('?')[1]}` : ''}`} />
    <main className="directory-page"><div className="directory-top"><Breadcrumbs items={[{ label: 'Discover' }]} /><p className="eyebrow">The Certxa directory</p><h1>Find your next<br /><em>good place.</em></h1><p className="directory-dek">Search the independent places we’d happily send a friend to.</p><form className="directory-search" onSubmit={e => e.preventDefault()}><Search size={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, service, or neighborhood" aria-label="Search directory" data-testid="input-directory-search" /><button type="submit" data-testid="button-directory-search">Search</button></form></div>
      <div className="directory-layout"><aside className="filter-sidebar"><div className="filter-header"><strong>Refine your search</strong><ListFilter size={17} /></div><div className="filter-group"><label>City</label>{cities.map(c => <button key={c.slug} className={`filter-option ${city === c.name ? 'selected' : ''}`} onClick={() => setCity(city === c.name ? '' : c.name)} data-testid={`button-city-filter-${c.slug}`}><span className="check-box">{city === c.name && <Check size={12} />}</span>{c.name}<small>{c.count}</small></button>)}</div><div className="filter-group"><label>Category</label>{Object.entries(categoryLabels).map(([key, label]) => <button key={key} className={`filter-option ${category === key ? 'selected' : ''}`} onClick={() => setCategory(category === key ? '' : key)} data-testid={`button-category-filter-${key}`}><span className="check-box">{category === key && <Check size={12} />}</span>{label}<small>{businesses.filter(b => b.category === key).length}</small></button>)}</div><button className={`saved-toggle ${savedOnly ? 'selected' : ''}`} onClick={() => setSavedOnly(!savedOnly)} data-testid="button-show-saved"><Bookmark size={16} /> Show saved places</button>{(q || city || category || savedOnly) && <button className="clear-filters" onClick={clear} data-testid="button-clear-filters">Clear all filters</button>}</aside>
        <section className="results-section"><div className="results-toolbar"><div><p className="result-count">{filtered.length} {filtered.length === 1 ? 'place' : 'places'} found</p><div className="active-filters">{q && <FilterPill label={`“${q}”`} active onClick={() => setQ('')} />}{city && <FilterPill label={city} active onClick={() => setCity('')} />}{category && <FilterPill label={categoryLabels[category]} active onClick={() => setCategory('')} />}</div></div><label className="sort-select">Sort by <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort results" data-testid="select-sort-results"><option value="recommended">Recommended</option><option value="rating">Highest rated</option><option value="reviews">Most reviewed</option></select><ChevronDown size={14} /></label></div>{filtered.length ? <div className="results-grid">{filtered.map(b => <BusinessCard key={b.id} business={b} />)}</div> : <div className="empty-state"><div className="empty-icon"><Compass size={24} /></div><h2>No places match that yet.</h2><p>Try a broader search or clear a filter. There are good places out there.</p><button className="button button-outline" onClick={clear} data-testid="button-empty-clear">Clear search</button></div>}</section></div>
    </main>
  </Shell>;
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
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/search" component={SearchPage} /><Route path="/category/:category" component={CategoryPage} /><Route path="/city/:city" component={CityPage} /><Route path="/business/:slug" component={BusinessPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;