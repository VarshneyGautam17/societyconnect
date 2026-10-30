/* Twitter/X reads `twitter:image` instead of falling back to `og:image` for its card preview, so
   this re-exports the same generated poster under the convention it looks for -- see
   opengraph-image.jsx for the actual rendering. */
export { default, alt, size, contentType } from './opengraph-image';
