const state = {
  clubs: [],
  filtered: [],
  day: 'All Days',
  query: '',
};

// Map scraped club names -> local thumbnail paths in /public/assets/clubs.
// Example: 'Monday Morning Trailblazers': '/assets/clubs/monday-morning-trailblazers.jpg'
const CLUB_THUMBNAILS = {
  '704 Run Club': '/assets/clubs/704runclub.jpeg',
  'Armored Calves Run Club': '/assets/clubs/ArmoredCalves.png',
  'Ballantyne Running Club': '/assets/clubs/BallantyneRunningClub.jpeg.png',
  'Barn Burners Run Club': '/assets/clubs/BarnBurnersRC.jpg',
  'Beer Trekkers Run Club': '/assets/clubs/BeerTrekkers.jpeg.png',
  'Belmont Run Club': '/assets/clubs/BelmontRunClub.png',
  'Belmont Runners': '/assets/clubs/BelmontRunners.jpg',
  'Birdsong Run Club': '/assets/clubs/BirdsongRunClub.jpeg.png',
  'Black Men Run': '/assets/clubs/BlackMenRun.png',
  'Burial Run Club': '/assets/clubs/BurialRunClub.jpeg.png',
  'Cabarrus Brewing Run Club': '/assets/clubs/CabbarrusBrewing.jpg',
  'Cabarrus Can Run': '/assets/clubs/CabarrusCanRun.jpg',
  'Charlotte Ladies Morning Run Club': '/assets/clubs/MorningMiles.png',
  'Charlotte Runners United': '/assets/clubs/CRU.png',
  'Charlotte Running Co.': '/assets/clubs/CRC.png',
  'Charlotte Urban Runners': '/assets/clubs/CharlotteUrbanRunners.png',
  'CRC Trail Run': '/assets/clubs/CRCTrailRun.png',
  'Davidson Area Run Team (DART)': '/assets/clubs/DART.png',
  'Distro Run Club': '/assets/clubs/DistroRunClub.jpg',
  'Flying Biscuit Run Club': '/assets/clubs/FlyingBiscuitRunClub.jpeg.png',
  'Fonta Flora Run Club': '/assets/clubs/FontaFlora.jpg',
  "Frank's Beer Shop Run and Walk": "/assets/clubs/Frank'sBeerShopRunandWalk.jpg",
  'Funroe Run Club': '/assets/clubs/FunroeRunClub.jpeg.png',
  'Gilde 1546 Runners': '/assets/clubs/Gilde1546Runners.jpg',
  'Great Wagon Road Run Club': '/assets/clubs/GreatWagonRun.png',
  'Heist Brewery Run Club': '/assets/clubs/HBRC.png',
  'Hare Bandits Run Team': '/assets/clubs/HareBanditsRunTeam.jpg',
  'Hi-Wire Run Club': '/assets/clubs/HiWireRunClub.png',
  'Highland Creek Run Crew': '/assets/clubs/HighlandCreek.png',
  'Hillz 4 Breakfast (HILLZ4BFAST)': '/assets/clubs/HillsForBreakfast.png',
  'Hoptown Run and Walk Community': '/assets/clubs/HoptownRunWalk.png',
  'Joggers for Lagers': '/assets/clubs/joggers_for_lagers.png',
  'Kannapolis Run Crew': '/assets/clubs/Kannapolisruncrew.jpeg',
  'Latinos Run Charlotte': '/assets/clubs/LatinosRunCharlotte.jpeg.png',
  'Legion SouthPark Run Club': '/assets/clubs/LegionSouthPark.png',
  'Legiondary Run Group': '/assets/clubs/Legiondary.jpg',
  'Little Sugar Creek Greenway Run': '/assets/clubs/LittleSugarCreekGreenwayRun.png',
  'Mad Miles Run Club': '/assets/clubs/MadMiles.png',
  'Mad Park Run Club': '/assets/clubs/MadParkRunClub.jpeg.png',
  'Mallard Creek Greenway Run': '/assets/clubs/MallardCreekGreenwayRun.jpg',
  'Matthews Run Club': '/assets/clubs/MatthewsRunClub.jpeg',
  'Matthews Social House Run Club': '/assets/clubs/MatthewsSocialHouse.jpg',
  "Mattie's Diner Run Club": '/assets/clubs/MattiesDiner.png',
  'Moms in Motion': '/assets/clubs/MomsInMotion.png',
  'Monday Morning Trailblazers': '/assets/clubs/Monday-Morning-Trailblazers.png',
  'MoRA Run Club': '/assets/clubs/MoraRunClub.png',
  'Morning Miles CLT': '/assets/clubs/MorningMiles (2).png',
  'Mount Holly Ladies Run Club': '/assets/clubs/MountHollyLadies.png',
  'Neoteric Run Club': '/assets/clubs/Neotericrunclub.jpeg',
  'New Sarum Run Club': '/assets/clubs/NewSarum.png',
  'NoDa Brewing Run Club': '/assets/clubs/NodaBrewing.png',
  "Don't Get Dead Run Club": "/assets/clubs/don't_get_dead_run_club.jpg",
  'North End Run Club': '/assets/clubs/NorthEndRunClub.jpg',
  'Olde Meck Brewery Run': '/assets/clubs/OMBRunClub.png',
  'OpenTap Run Club': '/assets/clubs/OpenTap.png',
  'Parkrun': '/assets/clubs/ParkRun.png',
  'Pace Cadets': '/assets/clubs/PaceCadets.jpg',
  'Patagonia Run Club': '/assets/clubs/PatagoniaRunClub.png',
  'PCC 7@7': '/assets/clubs/PCC.png',
  'Percent Run Club': '/assets/clubs/Percentrunclub.jpeg',
  'Pineville Run Club': '/assets/clubs/Pinevillerunclub.png',
  'Pour 64 Run Club': '/assets/clubs/Pour64RunClub.jpg',
  'Pour Decisions Run Club': '/assets/clubs/PourDecisions.png',
  "Reid's Fine Runners": '/assets/clubs/ReidsFineRunners.jpeg.png',
  'Resident Culture Run Club': '/assets/clubs/ResidentCulture.png',
  'River Jam Run Club': '/assets/clubs/RiverJamRun.png',
  'RUN CLT Run Club': '/assets/clubs/RunCLTRunClub.jpeg.png',
  'Run DBB': '/assets/clubs/RunDBB.jpeg.png',
  'Run HopFly': '/assets/clubs/RunHopFly.png',
  'Run LLBC': '/assets/clubs/RunLLBC.png',
  'Run This Town': '/assets/clubs/RunThisTown.png',
  'RunBots': '/assets/clubs/RunBots.png',
  'Running From the Cartel': '/assets/clubs/GroveCartel.jpg',
  'Running Pac': '/assets/clubs/RunningPac.jpg',
  'Running Raptors': '/assets/clubs/RunningRaptors.png',
  'Runs With Christ': '/assets/clubs/RunsWithChrist.jpg',
  'Slow Runners of Charlotte': '/assets/clubs/SlowRunnersofCharlotte.jpg',
  'South End Coffee Run': '/assets/clubs/SouthendCoffeeRun.png',
  'South Fork Run Club': '/assets/clubs/SouthForkRunClub.png',
  'Southern Strain Run Club': '/assets/clubs/SouthernStrain.png',
  'Stride City Run Club': '/assets/clubs/StrideCityRunClub.jpg',
  'Summit Coffee Run - Ballantyne': '/assets/clubs/SummitCoffeeRun-Ballantyne.jpg',
  'Summit Coffee Run - Eastover': '/assets/clubs/SummitCoffee.png',
  'Summit Coffee Run - Highland Creek': '/assets/clubs/SummitCoffeeHighlandCreek.png',
  'Summit Coffee Run - OTP': '/assets/clubs/SummitCoffeeRun-OTP.png',
  'Sun Valley Social House (SVSH) Run Club': '/assets/clubs/SunValleySocialHouse.jpg',
  'Sunday Runday': '/assets/clubs/SundayRunday.jpeg.png',
  'Sycamore Run Club': '/assets/clubs/SycamoreRunClub.png',
  'Tega Cay Run Club': '/assets/clubs/TegaCayRunClub.jpeg',
  'The Chamber Run': '/assets/clubs/TheChamberRun.png',
  'The Sole': '/assets/clubs/TheSole.png',
  'Top Flight Run Crew': '/assets/clubs/TopFlightRunCrew.jpg',
  'Triple C Beer Runners': '/assets/clubs/TripleCBeerRunners.jpeg.png',
  'Uwharrie Brewing Running Club': '/assets/clubs/UwharrieBrewing.png',
  'Waxhaw Run Club': '/assets/clubs/WaxhawRunClub.png',
  'Zoomie Toomey Run Club - Pawmotion': '/assets/clubs/ZoomieToomeyRunClub-Pawmotion.jpeg.png',
};

const clubList = document.getElementById('clubList');
const dayFilter = document.getElementById('dayFilter');
const searchInput = document.getElementById('searchInput');
const statusText = document.getElementById('statusText');
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const backButton = document.getElementById('backButton');
const detailTitle = document.getElementById('detailTitle');
const detailAvatar = document.getElementById('detailAvatar');
const detailDay = document.getElementById('detailDay');
const detailTime = document.getElementById('detailTime');
const detailLocation = document.getElementById('detailLocation');
const socialSection = document.getElementById('socialSection');
const socialLinks = document.getElementById('socialLinks');
const noSocialText = document.getElementById('noSocialText');
const mapsModal = document.getElementById('mapsModal');
const mapsSubtitle = document.getElementById('mapsSubtitle');
const openAppleMaps = document.getElementById('openAppleMaps');
const openGoogleMaps = document.getElementById('openGoogleMaps');
const closeMapsModal = document.getElementById('closeMapsModal');

const INSTAGRAM_ICON = '/assets/clubs/InstagramIcon.jpg';
const FACEBOOK_ICON = '/assets/clubs/Facebook.jpg';

let pendingDirectionsClub = null;

function normalize(text) {
  return (text || '').toLowerCase().trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function clubKey(name) {
  return normalize(name).replace(/[^a-z0-9]+/g, ' ').trim();
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function parseSafeUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
  } catch (_error) {
    return '';
  }
  return '';
}

const NORMALIZED_THUMBNAILS = Object.entries(CLUB_THUMBNAILS).map(([name, path]) => ({
  key: clubKey(name),
  path,
}));

function normalizeAlias(name) {
  return clubKey(name)
    .replace(/\bcompany\b/g, 'co')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\band\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getThumbnailForClub(name) {
  const target = clubKey(name);
  const direct = NORMALIZED_THUMBNAILS.find((entry) => entry.key === target);
  if (direct) return direct.path;

  const targetAlias = normalizeAlias(name);
  const alias = NORMALIZED_THUMBNAILS.find((entry) => normalizeAlias(entry.key) === targetAlias);
  if (alias) return alias.path;

  const contains = NORMALIZED_THUMBNAILS.find((entry) => entry.key.includes(target) || target.includes(entry.key));
  return contains ? contains.path : '';
}

function reportMissingThumbnails(clubs) {
  const missing = [...new Set(clubs.map((club) => club.name).filter((name) => !getThumbnailForClub(name)))].sort();
  if (missing.length === 0) {
    console.info('Thumbnail check: all loaded clubs have image matches.');
    return;
  }

  console.warn(`Thumbnail check: ${missing.length} club(s) missing image mapping.`);
  missing.forEach((name) => console.warn(`- ${name}`));
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

function colorFromName(name) {
  const colors = [
    ['#265f4c', '#164136'],
    ['#1f5f83', '#1a4259'],
    ['#3f5f98', '#27395e'],
    ['#6a5841', '#493d2f'],
    ['#4e4a7d', '#2e2b54'],
  ];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function formatCountText(count) {
  if (count === 1) return '1 club shown';
  return `${count} clubs shown`;
}

function getClubById(clubId) {
  if (!clubId) return null;
  return state.clubs.find((club) => club.id === clubId) || null;
}

function getClubIdFromRoute() {
  const params = new URLSearchParams(window.location.search);
  return params.get('club');
}

function setClubRoute(clubId, mode = 'push') {
  const url = new URL(window.location.href);
  if (clubId) {
    url.searchParams.set('club', clubId);
  } else {
    url.searchParams.delete('club');
  }
  if (mode === 'replace') {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

function extractSocialLinks(club) {
  const links = Array.isArray(club.links) ? club.links : [];
  let instagram = null;
  let facebook = null;

  links.forEach((link) => {
    const label = normalize(link.label);
    const url = normalize(link.url);
    if (!instagram && (label.includes('instagram') || url.includes('instagram.com'))) {
      instagram = parseSafeUrl(link.url);
    }
    if (!facebook && (label.includes('facebook') || url.includes('facebook.com'))) {
      facebook = parseSafeUrl(link.url);
    }
  });

  return {
    instagram,
    facebook,
  };
}

function getDirectionsQuery(club) {
  return encodeURIComponent(club.location || club.name);
}

function openMapModalForClub(club) {
  pendingDirectionsClub = club;
  mapsSubtitle.textContent = `Choose map app for ${club.name}`;
  mapsModal.classList.remove('hidden');
}

function closeMapModal() {
  mapsModal.classList.add('hidden');
  pendingDirectionsClub = null;
}

function openDirections(appType) {
  if (!pendingDirectionsClub) return;
  const query = getDirectionsQuery(pendingDirectionsClub);
  const url =
    appType === 'apple'
      ? `https://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  closeMapModal();
}

function showListView() {
  detailView.classList.add('hidden');
  listView.classList.remove('hidden');
}

function showDetailView() {
  listView.classList.add('hidden');
  detailView.classList.remove('hidden');
}

function renderDetail(club) {
  const thumbnail = getThumbnailForClub(club.name);
  const initials = getInitials(club.name);
  const [c1, c2] = colorFromName(club.name);

  detailTitle.textContent = club.name;
  detailDay.textContent = club.day;
  detailTime.textContent = club.time;
  detailLocation.textContent = club.location;
  detailLocation.setAttribute('aria-label', `Open directions for ${club.name}`);
  detailLocation.dataset.clubId = club.id;

  if (thumbnail) {
    detailAvatar.innerHTML = `<img class="detail-avatar-image" src="${escapeAttr(thumbnail)}" alt="${escapeAttr(club.name)} logo" />`;
  } else {
    detailAvatar.innerHTML = `<div class="detail-avatar-fallback" style="background:linear-gradient(145deg, ${c1}, ${c2});">${escapeHtml(initials)}</div>`;
  }

  const social = extractSocialLinks(club);
  const socialItems = [];
  if (social.instagram) {
    socialItems.push(
      `<a class="social-link" href="${escapeAttr(social.instagram)}" target="_blank" rel="noreferrer noopener" aria-label="Open Instagram"><img src="${INSTAGRAM_ICON}" alt="Instagram" /></a>`
    );
  }
  if (social.facebook) {
    socialItems.push(
      `<a class="social-link" href="${escapeAttr(social.facebook)}" target="_blank" rel="noreferrer noopener" aria-label="Open Facebook"><img src="${FACEBOOK_ICON}" alt="Facebook" /></a>`
    );
  }

  socialLinks.innerHTML = socialItems.join('');
  if (socialItems.length === 0) {
    noSocialText.classList.remove('hidden');
    socialSection.classList.add('no-icons');
  } else {
    noSocialText.classList.add('hidden');
    socialSection.classList.remove('no-icons');
  }

  showDetailView();
}

function renderRoute() {
  const clubId = getClubIdFromRoute();
  if (!clubId) {
    showListView();
    return;
  }

  const club = getClubById(clubId);
  if (!club) {
    setClubRoute('', 'replace');
    showListView();
    return;
  }

  renderDetail(club);
}

function buildDayOptions(clubs) {
  const days = new Set(clubs.map((club) => club.day));
  const sortedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const final = ['All Days', ...sortedDays.filter((day) => days.has(day)), ...[...days].filter((d) => !sortedDays.includes(d)).sort()];

  dayFilter.innerHTML = final
    .map((day) => `<option value="${day}">${day}</option>`)
    .join('');
}

function applyFilters() {
  const query = normalize(state.query);

  state.filtered = state.clubs.filter((club) => {
    const dayMatch = state.day === 'All Days' || club.day === state.day;
    if (!dayMatch) return false;

    if (!query) return true;

    const haystack = normalize(`${club.name} ${club.day} ${club.time} ${club.location}`);
    return haystack.includes(query);
  });

  renderList();
}

function renderList() {
  statusText.textContent = formatCountText(state.filtered.length);

  if (state.filtered.length === 0) {
    clubList.innerHTML = '<li class="empty">No clubs match your filter.</li>';
    return;
  }

  clubList.innerHTML = state.filtered
    .map((club) => {
      const initials = getInitials(club.name);
      const [c1, c2] = colorFromName(club.name);
      const thumbnail = getThumbnailForClub(club.name);
      const avatarHtml = thumbnail
        ? `<img class="avatar-image" src="${escapeHtml(thumbnail)}" alt="${escapeHtml(club.name)} logo" loading="lazy" />`
        : `${escapeHtml(initials)}`;

      return `
        <li class="club-item">
          <div class="avatar" style="background:linear-gradient(145deg, ${c1}, ${c2});">${avatarHtml}</div>
          <article>
            <button class="club-link club-open-button" type="button" data-club-id="${escapeAttr(club.id)}" aria-label="Open ${escapeAttr(club.name)} details">
              <h2 class="club-name">${escapeHtml(club.name)}</h2>
              <p class="meta">${escapeHtml(club.day)} • ${escapeHtml(club.time)}</p>
              <p class="location">${escapeHtml(club.location)}</p>
            </button>
          </article>
          <span class="chevron">›</span>
        </li>
      `;
    })
    .join('');
}

async function loadClubs() {
  statusText.textContent = 'Loading run clubs...';

  try {
    const response = await fetch('/api/run-clubs');
    if (!response.ok) throw new Error('Network response was not ok');

    const payload = await response.json();
    state.clubs = payload.clubs || [];
    reportMissingThumbnails(state.clubs);

    buildDayOptions(state.clubs);
    applyFilters();
    renderRoute();
  } catch (error) {
    statusText.textContent = 'Unable to load run clubs right now.';
    clubList.innerHTML = `<li class="empty">${error.message}</li>`;
  }
}

dayFilter.addEventListener('change', (event) => {
  state.day = event.target.value;
  applyFilters();
});

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  applyFilters();
});

clubList.addEventListener('click', (event) => {
  const button = event.target.closest('.club-open-button');
  if (!button) return;
  setClubRoute(button.dataset.clubId || '');
  renderRoute();
});

detailLocation.addEventListener('click', () => {
  const club = getClubById(detailLocation.dataset.clubId);
  if (!club) return;
  openMapModalForClub(club);
});

backButton.addEventListener('click', () => {
  setClubRoute('');
  renderRoute();
});

openAppleMaps.addEventListener('click', () => openDirections('apple'));
openGoogleMaps.addEventListener('click', () => openDirections('google'));
closeMapsModal.addEventListener('click', closeMapModal);
mapsModal.addEventListener('click', (event) => {
  if (event.target === mapsModal) closeMapModal();
});
window.addEventListener('popstate', renderRoute);

loadClubs();
