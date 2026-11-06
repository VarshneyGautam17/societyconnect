/* Signed-in-only vendor screen -- see src/app/dashboard/layout.js for why this is noindex on top
   of the robots.txt disallow. */
export const metadata = {
  robots: { index: false, follow: false }
};

export default function EditLayout({ children }) {
  return children;
}
