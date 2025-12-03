// Geocoding utilities for Irish towns
// Maps town names to approximate lat/lng coordinates

export interface Coordinates {
  lat: number
  lng: number
}

// Major Irish towns and cities with approximate coordinates
// Format: [latitude, longitude]
export const TOWN_COORDINATES: Record<string, Coordinates> = {
  // Dublin
  'Dublin': { lat: 53.3498, lng: -6.2603 },
  'Dún Laoghaire': { lat: 53.2939, lng: -6.1358 },
  'Swords': { lat: 53.4597, lng: -6.2181 },
  'Tallaght': { lat: 53.2859, lng: -6.3734 },
  'Blanchardstown': { lat: 53.3881, lng: -6.3775 },
  'Lucan': { lat: 53.3578, lng: -6.4486 },
  'Clondalkin': { lat: 53.3244, lng: -6.3972 },
  'Finglas': { lat: 53.3889, lng: -6.2969 },
  'Santry': { lat: 53.3958, lng: -6.2500 },
  'Howth': { lat: 53.3917, lng: -6.0653 },
  'Malahide': { lat: 53.4508, lng: -6.1544 },
  'Skerries': { lat: 53.5828, lng: -6.1083 },
  'Balbriggan': { lat: 53.6117, lng: -6.1819 },
  'Blackrock': { lat: 53.3014, lng: -6.1778 },
  'Dalkey': { lat: 53.2778, lng: -6.1000 },
  'Bray': { lat: 53.2028, lng: -6.0986 },
  
  // Cork
  'Cork': { lat: 51.8985, lng: -8.4756 },
  'Cobh': { lat: 51.8500, lng: -8.3000 },
  'Kinsale': { lat: 51.7075, lng: -8.5306 },
  'Youghal': { lat: 51.9500, lng: -7.8500 },
  'Mallow': { lat: 52.1333, lng: -8.6333 },
  'Midleton': { lat: 51.9167, lng: -8.1833 },
  'Fermoy': { lat: 52.1333, lng: -8.2833 },
  'Bandon': { lat: 51.7500, lng: -8.7333 },
  'Clonakilty': { lat: 51.6167, lng: -8.8833 },
  'Skibbereen': { lat: 51.5500, lng: -9.2667 },
  
  // Galway
  'Galway': { lat: 53.2707, lng: -9.0568 },
  'Tuam': { lat: 53.5167, lng: -8.8500 },
  'Ballinasloe': { lat: 53.3333, lng: -8.2167 },
  'Loughrea': { lat: 53.2000, lng: -8.5667 },
  'Athenry': { lat: 53.3000, lng: -8.7500 },
  'Gort': { lat: 53.0667, lng: -8.8167 },
  'Clifden': { lat: 53.4833, lng: -10.0167 },
  
  // Limerick
  'Limerick': { lat: 52.6638, lng: -8.6267 },
  'Newcastle West': { lat: 52.4500, lng: -9.0500 },
  'Kilmallock': { lat: 52.4000, lng: -8.5667 },
  'Rathkeale': { lat: 52.5167, lng: -8.9333 },
  
  // Waterford
  'Waterford': { lat: 52.2593, lng: -7.1119 },
  'Dungarvan': { lat: 52.0833, lng: -7.6167 },
  'Tramore': { lat: 52.1667, lng: -7.1500 },
  
  // Kilkenny
  'Kilkenny': { lat: 52.6542, lng: -7.2522 },
  'Thomastown': { lat: 52.5333, lng: -7.1333 },
  'Callan': { lat: 52.5167, lng: -7.3833 },
  
  // Wexford
  'Wexford': { lat: 52.3369, lng: -6.4633 },
  'Enniscorthy': { lat: 52.5000, lng: -6.5667 },
  'New Ross': { lat: 52.4000, lng: -6.9333 },
  'Gorey': { lat: 52.6833, lng: -6.2833 },
  
  // Wicklow
  'Wicklow': { lat: 52.9750, lng: -6.0494 },
  'Arklow': { lat: 52.8000, lng: -6.1500 },
  'Greystones': { lat: 53.1417, lng: -6.0639 },
  
  // Kildare
  'Naas': { lat: 53.2167, lng: -6.6667 },
  'Newbridge': { lat: 53.1833, lng: -6.8000 },
  'Athy': { lat: 52.9917, lng: -6.9806 },
  'Kildare': { lat: 53.1583, lng: -6.9083 },
  'Maynooth': { lat: 53.3833, lng: -6.5833 },
  'Leixlip': { lat: 53.3667, lng: -6.4833 },
  'Celbridge': { lat: 53.3333, lng: -6.5333 },
  
  // Meath
  'Navan': { lat: 53.6500, lng: -6.6833 },
  'Trim': { lat: 53.5500, lng: -6.7833 },
  'Kells': { lat: 53.7333, lng: -6.8833 },
  'Ashbourne': { lat: 53.5167, lng: -6.4000 },
  
  // Louth (Drogheda is on the border of Meath/Louth)
  'Dundalk': { lat: 54.0000, lng: -6.4000 },
  'Drogheda': { lat: 53.7167, lng: -6.3500 },
  'Ardee': { lat: 53.8667, lng: -6.5333 },
  
  // Westmeath
  'Athlone': { lat: 53.4228, lng: -7.9378 },
  'Mullingar': { lat: 53.5333, lng: -7.3500 },
  
  // Offaly
  'Tullamore': { lat: 53.2739, lng: -7.4889 },
  'Birr': { lat: 53.1000, lng: -7.9167 },
  'Edenderry': { lat: 53.3500, lng: -7.0500 },
  
  // Laois
  'Portlaoise': { lat: 53.0333, lng: -7.3000 },
  'Mountmellick': { lat: 53.1167, lng: -7.3167 },
  
  // Carlow
  'Carlow': { lat: 52.8361, lng: -6.9264 },
  'Tullow': { lat: 52.8000, lng: -6.7333 },
  
  // Tipperary
  'Clonmel': { lat: 52.3550, lng: -7.7039 },
  'Thurles': { lat: 52.6833, lng: -7.8000 },
  'Nenagh': { lat: 52.8667, lng: -8.2000 },
  'Carrick-on-Suir': { lat: 52.3500, lng: -7.4167 },
  'Roscrea': { lat: 52.9500, lng: -7.8000 },
  
  // Kerry
  'Tralee': { lat: 52.2700, lng: -9.7000 },
  'Killarney': { lat: 52.0500, lng: -9.5167 },
  'Listowel': { lat: 52.4500, lng: -9.4833 },
  'Dingle': { lat: 52.1333, lng: -10.2667 },
  'Kenmare': { lat: 51.8833, lng: -9.5833 },
  'Cahersiveen': { lat: 51.9500, lng: -10.2167 },
  
  // Clare
  'Ennis': { lat: 52.8436, lng: -8.9864 },
  'Kilrush': { lat: 52.6333, lng: -9.4833 },
  'Shannon': { lat: 52.7167, lng: -8.8667 },
  'Kilkee': { lat: 52.6833, lng: -9.6500 },
  
  // Mayo
  'Castlebar': { lat: 53.8500, lng: -9.3000 },
  'Ballina': { lat: 54.1167, lng: -9.1500 },
  'Westport': { lat: 53.8000, lng: -9.5167 },
  'Claremorris': { lat: 53.7167, lng: -8.9833 },
  'Ballinrobe': { lat: 53.6333, lng: -9.2333 },
  
  // Sligo
  'Sligo': { lat: 54.2667, lng: -8.4833 },
  'Ballymote': { lat: 54.0833, lng: -8.5167 },
  
  // Leitrim
  'Carrick-on-Shannon': { lat: 53.9500, lng: -8.1000 },
  'Manorhamilton': { lat: 54.3000, lng: -8.1833 },
  
  // Roscommon
  'Roscommon': { lat: 53.6333, lng: -8.1833 },
  'Boyle': { lat: 53.9667, lng: -8.3000 },
  
  // Longford
  'Longford': { lat: 53.7333, lng: -7.8000 },
  'Ballymahon': { lat: 53.5667, lng: -7.7667 },
  
  // Cavan
  'Cavan': { lat: 53.9833, lng: -7.3667 },
  'Belturbet': { lat: 54.1000, lng: -7.4500 },
  
  // Monaghan
  'Monaghan': { lat: 54.2500, lng: -6.9667 },
  'Carrickmacross': { lat: 53.9833, lng: -6.7167 },
  'Clones': { lat: 54.1833, lng: -7.2333 },
  
  // Donegal
  'Letterkenny': { lat: 54.9500, lng: -7.7333 },
  'Ballybofey': { lat: 54.8000, lng: -7.7833 },
  'Buncrana': { lat: 55.1333, lng: -7.4500 },
  'Donegal': { lat: 54.6500, lng: -8.1167 },
  'Ballyshannon': { lat: 54.5000, lng: -8.1833 },
  'Dungloe': { lat: 54.9500, lng: -8.3500 },
  
  // Northern Ireland
  'Belfast': { lat: 54.5973, lng: -5.9301 },
  'Derry': { lat: 54.9966, lng: -7.3086 },
  'Lisburn': { lat: 54.5167, lng: -6.0333 },
  'Newry': { lat: 54.1750, lng: -6.3333 },
  'Newtownabbey': { lat: 54.6667, lng: -5.9000 },
  'Bangor': { lat: 54.6667, lng: -5.6667 },
  'Carrickfergus': { lat: 54.7167, lng: -5.8000 },
  'Larne': { lat: 54.8500, lng: -5.8167 },
  'Coleraine': { lat: 55.1333, lng: -6.6667 },
  'Ballymena': { lat: 54.8667, lng: -6.2833 },
  'Omagh': { lat: 54.6000, lng: -7.3000 },
  'Enniskillen': { lat: 54.3500, lng: -7.6333 },
  'Armagh': { lat: 54.3500, lng: -6.6500 },
  'Downpatrick': { lat: 54.3333, lng: -5.7167 },
  'Strabane': { lat: 54.8333, lng: -7.4667 },
}

/**
 * Get coordinates for a town, or approximate coordinates for a county if town not found
 */
export function getTownCoordinates(town: string, county?: string): Coordinates | null {
  // Try exact match first
  if (TOWN_COORDINATES[town]) {
    return TOWN_COORDINATES[town]
  }
  
  // Try case-insensitive match
  const normalizedTown = town.trim()
  const match = Object.keys(TOWN_COORDINATES).find(
    key => key.toLowerCase() === normalizedTown.toLowerCase()
  )
  if (match) {
    return TOWN_COORDINATES[match]
  }
  
  // If no match and we have a county, return approximate county center
  if (county) {
    return getCountyCenter(county)
  }
  
  return null
}

/**
 * Get approximate center coordinates for a county
 */
export function getCountyCenter(county: string): Coordinates | null {
  const COUNTY_CENTERS: Record<string, Coordinates> = {
    'Dublin': { lat: 53.3498, lng: -6.2603 },
    'Cork': { lat: 51.8985, lng: -8.4756 },
    'Galway': { lat: 53.2707, lng: -9.0568 },
    'Limerick': { lat: 52.6638, lng: -8.6267 },
    'Waterford': { lat: 52.2593, lng: -7.1119 },
    'Kilkenny': { lat: 52.6542, lng: -7.2522 },
    'Wexford': { lat: 52.3369, lng: -6.4633 },
    'Wicklow': { lat: 52.9750, lng: -6.0494 },
    'Kildare': { lat: 53.2167, lng: -6.6667 },
    'Meath': { lat: 53.6500, lng: -6.6833 },
    'Louth': { lat: 54.0000, lng: -6.4000 },
    'Westmeath': { lat: 53.5333, lng: -7.3500 },
    'Offaly': { lat: 53.2739, lng: -7.4889 },
    'Laois': { lat: 53.0333, lng: -7.3000 },
    'Carlow': { lat: 52.8361, lng: -6.9264 },
    'Tipperary': { lat: 52.6833, lng: -7.8000 },
    'Kerry': { lat: 52.2700, lng: -9.7000 },
    'Clare': { lat: 52.8436, lng: -8.9864 },
    'Mayo': { lat: 53.8500, lng: -9.3000 },
    'Sligo': { lat: 54.2667, lng: -8.4833 },
    'Leitrim': { lat: 53.9500, lng: -8.1000 },
    'Roscommon': { lat: 53.6333, lng: -8.1833 },
    'Longford': { lat: 53.7333, lng: -7.8000 },
    'Cavan': { lat: 53.9833, lng: -7.3667 },
    'Monaghan': { lat: 54.2500, lng: -6.9667 },
    'Donegal': { lat: 54.9500, lng: -7.7333 },
    'Antrim': { lat: 54.8667, lng: -6.2833 },
    'Armagh': { lat: 54.3500, lng: -6.6500 },
    'Down': { lat: 54.3333, lng: -5.7167 },
    'Fermanagh': { lat: 54.3500, lng: -7.6333 },
    'Derry': { lat: 54.9966, lng: -7.3086 },
    'Tyrone': { lat: 54.6000, lng: -7.3000 },
  }
  
  const normalizedCounty = county.trim()
  const match = Object.keys(COUNTY_CENTERS).find(
    key => key.toLowerCase() === normalizedCounty.toLowerCase()
  )
  
  return match ? COUNTY_CENTERS[match] : null
}

/**
 * Convert geographic coordinates (lat/lng) to SVG coordinates
 * Based on the SVG's geoViewBox: -10.617532 55.384216 -5.429631 51.419751
 * (west, north, east, south)
 */
export function latLngToSvgCoords(
  lat: number,
  lng: number,
  svgWidth: number = 605.68,
  svgHeight: number = 1000
): { x: number; y: number } {
  // SVG geoViewBox bounds
  const west = -10.617532
  const north = 55.384216
  const east = -5.429631
  const south = 51.419751
  
  // Calculate the ratio
  const lngRange = east - west
  const latRange = north - south
  
  // Convert longitude to X (inverted because SVG X increases left to right, but lng increases west to east)
  const x = ((lng - west) / lngRange) * svgWidth
  
  // Convert latitude to Y (inverted because SVG Y increases top to bottom, but lat increases south to north)
  const y = ((north - lat) / latRange) * svgHeight
  
  return { x, y }
}

