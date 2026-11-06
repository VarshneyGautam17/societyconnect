'use client';

import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import MobileTabBar from './MobileTabBar';
import AccessGate from './AccessGate';
import SocietyAutoDetect from './SocietyAutoDetect';

const GATE_ENABLED = process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED === 'true';

/** Shared chrome for the resident-facing pages (home, societies, directory, business detail).
 *  AccessGate renders on top of all of these until a visitor enters a mobile number -- it's
 *  scoped here (not globally) so vendor/admin flows (onboarding, edit, dashboard, /admin) are
 *  never gated.
 *
 *  `children` is only rendered once `unlocked` is true (verified against the real session by
 *  Providers on load, and flipped back to false server-and-client by signOutResident). Before
 *  this, swapping the gate out for an empty <main> instead of still mounting the real page behind
 *  it meant the page's content, images and data never entered the DOM or ran its data fetches --
 *  so unlike an overlay, there's nothing left to reveal by inspecting the gate element and
 *  setting it to display:none. */
export default function SiteShell({ active, children }) {
  const unlocked = useSelector((state) => state.access.unlocked);
  const locked = GATE_ENABLED && !unlocked;

  return (
    <div className="flex flex-col min-h-screen">
      <Header active={active} />
      <main className="flex-1">{locked ? null : children}</main>
      <Footer tabBarSpace />
      <MobileTabBar active={active} />
      <AccessGate />
      <SocietyAutoDetect />
    </div>
  );
}
