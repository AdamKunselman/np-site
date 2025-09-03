const suffixMap = {
  NP: "National Park",
  NM: "National Monument",
  NMEM: "National Memorial",
  NRA: "National Recreation Area",
  NHS: "National Historic Site",
  NMP: "National Military Park",
  NB: "National Battlefield"
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