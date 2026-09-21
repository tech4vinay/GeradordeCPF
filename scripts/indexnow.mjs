// Pings Bing/Yandex/Seznam after each deploy so they pick up changes without
// waiting for their own crawl schedule. Google ignores IndexNow, so this is on
// top of (not instead of) the sitemap. Never fails the deploy: the site is
// already live once wrangler finishes, this is a best-effort notification.
import { readFileSync } from 'node:fs';

const KEY = '0ab69fcdac9d3ea6790a2b3756c5567a'; // must match public/<KEY>.txt
const HOST = 'cpfaleatorio.com';

try {
  const sitemap = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
  const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });

  console.log(
    res.ok
      ? `IndexNow: submitted ${urlList.length} URLs`
      : `IndexNow: ${res.status} ${await res.text()}`,
  );
} catch (err) {
  console.warn(`IndexNow: skipped (${err.message})`);
}
