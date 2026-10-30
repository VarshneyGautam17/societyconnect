/** Fetches a Google Font as raw TTF bytes for next/og's `ImageResponse` (via Satori), which
 *  needs real font binary data -- it can't load a font by stylesheet URL the way a browser page
 *  can. Google's css2 endpoint serves woff2 to modern user agents and Satori only accepts
 *  ttf/otf/woff, so the request is made with an old Chrome user agent that Google still serves
 *  ttf to -- the same trick Satori's own Google-fonts example uses. `text` scopes the request to
 *  only the glyphs actually needed, which keeps it fast. */
export async function loadGoogleFont(family, weight, text) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    }
  }).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not resolve a font file for ${family}.`);

  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Could not download font file for ${family}.`);
  return res.arrayBuffer();
}
