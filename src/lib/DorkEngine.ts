import { ATS_SEGMENTS, GLOBAL_HUBS } from "./Constants";

export interface FilterState {
  tiers: (keyof typeof ATS_SEGMENTS)[];
  roles: string[];
  levels: string[];
  cities: string[];
  countries: string[];
  timeframe: string;
}

export function generateAdvancedDork(filters: FilterState) {
  const { tiers, roles, levels, cities, countries, timeframe } = filters;

  // 1. Build ATS string based on selected segments (Easy/Med/Hard)
  const selectedSites = tiers.flatMap(t => ATS_SEGMENTS[t].sites);
  const siteStr = selectedSites.length > 0 ? `(${selectedSites.map(s => `site:${s}`).join(' OR ')})` : '';

  // 2. Build Level/Role Strings
  const levelStr = levels.length > 0 ? `(${levels.join(' OR ')})` : '';
  const roleStr = roles.length > 0 ? `("${roles.join('" OR "')}")` : '';

  // 3. Build Location - Use expanded arrays from countries
  const countryStrings = countries.flatMap(c => {
    // If the country corresponds to a key in GLOBAL_HUBS, use the expanded array
    if (GLOBAL_HUBS[c as keyof typeof GLOBAL_HUBS]) {
      return GLOBAL_HUBS[c as keyof typeof GLOBAL_HUBS];
    }
    return [`"${c}"`]; // fallback
  });
  
  const locStr = countryStrings.length > 0 ? `(${countryStrings.join(' OR ')})` : '';

  // 4. Timeframe (Dynamic calculation based on days selected)
  let dateStr = ''; // Default base
  
  if (timeframe && timeframe !== 'all') {
    const today = new Date("2026-03-24T00:00:00Z"); // Simulation date as per prompt
    let daysToSubtract = 0;
    
    if (timeframe === '24h') daysToSubtract = 1;
    else if (timeframe === '2d') daysToSubtract = 2;
    else if (timeframe === '3d') daysToSubtract = 3;
    else if (timeframe === '5d') daysToSubtract = 5;
    else if (timeframe === '7d' || timeframe === '1w') daysToSubtract = 7;
    else if (timeframe === '1m') daysToSubtract = 30;
    
    if (daysToSubtract > 0) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - daysToSubtract);
      dateStr = `after:${targetDate.toISOString().split('T')[0]}`;
    }
  }

  const queryParts = [siteStr, levelStr, roleStr, locStr, dateStr];
  const query = queryParts.filter(p => p !== '').join(' ').trim();
  
  // Dynamic shortening if query exceeds Google limits
  let finalQuery = query;
  if (finalQuery.length >= 1800) {
     // Broke Founder auto-shorting: strip out timeframe and levels to compress
     const shortParts = [siteStr, roleStr, locStr];
     finalQuery = shortParts.filter(p => p !== '').join(' ').trim();
  }
  
  return {
    query: finalQuery,
    length: finalQuery.length,
    isSafe: finalQuery.length < 1900, // Google threshold
    url: `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}&udm=14`
  };
}

// Backwards compatibility for old UI components
export function generateJobDork(oldFilters: any) {
  return generateAdvancedDork({
    tiers: oldFilters.atsTypes?.map((t: string) => t.toUpperCase()) || ['EASY'],
    roles: oldFilters.roles || [],
    levels: oldFilters.levels || [],
    cities: oldFilters.cities || [],
    countries: oldFilters.countries || [],
    timeframe: '1m' // Default large timeframe
  });
}
