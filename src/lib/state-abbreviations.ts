/**
 * US State Abbreviations
 *
 * Utility for converting full state names to abbreviations.
 * Used for compact display on mobile viewports.
 */

const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

// Pre-sorted by length descending to ensure longer names match first
// (e.g., "West Virginia" before "Virginia")
const SORTED_STATE_ENTRIES = Object.entries(STATE_ABBREVIATIONS).sort(([a], [b]) => b.length - a.length);

/**
 * Abbreviate a location string by replacing full state name with abbreviation.
 * Input: "Corvallis, Oregon" → Output: "Corvallis, OR"
 * If state not found, returns original string.
 */
export function abbreviateLocation(location: string): string {
  for (const [state, abbrev] of SORTED_STATE_ENTRIES) {
    if (location.includes(state)) {
      return location.replace(state, abbrev);
    }
  }
  return location;
}
