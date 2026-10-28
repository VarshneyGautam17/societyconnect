import { ICONS } from '@/lib/icons';

/** A Material Symbols glyph. `name` can be a short alias from ICONS (e.g. "heart") or a raw
 *  Material Symbol name (e.g. a category's own `micon`, like "restaurant"). */
export default function Icon({ name, className = 'text-base', filled = false, ...rest }) {
  const glyph = ICONS[name] || name;
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      {...rest}
    >
      {glyph}
    </span>
  );
}
