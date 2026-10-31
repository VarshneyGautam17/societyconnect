'use client';

import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllBusinesses, selectListingsLoading } from '@/store/selectors';
import { setSociety } from '@/store/slices/societySlice';
import { socOf } from '@/data/societies';
import { useSocieties } from '@/lib/societies';
import { catOf } from '@/data/categories';
import { useSocietyLocator } from '@/lib/useSocietyLocator';
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
  const loading = useSelector(selectListingsLoading);
  const societies = useSocieties();

  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const { message: locateMsg, locate } = useSocietyLocator('Prefer not to share? Just pick your society above.');

  /* No society chosen yet (or it no longer exists): show every listing instead of none. */
  const hasSociety = societies.some((s) => s.id === societyId);
  const soc = socOf(societyId, societies);
  const inSociety = useMemo(
    () => (hasSociety ? allBusinesses.filter((b) => b.society === soc.id || b.served?.includes(soc.id)) : allBusinesses),
    [allBusinesses, hasSociety, soc.id]
  );
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
  async function onLocate() {
    await locate();
    setShown(PAGE);
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
        heroSociety={hasSociety ? soc.name : 'Not chosen yet'}
        heroCount={hasSociety ? inSociety.length : null}
      />
      <BusinessesSection
        title={hasSociety ? `Businesses in ${soc.name.replace(' Habitat', '')}` : 'Businesses on SocietySpot'}
        loading={loading}
        list={list}
        cat={cat}
        onCatChange={onCatChange}
        shown={shown}
        onLoadMore={() => setShown((s) => s + PAGE)}
      />
      <PicksRow businesses={allBusinesses} />
      <OffersSection businesses={allBusinesses} />
      <HowItWorks />
      <VendorCTA />
    </SiteShell>
  );
}
