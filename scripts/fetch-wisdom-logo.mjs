/**
 * One-off: fetch Wisdom Warehouse logo from their site and save to public/logos/wisdom-warehouse.png
 * Run: node scripts/fetch-wisdom-logo.mjs
 */
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const outPath = path.join(repoRoot, 'public', 'logos', 'wisdom-warehouse.png');

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
    }).on('error', reject);
  });
}

async function main() {
  const base = 'https://wisdomwarehouseuae.com';
  const pageUrl = base + '/';
  console.log('Fetching', pageUrl);
  const { status, body } = await get(pageUrl);
  if (status !== 200) {
    console.error('Page fetch failed:', status);
    process.exit(1);
  }
  const html = body.toString();
  // Match src="...logo..." or wp-content/uploads/... (any image)
  const urlMatches = html.match(/https?:\/\/[^"'\s>]+(?:wp-content\/uploads[^"'\s>]+\.(?:png|jpg|jpeg|svg|webp)|[^"'\s>]*[Ll]ogo[^"'\s>]*\.(?:png|jpg|jpeg|svg|webp))/g);
  let urls = [...new Set(urlMatches || [])].filter((u) => !u.includes('gravatar') && !u.includes('emoji'));
  if (urls.length === 0) {
    const relMatches = html.match(/["'](\/wp-content\/uploads\/[^"'\s]+\.(?:png|jpg|jpeg|svg|webp))["']/g);
    if (relMatches) {
      relMatches.forEach((m) => {
        const p = m.slice(1, -1);
        if (!p.includes('gravatar')) urls.push(base + p);
      });
    }
  }
  // Prefer URLs that contain "Logo" (actual logo) over "Header" or "Mobile" (hero images)
  const logoFirst = (a, b) => {
    const aLogo = /Logo|logo/.test(a) && !/Header|Mobile|Hero/.test(a);
    const bLogo = /Logo|logo/.test(b) && !/Header|Mobile|Hero/.test(b);
    if (aLogo && !bLogo) return -1;
    if (!aLogo && bLogo) return 1;
    return 0;
  };
  urls.sort(logoFirst);
  // Prefer Light (white background) over Dark (black background)
  const knownLogoPathsLightFirst = [
    base + '/wp-content/uploads/2025/08/Wisdom-Warehouse-Logo-1000_Light.png',
    base + '/wp-content/uploads/2025/09/Wisdom-Warehouse-Logo-1000_Light.png',
    base + '/wp-content/uploads/2025/08/Wisdom-Warehouse-Logo.png',
    base + '/wp-content/uploads/2025/09/Wisdom-Warehouse-Logo.png',
    base + '/wp-content/uploads/2025/01/Wisdom-Warehouse-Logo.png',
    base + '/wp-content/uploads/2024/12/Wisdom-Warehouse-Logo.png',
    base + '/wp-content/uploads/2025/08/Wisdom-Warehouse-Logo-1000_Dark.png', // fallback
  ];
  // Sort page URLs: prefer Light over Dark
  urls.sort((a, b) => {
    const aLight = /Light|light/.test(a);
    const bLight = /Light|light/.test(b);
    if (aLight && !bLight) return -1;
    if (!aLight && bLight) return 1;
    if (/Dark|dark/.test(a) && !/Dark|dark/.test(b)) return 1;
    if (!/Dark|dark/.test(a) && /Dark|dark/.test(b)) return -1;
    return 0;
  });
  const toTry = [...knownLogoPathsLightFirst, ...urls];
  for (const url of toTry) {
    const fullUrl = url.startsWith('http') ? url : base + url;
    console.log('Trying', fullUrl);
    const res = await get(fullUrl);
    if (res.status === 200 && res.body.length > 100) {
      const ct = (res.headers['content-type'] || '').toLowerCase();
      if (ct.includes('image') || /\.(png|jpg|jpeg|svg|webp)$/i.test(fullUrl)) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, res.body);
        console.log('Saved to', outPath, res.body.length, 'bytes');
        process.exit(0);
      }
    }
  }
  console.error('Could not download logo from any URL');
  process.exit(1);
}

main();
