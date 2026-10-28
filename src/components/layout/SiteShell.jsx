import Header from './Header';
import Footer from './Footer';
import MobileTabBar from './MobileTabBar';

/** Shared chrome for the resident-facing pages (home, societies, directory, business detail). */
export default function SiteShell({ active, children }) {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Header active={active} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileTabBar active={active} />
    </div>
  );
}
