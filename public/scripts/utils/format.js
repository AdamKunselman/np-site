const suffixMap = {
  IHS: "International Historic Site",
  NP: "National Park",
  NM: "National Monument",
  NMEM: "National Memorial",
  NRA: "National Recreation Area",
  NHS: "National Historic Site",
  NMP: "National Military Park",
  NB: "National Battlefield",
  NBP: "National Battlefield Park",
  NR: "National River",
  NHP: "National Historic Park",
  NL: "National Lakeshore",
  PKWY: "National Parkway",
  NPRES: "National Preserve",
  NRES: "National Reserve",
  NST: "National Scenic Trail",
  NS: "National Seashore"

};

export function formatParkName(name) {
  if (name.length <= 18) {
    for (const [abbr, full] of Object.entries(suffixMap)) {
      const regex = new RegExp(`\\b${abbr}$`);
      if (regex.test(name)) {
        return name.replace(regex, full);
      }
    }
  }
  return name;
}

const STATE_NAMES = Object.freeze({
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
  GU: "Guam",
  VI: "U.S. Virgin Islands",
  AS: "American Samoa",
  MP: "Northern Mariana Islands"
});

export function getStateName(code) {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return STATE_NAMES[key] || null;
}