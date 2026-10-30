import { ImageResponse } from 'next/og';
import { getBusinessForOg } from '@/lib/ogBusiness';
import { loadGoogleFont } from '@/lib/ogFont';

/* The "share poster" -- what shows up as the link preview thumbnail when a vendor's page URL is
   pasted into WhatsApp/Instagram/iMessage/etc, the same way a reel shows its video frame. Next
   wires this file's output into the business page's og:image (and, via `twitter-image.jsx`
   re-exporting it, twitter:image) automatically -- see opengraph-image.md in the vendored Next
   docs. Rendered with Satori (`ImageResponse`), which only understands inline flexbox styles, no
   Tailwind classes or CSS variables, so every colour below is a literal hex pulled from the same
   design tokens as globals.css (kept in sync by eye, not by import -- Satori can't read @theme). */

export const alt = 'SocietySpot business card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const EMERALD = '#11543b';
const EMERALD_DARK = '#072a1d';
const BRASS = '#d2ae62';
const BRASS_TEXT = '#2a1e04';
const IVORY = '#faf8f2';

export default async function Image({ params }) {
  const { id } = await params;
  const business = await getBusinessForOg(id);

  const name = business?.name || 'SocietySpot';
  const categoryName = business?.cat?.name || '';
  const societyLine = business ? `${business.area} · ${business.society.name}` : 'Trusted local businesses';
  const imageUrl = business?.imageUrl;
  const isTopPick = business?.rank && business.rank <= 10;

  const manropeBoldText =
    'SocietySpot' + categoryName + (isTopPick ? `Top ${business.rank} pick this month` : '') + (business?.verified ? 'Verified' : '');

  /* Google Fonts is a live network call at request time -- if it's slow or unreachable, a
     broken/missing share poster is worse than one rendered in next/og's own bundled fallback
     font, so a font-load failure leaves `fonts` undefined (NOT an empty array -- next/og only
     falls back to its bundled default when the option is omitted/undefined; `[]` is truthy and
     would leave Satori with no font at all, which throws) instead of failing the whole image. */
  let fonts;
  let titleFontFamily = 'sans-serif';
  let bodyFontFamily = 'sans-serif';
  try {
    const [fraunces700, manrope700, manrope500] = await Promise.all([
      loadGoogleFont('Fraunces', 700, name + 'S'),
      loadGoogleFont('Manrope', 700, manropeBoldText),
      loadGoogleFont('Manrope', 500, societyLine)
    ]);
    fonts = [
      { name: 'Fraunces', data: fraunces700, weight: 700, style: 'normal' },
      { name: 'Manrope', data: manrope700, weight: 700, style: 'normal' },
      { name: 'Manrope', data: manrope500, weight: 500, style: 'normal' }
    ];
    titleFontFamily = 'Fraunces';
    bodyFontFamily = 'Manrope';
  } catch {
    /* Fall through with the generic family names set above. */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: EMERALD_DARK,
          fontFamily: bodyFontFamily
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            width={1200}
            height={630}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {/* Legibility scrim: near-opaque at the bottom where the text sits, clear near the top. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `linear-gradient(180deg, ${EMERALD_DARK}00 0%, ${EMERALD_DARK}1a 35%, ${EMERALD_DARK}e6 78%, ${EMERALD_DARK} 100%)`
          }}
        />

        {/* Brand mark, top-left */}
        <div style={{ position: 'absolute', top: 44, left: 48, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: IVORY,
              fontFamily: titleFontFamily,
              fontSize: 32,
              fontWeight: 700,
              color: EMERALD
            }}
          >
            S
          </div>
          <span style={{ fontSize: 30, fontWeight: 700, color: IVORY, letterSpacing: -0.5 }}>SocietySpot</span>
        </div>

        {/* Category pill, top-right */}
        {categoryName && (
          <div
            style={{
              position: 'absolute',
              top: 48,
              right: 48,
              display: 'flex',
              alignItems: 'center',
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: BRASS,
              color: BRASS_TEXT,
              fontSize: 24,
              fontWeight: 700
            }}
          >
            {categoryName}
          </div>
        )}

        {/* Bottom content block */}
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 44, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(isTopPick || business?.verified) && (
            <div style={{ display: 'flex', gap: 12 }}>
              {isTopPick && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 18px', borderRadius: 999, backgroundColor: BRASS, color: BRASS_TEXT, fontSize: 20, fontWeight: 700 }}>
                  Top {business.rank} pick this month
                </div>
              )}
              {business?.verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', color: IVORY, fontSize: 20, fontWeight: 700 }}>
                  {/* A plain coloured dot instead of a "✓" character -- a Unicode glyph the
                      fallback font (used if the Google Fonts request below fails) doesn't carry
                      would render as a tofu box instead of silently just not being there. */}
                  <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#8fd9b6', display: 'flex' }} />
                  Verified
                </div>
              )}
            </div>
          )}
          <span style={{ fontFamily: titleFontFamily, fontSize: 72, fontWeight: 700, color: IVORY, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }}>
            {name}
          </span>
          <span style={{ fontSize: 30, fontWeight: 500, color: 'rgba(250,248,242,0.85)' }}>{societyLine}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts
    }
  );
}
