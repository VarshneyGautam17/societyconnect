'use client';

import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllBusinesses } from '@/store/selectors';
import { setSociety } from '@/store/slices/societySlice';
import { socOf } from '@/data/societies';
import { catOf } from '@/data/categories';
import SiteShell from '@/components/layout/SiteShell';
import Hero from '@/components/home/Hero';
import BusinessesSection from '@/components/home/BusinessesSection';
import PicksRow from '@/components/home/PicksRow';
import OffersSection from '@/components/home/OffersSection';
import HowItWorks from '@/components/home/HowItWorks';
import VendorCTA from '@/components/home/VendorCTA';

const PAGE = 8;

export default function HomePage() {
  const dispatch = useDispatch();
  const societyId = useSelector((state) => state.society.selectedId);
  const allBusinesses = useSelector(selectAllBusinesses);

  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const [locateMsg, setLocateMsg] = useState('Prefer not to share? Just pick your society above.');

  const soc = socOf(societyId);
  const inSociety = useMemo(() => allBusinesses.filter((b) => b.society === soc.id), [allBusinesses, soc.id]);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inSociety.filter((b) => {
      if (cat !== 'all' && b.cat !== cat) return false;
      if (!q) return true;
      return (b.name + ' ' + b.desc + ' ' + catOf(b.cat).name).toLowerCase().includes(q);
    });
  }, [inSociety, cat, query]);

  function onSocietyChange(id) {
    dispatch(setSociety(id));
    setShown(PAGE);
  }
  function onSubmit(e) {
    e.preventDefault();
    setShown(PAGE);
    document.getElementById('businesses')?.scrollIntoView({ behavior: 'smooth' });
  }
  function onCatChange(id) {
    setCat(id);
    setShown(PAGE);
  }
  function onLocate() {
    if (!navigator.geolocation) {
      setLocateMsg('Location is not available here. Pick your society from the list.');
      return;
    }
    setLocateMsg('Checking your approximate location...');
    navigator.geolocation.getCurrentPosition(
      () => setLocateMsg('Location found. Confirm your society in the list to see exact results.'),
      () => setLocateMsg('Location blocked. No problem, pick your society from the list.'),
      { timeout: 8000 }
    );
  }

  return (
    <SiteShell active="home">
      <Hero
        societyId={societyId}
        onSocietyChange={onSocietyChange}
        query={query}
        onQueryChange={setQuery}
        onSubmit={onSubmit}
        locateMsg={locateMsg}
        onLocate={onLocate}
        heroSociety={soc.name}
        heroCount={`${inSociety.length} listed`}
      />
      <BusinessesSection
        societyId={societyId}
        list={list}
        cat={cat}
        onCatChange={onCatChange}
        shown={shown}
        onLoadMore={() => setShown((s) => s + PAGE)}
      />
      <PicksRow />
      <OffersSection />
      <HowItWorks />
      <VendorCTA />
    </SiteShell>
  );
}
