import { catOf } from '@/data/categories';

/** Small rounded initial tile, used for picks rows, avatars and logo slots.
 *  Pass a size class, e.g. "w-12 h-12 text-xl rounded-2xl". */
export default function MonoTile({ business, className = 'w-12 h-12 text-xl rounded-2xl' }) {
  const c = catOf(business.cat);
  return (
    <span
      className={`font-bold flex items-center justify-center flex-none ${className}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {business.name.charAt(0)}
    </span>
  );
}
