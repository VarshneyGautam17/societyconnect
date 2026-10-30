/** Fetches a Google Font as raw font bytes for next/og's `ImageResponse` (via Satori), which
 *  needs real font binary data -- it can't load a font by stylesheet URL the way a browser page
 *  can. Google's css2 endpoint serves woff2 to modern user agents and Satori only accepts
 *  ttf/otf/woff (not woff2), so the request pretends to be a browser old enough that Google
 *  still serves it one of those -- an old Android browser UA reliably gets truetype as of this
 *  writing. (An older trick here used a "Chrome/51" desktop UA, which stopped working at some
 *  point -- Google started serving it woff2 too -- so the format match below also accepts woff
 *  as a second fallback in case Google's UA-sniffing shifts again.) `text` scopes the request to
 *  only the glyphs actually needed, which keeps it fast. */
export async function loadGoogleFont(family, weight, text) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Nexus S Build/JRO03E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    }
  }).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype|woff)'\)/);
  if (!match) throw new Error(`Could not resolve a font file for ${family}.`);

  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Could not download font file for ${family}.`);
  return res.arrayBuffer();
}
