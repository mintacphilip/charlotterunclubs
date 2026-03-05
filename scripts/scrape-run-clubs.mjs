import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const SOURCE_URL = 'https://www.charlotterunningclub.org/Run-Clubs';
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'data', 'run-clubs.json');

function cleanText(value) {
  return (value || '').replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim();
}

function normalizeKey(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function clubSignature(club) {
  return [club.name, club.day, club.time, club.location].map(normalizeKey).join('|');
}

function parseRunClubs(html) {
  const $ = load(html);
  const rows = [];

  $('table tr').each((_, tr) => {
    const crossedOut = $(tr).find('s, strike, del, [style*="line-through"]').length > 0;
    if (crossedOut) return;

    const cells = $(tr)
      .find('td')
      .map((__, td) => cleanText($(td).text()))
      .get();

    if (cells.length < 4) return;

    const [day, name, location, time] = cells;
    if (!day || !name || !location || !time) return;
    if (day.toLowerCase() === 'day' || name.toLowerCase() === 'club name') return;

    const links = $(tr)
      .find('td:last-child a')
      .map((__, a) => {
        const label = cleanText($(a).text());
        const url = $(a).attr('href');
        if (!label || !url) return null;
        return { label, url };
      })
      .get()
      .filter(Boolean);

    rows.push({
      id: `${day}-${name}-${time}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      day,
      name,
      location,
      time,
      links,
    });
  });

  return rows;
}

function calculateChanges(previousClubs, nextClubs) {
  const previousBySig = new Map(previousClubs.map((club) => [clubSignature(club), club]));
  const nextBySig = new Map(nextClubs.map((club) => [clubSignature(club), club]));

  const added = nextClubs.filter((club) => !previousBySig.has(clubSignature(club)));
  const removed = previousClubs.filter((club) => !nextBySig.has(clubSignature(club)));

  return { added, removed };
}

function readPreviousClubs() {
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.clubs) ? parsed.clubs : [];
  } catch {
    return [];
  }
}

async function run() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (RunClubsGithubAction/1.0)',
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const clubs = parseRunClubs(html);
  const previousClubs = readPreviousClubs();

  const payload = {
    source: SOURCE_URL,
    fetchedAt: new Date().toISOString(),
    count: clubs.length,
    changes: calculateChanges(previousClubs, clubs),
    clubs,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`Saved ${clubs.length} clubs to ${OUTPUT_PATH}`);
  console.log(`Added: ${payload.changes.added.length}, Removed: ${payload.changes.removed.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
