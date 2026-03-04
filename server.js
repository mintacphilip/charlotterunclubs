const express = require('express');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE_URL = 'https://www.charlotterunningclub.org/Run-Clubs';
const CACHE_MS = 24 * 60 * 60 * 1000;
const CACHE_FILE = path.join(__dirname, 'data', 'run-clubs-cache.json');

let cache = {
  data: null,
  fetchedAt: 0,
  changes: { added: [], removed: [] },
};

function cleanText(value) {
  return (value || '').replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim();
}

function parseRunClubs(html) {
  const $ = cheerio.load(html);
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

function normalizeKey(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function clubSignature(club) {
  return [club.name, club.day, club.time, club.location].map(normalizeKey).join('|');
}

function calculateChanges(previousClubs, nextClubs) {
  const previousBySig = new Map(previousClubs.map((club) => [clubSignature(club), club]));
  const nextBySig = new Map(nextClubs.map((club) => [clubSignature(club), club]));

  const added = nextClubs.filter((club) => !previousBySig.has(clubSignature(club)));
  const removed = previousClubs.filter((club) => !nextBySig.has(clubSignature(club)));

  return { added, removed };
}

function loadCacheFromDisk() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return;
    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.data) || typeof parsed.fetchedAt !== 'number') return;

    cache = {
      data: parsed.data,
      fetchedAt: parsed.fetchedAt,
      changes: parsed.changes || { added: [], removed: [] },
    };
  } catch (error) {
    console.warn(`Could not read cache file: ${error.message}`);
  }
}

function saveCacheToDisk() {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn(`Could not write cache file: ${error.message}`);
  }
}

async function fetchRunClubs() {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_MS) {
    return cache.data;
  }

  const response = await fetch(SOURCE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (RunClubsApp/1.0)',
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const clubs = parseRunClubs(html);
  const previousClubs = cache.data || [];
  const changes = calculateChanges(previousClubs, clubs);

  cache = { data: clubs, fetchedAt: now, changes };
  saveCacheToDisk();

  if (previousClubs.length > 0) {
    console.log(
      `Daily run club refresh complete: +${changes.added.length} added, -${changes.removed.length} removed`
    );
  } else {
    console.log(`Run club cache initialized with ${clubs.length} clubs.`);
  }

  return clubs;
}

app.use(express.static('public'));

app.get('/api/run-clubs', async (_req, res) => {
  try {
    const clubs = await fetchRunClubs();
    res.json({
      source: SOURCE_URL,
      fetchedAt: new Date(cache.fetchedAt).toISOString(),
      count: clubs.length,
      changes: cache.changes,
      clubs,
    });
  } catch (error) {
    if (cache.data) {
      res.status(200).json({
        source: SOURCE_URL,
        fetchedAt: new Date(cache.fetchedAt).toISOString(),
        count: cache.data.length,
        changes: cache.changes,
        stale: true,
        staleReason: error.message,
        clubs: cache.data,
      });
      return;
    }

    res.status(500).json({
      error: 'Could not load run clubs right now.',
      details: error.message,
    });
  }
});

loadCacheFromDisk();

app.listen(PORT, () => {
  console.log(`Run clubs app running at http://localhost:${PORT}`);
});
