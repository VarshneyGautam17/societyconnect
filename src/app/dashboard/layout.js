/* Signed-in-only vendor screen, no content without a session. robots.txt already disallows
   crawling this path (see src/app/robots.js) -- this is the belt-and-suspenders version: a
   noindex meta tag covers a crawler that reaches the URL some other way (an external link, a
   browser history leak, etc.) despite the disallow. */
export const metadata = {
  robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }) {
  return children;
}
