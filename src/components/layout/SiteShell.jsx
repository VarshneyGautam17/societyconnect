import Header from './Header';
import Footer from './Footer';
import MobileTabBar from './MobileTabBar';
import AccessGate from './AccessGate';

/** Shared chrome for the resident-facing pages (home, societies, directory, business detail).
 *  AccessGate renders on top of all of these until a visitor enters a mobile number -- it's
 *  scoped here (not globally) so vendor/admin flows (onboarding, edit, dashboard, /admin) are
 *  never gated. */
export default function SiteShell({ active, children }) {
  return (
    <div className="flex flex-col min-h-screen pb-14 md:pb-0">
      <Header active={active} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileTabBar active={active} />
      <AccessGate />
    </div>
  );
}
