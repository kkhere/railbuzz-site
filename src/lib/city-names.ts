// Places known by more than one name (the owner, 21 November 2026: typing
// "bangalore" should find Bengaluru, "vizag" Visakhapatnam). A search tries
// each other name of a place in what was typed, as well as the words typed.
//
// The app's list and rules, kept the same: CityNames.kt in the app
// (app/src/main/java/com/example/railbuzz/data/CityNames.kt).
// city-names.test.ts checks the two lists match wherever the app's source is
// beside the site.
//
// Both ways: RailRadar's own names are a mix of old and new (10 trains say
// "Mysore" and 41 "Mysuru"), so "Mysuru" has to find "Mysore" too. Each
// group: the name in use now first, then names still typed (former names,
// English ones, short ones, common spellings).

export const GROUPS: readonly (readonly string[])[] = [
  ["Bengaluru", "Bangalore", "Banglore", "Bengalore"],
  ["Visakhapatnam", "Vizag", "Vishakhapatnam", "Vishakapatnam", "Visakapatnam", "Waltair"],
  ["Mumbai", "Bombay"],
  ["CSMT", "Victoria Terminus", "Chhatrapati Shivaji Maharaj Terminus"],
  ["Chennai", "Madras"],
  ["Kolkata", "Calcutta"],
  ["Pune", "Poona"],
  ["Vadodara", "Baroda"],
  ["Thiruvananthapuram", "Trivandrum"],
  ["Ernakulam", "Kochi", "Cochin"],
  ["Kozhikode", "Calicut"],
  ["Kollam", "Quilon"],
  ["Alappuzha", "Alleppey"],
  ["Thrissur", "Trichur"],
  ["Palakkad", "Palghat"],
  ["Kannur", "Cannanore"],
  ["Thalassery", "Tellicherry"],
  ["Mysuru", "Mysore"],
  ["Mangaluru", "Mangalore"],
  ["Belagavi", "Belgaum"],
  ["Hubballi", "Hubli"],
  ["Kalaburagi", "Gulbarga"],
  ["Ballari", "Bellary"],
  ["Vijayapura", "Bijapur"],
  ["Shivamogga", "Shimoga"],
  ["Tumakuru", "Tumkur"],
  ["Puducherry", "Pondicherry", "Pondy"],
  ["Tiruchchirappalli", "Tiruchirappalli", "Trichy", "Trichinopoly"],
  ["Thoothukudi", "Tuticorin"],
  ["Thanjavur", "Tanjore"],
  ["Udagamandalam", "Udhagamandalam", "Ooty", "Ootacamund"],
  ["Kanniyakumari", "Kanyakumari", "Cape Comorin"],
  ["Prayagraj", "Allahabad"],
  ["Deen Dayal Upadhyaya", "Mughalsarai", "Mughal Sarai"],
  ["Ayodhya", "Faizabad"],
  ["Rani Kamalapati", "Habibganj"],
  ["Sambhajinagar", "Aurangabad"],
  ["Narmadapuram", "Hoshangabad"],
  ["Ahilyanagar", "Ahmednagar"],
  ["Dharashiv", "Osmanabad"],
  ["Gurugram", "Gurgaon"],
  ["Madgaon", "Margao"],
  ["Shimla", "Simla"],
  ["Nashik", "Nasik"],
  ["Rajahmundry", "Rajamahendravaram", "Rajahmahendravaram"],
  ["Varanasi", "Banaras", "Benares"],
  ["Guwahati", "Gauhati"],
  ["Vijayawada", "Bezawada"],
  ["Ahmedabad", "Amdavad"],
  ["Bhubaneswar", "Bhubaneshwar"],
  ["Tirupati", "Tirupathi"],
  ["Coimbatore", "Kovai"],
];

/** The start of a name typed that already counts as it (4 letters: "bang", "viza", "madr"). */
export const MIN_PREFIX = 4;

const NAMES = GROUPS.flatMap((group) => group.map((name) => ({ text: name.toLowerCase(), group })));

/** Lower case, one space between words, no stray marks around them. */
export function normalise(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

type Hit = { typed: string; start: number; end: number; group: readonly string[] };

/**
 * The places named in [q] (normalised): a whole name, one or more words,
 * standing as words; or the last word, at least MIN_PREFIX letters, as the
 * start of a one-word name.
 */
function hits(q: string): Hit[] {
  const found: Hit[] = [];
  for (const name of NAMES) {
    let from = 0;
    for (;;) {
      const at = q.indexOf(name.text, from);
      if (at < 0) break;
      const end = at + name.text.length;
      const wordStart = at === 0 || q[at - 1] === " ";
      const wordEnd = end === q.length || q[end] === " ";
      if (wordStart && wordEnd) found.push({ typed: name.text, start: at, end, group: name.group });
      from = at + 1;
    }
  }
  const lastStart = q.lastIndexOf(" ") + 1;
  const last = q.slice(lastStart);
  if (last.length >= MIN_PREFIX && !found.some((h) => h.end === q.length)) {
    for (const name of NAMES) {
      if (
        !name.text.includes(" ") &&
        name.text.length > last.length &&
        name.text.startsWith(last)
      ) {
        found.push({ typed: last, start: lastStart, end: q.length, group: name.group });
      }
    }
  }
  return found;
}

/**
 * [query] with a place's name in it replaced by each of that place's other
 * names, for a search to try as well as [query]: "bangalore rajdhani" gives
 * "bengaluru rajdhani", and the rest. The last word may still be being
 * typed: "bang" counts as "bangalore". Empty when [query] names no such place.
 */
export function variants(query: string): string[] {
  const q = normalise(query);
  if (!q) return [];
  const out = new Set<string>();
  for (const hit of hits(q)) {
    for (const other of hit.group) {
      const o = other.toLowerCase();
      if (o !== hit.typed) out.add(q.slice(0, hit.start) + o + q.slice(hit.end));
    }
  }
  out.delete(q);
  return [...out];
}

/**
 * The name in use now of a place [query] names by another name, for the
 * results to say they include it: "Bengaluru" for "bangalore" or "bang",
 * "Visakhapatnam" for "vizag". Null when [query] has none, or already uses
 * the name in use now.
 */
export function nowCalled(query: string): string | null {
  const q = normalise(query);
  if (!q) return null;
  const hit = hits(q).find((h) => !(h.group[0] ?? "").toLowerCase().startsWith(h.typed));
  return hit?.group[0] ?? null;
}
