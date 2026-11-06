/* Wraps both /admin/login and the /admin/(protected)/* group, so this one file keeps the whole
   admin surface out of search results -- also covered by the robots.txt disallow
   (src/app/robots.js); this is the belt-and-suspenders noindex for a crawler that reaches a URL
   under here some other way. */
export const metadata = {
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }) {
  return children;
}
