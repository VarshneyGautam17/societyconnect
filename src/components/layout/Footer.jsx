import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/** `tabBarSpace`: pages with the fixed MobileTabBar pass this so the room it needs below the last
 *  footer row is footer-colored padding, not a page-background strip -- the tab bar hides on
 *  scroll-down, and a strip would then show as an odd empty gap under the footer. */
export default function Footer({ tabBarSpace = false }) {
  return (
    <footer className={`bg-surface-container border-t border-outline-variant/40 mt-auto ${tabBarSpace ? 'pb-14 md:pb-0' : ''}`}>
      <div className="w-full py-6 md:py-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5 md:gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-2.5 md:mb-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <Icon name="pin" className="text-sm" filled />
            </div>
            <span className="font-headline-sm text-label-lg md:text-headline-sm font-bold text-on-surface">SocietySpot</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 md:mb-4">
            Built for trusted residential gated communities across India. A hyperlocal marketplace connecting neighbors.
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span>Verified Society Protocol Active</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-8">
          <div>
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface mb-3">Directory</h4>
            <ul className="space-y-2 font-body-sm text-body-sm">
              <li><Link href="/directory" className="text-on-surface-variant hover:text-primary transition-colors">Browse categories</Link></li>
              <li><Link href="/societies" className="text-on-surface-variant hover:text-primary transition-colors">Explore societies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface mb-3">Safety &amp; Rules</h4>
            <ul className="space-y-2 font-body-sm text-body-sm">
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Resident guidelines</a></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Vendor terms &amp; security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface mb-3">Support</h4>
            <ul className="space-y-2 font-body-sm text-body-sm">
              <li><Link href="/onboarding" className="text-on-surface-variant hover:text-primary transition-colors">For businesses</Link></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Help and FAQs</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
