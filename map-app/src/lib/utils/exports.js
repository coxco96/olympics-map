export const nameExceptions = {
  'Austria': 'On 1880 and 1900 maps, this was Austria Hungary. On 1914, it was Austro-Hungarian Empire. Most sources separate Austrian and Hungarian competitors, but on this map, at least for now, these are counted as Austrian. This is random choice for simplicity.',
  'Hungary': 'On 1880 and 1900 maps, this was Austria Hungary. On 1914, it was Austro-Hungarian Empire. Most sources separate Austrian and Hungarian competitors, but on this map, at least for now, these are counted as Austrian. This is random choice for simplicity.',
  'Australasia': 'Right now, Australasia team isnt being counted anywhere.',
  'Bohemia': 'Is not being counted anywhere right now. Competed 1900, 1908 and 1912 as its own team, part of Hungary.',
  'Finland': 'On 1900 map, this shows up on map as part of Russian Empire. Is not being counted at all right now until 1914. First competed in 1908.',
  'Sweden': 'On 1900 map, there is Sweden Norway. All is set to count as Norway. For no reason, just simplicity, for now.',
  'Norway': 'On 1900 map, there is Sweden Norway. All is set to count as Norway. For no reason, just simplicity, for now.',
  'Ireland': 'On the 1920 and 1930 maps, it is called United Kingdom of Great Britain and Ireland. Olympic team is set to Great Britain for now, but Ireland did compete. Decision just for simplicity for now.',
  'Germany': 'On 1945 map, Germany is split as Germany (USA) and Germany (Soviet). For now I have set them both to OLYMPIC_TEAM as Germany. Worth checking later if this should be specifically one or the other.',
  'Liechtenstein': 'On the 1960 map, this area is covered by Switzerland and Austria. It is not currently set to show up or count toward any totals.',
  'United States Virgin Islands': 'Not included in 1960 map, therefore will not show up except on table.',
  'West Indies Federation': 'Will not be included on map but will be in table.',
  'Netherlands Antilles': 'Will not be included on 1960 basemap.',
  'Singapore': '1960 and 1994 and 2000 basemaps do not include. Singapore gained independence in 1963 and briefly joined Malaysia, but Malaysia also competed... it broke away for independent sovereignty in 1965... but I dont have a basemap for between 1960 and 1994 so Singapore will not appear before 1994.',
  'Bermuda': 'No Bermuda on the 1960 or 1994 or 2000 maps, so it will not appear except in table.',
  'Lithuania': 'Appears on 1960 map under USSR/Soviet Union, so it will not appear.',
  'Bahrain': 'Does not appear on 2000 map so will only appear in table view.',
  'Kosovo': 'Appears on 2000 map under Serbia. First medal was in 2016. If I use a more updated base map past 2000, could add this in, but for now it will stay off.',
  'Mauritius': 'No geography for Mauritius on 2000 basemap. First medal was 2008 so could add later if more recent basemap is used, but for now it will only be in table.',
  'Serbia and Montenegro': 'Fixed for 1994 but then realized first medal was 1996. Both Serbia and Montenegro individually had medals post-2000 so for now anything won under Serbia and Montenegro will not show up on map.',
  'ROC': 'On the 2000 basemap, I used Russian Federation as the OLYMPIC_NAME for Russia, leaving out ROC.'

}

// turn data array into object with each country as key and 
// all of its medals data as value
export function convertData(data) {
  const dataObj = {};
  data = data.post;
  data.forEach(row => {
    const [country, medal, year, sport, sportEvent, athlete, source] = row;

    if (!dataObj[country]) {
      dataObj[country] = []
    }

    dataObj[country].push({
      medal,
      year,
      sport,
      sportEvent,
      athlete,
      source
    });
  });
  return dataObj;
}

export function makeTooltipString(country, data, olympicTeam) {
  let goldMedalCount = 0;
  let silverMedalCount = 0;
  let bronzeMedalCount = 0;

  data.forEach(d => {
    let {
      medal
    } = d;
    if (medal === 'Gold') {
      goldMedalCount++;
    }
    if (medal === 'Silver') {
      silverMedalCount++;
    }
    if (medal === 'Bronze') {
      bronzeMedalCount++;
    }
  })
  let string = (olympicTeam == '' || olympicTeam == undefined)
    // second one if olympicTeam is specified,
    // first one if not
    ?
    `
  <strong>${country}</strong> <br>
  Gold Medals: ${goldMedalCount}<br>
  Silver Medals: ${silverMedalCount}<br>
  Bronze Medals: ${bronzeMedalCount}<br>
  ` :
    `
  <strong>${country}</strong> <br>
  <strong>(Team ${olympicTeam})</strong><br>
  Gold Medals: ${goldMedalCount}<br>
  Silver Medals: ${silverMedalCount}<br>
  Bronze Medals: ${bronzeMedalCount}<br>
  `


  return string;
}


export function makePaint(colorize, breaks, isForLegend) {

  // is isForLegend is true, return obj needed for legend styling rather than full paint object
  if (isForLegend) {
    console.log('for the legend')
  }
  // create array of objects with rbg string associated with each break point
  const fillColorsArr = () => {
    let rgbBreaks = [];
    breaks.forEach((colorStop) => {
      let thisColor = colorize(colorStop);
      // make obj with maplibre-ready rgb string
      let obj = {
        [colorStop]: `rgb(${thisColor["_rgb"][0].toString()}, ${thisColor["_rgb"][1].toString()}, ${thisColor["_rgb"][2].toString()})`,
      };
      rgbBreaks.push(obj);
    });
    return rgbBreaks;
  };

  let colors = fillColorsArr();

  // initialize the fill-color array
  let fillColorArray = [];

  // add gradient color stops based on colors2
  colors.forEach((color) => {
    const key = parseInt(Object.keys(color)[0], 10); // Ensure key is an integer
    const rgbString = color[key];
    fillColorArray.push(key, rgbString);
  });

  // object to return as paint for styling
  const style = {
    "fill-outline-color": "white",
    "fill-color": [
      "case",
      ["==", ["feature-state", "pointsTotal"], null],
      "black", // black for undefined pointsTotal (debugging purposes)
      ["==", ["feature-state", "pointsTotal"], 0],
      "#242222", // gray for pointsTotal = 0
      [
        "interpolate",
        ["linear"],
        ["feature-state", "pointsTotal"],
        ...fillColorArray,
      ],
    ],
    "fill-opacity": [
      "case",
      ["==", ["feature-state", "pointsTotal"], null],
      0,
      ["==", ["feature-state", "pointsTotal"], 0],
      .1,
      1,
    ],
  };
  return style;
}


// return the most recent basemap year
export const getBaseMapYear = (selection) => {
  for (let i = baseMapYears.length - 1; i >= 0; i--) {
    if (selection >= baseMapYears[i]) {
      return baseMapYears[i].toString();
    }
  }
  return baseMapYears[0].toString(); // return the first year if selection is less than the smallest year
}

export function filterData(year, sport, sportEvent, initialData) {
  let filteredObj = {};

  for (let country in initialData) {
    let countryData = initialData[country];

    let filteredCountryData = countryData.filter(x => {
      // check if all filters are set to "All" (i.e., no filtering)
      if (year === 'All years (1896-2024)' && sport === 'All sports' && sportEvent === 'All events') {
        return true; // return all data
      }

      // filtering based on year, sport, and sportEvent
      let yearMatch = year === 'All years (1896-2024)' || x['year'] === year;
      let sportMatch = sport === 'All sports' || x['sport'] === sport;
      let eventMatch = sportEvent === 'All events' || x['sportEvent'] === sportEvent;

      return yearMatch && sportMatch && eventMatch;
    });


    if (filteredCountryData.length > 0) {
      filteredObj[country] = filteredCountryData;
    }
  }
  return filteredObj;
}

export const gameLocations = {
  "1896": {
    "location": "Athens, Greece",
    "latlon": [37.9838096, 23.7275388]
  },
  "1900": {
    "location": "Paris, France",
    "latlon": [48.8575475, 2.3513765]
  },
  "1904": {
    "location": "St. Louis",
    "latlon": [38.6270025, -90.1994041999999]
  },
  "1908": {
    "location": "London",
    "latlon": [51.5072178, -0.1275862]
  },
  "1912": {
    "location": "Stockholm",
    "latlon": [59.3293234999999, 18.0685808]
  },
  "1920": {
    "location": "Antwerp",
    "latlon": [51.2213404, 4.4051485]
  },
  "1924": {
    "location": "Paris",
    "latlon": [48.8575475, 2.3513765]
  },
  "1928": {
    "location": "Amsterdam",
    "latlon": [52.3675734, 4.9041389]
  },
  "1932": {
    "location": "Los Angeles",
    "latlon": [34.0549076, -118.242643]
  },
  "1934": {
    "location": "Tokyo",
    "latlon": [35.6764225, 139.650027]
  },
  "1936": {
    "location": "Berlin",
    "latlon": [52.5200065999999, 13.404954]
  },
  "1948": {
    "location": "London",
    "latlon": [51.5072178, -0.1275862]
  },
  "1952": {
    "location": "Helsinki",
    "latlon": [60.1698556999999, 24.938379]
  },
  "1956": {
    "location": "Melbourne",
    "latlon": [-37.8136276, 144.9630576]
  },
  "1960": {
    "location": "Rome",
    "latlon": [41.8967068, 12.4822025]
  },
  "1964": {
    "location": "Tokyo",
    "latlon": [35.6764225, 139.650027]
  },
  "1968": {
    "location": "Mexico City",
    "latlon": [19.4326077, -99.133208]
  },
  "1972": {
    "location": "Munich",
    "latlon": [48.1351253, 11.5819806]
  },
  "1976": {
    "location": "Montreal",
    "latlon": [45.5018869, -73.5673918999999]
  },
  "1980": {
    "location": "Moscow",
    "latlon": [55.755826, 37.6173]
  },
  "1984": {
    "location": "Los Angeles",
    "latlon": [34.0549076, -118.242643]
  },
  "1988": {
    "location": "Seoul",
    "latlon": [37.550263, 126.9970831]
  },
  "1992": {
    "location": "Barcelona",
    "latlon": [41.3873974, 2.168568]
  },
  "1994": {
    "location": "Lillehammer",
    "latlon": [61.1152713, 10.4662306]
  },
  "1996": {
    "location": "Atlanta",
    "latlon": [33.748752, -84.3876844999999]
  },
  "1998": {
    "location": "Nagano",
    "latlon": [36.6485258, 138.1950371]
  },
  "2000": {
    "location": "Sydney",
    "latlon": [-33.8688197, 151.2092955]
  },
  "2002": {
    "location": "Salt Lake City",
    "latlon": [40.7607793, -111.8910474]
  },
  "2004": {
    "location": "Athens",
    "latlon": [37.9838096, 23.7275388]
  },
  "2006": {
    "location": "Turin",
    "latlon": [45.0703155, 7.6868552]
  },
  "2008": {
    "location": "Beijing",
    "latlon": [39.904211, 116.407395]
  },
  "2010": {
    "location": "Vancouver",
    "latlon": [49.2827291, -123.1207375]
  },
  "2012": {
    "location": "London",
    "latlon": [51.5072178, -0.1275862]
  },
  "2014": {
    "location": "Sochi",
    "latlon": [43.6028078999999, 39.7341543]
  },
  "2016": {
    "location": "Rio de Janeiro",
    "latlon": [-22.9068467, -43.1728965]
  },
  "2018": {
    "location": "Pyeongchang",
    "latlon": [37.3677068, 128.3954442]
  },
  "2020": {
    "location": "Tokyo",
    "latlon": [35.6764225, 139.650027]
  },
  "2022": {
    "location": "Beijing",
    "latlon": [39.904211, 116.407395]
  },
  "2024": {
    "location": "Paris",
    "latlon": [48.8575475, 2.3513765]
  }
}

export const olympicIconSvg = '<svg viewBox="-34 -12 68 33" width="1020" height="495" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="interlace"><path d="M -11,-11 h 22 v 22 h -22 z M 11,-1.5 a 10.5,10.5 0 0,0 0,21 v -3 a 7.5,7.5 0 1,1 0,-15 M -11,1.5 a 7.5,7.5 0 1,1 0,15 v 3 a 10.5,10.5 0 0,0 0,-21 z" clip-rule="evenodd"/></clipPath><clipPath id="interlace_Firefox"><!-- Firefox workaround --><path d="M 0,0 l -12,12 h 12 z"/></clipPath><g id="ring"><circle r="9" clip-path="url(#interlace)"/><circle r="9" clip-path="url(#interlace_Firefox)"/><!-- Firefox workaround --><path d="M 0,-9 a 9,9 0 0,1 9,9" transform="rotate(45)"/></g></defs><g fill="none" stroke-width="2"><g stroke="#0085c7" transform="translate(-22,0)"><use xlink:href="#ring"/><path d="M 0,-9 a 9,9 0 0,0 0,18"/></g><use xlink:href="#ring" stroke="black"/><g stroke="#df0024" transform="translate(22,0)"><use xlink:href="#ring"/><path d="M 0,-9 a 9,9 0 0,1 0,18"/></g><use xlink:href="#ring" stroke="#f4c300" transform="translate(-11,9) rotate(180)"/><use xlink:href="#ring" stroke="#009f3d" transform="translate(11,9) rotate(180)"/></g></svg>'

export const baseMapYears = [1880, 1900, 1914, 1920, 1938, 1945, 1960, 1994, 2000];

export const sportsArray = [
  "3x3 Basketball",
  "Aeronautics",
  "Alpine Skiing",
  "Alpinism",
  "Archery",
  "Art Competitions",
  "Artistic Gymnastics",
  "Artistic Swimming",
  "Athletics",
  "Badminton",
  "Baseball",
  "Basketball",
  "Basque pelota",
  "Beach Volleyball",
  "Biathlon",
  "Bobsleigh",
  "Boxing",
  "Canoe Marathon",
  "Canoe Slalom",
  "Canoe Sprint",
  "Cricket",
  "Croquet",
  "Cross Country Skiing",
  "Curling",
  "Cycling BMX Freestyle",
  "Cycling BMX Racing",
  "Cycling Mountain Bike",
  "Cycling Road",
  "Cycling Track",
  "Diving",
  "Equestrian Dressage",
  "Equestrian Driving",
  "Equestrian Eventing",
  "Equestrian Jumping",
  "Equestrian Vaulting",
  "Fencing",
  "Figure Skating",
  "Football",
  "Freestyle Skiing",
  "Golf",
  "Handball",
  "Hockey",
  "Ice Hockey",
  "Jeu De Paume",
  "Judo",
  "Karate",
  "Lacrosse",
  "Luge",
  "Marathon Swimming",
  "Military Ski Patrol",
  "Modern Pentathlon",
  "Motorboating",
  "Nordic Combined",
  "Polo",
  "Racquets",
  "Rhythmic Gymnastics",
  "Roque",
  "Rowing",
  "Rugby",
  "Rugby Sevens",
  "Sailing",
  "Shooting",
  "Short Track Speed Skating",
  "Skateboarding",
  "Skeleton",
  "Ski Jumping",
  "Snowboarding",
  "Softball",
  "Speed Skating",
  "Sport Climbing",
  "Surfing",
  "Swimming",
  "Table Tennis",
  "Taekwondo",
  "Tennis",
  "Trampolining",
  "Triathlon",
  "Tug-Of-War",
  "Volleyball",
  "Water Polo",
  "Weightlifting",
  "Wrestling"
]

export const yearsArray = ["1896",
  "1900", "1904",
  "1908",
  "1912",
  "1916 (not held)",
  "1920",
  "1924",
  "1928",
  "1932",
  "1934",
  "1936",
  "1940 (not held)",
  "1944 (not held)",
  "1948",
  "1952",
  "1956",
  "1960",
  "1964",
  "1968",
  "1972",
  "1976",
  "1980",
  "1984",
  "1988",
  "1992",
  "1994",
  "1996",
  "1998",
  "2000",
  "2002",
  "2004",
  "2006",
  "2008",
  "2010",
  "2012",
  "2014",
  "2016",
  "2018",
  "2020",
  "2022",
  "2024",
  "All years (1896-2024)",
];

export const locationsByYear = {
  "1896": "Athens",
  "1900": "Paris",
  "1904": "St. Louis",
  "1908": "London",
  "1912": "Stockholm",
  "1920": "Antwerp",
  "1924": "Paris",
  "1928": "Amsterdam",
  "1932": "Los Angeles",
  "1934": "Tokyo",
  "1936": "Berlin",
  "1948": "London",
  "1952": "Helsinki",
  "1956": "Melbourne",
  "1960": "Rome",
  "1964": "Tokyo",
  "1968": "Mexico City",
  "1972": "Munich",
  "1976": "Montreal",
  "1980": "Moscow",
  "1984": "Los Angeles",
  "1988": "Seoul",
  "1992": "Barcelona",
  "1994": "Lillehammer",
  "1996": "Atlanta",
  "1998": "Nagano",
  "2000": "Sydney",
  "2002": "Salt Lake City",
  "2004": "Athens",
  "2006": "Turin",
  "2008": "Beijing",
  "2010": "Vancouver",
  "2012": "London",
  "2014": "Sochi",
  "2016": "Rio de Janeiro",
  "2018": "Pyeongchang",
  "2020": "Tokyo",
  "2022": "Beijing",
  "2024": "Paris",
  "year": "location"
}

export const sportEvents = {
  "sport": {
    "event": [
      "year"
    ]
  },
  "Taekwondo": {
    "Flyweight, Men": [
      "2008",
      "2016",
      "2000",
      "2004",
      "2012",
      "2020"
    ],
    "Featherweight, Men": [
      "2012",
      "2020",
      "2004",
      "2008",
      "2000",
      "2016"
    ],
    "Welterweight, Men": [
      "2012",
      "2016",
      "2008",
      "2020",
      "2000",
      "2004"
    ],
    "Heavyweight, Men": [
      "2000",
      "2016",
      "2012",
      "2020",
      "2004",
      "2008"
    ],
    "Flyweight, Women": [
      "2000",
      "2016",
      "2008",
      "2012",
      "2004",
      "2020"
    ],
    "Heavyweight, Women": [
      "2008",
      "2000",
      "2004",
      "2016",
      "2012",
      "2020"
    ],
    "Welterweight, Women": [
      "2008",
      "2004",
      "2016",
      "2020",
      "2012",
      "2000"
    ],
    "Featherweight, Women": [
      "2012",
      "2020",
      "2008",
      "2016",
      "2004",
      "2000"
    ]
  },
  "Boxing": {
    "Middleweight, Men": [
      "1984",
      "1996",
      "1932",
      "1936",
      "1956",
      "1908",
      "2000",
      "2016",
      "1924",
      "1928",
      "2012",
      "2020",
      "1952",
      "1920",
      "1988",
      "1992",
      "1976",
      "1980",
      "2008",
      "1972",
      "1964",
      "1948",
      "1968",
      "2004",
      "1960",
      "1904"
    ],
    "Light-Heavyweight, Men": [
      "1984",
      "1928",
      "1936",
      "1948",
      "1952",
      "1960",
      "2020",
      "2004",
      "2012",
      "1964",
      "1968",
      "1956",
      "2008",
      "1972",
      "1976",
      "1980",
      "2016",
      "2000",
      "1924",
      "1932",
      "1992",
      "1996",
      "1920",
      "1988"
    ],
    "Featherweight, Men": [
      "1992",
      "1924",
      "1928",
      "1932",
      "1936",
      "1996",
      "2008",
      "1968",
      "1972",
      "1976",
      "1980",
      "2020",
      "1952",
      "1956",
      "1960",
      "1920",
      "1964",
      "2004",
      "1908",
      "1948",
      "1988",
      "2000",
      "1984",
      "1904"
    ],
    "Lightweight, Men": [
      "1996",
      "1924",
      "1960",
      "2008",
      "2020",
      "1948",
      "2016",
      "1984",
      "1920",
      "1972",
      "1980",
      "2000",
      "2004",
      "2012",
      "1988",
      "1936",
      "1952",
      "1956",
      "1992",
      "1908",
      "1964",
      "1928",
      "1968",
      "1976",
      "1932",
      "1904"
    ],
    "Light-Welterweight, Men": [
      "2000",
      "1988",
      "2016",
      "1972",
      "1976",
      "2004",
      "1992",
      "1968",
      "1980",
      "1996",
      "2008",
      "2012",
      "1960",
      "1952",
      "1964",
      "1956",
      "1984"
    ],
    "Welterweight, Men": [
      "1924",
      "1928",
      "1968",
      "1956",
      "1920",
      "2008",
      "1972",
      "1980",
      "1992",
      "1996",
      "2004",
      "2020",
      "1948",
      "1936",
      "1952",
      "1976",
      "1932",
      "1964",
      "1984",
      "1988",
      "2016",
      "1960",
      "2012",
      "2000",
      "1904"
    ],
    "Heavyweight, Men": [
      "1924",
      "1928",
      "1932",
      "1936",
      "1948",
      "2012",
      "2004",
      "1976",
      "2020",
      "1984",
      "1996",
      "1972",
      "1980",
      "1992",
      "2000",
      "2008",
      "2016",
      "1960",
      "1920",
      "1952",
      "1964",
      "1908",
      "1956",
      "1968",
      "1988",
      "1904"
    ],
    "Flyweight, Men": [
      "1948",
      "2004",
      "1968",
      "1972",
      "1980",
      "2016",
      "1976",
      "1992",
      "1996",
      "2008",
      "2012",
      "1920",
      "1988",
      "1928",
      "1956",
      "2000",
      "1936",
      "1952",
      "1924",
      "2020",
      "1932",
      "1960",
      "1964",
      "1984",
      "1904"
    ],
    "Light-Middleweight, Men": [
      "1952",
      "1984",
      "1988",
      "1968",
      "1976",
      "1980",
      "1992",
      "1996",
      "1972",
      "1964",
      "1956",
      "1960",
      "2000"
    ],
    "Bantamweight, Men": [
      "1960",
      "2004",
      "1988",
      "1920",
      "1932",
      "1984",
      "1956",
      "1972",
      "1980",
      "1992",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "1952",
      "1924",
      "1908",
      "1976",
      "1948",
      "1928",
      "1936",
      "1964",
      "1968",
      "1904"
    ],
    "Super-Heavyweight, Men": [
      "2012",
      "1992",
      "1988",
      "2008",
      "2016",
      "2004",
      "1984",
      "2000",
      "2020",
      "1996"
    ],
    "Lightweight, Women": [
      "2012",
      "2020",
      "2016"
    ],
    "Light-Flyweight, Men": [
      "1980",
      "1988",
      "1992",
      "1996",
      "2004",
      "2008",
      "2012",
      "2016",
      "1976",
      "2000",
      "1972",
      "1984",
      "1968"
    ],
    "Flyweight, Women": [
      "2020",
      "2012",
      "2016"
    ],
    "Middleweight, Women": [
      "2012",
      "2016",
      "2020"
    ],
    "Welterweight, Women": [
      "2020"
    ],
    "Featherweight, Women": [
      "2020"
    ]
  },
  "Athletics": {
    "1,500 metres, Women": [
      "1992",
      "2000",
      "1996",
      "2012",
      "1972",
      "1976",
      "1980",
      "2016",
      "2004",
      "2020",
      "1984",
      "2008",
      "1988"
    ],
    "1,500 metres, Men": [
      "1996",
      "2012",
      "2016",
      "1896",
      "1956",
      "1960",
      "1976",
      "1932",
      "1964",
      "1980",
      "1988",
      "1924",
      "1928",
      "1972",
      "1900",
      "2008",
      "1952",
      "1908",
      "1912",
      "1920",
      "1984",
      "2020",
      "1936",
      "1968",
      "2000",
      "2004",
      "1992",
      "1948",
      "1904"
    ],
    "800 metres, Men": [
      "2000",
      "2016",
      "1896",
      "1968",
      "1960",
      "1976",
      "2012",
      "1984",
      "1988",
      "1932",
      "1936",
      "1964",
      "2004",
      "1948",
      "1908",
      "1928",
      "1952",
      "1900",
      "1920",
      "1924",
      "1956",
      "1980",
      "1972",
      "1992",
      "1996",
      "2008",
      "2020",
      "1904",
      "1912"
    ],
    "5,000 metres, Men": [
      "2000",
      "1948",
      "1996",
      "2020",
      "1952",
      "1988",
      "1980",
      "1992",
      "2004",
      "2008",
      "2012",
      "2016",
      "1912",
      "1920",
      "1924",
      "1928",
      "1932",
      "1936",
      "1972",
      "1976",
      "1960",
      "1964",
      "1956",
      "1968",
      "1984"
    ],
    "High Jump, Men": [
      "2000",
      "1948",
      "1956",
      "1992",
      "2020",
      "1952",
      "1932",
      "1976",
      "2012",
      "2016",
      "1984",
      "2004",
      "1972",
      "1980",
      "1908",
      "1924",
      "1928",
      "1904",
      "1912",
      "1900",
      "1996",
      "2008",
      "1960",
      "1964",
      "1968",
      "1988",
      "1920",
      "1896",
      "1936"
    ],
    "Triple Jump, Men": [
      "1924",
      "1936",
      "1948",
      "1952",
      "1956",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "2020",
      "1908",
      "2016",
      "1996",
      "2000",
      "1920",
      "1928",
      "1896",
      "1984",
      "2008",
      "2012",
      "1932",
      "1960",
      "1964",
      "2004",
      "1912",
      "1992",
      "1900",
      "1904"
    ],
    "Marathon, Men": [
      "1932",
      "1948",
      "1952",
      "1972",
      "1976",
      "2020",
      "2004",
      "1928",
      "1988",
      "1980",
      "1920",
      "1960",
      "1964",
      "1968",
      "2000",
      "2008",
      "2016",
      "1924",
      "1956",
      "1900",
      "1992",
      "1936",
      "1984",
      "1896",
      "1996",
      "2012",
      "1908",
      "1912",
      "1904"
    ],
    "Long Jump, Women": [
      "1948",
      "2008",
      "1972",
      "1976",
      "1980",
      "1988",
      "1960",
      "1992",
      "2000",
      "2020",
      "1952",
      "1964",
      "1968",
      "1984",
      "1996",
      "1956",
      "2004",
      "2012",
      "2016"
    ],
    "3,500 metres Race Walk, Men": [
      "1908"
    ],
    "60 metres, Men": [
      "1900",
      "1904"
    ],
    "100 metres, Men": [
      "1900",
      "1956",
      "2000",
      "1980",
      "1908",
      "1928",
      "1964",
      "1984",
      "1996",
      "2016",
      "2020",
      "1896",
      "1932",
      "1960",
      "1920",
      "1924",
      "1952",
      "1988",
      "1992",
      "1968",
      "1972",
      "1976",
      "2008",
      "2012",
      "1936",
      "1948",
      "2004",
      "1904",
      "1912"
    ],
    "200 metres, Men": [
      "1900",
      "1968",
      "1988",
      "1908",
      "1928",
      "2016",
      "2020",
      "1960",
      "1912",
      "1920",
      "1924",
      "1980",
      "2000",
      "1972",
      "1976",
      "2008",
      "2012",
      "1992",
      "1996",
      "1936",
      "1948",
      "1964",
      "1904",
      "1932",
      "1952",
      "1956",
      "1984",
      "2004"
    ],
    "3,000 metres Race Walk, Men": [
      "1920"
    ],
    "Long Jump, Men": [
      "1948",
      "1984",
      "2000",
      "2012",
      "1908",
      "1912",
      "2008",
      "2020",
      "1968",
      "1976",
      "1980",
      "1956",
      "1936",
      "1900",
      "1964",
      "2016",
      "1928",
      "1952",
      "1996",
      "1932",
      "1924",
      "1960",
      "2004",
      "1920",
      "1896",
      "1904",
      "1972",
      "1988",
      "1992"
    ],
    "100 metres, Women": [
      "1948",
      "1952",
      "1956",
      "1972",
      "2004",
      "1928",
      "1932",
      "1976",
      "1980",
      "1988",
      "1936",
      "1960",
      "2000",
      "1984",
      "1992",
      "1996",
      "2008",
      "2012",
      "2016",
      "2020",
      "1964",
      "1968"
    ],
    "80 metres Hurdles, Women": [
      "1948",
      "1952",
      "1956",
      "1964",
      "1968",
      "1936",
      "1960",
      "1932"
    ],
    "4 × 100 metres Relay, Women": [
      "1948",
      "1956",
      "2008",
      "1928",
      "1932",
      "1936",
      "1984",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "2004",
      "1952",
      "1960",
      "1964",
      "2016",
      "2020",
      "1996",
      "2000",
      "2012",
      "1992"
    ],
    "200 metres, Women": [
      "1952",
      "1956",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "1996",
      "1960",
      "1948",
      "1984",
      "1992",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "10,000 metres, Men": [
      "1956",
      "1960",
      "1964",
      "1972",
      "1948",
      "1952",
      "2004",
      "1968",
      "1980",
      "1992",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "1912",
      "1920",
      "1924",
      "1928",
      "1932",
      "1936",
      "1976",
      "1984",
      "1988"
    ],
    "4 × 400 metres Relay, Men": [
      "1956",
      "2004",
      "2020",
      "1928",
      "1932",
      "1992",
      "1980",
      "1912",
      "1920",
      "1948",
      "1972",
      "1936",
      "1952",
      "1960",
      "1924",
      "1964",
      "1984",
      "1996",
      "2008",
      "1988",
      "2000",
      "2016",
      "1968",
      "1976",
      "2012"
    ],
    "20 kilometres Race Walk, Men": [
      "1960",
      "2004",
      "2008",
      "2016",
      "1992",
      "2012",
      "1988",
      "1972",
      "1976",
      "1980",
      "1996",
      "1964",
      "1984",
      "2020",
      "1968",
      "2000",
      "1956"
    ],
    "800 metres, Women": [
      "1960",
      "2000",
      "1976",
      "2016",
      "1992",
      "1996",
      "1972",
      "1988",
      "1964",
      "1928",
      "2004",
      "2020",
      "2008",
      "2012",
      "1968",
      "1984",
      "1980"
    ],
    "400 metres, Women": [
      "1964",
      "1996",
      "2000",
      "1992",
      "1980",
      "2020",
      "1972",
      "1976",
      "1988",
      "1968",
      "1984",
      "2008",
      "2012",
      "2016",
      "2004"
    ],
    "High Jump, Women": [
      "1964",
      "2020",
      "1972",
      "2008",
      "1976",
      "1988",
      "1996",
      "2016",
      "1928",
      "1932",
      "1992",
      "1968",
      "1980",
      "1948",
      "1936",
      "1952",
      "1956",
      "1960",
      "1984",
      "2000",
      "2004",
      "2012"
    ],
    "400 metres, Men": [
      "1980",
      "1928",
      "1932",
      "2020",
      "1984",
      "1976",
      "1900",
      "2012",
      "1956",
      "1912",
      "1960",
      "1896",
      "1908",
      "1920",
      "1924",
      "1936",
      "1996",
      "2016",
      "1948",
      "1952",
      "2000",
      "1972",
      "1992",
      "1964",
      "1904",
      "1968",
      "1988",
      "2004",
      "2008"
    ],
    "Shot Put, Women": [
      "1984",
      "1948",
      "2000",
      "1972",
      "1976",
      "1988",
      "1992",
      "1996",
      "2008",
      "2012",
      "2020",
      "2004",
      "1968",
      "1980",
      "1952",
      "1956",
      "1960",
      "1964",
      "2016"
    ],
    "Heptathlon, Women": [
      "1984",
      "1996",
      "2000",
      "2016",
      "2020",
      "1988",
      "1992",
      "2012",
      "2004",
      "2008"
    ],
    "Marathon, Women": [
      "1988",
      "2016",
      "2008",
      "1996",
      "2012",
      "1992",
      "2000",
      "2004",
      "2020",
      "1984"
    ],
    "400 metres Hurdles, Women": [
      "1988",
      "2012",
      "2016",
      "1992",
      "2008",
      "2004",
      "1996",
      "2000",
      "1984",
      "2020"
    ],
    "Discus Throw, Women": [
      "1992",
      "1996",
      "2000",
      "1972",
      "1976",
      "1980",
      "1988",
      "2008",
      "2012",
      "2016",
      "2020",
      "2004",
      "1956",
      "1948",
      "1936",
      "1964",
      "1968",
      "1984",
      "1928",
      "1932",
      "1960",
      "1952"
    ],
    "Javelin Throw, Women": [
      "1996",
      "2020",
      "1948",
      "1968",
      "1956",
      "2016",
      "1980",
      "2000",
      "2004",
      "2008",
      "2012",
      "1952",
      "1960",
      "1972",
      "1976",
      "1988",
      "1984",
      "1932",
      "1936",
      "1992",
      "1964"
    ],
    "Pole Vault, Women": [
      "2000",
      "2012",
      "2020",
      "2016",
      "2004",
      "2008"
    ],
    "20 kilometres Race Walk, Women": [
      "2004",
      "2000",
      "2012",
      "2016",
      "2020",
      "2008"
    ],
    "50 kilometres Race Walk, Men": [
      "2008",
      "2012",
      "2016",
      "2020",
      "1952",
      "1968",
      "1980",
      "1988",
      "1992",
      "1932",
      "1936",
      "1948",
      "1960",
      "1964",
      "1984",
      "2000",
      "1956",
      "1996",
      "2004",
      "1972"
    ],
    "Pole Vault, Men": [
      "2008",
      "2016",
      "2020",
      "1908",
      "1912",
      "1920",
      "1968",
      "1972",
      "1948",
      "1960",
      "1976",
      "1984",
      "1996",
      "2012",
      "1964",
      "1896",
      "1956",
      "2004",
      "1932",
      "1936",
      "1900",
      "1980",
      "2000",
      "1988",
      "1992",
      "1952",
      "1904",
      "1924",
      "1928"
    ],
    "100 metres Hurdles, Women": [
      "2008",
      "2012",
      "1988",
      "1992",
      "1972",
      "1976",
      "1980",
      "1984",
      "1996",
      "2020",
      "2000",
      "2004",
      "2016"
    ],
    "Decathlon, Men": [
      "2020",
      "2008",
      "1988",
      "2016",
      "1960",
      "2012",
      "1996",
      "2000",
      "2004",
      "1992",
      "1924",
      "1928",
      "1932",
      "1948",
      "1964",
      "1980",
      "1984",
      "1920",
      "1972",
      "1956",
      "1976",
      "1912",
      "1936",
      "1952",
      "1968"
    ],
    "Pentathlon, Women": [
      "1968",
      "1972",
      "1976",
      "1964",
      "1980"
    ],
    "Discus Throw, Men": [
      "2020",
      "1996",
      "1900",
      "1980",
      "1992",
      "1964",
      "1968",
      "1972",
      "1976",
      "1988",
      "2004",
      "2008",
      "2012",
      "1912",
      "1920",
      "1924",
      "1928",
      "1932",
      "2000",
      "2016",
      "1896",
      "1904",
      "1936",
      "1948",
      "1952",
      "1908",
      "1956",
      "1960",
      "1984"
    ],
    "3,000 metres Steeplechase, Women": [
      "2016",
      "2012",
      "2008",
      "2020"
    ],
    "10,000 metres, Women": [
      "2020",
      "1996",
      "2004",
      "1992",
      "2000",
      "2008",
      "2012",
      "2016",
      "1988"
    ],
    "Hammer Throw, Men": [
      "2000",
      "2008",
      "2016",
      "1908",
      "1912",
      "1972",
      "1932",
      "1984",
      "1936",
      "1952",
      "1964",
      "1924",
      "1948",
      "1960",
      "1968",
      "1996",
      "2012",
      "1928",
      "2004",
      "2020",
      "1956",
      "1976",
      "1980",
      "1988",
      "1920",
      "1900",
      "1904"
    ],
    "3,000 metres Steeplechase, Men": [
      "1964",
      "1976",
      "1980",
      "2020",
      "1924",
      "1928",
      "1932",
      "1936",
      "1972",
      "1984",
      "2008",
      "2012",
      "2016",
      "1920",
      "1952",
      "1956",
      "1988",
      "1996",
      "1968",
      "1992",
      "2000",
      "2004",
      "1960",
      "1948"
    ],
    "4 × 100 metres Relay, Men": [
      "1996",
      "2000",
      "2008",
      "1984",
      "2016",
      "2020",
      "1968",
      "1992",
      "1976",
      "1920",
      "1964",
      "1980",
      "1988",
      "2012",
      "1928",
      "1932",
      "1936",
      "1956",
      "1960",
      "1912",
      "1924",
      "1948",
      "2004",
      "1952",
      "1972"
    ],
    "400 metres Hurdles, Men": [
      "2020",
      "1936",
      "2004",
      "2012",
      "1980",
      "1924",
      "1900",
      "1908",
      "1928",
      "1964",
      "1968",
      "1972",
      "1992",
      "1932",
      "2016",
      "2000",
      "1952",
      "1988",
      "1976",
      "1948",
      "1904",
      "1920",
      "1956",
      "1960",
      "1984",
      "1996",
      "2008"
    ],
    "Triple Jump, Women": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "1996",
      "2020"
    ],
    "56-pound Weight Throw, Men": [
      "1904",
      "1920"
    ],
    "10 kilometres Race Walk, Men": [
      "1912",
      "1920",
      "1924",
      "1952",
      "1948"
    ],
    "Pentathlon, Men": [
      "1912",
      "1920",
      "1924"
    ],
    "110 metres Hurdles, Men": [
      "1920",
      "1992",
      "2004",
      "1976",
      "1980",
      "2000",
      "2008",
      "1984",
      "1972",
      "2016",
      "1996",
      "1896",
      "1932",
      "1936",
      "1988",
      "1968",
      "2012",
      "2020",
      "1924",
      "1928",
      "1964",
      "1900",
      "1904",
      "1908",
      "1912",
      "1948",
      "1952",
      "1956",
      "1960"
    ],
    "3,000 metres, Women": [
      "1984",
      "1992",
      "1988"
    ],
    "4 × 400 metres Relay, Women": [
      "1984",
      "1972",
      "1976",
      "1980",
      "1988",
      "1996",
      "1992",
      "2008",
      "2016",
      "2000",
      "2004",
      "2012",
      "2020"
    ],
    "Shot Put, Men": [
      "2008",
      "1932",
      "1956",
      "2004",
      "1972",
      "1976",
      "1980",
      "1988",
      "1920",
      "1936",
      "2000",
      "1928",
      "2012",
      "1908",
      "1896",
      "1964",
      "1984",
      "2016",
      "2020",
      "1968",
      "1996",
      "1900",
      "1904",
      "1912",
      "1924",
      "1948",
      "1952",
      "1960",
      "1992"
    ],
    "10 kilometres Race Walk, Women": [
      "1992",
      "1996"
    ],
    "5,000 metres, Women": [
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Hammer Throw, Women": [
      "2008",
      "2012",
      "2016",
      "2020",
      "2004",
      "2000"
    ],
    "Javelin Throw, Men": [
      "1996",
      "2000",
      "2012",
      "2020",
      "1988",
      "1992",
      "1980",
      "1912",
      "1920",
      "1924",
      "1932",
      "1936",
      "1948",
      "1952",
      "1964",
      "1968",
      "1976",
      "1984",
      "2008",
      "1960",
      "2016",
      "1928",
      "2004",
      "1908",
      "1956",
      "1972"
    ],
    "4 × 400 metres Relay, Mixed": [
      "2020"
    ],
    "Discus Throw, Greek Style, Men": [
      "1908"
    ],
    "Cross-Country, Individual, Men": [
      "1912",
      "1920",
      "1924"
    ],
    "Cross-Country, Team, Men": [
      "1912",
      "1920",
      "1924"
    ],
    "Shot Put, Both Hands, Men": [
      "1912"
    ],
    "Discus Throw, Both Hands, Men": [
      "1912"
    ],
    "Javelin Throw, Both Hands, Men": [
      "1912"
    ],
    "3,000 metres, Team, Men": [
      "1924",
      "1912",
      "1920"
    ],
    "2,500 metres Steeplechase, Men": [
      "1900"
    ],
    "5,000 metres, Team, Men": [
      "1900"
    ],
    "Standing Long Jump, Men": [
      "1900",
      "1908",
      "1912",
      "1904"
    ],
    "3 miles, Team, Men": [
      "1908"
    ],
    "1,600 metres Medley Relay, Men": [
      "1908"
    ],
    "4,000 metres Steeplechase, Men": [
      "1900"
    ],
    "2,590 metres Steeplechase, Men": [
      "1904"
    ],
    "All-Around Championship, Men": [
      "1904"
    ],
    "5 miles, Men": [
      "1908"
    ],
    "3,200 metres Steeplechase, Men": [
      "1908"
    ],
    "10 miles Race Walk, Men": [
      "1908"
    ],
    "Standing High Jump, Men": [
      "1908",
      "1912",
      "1900",
      "1904"
    ],
    "Javelin Throw, Freestyle, Men": [
      "1908"
    ],
    "200 metres Hurdles, Men": [
      "1900",
      "1904"
    ],
    "Standing Triple Jump, Men": [
      "1900",
      "1904"
    ],
    "4 miles, Team, Men": [
      "1904"
    ]
  },
  "Judo": {
    "Middleweight, Men": [
      "2008",
      "1984",
      "1988",
      "2000",
      "1992",
      "2016",
      "1980",
      "2012",
      "1972",
      "2004",
      "2020",
      "1964",
      "1996",
      "1976"
    ],
    "Half-Lightweight, Women": [
      "2008",
      "2004",
      "1992",
      "2000",
      "1996",
      "2012",
      "2020",
      "2016"
    ],
    "Extra-Lightweight, Women": [
      "2008",
      "2016",
      "2000",
      "2012",
      "2004",
      "1992",
      "1996",
      "2020"
    ],
    "Open Class, Men": [
      "1964",
      "1980",
      "1972",
      "1976",
      "1984"
    ],
    "Lightweight, Women": [
      "2000",
      "1996",
      "2008",
      "2016",
      "2020",
      "1992",
      "2004",
      "2012"
    ],
    "Half-Lightweight, Men": [
      "1984",
      "1992",
      "1996",
      "2020",
      "1980",
      "2004",
      "2008",
      "1988",
      "2000",
      "2012",
      "2016"
    ],
    "Half-Middleweight, Women": [
      "2004",
      "1996",
      "2000",
      "2020",
      "1992",
      "2012",
      "2008",
      "2016"
    ],
    "Extra-Lightweight, Men": [
      "2008",
      "2012",
      "2020",
      "1980",
      "2000",
      "2004",
      "1992",
      "1996",
      "1984",
      "1988",
      "2016"
    ],
    "Half-Middleweight, Men": [
      "2020",
      "2004",
      "2008",
      "2012",
      "1980",
      "1972",
      "1988",
      "2000",
      "1976",
      "1984",
      "1992",
      "1996",
      "2016"
    ],
    "Middleweight, Women": [
      "2020",
      "1992",
      "1996",
      "2004",
      "2012",
      "2016",
      "2000",
      "2008"
    ],
    "Lightweight, Men": [
      "2008",
      "2016",
      "2000",
      "1984",
      "2004",
      "1976",
      "1980",
      "1988",
      "1972",
      "1996",
      "2012",
      "2020",
      "1992",
      "1964"
    ],
    "Half-Heavyweight, Men": [
      "2008",
      "2016",
      "2004",
      "1980",
      "1988",
      "1972",
      "1984",
      "1996",
      "2000",
      "2012",
      "1976",
      "1992",
      "2020"
    ],
    "Heavyweight, Women": [
      "2020",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016"
    ],
    "Heavyweight, Men": [
      "1996",
      "2012",
      "2016",
      "1980",
      "1964",
      "1984",
      "2008",
      "2020",
      "1988",
      "2000",
      "2004",
      "1992",
      "1972",
      "1976"
    ],
    "Half-Heavyweight, Women": [
      "1996",
      "2012",
      "2016",
      "2020",
      "2000",
      "2004",
      "2008",
      "1992"
    ],
    "Team, Mixed": [
      "2020"
    ]
  },
  "Polo": {
    "Polo, Men": [
      "1924",
      "1936",
      "1900",
      "1908",
      "1920"
    ]
  },
  "Fencing": {
    "Foil, Team, Men": [
      "1928",
      "1924",
      "1948",
      "2000",
      "2004",
      "1904",
      "1992",
      "1996",
      "1920",
      "1932",
      "1936",
      "1952",
      "1956",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1984",
      "2016",
      "2020",
      "1960",
      "2012",
      "1988"
    ],
    "Sabre, Individual, Men": [
      "1900",
      "1908",
      "2008",
      "1904",
      "1896",
      "1924",
      "1964",
      "1984",
      "1988",
      "1992",
      "1996",
      "2000",
      "1912",
      "1928",
      "1932",
      "1936",
      "1948",
      "1952",
      "1956",
      "1960",
      "1968",
      "1972",
      "1980",
      "2004",
      "2012",
      "2016",
      "2020",
      "1920",
      "1976"
    ],
    "Sabre, Masters, Individual, Men": [
      "1900"
    ],
    "Foil, Individual, Men": [
      "1912",
      "1924",
      "2012",
      "1904",
      "1992",
      "2020",
      "1988",
      "1896",
      "1900",
      "1920",
      "1928",
      "1936",
      "1948",
      "1952",
      "1956",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1996",
      "2004",
      "2000",
      "2008",
      "1932",
      "1984",
      "2016",
      "1960"
    ],
    "Sabre, Team, Men": [
      "1912",
      "1908",
      "1920",
      "1952",
      "1984",
      "1992",
      "2000",
      "2004",
      "2008",
      "1936",
      "1924",
      "1928",
      "1932",
      "1948",
      "1956",
      "1960",
      "1968",
      "1972",
      "1980",
      "1988",
      "1996",
      "2020",
      "1964",
      "1976",
      "2012"
    ],
    "Foil, Individual, Women": [
      "1932",
      "1936",
      "1948",
      "1984",
      "1992",
      "1924",
      "1952",
      "1956",
      "1980",
      "1928",
      "1960",
      "1964",
      "2000",
      "1968",
      "1972",
      "1976",
      "1996",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1988"
    ],
    "Épée, Team, Men": [
      "1908",
      "1912",
      "1920",
      "1924",
      "2000",
      "1928",
      "1932",
      "1936",
      "1948",
      "1956",
      "1964",
      "1980",
      "1984",
      "1988",
      "1996",
      "2004",
      "2008",
      "2016",
      "1992",
      "1960",
      "1968",
      "1972",
      "1952",
      "2020",
      "1976"
    ],
    "Épée, Individual, Men": [
      "1912",
      "1924",
      "2004",
      "1900",
      "1904",
      "1996",
      "1908",
      "1920",
      "1928",
      "1932",
      "1972",
      "1980",
      "1984",
      "1988",
      "1992",
      "2000",
      "2008",
      "2016",
      "2020",
      "1960",
      "1964",
      "1968",
      "1976",
      "1936",
      "1948",
      "1952",
      "1956",
      "2012"
    ],
    "Épée, Team, Women": [
      "2000",
      "2012",
      "2016",
      "2020",
      "1996",
      "2004"
    ],
    "Sabre, Individual, Women": [
      "2004",
      "2020",
      "2012",
      "2016",
      "2008"
    ],
    "Sabre, Team, Women": [
      "2008",
      "2020",
      "2016"
    ],
    "Épée, Individual, Women": [
      "2012",
      "2016",
      "2020",
      "1996",
      "2000",
      "2004",
      "2008"
    ],
    "Épée, Masters and Amateurs, Individual, Men": [
      "1900"
    ],
    "Foil, Masters, Individual, Men": [
      "1896",
      "1900"
    ],
    "Épée, Masters, Individual, Men": [
      "1900"
    ],
    "Foil, Team, Women": [
      "1976",
      "1980",
      "1984",
      "2020",
      "1964",
      "1992",
      "1996",
      "2000",
      "1960",
      "1968",
      "1972",
      "1988",
      "2008",
      "2012"
    ],
    "Single Sticks, Individual, Men": [
      "1904"
    ]
  },
  "Football": {
    "Football, Men": [
      "1928",
      "1996",
      "2004",
      "2008",
      "1936",
      "1900",
      "1920",
      "1984",
      "1988",
      "2012",
      "2016",
      "2020",
      "1956",
      "1968",
      "2000",
      "1904",
      "1964",
      "1980",
      "1908",
      "1912",
      "1948",
      "1960",
      "1972",
      "1976",
      "1992",
      "1952",
      "1924"
    ],
    "Football, Women": [
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1996",
      "2000"
    ]
  },
  "Swimming": {
    "400 metres Freestyle, Men": [
      "1928",
      "1908",
      "1912",
      "1924",
      "1948",
      "1956",
      "1960",
      "1964",
      "1972",
      "1984",
      "1988",
      "1992",
      "1996",
      "2000",
      "2004",
      "2016",
      "2020",
      "1920",
      "1968",
      "2008",
      "2012",
      "1932",
      "1952",
      "1936",
      "1976",
      "1980"
    ],
    "100 metres Freestyle, Women": [
      "1936",
      "1912",
      "1956",
      "1960",
      "1964",
      "1972",
      "2004",
      "2008",
      "2020",
      "2012",
      "2016",
      "1988",
      "1992",
      "1996",
      "1948",
      "1976",
      "1980",
      "1928",
      "1952",
      "1932",
      "1984",
      "2000",
      "1920",
      "1924",
      "1968"
    ],
    "400 metres Individual Medley, Women": [
      "2004",
      "1972",
      "1984",
      "2008",
      "1976",
      "1992",
      "2012",
      "1968",
      "1980",
      "1988",
      "1996",
      "2016",
      "2000",
      "2020",
      "1964"
    ],
    "1,500 metres Freestyle, Men": [
      "1908",
      "1912",
      "1920",
      "1924",
      "1928",
      "1948",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "1952",
      "2012",
      "1988",
      "2016",
      "1932",
      "1936",
      "2020",
      "1984"
    ],
    "100 metres Freestyle, Men": [
      "1912",
      "1956",
      "1960",
      "1968",
      "1984",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1896",
      "1992",
      "1996",
      "1980",
      "1988",
      "1964",
      "1908",
      "1928",
      "1936",
      "1948",
      "1932",
      "1952",
      "2000",
      "1972",
      "1920",
      "1924",
      "1976"
    ],
    "4 × 200 metres Freestyle Relay, Men": [
      "1912",
      "1920",
      "1924",
      "1956",
      "1960",
      "1968",
      "2000",
      "2004",
      "2008",
      "2020",
      "1980",
      "1928",
      "2012",
      "1988",
      "1948",
      "1952",
      "1964",
      "1996",
      "1908",
      "1976",
      "1984",
      "2016",
      "1932",
      "1936",
      "1972",
      "1992"
    ],
    "100 metres Backstroke, Women": [
      "1932",
      "1948",
      "2012",
      "2020",
      "1968",
      "1976",
      "2016",
      "1980",
      "1988",
      "1964",
      "2004",
      "1924",
      "1928",
      "1956",
      "1960",
      "1972",
      "1992",
      "2000",
      "1936",
      "1952",
      "1984",
      "1996",
      "2008"
    ],
    "200 metres Breaststroke, Women": [
      "1932",
      "1948",
      "1972",
      "2004",
      "2008",
      "1984",
      "1988",
      "1992",
      "2016",
      "1936",
      "1928",
      "1956",
      "1960",
      "1924",
      "1952",
      "1996",
      "2000",
      "2012",
      "2020",
      "1964",
      "1968",
      "1976",
      "1980"
    ],
    "200 metres Breaststroke, Men": [
      "1952",
      "1964",
      "1984",
      "2008",
      "2020",
      "1924",
      "1920",
      "1912",
      "1928",
      "1936",
      "1908",
      "1972",
      "1976",
      "1988",
      "1992",
      "2012",
      "1980",
      "1996",
      "2004",
      "2000",
      "1932",
      "1956",
      "1960",
      "2016",
      "1968",
      "1948"
    ],
    "100 metres Backstroke, Men": [
      "1956",
      "1960",
      "2000",
      "2008",
      "2004",
      "1920",
      "1984",
      "1992",
      "2016",
      "1996",
      "1908",
      "1968",
      "1972",
      "1976",
      "1948",
      "1952",
      "1912",
      "1924",
      "1932",
      "1936",
      "1988",
      "2012",
      "2020",
      "1980",
      "1928"
    ],
    "400 metres Freestyle, Women": [
      "1956",
      "1968",
      "1972",
      "1992",
      "2020",
      "1976",
      "2000",
      "1936",
      "1948",
      "1980",
      "1988",
      "2004",
      "2012",
      "1996",
      "1984",
      "2008",
      "2016",
      "1952",
      "1928",
      "1960",
      "1932",
      "1924",
      "1964"
    ],
    "4 × 100 metres Freestyle Relay, Women": [
      "1956",
      "1960",
      "1964",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1912",
      "1968",
      "1976",
      "1992",
      "1996",
      "1948",
      "1972",
      "1980",
      "1988",
      "1936",
      "1920",
      "1924",
      "1928",
      "1932",
      "1952",
      "1984",
      "2000"
    ],
    "200 metres Butterfly, Men": [
      "1960",
      "1964",
      "1984",
      "1996",
      "2000",
      "1988",
      "1980",
      "1992",
      "1968",
      "2004",
      "1956",
      "2008",
      "2016",
      "2020",
      "2012",
      "1972",
      "1976"
    ],
    "4 × 100 metres Medley Relay, Men": [
      "1960",
      "1964",
      "1980",
      "1984",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "1972",
      "1976",
      "1988",
      "1992",
      "1968",
      "2004",
      "2020"
    ],
    "100 metres Butterfly, Women": [
      "1960",
      "1968",
      "2004",
      "2008",
      "2012",
      "2020",
      "2016",
      "1988",
      "1992",
      "1996",
      "1972",
      "1976",
      "1980",
      "1964",
      "2000",
      "1956",
      "1984"
    ],
    "4 × 100 metres Medley Relay, Women": [
      "1960",
      "1968",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1976",
      "1984",
      "1988",
      "1972",
      "1980",
      "1992",
      "1964"
    ],
    "4 × 100 metres Freestyle Relay, Men": [
      "1964",
      "1968",
      "1984",
      "2000",
      "2008",
      "2016",
      "2020",
      "1972",
      "1988",
      "2012",
      "1992",
      "1996",
      "2004"
    ],
    "200 metres Freestyle, Men": [
      "1968",
      "1980",
      "1988",
      "1996",
      "2000",
      "2004",
      "1900",
      "2020",
      "2012",
      "2016",
      "1992",
      "2008",
      "1972",
      "1976",
      "1984"
    ],
    "200 metres Freestyle, Women": [
      "1972",
      "2000",
      "2012",
      "2016",
      "2020",
      "2008",
      "1988",
      "1996",
      "1976",
      "1980",
      "2004",
      "1992",
      "1984",
      "1968"
    ],
    "800 metres Freestyle, Women": [
      "1972",
      "1980",
      "1988",
      "1992",
      "2020",
      "2008",
      "1976",
      "2004",
      "1996",
      "1984",
      "2012",
      "2016",
      "1968",
      "2000"
    ],
    "100 metres Breaststroke, Women": [
      "1972",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "1988",
      "1984",
      "1980",
      "1976",
      "2012",
      "2016",
      "2020",
      "1968"
    ],
    "200 metres Individual Medley, Women": [
      "1972",
      "1984",
      "2008",
      "2012",
      "1996",
      "1992",
      "1988",
      "2016",
      "2020",
      "2000",
      "2004",
      "1968"
    ],
    "200 metres Backstroke, Men": [
      "1980",
      "2000",
      "2016",
      "1900",
      "2004",
      "1984",
      "1968",
      "1972",
      "1988",
      "2020",
      "1992",
      "1996",
      "2012",
      "2008",
      "1964",
      "1976"
    ],
    "100 metres Breaststroke, Men": [
      "1980",
      "1984",
      "1992",
      "2012",
      "1996",
      "2004",
      "2008",
      "1976",
      "1988",
      "2016",
      "2020",
      "2000",
      "1972",
      "1968"
    ],
    "200 metres Butterfly, Women": [
      "1980",
      "1984",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2016",
      "2012",
      "2020",
      "1968",
      "1976",
      "1988",
      "1972"
    ],
    "100 metres Butterfly, Men": [
      "1984",
      "1996",
      "2000",
      "2008",
      "1972",
      "1980",
      "1988",
      "2016",
      "2020",
      "1992",
      "2012",
      "2004",
      "1968",
      "1976"
    ],
    "400 metres Individual Medley, Men": [
      "1984",
      "2020",
      "2012",
      "1996",
      "2000",
      "1964",
      "1972",
      "1980",
      "1988",
      "1992",
      "2004",
      "2008",
      "2016",
      "1976",
      "1968"
    ],
    "200 metres Backstroke, Women": [
      "1992",
      "2020",
      "1968",
      "1972",
      "1976",
      "2016",
      "1980",
      "1988",
      "2000",
      "1996",
      "2004",
      "2008",
      "1984",
      "2012"
    ],
    "4 × 200 metres Freestyle Relay, Women": [
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "2004"
    ],
    "50 metres Freestyle, Women": [
      "2004",
      "2008",
      "2020",
      "2012",
      "2016",
      "1988",
      "1992",
      "1996",
      "2000"
    ],
    "4 × 100 metres Medley Relay, Mixed": [
      "2020"
    ],
    "500 metres Freestyle, Men": [
      "1896"
    ],
    "1,000 metres Freestyle, Men": [
      "1900"
    ],
    "200 metres Obstacle Course, Men": [
      "1900"
    ],
    "50 metres Freestyle, Men": [
      "1996",
      "2008",
      "2012",
      "2020",
      "2004",
      "2016",
      "2000",
      "1988",
      "1992"
    ],
    "200 metres Individual Medley, Men": [
      "1984",
      "1996",
      "2016",
      "2020",
      "1988",
      "1992",
      "2008",
      "2012",
      "2000",
      "1972",
      "2004",
      "1968"
    ],
    "Underwater Swimming, Men": [
      "1900"
    ],
    "400 metres Breaststroke, Men": [
      "1920",
      "1912"
    ],
    "4,000 metres Freestyle, Men": [
      "1900"
    ],
    "200 metres Team Swimming, Men": [
      "1900"
    ],
    "220 yards Freestyle, Men": [
      "1904"
    ],
    "880 yards Freestyle, Men": [
      "1904"
    ],
    "1 mile Freestyle, Men": [
      "1904"
    ],
    "100 yards Backstroke, Men": [
      "1904"
    ],
    "440 yards Breaststroke, Men": [
      "1904"
    ],
    "1,200 metres Freestyle, Men": [
      "1896"
    ],
    "100 metres Freestyle For Sailors, Men": [
      "1896"
    ],
    "50 yards Freestyle, Men": [
      "1904"
    ],
    "100 yards Freestyle, Men": [
      "1904"
    ],
    "800 metres Freestyle, Men": [
      "2020"
    ],
    "440 yards Freestyle, Men": [
      "1904"
    ],
    "4 × 50 yards Freestyle Relay, Men": [
      "1904"
    ],
    "Plunge For Distance, Men": [
      "1904"
    ],
    "300 metres Freestyle, Women": [
      "1920"
    ],
    "1,500 metres Freestyle, Women": [
      "2020"
    ]
  },
  "Rowing": {
    "Coxless Pairs, Men": [
      "1936",
      "1996",
      "2000",
      "2004",
      "2008",
      "1956",
      "1960",
      "1952",
      "1908",
      "1964",
      "2020",
      "1968",
      "1972",
      "1976",
      "1980",
      "1924",
      "2012",
      "1928",
      "1992",
      "1932",
      "1948",
      "1988",
      "2016",
      "1984",
      "1904"
    ],
    "Double Sculls, Men": [
      "1952",
      "1956",
      "1992",
      "2008",
      "1928",
      "1984",
      "1932",
      "2020",
      "2016",
      "1960",
      "1964",
      "1980",
      "1948",
      "1972",
      "1976",
      "1920",
      "1924",
      "1996",
      "2004",
      "1936",
      "2000",
      "2012",
      "1968",
      "1988",
      "1904"
    ],
    "Single Sculls, Men": [
      "1968",
      "1972",
      "1928",
      "1932",
      "1948",
      "1952",
      "1956",
      "1936",
      "1912",
      "2004",
      "1984",
      "1996",
      "2016",
      "2020",
      "2008",
      "2012",
      "1992",
      "1976",
      "1980",
      "1988",
      "1900",
      "1908",
      "1960",
      "1964",
      "2000",
      "1920",
      "1924",
      "1904"
    ],
    "Eights, Men": [
      "1952",
      "1956",
      "1968",
      "1984",
      "2000",
      "2004",
      "1900",
      "1908",
      "1904",
      "1924",
      "1928",
      "1932",
      "1960",
      "1992",
      "2008",
      "2012",
      "1964",
      "1972",
      "1976",
      "1980",
      "1912",
      "1936",
      "1996",
      "2016",
      "1920",
      "1948",
      "2020",
      "1988"
    ],
    "Quadruple Sculls, Men": [
      "1984",
      "1996",
      "2012",
      "2016",
      "2020",
      "1980",
      "2004",
      "1976",
      "1988",
      "2008",
      "1992",
      "2000"
    ],
    "Coxed Fours, Women": [
      "1984",
      "1976",
      "1980",
      "1988"
    ],
    "Coxless Fours, Men": [
      "1992",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "1908",
      "1924",
      "1956",
      "2004",
      "1948",
      "1964",
      "1984",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "1952",
      "1932",
      "1936",
      "1928",
      "1960",
      "1904"
    ],
    "Lightweight Double Sculls, Men": [
      "1996",
      "2008",
      "2012",
      "2000",
      "2004",
      "2016",
      "2020"
    ],
    "Coxless Pairs, Women": [
      "1996",
      "2000",
      "2012",
      "2004",
      "2008",
      "1976",
      "1980",
      "1988",
      "1984",
      "1992",
      "2020",
      "2016"
    ],
    "Lightweight Double Sculls, Women": [
      "1996",
      "2008",
      "2016",
      "2012",
      "2020",
      "2000",
      "2004"
    ],
    "Lightweight Coxless Fours, Men": [
      "2000",
      "2004",
      "1996",
      "2008",
      "2012",
      "2016"
    ],
    "Quadruple Sculls, Women": [
      "2004",
      "2020",
      "1996",
      "2008",
      "1988",
      "1992",
      "2000",
      "2012",
      "2016"
    ],
    "Single Sculls, Women": [
      "2012",
      "2016",
      "2020",
      "1996",
      "2000",
      "2004",
      "2008",
      "1984",
      "1992",
      "1988",
      "1976",
      "1980"
    ],
    "Double Sculls, Women": [
      "2012",
      "1976",
      "1988",
      "1984",
      "1996",
      "1992",
      "1980",
      "2000",
      "2004",
      "2008",
      "2016",
      "2020"
    ],
    "Coxless Fours, Women": [
      "2020",
      "1992"
    ],
    "Eights, Women": [
      "1996",
      "1992",
      "2000",
      "2012",
      "2020",
      "1988",
      "1976",
      "1980",
      "2016",
      "1984",
      "2004",
      "2008"
    ],
    "Coxed Pairs, Men": [
      "1928",
      "1972",
      "1976",
      "1948",
      "1952",
      "1968",
      "1980",
      "1988",
      "1900",
      "1920",
      "1932",
      "1936",
      "1964",
      "1956",
      "1960",
      "1992",
      "1924",
      "1984"
    ],
    "Coxed Quadruple Sculls, Women": [
      "1980",
      "1984",
      "1976"
    ],
    "Coxed Fours, Men": [
      "1952",
      "1972",
      "1948",
      "1968",
      "1976",
      "1980",
      "1988",
      "1956",
      "1900",
      "1924",
      "1936",
      "1960",
      "1932",
      "1964",
      "1992",
      "1984",
      "1928",
      "1920"
    ],
    "Coxed Fours, Outriggers, Men": [
      "1912"
    ],
    "Coxed Fours, Inriggers, Men": [
      "1912"
    ]
  },
  "Sailing": {
    "6 metres, Open": [
      "1948",
      "1908",
      "1920",
      "1932",
      "1912",
      "1924",
      "1928",
      "1952",
      "1936"
    ],
    "Three Person Keelboat, Open": [
      "1960",
      "1972",
      "1984",
      "1948",
      "1956",
      "1964",
      "1968",
      "1976",
      "1980",
      "1988",
      "1992",
      "2000",
      "1952",
      "1996"
    ],
    "Windsurfer, Men": [
      "1996",
      "2000",
      "1992",
      "2020",
      "2008",
      "2016",
      "2004",
      "2012",
      "1984"
    ],
    "Two Person Dinghy, Men": [
      "2000",
      "2012",
      "2008",
      "2016",
      "2020",
      "1992",
      "1988",
      "1996",
      "2004"
    ],
    "One Person Dinghy, Women": [
      "2000",
      "2012",
      "2008",
      "2004",
      "1996",
      "2016",
      "2020",
      "1992"
    ],
    "Multihull, Open": [
      "2004",
      "2008",
      "1984",
      "1992",
      "1996",
      "2000",
      "1980",
      "1988",
      "1976"
    ],
    "Multihull, Mixed": [
      "2016",
      "2020"
    ],
    "Two Person Heavyweight Dinghy, Open": [
      "1956",
      "1968",
      "1976",
      "1984",
      "1988",
      "1960",
      "1992",
      "1972",
      "1964",
      "1980"
    ],
    "5.5 metres, Open": [
      "1956",
      "1964",
      "1960",
      "1968",
      "1952"
    ],
    "Two Person Keelboat, Open": [
      "1972",
      "1996",
      "1980",
      "1988",
      "2000",
      "1992",
      "1948",
      "1936",
      "1932",
      "1952",
      "1956",
      "1968",
      "1984",
      "1960",
      "1976",
      "1964"
    ],
    "One Person Dinghy, Open": [
      "1976",
      "2000",
      "1968",
      "1980",
      "2004",
      "1924",
      "1956",
      "1960",
      "1996",
      "1984",
      "1948",
      "1952",
      "1964",
      "1928",
      "1932",
      "1972",
      "2008",
      "1936",
      "1988"
    ],
    "Two Person Dinghy, Open": [
      "1976",
      "1980",
      "1984"
    ],
    "Two Person Dinghy, Women": [
      "2000",
      "2008",
      "2016",
      "2020",
      "2012",
      "2004",
      "1996",
      "1992",
      "1988"
    ],
    "One Person Dinghy, Men": [
      "2012",
      "2016",
      "2020",
      "1996",
      "2000",
      "2004",
      "2008",
      "1992"
    ],
    "Skiff, Men": [
      "2012",
      "2016",
      "2020"
    ],
    "Three Person Keelboat, Women": [
      "2012",
      "2004",
      "2008"
    ],
    "8 metres, Open": [
      "1920",
      "1932",
      "1912",
      "1924",
      "1928",
      "1936",
      "1908"
    ],
    "Two Person Keelboat, Men": [
      "2004",
      "2008",
      "2012"
    ],
    "Skiff, Women": [
      "2016",
      "2020"
    ],
    "Windsurfer, Women": [
      "1992",
      "2004",
      "2008",
      "2016",
      "2020",
      "2012",
      "2000",
      "1996"
    ],
    "Skiff, Open": [
      "2008",
      "2000",
      "2004"
    ],
    "One Person Heavyweight Dinghy, Men": [
      "2012",
      "2016",
      "2020"
    ],
    "10 metres, Open": [
      "1912",
      "1920"
    ],
    "12 metres, Open": [
      "1912",
      "1908",
      "1920"
    ],
    "Open, Open": [
      "1900"
    ],
    "0-½ Ton, Open": [
      "1900"
    ],
    "½-1 Ton, Open": [
      "1900"
    ],
    "1-2 Ton, Open": [
      "1900"
    ],
    "2-3 Ton, Open": [
      "1900"
    ],
    "3-10 Ton, Open": [
      "1900"
    ],
    "10-20 Ton, Open": [
      "1900"
    ],
    "6.5 metres, Open": [
      "1920"
    ],
    "20+ Ton, Open": [
      "1900"
    ],
    "7 metres, Open": [
      "1908",
      "1920"
    ],
    "12 foot, Open": [
      "1920"
    ],
    "Windsurfer, Open": [
      "1988"
    ],
    "30 metres², Open": [
      "1920"
    ],
    "40 metres², Open": [
      "1920"
    ]
  },
  "Shooting": {
    "Rapid-Fire Pistol, 25 metres, Men": [
      "1948",
      "1996",
      "2012",
      "2016",
      "2020",
      "1964",
      "1988",
      "1924",
      "1960",
      "1984",
      "1932",
      "1936",
      "1992",
      "2004",
      "2008",
      "1952",
      "1956",
      "2000"
    ],
    "Sporting Pistol, 25 metres, Women": [
      "1984",
      "2004",
      "2000",
      "1996",
      "1992",
      "2008",
      "2012",
      "2020",
      "2016",
      "1988"
    ],
    "Trap, Men": [
      "1996",
      "2000",
      "2004",
      "1900",
      "1908",
      "1952",
      "2012",
      "2016",
      "2008",
      "2020",
      "1924",
      "1912",
      "1956",
      "1960",
      "1964",
      "1920"
    ],
    "Double Trap, Men": [
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016"
    ],
    "Double Trap, Women": [
      "1996",
      "2004",
      "2000"
    ],
    "Air Pistol, 10 metres, Women": [
      "2000",
      "1992",
      "1996",
      "2004",
      "2020",
      "2008",
      "2012",
      "2016",
      "1988"
    ],
    "Trap, Women": [
      "2004",
      "2016",
      "2000",
      "2008",
      "2012",
      "2020"
    ],
    "Small-Bore Rifle, Prone, 50 metres, Men": [
      "2008",
      "2000",
      "2004",
      "2012",
      "1956",
      "1988",
      "1924",
      "1984",
      "1960",
      "1996",
      "2016",
      "1932",
      "1936",
      "1964",
      "1992",
      "1952",
      "1948"
    ],
    "Free Rifle, Three Positions, 300 metres, Men": [
      "1960",
      "1900",
      "1912",
      "1920",
      "1948",
      "1956",
      "1908",
      "1952",
      "1964"
    ],
    "Free Pistol, 50 metres, Open": [
      "1972",
      "1976",
      "1980",
      "1968"
    ],
    "Rapid-Fire Pistol, 25 metres, Open": [
      "1980",
      "1972",
      "1976",
      "1968"
    ],
    "Air Rifle, 10 metres, Men": [
      "1984",
      "1996",
      "2000",
      "2004",
      "2008",
      "2020",
      "1988",
      "1992",
      "2012",
      "2016"
    ],
    "Small-Bore Rifle, Three Positions, 50 metres, Men": [
      "1996",
      "2004",
      "1964",
      "2008",
      "2020",
      "1956",
      "1952",
      "2000",
      "2016",
      "1960",
      "1984",
      "1988",
      "2012",
      "1992"
    ],
    "Skeet, Women": [
      "2000",
      "2004",
      "2012",
      "2020",
      "2008",
      "2016"
    ],
    "Free Pistol, 50 metres, Men": [
      "1996",
      "2000",
      "1920",
      "1984",
      "1992",
      "2008",
      "2012",
      "1956",
      "1964",
      "1900",
      "1936",
      "1912",
      "1952",
      "1960",
      "2004",
      "2016",
      "1948",
      "1988"
    ],
    "Air Pistol, 10 metres, Men": [
      "2000",
      "2016",
      "1988",
      "1996",
      "1992",
      "2004",
      "2008",
      "2020",
      "2012"
    ],
    "Free Rifle, Standing, 300 metres, Men": [
      "1900"
    ],
    "Free Pistol, 50 yards, Men": [
      "1908"
    ],
    "Free Pistol, 50 yards, Team, Men": [
      "1908"
    ],
    "Trap, Team, Men": [
      "1920",
      "1908",
      "1924",
      "1912"
    ],
    "Trap, Open": [
      "1988",
      "1992",
      "1968",
      "1980",
      "1972",
      "1976",
      "1984"
    ],
    "Free Pistol, 50 metres, Team, Men": [
      "1920",
      "1900",
      "1912"
    ],
    "Military Pistol, 30 metres, Men": [
      "1920"
    ],
    "Small-Bore Rifle, Prone, 50 metres, Open": [
      "1980",
      "1968",
      "1972",
      "1976"
    ],
    "Small-Bore Rifle, Three Positions, 50 metres, Women": [
      "1988",
      "1992",
      "1984",
      "2004",
      "2008",
      "2016",
      "2012",
      "1996",
      "2000",
      "2020"
    ],
    "Air Rifle, 10 metres, Women": [
      "1992",
      "1984",
      "2000",
      "2004",
      "2012",
      "2016",
      "2020",
      "2008",
      "1996",
      "1988"
    ],
    "Military Rifle, 200/500/600/800/900/1,000 yards, Team, Men": [
      "1908"
    ],
    "Skeet, Open": [
      "1988",
      "1992",
      "1980",
      "1976",
      "1984",
      "1972",
      "1968"
    ],
    "Running Target, 50 metres, Men": [
      "1984",
      "1988"
    ],
    "Running Target, 10 metres, Men": [
      "1996",
      "2000",
      "1992",
      "2004"
    ],
    "Air Pistol, 10 metres, Team, Mixed": [
      "2020"
    ],
    "Air Rifle, 10 metres, Team, Mixed": [
      "2020"
    ],
    "Running Target, 50 metres, Open": [
      "1972",
      "1980",
      "1976"
    ],
    "Skeet, Men": [
      "2004",
      "2000",
      "2012",
      "2020",
      "2008",
      "1996",
      "2016"
    ],
    "Free Pistol, 30 metres, Men": [
      "1896"
    ],
    "Muzzle-Loading Pistol, 25 metres, Men": [
      "1896"
    ],
    "Free Rifle, Any Position, 300 metres, Men": [
      "1896"
    ],
    "Free Rifle, Kneeling, 300 metres, Men": [
      "1900"
    ],
    "Free Rifle, Prone, 300 metres, Men": [
      "1900"
    ],
    "Free Rifle, Three Positions, 300 metres, Team, Men": [
      "1912",
      "1900",
      "1908",
      "1920"
    ],
    "Military Rifle, Standing, 300 metres, Men": [
      "1920"
    ],
    "Military Rifle, Standing, 300 metres, Team, Men": [
      "1920"
    ],
    "Free Rifle, Prone, 600 metres, Men": [
      "1924"
    ],
    "Small-Bore Rifle, Three Positions, 50 metres, Open": [
      "1972",
      "1980",
      "1968",
      "1976"
    ],
    "Running Target, Single Shot, Men": [
      "1912",
      "1908",
      "1924",
      "1920"
    ],
    "Running Target, Single Shot, Team, Men": [
      "1912",
      "1920",
      "1908",
      "1924"
    ],
    "Military Rifle, Prone, 300 metres, Team, Men": [
      "1920"
    ],
    "Running Target, Double Shot, Team, Men": [
      "1920",
      "1924"
    ],
    "Running Target, Single and Double Shot, Men": [
      "1952",
      "1956"
    ],
    "Small-Bore Rifle, 50 and 100 yards, Team, Men": [
      "1908"
    ],
    "Military Rifle, Any Position, 600 metres, Men": [
      "1912"
    ],
    "Military Rifle, Prone, 300 metres, Men": [
      "1920"
    ],
    "Free Rifle, 400, 600 and 800 metres, Team, Men": [
      "1924"
    ],
    "Free Rifle, 1,000 yards, Men": [
      "1908"
    ],
    "Small-Bore Rifle, Prone, 50 and 100 yards, Men": [
      "1908"
    ],
    "Small-Bore Rifle, Disappearing Target, 25 yards, Men": [
      "1908"
    ],
    "Small-Bore Rifle, Moving Target, 25 yards, Men": [
      "1908"
    ],
    "Running Target, Double Shot, Men": [
      "1908",
      "1924",
      "1920",
      "1912"
    ],
    "Dueling Pistol, 30 metres, Team, Men": [
      "1912"
    ],
    "Military Rifle, 200, 400, 500 and 600 metres, Team, Men": [
      "1912"
    ],
    "Small-Bore Rifle, Any Position, 50 metres, Men": [
      "1912"
    ],
    "Small-Bore Rifle, Prone, 50 metres, Team, Men": [
      "1912"
    ],
    "Small-Bore Rifle, Disappearing Target, 25 metres, Team, Men": [
      "1912"
    ],
    "Military Pistol, 25 metres, Men": [
      "1896"
    ],
    "Military Rifle, 200 metres, Men": [
      "1896"
    ],
    "Military Pistol, Team, Men": [
      "1920"
    ],
    "Military Rifle, Three Positions, 300 metres, Men": [
      "1912"
    ],
    "Free Rifle, Three Positions, 300 metres, Open": [
      "1972",
      "1968"
    ],
    "Military Rifle, Prone, 300 and 600 metres, Team, Men": [
      "1920"
    ],
    "Smal-Bore Rifle, Standing, 50 metres, Team, Men": [
      "1920"
    ],
    "Trap, Team, Mixed": [
      "2020"
    ],
    "Military Rifle, Prone, 600 metres, Team, Men": [
      "1920"
    ],
    "Dueling Pistol, 30 metres, Men": [
      "1912"
    ],
    "Small-Bore Rifle, Disappearing Target, 25 metres, Men": [
      "1912"
    ],
    "Military Rifle, Prone, 600 metres, Men": [
      "1920"
    ],
    "Small-Bore Rifle, Standing, 50 metres, Men": [
      "1920"
    ]
  },
  "Weightlifting": {
    "Heavyweight, Men": [
      "1952",
      "1956",
      "2016",
      "2020",
      "1924",
      "2008",
      "1968",
      "1972",
      "1976",
      "2000",
      "1928",
      "1932",
      "1936",
      "1920",
      "2012",
      "1948",
      "2004",
      "1960",
      "1964"
    ],
    "Middleweight, Men": [
      "2000",
      "2008",
      "1932",
      "1972",
      "1976",
      "1980",
      "1988",
      "1996",
      "1952",
      "1984",
      "2012",
      "2016",
      "2020",
      "1992",
      "1964",
      "1924",
      "1920",
      "1928",
      "1936",
      "1960",
      "1968",
      "1956",
      "2004",
      "1948"
    ],
    "Light-Heavyweight, Men": [
      "2008",
      "1984",
      "1924",
      "2004",
      "1976",
      "1980",
      "2016",
      "2020",
      "1932",
      "1920",
      "1928",
      "1936",
      "2000",
      "1996",
      "1992",
      "1964",
      "1972",
      "1988",
      "2012",
      "1960",
      "1968",
      "1952",
      "1956",
      "1948"
    ],
    "Super-Heavyweight, Men": [
      "2016",
      "1984",
      "1996",
      "2004",
      "1972",
      "1976",
      "1980",
      "2020",
      "1992",
      "2000",
      "2008",
      "2012",
      "1988"
    ],
    "Lightweight, Men": [
      "1952",
      "1924",
      "1928",
      "1932",
      "1936",
      "2000",
      "1920",
      "1972",
      "1980",
      "1992",
      "1984",
      "1988",
      "1996",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1976",
      "1948",
      "1968",
      "1964",
      "1960",
      "1956"
    ],
    "Featherweight, Men": [
      "1924",
      "1928",
      "2000",
      "1920",
      "1972",
      "1976",
      "1980",
      "1988",
      "1992",
      "1984",
      "1996",
      "2004",
      "2008",
      "2020",
      "2012",
      "2016",
      "1932",
      "1948",
      "1960",
      "1964",
      "1968",
      "1956",
      "1952",
      "1936"
    ],
    "Middleweight, Women": [
      "2004",
      "2012",
      "2008",
      "2020",
      "2000",
      "2016"
    ],
    "Middle-Heavyweight, Men": [
      "2016",
      "1972",
      "1976",
      "1980",
      "2004",
      "2008",
      "1968",
      "1956",
      "2020",
      "1996",
      "1960",
      "1964",
      "1984",
      "2000",
      "2012",
      "1988",
      "1992",
      "1952"
    ],
    "Heavyweight, Women": [
      "2016",
      "2012",
      "2020",
      "2000",
      "2008",
      "2004"
    ],
    "Bantamweight, Men": [
      "1976",
      "1996",
      "1984",
      "1988",
      "1992",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "1980",
      "1948",
      "1964",
      "1968",
      "1972",
      "1952",
      "1956",
      "1960"
    ],
    "Heavyweight II, Men": [
      "1980",
      "1992",
      "1988",
      "1984",
      "1996"
    ],
    "Flyweight, Men": [
      "1988",
      "1992",
      "1996",
      "1984",
      "1972",
      "1976",
      "1980"
    ],
    "Featherweight, Women": [
      "2000",
      "2020",
      "2012",
      "2016",
      "2004",
      "2008"
    ],
    "Light-Heavyweight, Women": [
      "2000",
      "2004",
      "2016",
      "2008",
      "2012",
      "2020"
    ],
    "Super-Heavyweight, Women": [
      "2000",
      "2004",
      "2012",
      "2016",
      "2020",
      "2008"
    ],
    "Flyweight, Women": [
      "2004",
      "2012",
      "2020",
      "2008",
      "2000",
      "2016"
    ],
    "Lightweight, Women": [
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "2000"
    ],
    "Heavyweight I, Men": [
      "1980",
      "1984",
      "1996",
      "1992",
      "1988"
    ],
    "Unlimited, One Hand, Men": [
      "1896"
    ],
    "Unlimited, Two Hands, Men": [
      "1896",
      "1904"
    ],
    "All-Around Dumbbell Contest, Men": [
      "1904"
    ]
  },
  "Equestrian Eventing": {
    "Individual, Open": [
      "1964",
      "1992",
      "2000",
      "2020",
      "1968",
      "2016",
      "2008",
      "2012",
      "1972",
      "1984",
      "1988",
      "2004",
      "1980",
      "1996",
      "1976"
    ],
    "Individual, Men": [
      "1960",
      "1924",
      "1936",
      "1912",
      "1948",
      "1952",
      "1928",
      "1920",
      "1932"
    ],
    "Team, Men": [
      "1960",
      "1920",
      "1912",
      "1936",
      "1952",
      "1924",
      "1948",
      "1928",
      "1932"
    ],
    "Team, Open": [
      "1968",
      "1976",
      "1992",
      "1996",
      "2000",
      "2008",
      "2016",
      "2020",
      "2004",
      "1964",
      "2012",
      "1972",
      "1984",
      "1988",
      "1980"
    ]
  },
  "Tennis": {
    "Singles, Women": [
      "1988",
      "2004",
      "2012",
      "1900",
      "1996",
      "2016",
      "2020",
      "1912",
      "1920",
      "1924",
      "1992",
      "1908",
      "2000",
      "2008"
    ],
    "Doubles, Men": [
      "1992",
      "1896",
      "1996",
      "2000",
      "1912",
      "2004",
      "2020",
      "1988",
      "1900",
      "1920",
      "1924",
      "2012",
      "1908",
      "2016",
      "2008",
      "1904"
    ],
    "Doubles, Women": [
      "2004",
      "1988",
      "1992",
      "2000",
      "2020",
      "2008",
      "1996",
      "2012",
      "2016",
      "1920",
      "1924"
    ],
    "Singles, Men": [
      "2012",
      "2016",
      "2004",
      "2008",
      "1992",
      "1988",
      "1924",
      "2000",
      "1908",
      "1912",
      "1896",
      "1900",
      "1996",
      "1920",
      "2020",
      "1904"
    ],
    "Singles, Covered Courts, Men": [
      "1912",
      "1908"
    ],
    "Doubles, Mixed": [
      "2020",
      "2012",
      "1900",
      "2016",
      "1920",
      "1912",
      "1924"
    ],
    "Singles, Covered Courts, Women": [
      "1912",
      "1908"
    ],
    "Doubles, Covered Courts, Men": [
      "1912",
      "1908"
    ],
    "Doubles, Covered Courts, Mixed": [
      "1912"
    ]
  },
  "Volleyball": {
    "Volleyball, Men": [
      "1988",
      "2020",
      "1984",
      "1992",
      "2004",
      "2008",
      "2012",
      "2016",
      "1980",
      "1976",
      "1964",
      "1968",
      "1972",
      "1996",
      "2000"
    ],
    "Volleyball, Women": [
      "1996",
      "2000",
      "2008",
      "2012",
      "2020",
      "1980",
      "1984",
      "1988",
      "2004",
      "2016",
      "1992",
      "1964",
      "1968",
      "1972",
      "1976"
    ]
  },
  "Hockey": {
    "Hockey, Women": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "1988",
      "1996",
      "1980",
      "1992",
      "2016",
      "1984"
    ],
    "Hockey, Men": [
      "2016",
      "1964",
      "1968",
      "1976",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "1920",
      "1928",
      "1936",
      "1956",
      "1908",
      "1948",
      "1952",
      "1984",
      "1988",
      "1932",
      "1960",
      "1972",
      "1980"
    ]
  },
  "Basketball": {
    "Basketball, Men": [
      "2004",
      "2008",
      "2020",
      "1948",
      "1960",
      "1964",
      "1936",
      "1992",
      "1972",
      "2000",
      "1980",
      "1996",
      "2012",
      "2016",
      "1952",
      "1956",
      "1968",
      "1976",
      "1988",
      "1984"
    ],
    "Basketball, Women": [
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "1976",
      "1980",
      "1984",
      "1992",
      "2020",
      "2016",
      "1988"
    ]
  },
  "Cycling Track": {
    "Madison, Men": [
      "2008",
      "2000",
      "2004",
      "2020"
    ],
    "1,000 metres Time Trial, Men": [
      "1928",
      "1932",
      "1952",
      "1972",
      "1988",
      "1992",
      "2000",
      "1948",
      "1964",
      "1976",
      "1984",
      "1956",
      "1968",
      "1980",
      "1936",
      "1996",
      "2004",
      "1960"
    ],
    "Sprint, Men": [
      "1952",
      "1956",
      "1972",
      "1988",
      "1992",
      "2004",
      "2012",
      "1960",
      "1996",
      "1976",
      "1928",
      "1948",
      "1980",
      "1896",
      "1900",
      "1908",
      "1924",
      "1932",
      "1936",
      "1964",
      "1968",
      "2000",
      "2008",
      "1920",
      "2016",
      "2020",
      "1984"
    ],
    "Tandem Sprint, 2,000 metres, Men": [
      "1952",
      "1956",
      "1968",
      "1924",
      "1932",
      "1972",
      "1908",
      "1936",
      "1948",
      "1928",
      "1960",
      "1964",
      "1920"
    ],
    "Team Pursuit, 4,000 metres, Men": [
      "1984",
      "1988",
      "1992",
      "1996",
      "2004",
      "2012",
      "2016",
      "2020",
      "1924",
      "1980",
      "1968",
      "2008",
      "1972",
      "1932",
      "1936",
      "1948",
      "1956",
      "1960",
      "1964",
      "2000",
      "1920",
      "1928",
      "1952",
      "1976"
    ],
    "Individual Pursuit, 4,000 metres, Men": [
      "1988",
      "1996",
      "2000",
      "2004",
      "1964",
      "1968",
      "1980",
      "1976",
      "1992",
      "2008",
      "1972",
      "1984"
    ],
    "Individual Pursuit, Women": [
      "1992",
      "2004",
      "1996",
      "2000",
      "2008"
    ],
    "Points Race, Men": [
      "1996",
      "1984",
      "1992",
      "1988",
      "1900",
      "2004",
      "2008",
      "2000"
    ],
    "Sprint, Women": [
      "1996",
      "2004",
      "2008",
      "2012",
      "2020",
      "1988",
      "1992",
      "2000",
      "2016"
    ],
    "Points Race, Women": [
      "1996",
      "2004",
      "2008",
      "2000"
    ],
    "Keirin, Men": [
      "2000",
      "2004",
      "2012",
      "2008",
      "2016",
      "2020"
    ],
    "Team Sprint, Men": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "500 metres Time Trial, Women": [
      "2000",
      "2004"
    ],
    "Team Sprint, Women": [
      "2012",
      "2016",
      "2020"
    ],
    "Omnium, Women": [
      "2012",
      "2016",
      "2020"
    ],
    "Keirin, Women": [
      "2016",
      "2020",
      "2012"
    ],
    "333⅓ metres Time Trial, Men": [
      "1896"
    ],
    "10,000 metres, Men": [
      "1896"
    ],
    "12-Hours Race, Men": [
      "1896"
    ],
    "20 kilometres, Men": [
      "1908"
    ],
    "50 kilometres, Men": [
      "1920",
      "1924"
    ],
    "Team Pursuit, 1,980 yards, Men": [
      "1908"
    ],
    "Team Pursuit, Women": [
      "2012",
      "2016",
      "2020"
    ],
    "Omnium, Men": [
      "2012",
      "2016",
      "2020"
    ],
    "Madison, Women": [
      "2020"
    ],
    "100 kilometres, Men": [
      "1896",
      "1908"
    ],
    "25 kilometres, Men": [
      "1900"
    ],
    "5,000 metres, Men": [
      "1908"
    ],
    "¼ mile, Men": [
      "1904"
    ],
    "⅓ mile, Men": [
      "1904"
    ],
    "½ mile, Men": [
      "1904"
    ],
    "1 mile, Men": [
      "1904"
    ],
    "2 miles, Men": [
      "1904"
    ],
    "5 miles, Men": [
      "1904"
    ],
    "25 miles, Men": [
      "1904"
    ]
  },
  "Rugby Sevens": {
    "Rugby Sevens, Men": [
      "2020",
      "2016"
    ],
    "Rugby Sevens, Women": [
      "2016",
      "2020"
    ]
  },
  "Wrestling": {
    "Flyweight, Greco-Roman, Men": [
      "1996",
      "1964",
      "1968",
      "1972",
      "1980",
      "1948",
      "1952",
      "1960",
      "1956",
      "1976",
      "1984",
      "1988",
      "1992"
    ],
    "Light-Flyweight, Freestyle, Men": [
      "1996",
      "1972",
      "1976",
      "1988",
      "1980",
      "1984",
      "1992",
      "1904"
    ],
    "Featherweight, Greco-Roman, Men": [
      "2008",
      "2012",
      "1972",
      "1988",
      "2000",
      "2020",
      "1992",
      "1996",
      "2016",
      "1928",
      "1912",
      "1920",
      "1924",
      "1932",
      "1936",
      "1956",
      "1980",
      "2004",
      "1948",
      "1952",
      "1960",
      "1964",
      "1976",
      "1968",
      "1984"
    ],
    "Super-Heavyweight, Greco-Roman, Men": [
      "2008",
      "2016",
      "2000",
      "1972",
      "1976",
      "1980",
      "1988",
      "2012",
      "2020",
      "2004",
      "1996",
      "1984",
      "1992"
    ],
    "Middleweight, Greco-Roman, Men": [
      "2012",
      "2020",
      "1996",
      "1956",
      "1960",
      "1976",
      "1980",
      "2008",
      "1964",
      "1908",
      "2016",
      "1968",
      "1924",
      "1928",
      "1920",
      "1932",
      "1952",
      "2000",
      "2004",
      "1936",
      "1984",
      "1972",
      "1988",
      "1992",
      "1948"
    ],
    "Heavyweight, Greco-Roman, Men": [
      "2012",
      "2016",
      "2020",
      "1932",
      "1996",
      "1976",
      "1980",
      "1992",
      "2008",
      "1952",
      "1960",
      "1968",
      "1908",
      "1912",
      "1920",
      "1936",
      "1924",
      "1928",
      "2004",
      "1956",
      "1964",
      "1972",
      "1948",
      "1988",
      "1984",
      "2000"
    ],
    "Welterweight, Greco-Roman, Men": [
      "2016",
      "2004",
      "2008",
      "1964",
      "1996",
      "2000",
      "1972",
      "1976",
      "1948",
      "1968",
      "1932",
      "1936",
      "1980",
      "1984",
      "1960",
      "2012",
      "1952",
      "2020",
      "1988",
      "1992",
      "1956"
    ],
    "Light-Heavyweight, Freestyle, Men": [
      "1932",
      "2012",
      "2016",
      "1964",
      "2000",
      "1980",
      "1936",
      "1928",
      "1996",
      "2008",
      "1984",
      "1968",
      "1972",
      "1956",
      "1960",
      "2020",
      "1988",
      "1976",
      "2004",
      "1920",
      "1924",
      "1948",
      "1952",
      "1992"
    ],
    "Welterweight, Freestyle, Men": [
      "1948",
      "2016",
      "2020",
      "1980",
      "1988",
      "1928",
      "1932",
      "1936",
      "2000",
      "2012",
      "1924",
      "1968",
      "2008",
      "1952",
      "1964",
      "1976",
      "1992",
      "1956",
      "1996",
      "1960",
      "2004",
      "1972",
      "1904",
      "1984"
    ],
    "Heavyweight, Freestyle, Men": [
      "1948",
      "1932",
      "2008",
      "2012",
      "2016",
      "1956",
      "1964",
      "1968",
      "1976",
      "1980",
      "2020",
      "1936",
      "1928",
      "2000",
      "1960",
      "1992",
      "1996",
      "1908",
      "1924",
      "1952",
      "1972",
      "2004",
      "1984",
      "1988",
      "1920",
      "1904"
    ],
    "Flyweight, Freestyle, Men": [
      "1996",
      "1980",
      "1992",
      "1948",
      "1952",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1984",
      "1988",
      "1904"
    ],
    "Bantamweight, Freestyle, Men": [
      "2000",
      "1928",
      "1960",
      "1908",
      "1996",
      "1992",
      "1976",
      "1924",
      "1932",
      "1948",
      "1936",
      "1972",
      "1952",
      "1956",
      "1968",
      "1988",
      "1964",
      "1984",
      "1980",
      "1904"
    ],
    "Flyweight, Freestyle, Women": [
      "2008",
      "2012",
      "2016",
      "2020",
      "2004"
    ],
    "Lightweight, Freestyle, Men": [
      "2012",
      "1960",
      "1964",
      "1968",
      "1980",
      "1992",
      "2000",
      "2004",
      "1928",
      "1920",
      "1924",
      "1936",
      "1984",
      "1932",
      "1908",
      "1952",
      "1956",
      "2008",
      "1972",
      "1976",
      "1996",
      "1988",
      "1948",
      "1904"
    ],
    "Lightweight, Freestyle, Women": [
      "2012",
      "2020",
      "2004",
      "2008",
      "2016"
    ],
    "Featherweight, Freestyle, Men": [
      "2016",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1980",
      "1988",
      "2008",
      "1992",
      "1928",
      "1932",
      "1936",
      "2012",
      "1908",
      "1920",
      "2020",
      "1952",
      "2000",
      "1924",
      "1984",
      "2004",
      "1976",
      "1996",
      "1948",
      "1904"
    ],
    "Middleweight, Freestyle, Men": [
      "2016",
      "2008",
      "2020",
      "1924",
      "1956",
      "1964",
      "1968",
      "1980",
      "1928",
      "1984",
      "2004",
      "1988",
      "1920",
      "1932",
      "1936",
      "1908",
      "1952",
      "2012",
      "1992",
      "1996",
      "1972",
      "2000",
      "1960",
      "1976",
      "1948"
    ],
    "Featherweight, Freestyle, Women": [
      "2016",
      "2020"
    ],
    "Light-Flyweight, Greco-Roman, Men": [
      "1996",
      "1972",
      "1976",
      "1988",
      "1992",
      "1980",
      "1984"
    ],
    "Super-Heavyweight, Freestyle, Men": [
      "1996",
      "2016",
      "1972",
      "1984",
      "1992",
      "2000",
      "2008",
      "1988",
      "2020",
      "1976",
      "1980",
      "2004",
      "2012"
    ],
    "Light-Heavyweight, Greco-Roman, Men": [
      "2004",
      "2016",
      "1956",
      "1960",
      "1964",
      "1968",
      "1976",
      "1988",
      "1908",
      "1920",
      "1936",
      "1924",
      "1928",
      "1932",
      "1948",
      "1952",
      "2000",
      "1992",
      "1996",
      "1980",
      "2008",
      "2020",
      "2012",
      "1972",
      "1984"
    ],
    "Middleweight, Freestyle, Women": [
      "2016",
      "2020",
      "2012",
      "2004",
      "2008"
    ],
    "Bantamweight, Greco-Roman, Men": [
      "1960",
      "1988",
      "1992",
      "1996",
      "2000",
      "1928",
      "1924",
      "1972",
      "1976",
      "1932",
      "1936",
      "1984",
      "1952",
      "1968",
      "1964",
      "1980",
      "1956",
      "1948"
    ],
    "Lightweight, Greco-Roman, Men": [
      "1972",
      "2004",
      "2008",
      "2000",
      "1936",
      "1952",
      "1932",
      "1976",
      "1908",
      "1912",
      "1920",
      "1924",
      "1928",
      "1956",
      "1984",
      "1988",
      "1996",
      "2012",
      "1968",
      "1948",
      "1992",
      "1980",
      "1964",
      "1960"
    ],
    "Heavyweight, Freestyle, Women": [
      "2008",
      "2012",
      "2016",
      "2004",
      "2020"
    ],
    "Middleweight A, Greco-Roman, Men": [
      "1912"
    ],
    "Middleweight B, Greco-Roman, Men": [
      "1912"
    ],
    "Unlimited Class, Greco-Roman, Men": [
      "1896"
    ],
    "Light-Heavyweight, Freestyle, Women": [
      "2016",
      "2020"
    ]
  },
  "Artistic Gymnastics": {
    "Horse Vault, Men": [
      "2020",
      "1996",
      "1984",
      "1988",
      "1924",
      "1928",
      "1948",
      "1972",
      "1980",
      "1964",
      "2008",
      "1896",
      "1936",
      "1956",
      "1932",
      "1952",
      "1960",
      "1968",
      "1976",
      "2016",
      "2004",
      "2000",
      "2012",
      "1992",
      "1904"
    ],
    "Individual All-Around, Men": [
      "1996",
      "1980",
      "1984",
      "2000",
      "2008",
      "2020",
      "1924",
      "1932",
      "1948",
      "1900",
      "1908",
      "1912",
      "1920",
      "1904",
      "1936",
      "2012",
      "2016",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "2004",
      "1952",
      "1988",
      "1928"
    ],
    "Parallel Bars, Men": [
      "1996",
      "1992",
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "1924",
      "1928",
      "1980",
      "1988",
      "1932",
      "1948",
      "1896",
      "1936",
      "1960",
      "1964",
      "1956",
      "1968",
      "1972",
      "1976",
      "1984",
      "2016",
      "1952",
      "1904"
    ],
    "Horizontal Bar, Men": [
      "1996",
      "1980",
      "1984",
      "2008",
      "2012",
      "2020",
      "1988",
      "1932",
      "1936",
      "1948",
      "1924",
      "1976",
      "2000",
      "1896",
      "1952",
      "1992",
      "2016",
      "1928",
      "2004",
      "1956",
      "1960",
      "1968",
      "1972",
      "1964",
      "1904"
    ],
    "Team All-Around, Men": [
      "1920",
      "1984",
      "1992",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "1928",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "1908",
      "1932",
      "1936",
      "1948",
      "1952",
      "1956",
      "1924",
      "1964",
      "1912",
      "1960",
      "2004",
      "1904"
    ],
    "Team All-Around, Swedish System, Men": [
      "1920",
      "1912"
    ],
    "Uneven Bars, Women": [
      "2020",
      "1984",
      "1992",
      "1996",
      "2000",
      "2008",
      "2012",
      "1968",
      "1972",
      "1980",
      "1988",
      "2004",
      "2016",
      "1952",
      "1956",
      "1964",
      "1976",
      "1960"
    ],
    "Rings, Men": [
      "2012",
      "2016",
      "1960",
      "2000",
      "2004",
      "1984",
      "1992",
      "2008",
      "2020",
      "1924",
      "1928",
      "1936",
      "1948",
      "1980",
      "1988",
      "1896",
      "1996",
      "1932",
      "1964",
      "1956",
      "1968",
      "1972",
      "1976",
      "1952",
      "1904"
    ],
    "Floor Exercise, Men": [
      "2016",
      "2000",
      "2004",
      "1984",
      "1988",
      "1992",
      "1996",
      "2008",
      "2012",
      "2020",
      "1948",
      "1980",
      "1936",
      "1932",
      "1960",
      "1964",
      "1952",
      "1956",
      "1968",
      "1972",
      "1976"
    ],
    "Individual All-Around, Women": [
      "2020",
      "2000",
      "2004",
      "2008",
      "1964",
      "1968",
      "1972",
      "1980",
      "1952",
      "1956",
      "1976",
      "1984",
      "1988",
      "1992",
      "1996",
      "2012",
      "2016",
      "1960"
    ],
    "Horse Vault, Women": [
      "2020",
      "1996",
      "2008",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1956",
      "1992",
      "1984",
      "1988",
      "2000",
      "2004",
      "2012",
      "2016",
      "1952",
      "1960"
    ],
    "Pommelled Horse, Men": [
      "1988",
      "1984",
      "2004",
      "2008",
      "2020",
      "1976",
      "1980",
      "1928",
      "1948",
      "1960",
      "1968",
      "2000",
      "1896",
      "1936",
      "1992",
      "2012",
      "2016",
      "1932",
      "1956",
      "1964",
      "1972",
      "1996",
      "1952",
      "1924"
    ],
    "Floor Exercise, Women": [
      "1988",
      "1968",
      "1980",
      "2016",
      "1952",
      "1956",
      "1964",
      "1992",
      "2020",
      "1976",
      "1984",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "1960",
      "1972"
    ],
    "Team All-Around, Women": [
      "1984",
      "2008",
      "2016",
      "1936",
      "1948",
      "1952",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1988",
      "1928",
      "2020",
      "1956",
      "1992",
      "1996",
      "2000",
      "2004",
      "2012"
    ],
    "Balance Beam, Women": [
      "1992",
      "2000",
      "2008",
      "2012",
      "2020",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1952",
      "2016",
      "1976",
      "1980",
      "1984",
      "1988",
      "1996",
      "2004"
    ],
    "Rope Climbing, Men": [
      "1924",
      "1896",
      "1904",
      "1932"
    ],
    "Team All-Around, Free System, Men": [
      "1912",
      "1920"
    ],
    "Side Horse, Men": [
      "1924",
      "1904"
    ],
    "Parallel Bars, Teams, Men": [
      "1896"
    ],
    "Horizontal Bar, Teams, Men": [
      "1896"
    ],
    "Individual All-Around, Apparatus Work, Men": [
      "1904"
    ],
    "Team Portable Apparatus, Women": [
      "1952",
      "1956"
    ],
    "Individual All-Around, Field Sports, Men": [
      "1904"
    ],
    "Individual All-Around, 4 Events, Men": [
      "1904"
    ],
    "Club Swinging, Men": [
      "1904",
      "1932"
    ],
    "Tumbling, Men": [
      "1932"
    ]
  },
  "Rugby": {
    "Rugby, Men": [
      "1908",
      "1900",
      "1920",
      "1924"
    ]
  },
  "Diving": {
    "Plain High, Men": [
      "1924",
      "1912",
      "1920"
    ],
    "Synchronized Springboard, Men": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Synchronized Platform, Women": [
      "2000",
      "2008",
      "2004",
      "2012",
      "2016",
      "2020"
    ],
    "Platform, Men": [
      "2004",
      "2008",
      "1984",
      "1988",
      "1992",
      "1996",
      "2000",
      "2012",
      "2016",
      "2020",
      "1980",
      "1912",
      "1936",
      "1952",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1948",
      "1956",
      "1908",
      "1920",
      "1924",
      "1928",
      "1932"
    ],
    "Synchronized Platform, Men": [
      "2004",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Platform, Women": [
      "2004",
      "2012",
      "2020",
      "2000",
      "2008",
      "2016",
      "1984",
      "1988",
      "1992",
      "1996",
      "1968",
      "1972",
      "1948",
      "1980",
      "1936",
      "1960",
      "1964",
      "1976",
      "1928",
      "1932",
      "1952",
      "1956"
    ],
    "Synchronized Springboard, Women": [
      "2004",
      "2016",
      "2012",
      "2020",
      "2000",
      "2008"
    ],
    "Springboard, Women": [
      "1956",
      "1984",
      "1996",
      "1988",
      "1992",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1972",
      "1976",
      "1980",
      "1952",
      "1960",
      "1964",
      "1968",
      "1920",
      "1924",
      "1928",
      "1932",
      "1936",
      "1948"
    ],
    "Springboard, Men": [
      "2004",
      "2008",
      "1984",
      "1988",
      "1992",
      "1996",
      "2000",
      "2012",
      "2016",
      "2020",
      "1904",
      "1908",
      "1912",
      "1968",
      "1972",
      "1976",
      "1980",
      "1956",
      "1960",
      "1920",
      "1924",
      "1928",
      "1932",
      "1936",
      "1948",
      "1952",
      "1964"
    ],
    "Plain High, Women": [
      "1920",
      "1912",
      "1924"
    ]
  },
  "Alpinism": {
    "Alpinism, Open": [
      "1924",
      "1932",
      "1936"
    ]
  },
  "Canoe Marathon": {
    "Kayak Doubles, 10,000 metres, Men": [
      "1956",
      "1936",
      "1948",
      "1952"
    ],
    "Kayak Singles, 10,000 metres, Men": [
      "1936",
      "1948",
      "1952",
      "1956"
    ],
    "Canadian Doubles, 10,000 metres, Men": [
      "1936",
      "1952",
      "1948",
      "1956"
    ],
    "Folding Kayak Singles, 10,000 metres, Men": [
      "1936"
    ],
    "Canadian Singles, 10,000 metres, Men": [
      "1948",
      "1952",
      "1956"
    ],
    "Folding Kayak Doubles, 10,000 metres, Men": [
      "1936"
    ]
  },
  "Cycling Road": {
    "Road Race, Individual, Men": [
      "1972",
      "1924",
      "1948",
      "1952",
      "1960",
      "1964",
      "2004",
      "2016",
      "2020",
      "1984",
      "2012",
      "1928",
      "1968",
      "1996",
      "1988",
      "1920",
      "1936",
      "1956",
      "1896",
      "2000",
      "1912",
      "1932",
      "1976",
      "1992",
      "1980",
      "2008"
    ],
    "Road Race, Individual, Women": [
      "1992",
      "2004",
      "2020",
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "1988",
      "1984"
    ],
    "Individual Time Trial, Men": [
      "2004",
      "2020",
      "2000",
      "2012",
      "1996",
      "2016",
      "2008"
    ],
    "Road Race, Team, Men": [
      "1920",
      "1924",
      "1936",
      "1948",
      "1952",
      "1928",
      "1932",
      "1956",
      "1912"
    ],
    "Individual Time Trial, Women": [
      "1996",
      "2000",
      "2012",
      "2008",
      "2004",
      "2016",
      "2020"
    ],
    "100 kilometres Team Time Trial, Men": [
      "1980",
      "1976",
      "1988",
      "1992",
      "1960",
      "1964",
      "1968",
      "1984",
      "1972"
    ]
  },
  "Canoe Sprint": {
    "Kayak Singles, 500 metres, Men": [
      "1980",
      "2004",
      "2008",
      "2000",
      "1976",
      "1988",
      "1992",
      "1984",
      "1996"
    ],
    "Kayak Doubles, 1,000 metres, Men": [
      "1984",
      "1988",
      "2016",
      "2020",
      "1936",
      "1952",
      "1956",
      "1968",
      "1996",
      "1948",
      "2008",
      "1976",
      "1964",
      "1992",
      "2012",
      "1960",
      "1972",
      "1980",
      "2000",
      "2004"
    ],
    "Kayak Singles, 1,000 metres, Men": [
      "1988",
      "1992",
      "1996",
      "2008",
      "1936",
      "2000",
      "2004",
      "2012",
      "2016",
      "1948",
      "1960",
      "1968",
      "1976",
      "1980",
      "1952",
      "1956",
      "1964",
      "1972",
      "2020",
      "1984"
    ],
    "Kayak Fours, 1,000 metres, Men": [
      "1992",
      "2012",
      "2008",
      "1980",
      "2016",
      "1976",
      "1988",
      "1984",
      "1964",
      "1996",
      "2000",
      "2004",
      "1968",
      "1972"
    ],
    "Kayak Doubles, 500 metres, Men": [
      "1996",
      "2000",
      "2004",
      "2008",
      "1984",
      "1976",
      "1980",
      "1992",
      "1988"
    ],
    "Kayak Doubles, 500 metres, Women": [
      "1996",
      "1988",
      "1984",
      "1972",
      "1976",
      "1980",
      "2008",
      "1960",
      "1964",
      "1992",
      "2000",
      "2004",
      "2012",
      "2016",
      "1968",
      "2020"
    ],
    "Kayak Singles, 500 metres, Women": [
      "2000",
      "1948",
      "1952",
      "1980",
      "1988",
      "1996",
      "2004",
      "1956",
      "2016",
      "2020",
      "1976",
      "1960",
      "1992",
      "2008",
      "1972",
      "2012",
      "1984",
      "1964",
      "1968"
    ],
    "Kayak Fours, 500 metres, Women": [
      "2008",
      "2012",
      "2016",
      "2020",
      "1988",
      "1984",
      "1992",
      "1996",
      "2000",
      "2004"
    ],
    "Canadian Doubles, 1,000 metres, Men": [
      "1936",
      "2008",
      "2012",
      "2016",
      "1972",
      "2020",
      "2000",
      "1948",
      "1952",
      "1964",
      "1992",
      "1980",
      "1988",
      "1984",
      "1996",
      "2004",
      "1956",
      "1960",
      "1968",
      "1976"
    ],
    "Canadian Singles, 200 metres, Men": [
      "2016",
      "2012"
    ],
    "Kayak Singles, 200 metres, Women": [
      "2016",
      "2020",
      "2012"
    ],
    "Kayak Doubles, 200 metres, Men": [
      "2012",
      "2016"
    ],
    "Canadian Singles, 1,000 metres, Men": [
      "2016",
      "2020",
      "1980",
      "1988",
      "1992",
      "1936",
      "1948",
      "1984",
      "2000",
      "2008",
      "2012",
      "1996",
      "1952",
      "1964",
      "2004",
      "1956",
      "1960",
      "1968",
      "1972",
      "1976"
    ],
    "Canadian Singles, 500 metres, Men": [
      "1980",
      "1988",
      "1992",
      "1976",
      "1984",
      "1996",
      "2000",
      "2004",
      "2008"
    ],
    "Canadian Doubles, 500 metres, Men": [
      "1980",
      "1992",
      "2004",
      "2008",
      "1988",
      "1976",
      "1996",
      "2000",
      "1984"
    ],
    "Kayak Singles, 200 metres, Men": [
      "2012",
      "2016",
      "2020"
    ],
    "Canadian Singles, 200 metres, Women": [
      "2020"
    ],
    "Canadian Doubles, 500 metres, Women": [
      "2020"
    ],
    "Kayak Relay, 4 × 500 metres, Men": [
      "1960"
    ],
    "Kayak Fours, 500 metres, Men": [
      "2020"
    ]
  },
  "Canoe Slalom": {
    "Kayak Singles, Slalom, Women": [
      "1992",
      "2008",
      "2012",
      "2016",
      "2020",
      "1996",
      "2000",
      "1972",
      "2004"
    ],
    "Canadian Singles, Slalom, Men": [
      "2008",
      "1996",
      "2020",
      "1992",
      "1972",
      "2000",
      "2004",
      "2012",
      "2016"
    ],
    "Canadian Singles, Slalom, Women": [
      "2020"
    ],
    "Kayak Singles, Slalom, Men": [
      "1972",
      "2012",
      "2016",
      "2020",
      "1992",
      "2004",
      "2008",
      "1996",
      "2000"
    ],
    "Canadian Doubles, Slalom, Men": [
      "1996",
      "2000",
      "2004",
      "2008",
      "1992",
      "1972",
      "2016",
      "2012"
    ]
  },
  "Short Track Speed Skating": {
    "5,000 metres Relay, Men": [
      "1994",
      "1992",
      "1998",
      "2002",
      "2006",
      "2010",
      "2018",
      "2022",
      "2014"
    ],
    "1,000 metres, Men": [
      "2002",
      "1992",
      "1994",
      "1998",
      "2018",
      "2022",
      "2014",
      "2006",
      "2010"
    ],
    "1,000 metres, Women": [
      "2022",
      "1994",
      "2018",
      "1998",
      "2002",
      "2006",
      "2010",
      "2014"
    ],
    "500 metres, Women": [
      "2002",
      "2006",
      "1998",
      "2010",
      "2018",
      "2022",
      "1992",
      "1994",
      "2014"
    ],
    "1,500 metres, Women": [
      "2002",
      "2018",
      "2006",
      "2010",
      "2014",
      "2022"
    ],
    "3,000 metres Relay, Women": [
      "1992",
      "1994",
      "1998",
      "2002",
      "2006",
      "2010",
      "2014",
      "2022",
      "2018"
    ],
    "500 metres, Men": [
      "2002",
      "2006",
      "2010",
      "2014",
      "2022",
      "1998",
      "2018",
      "1994"
    ],
    "1,500 metres, Men": [
      "2002",
      "2014",
      "2022",
      "2006",
      "2018",
      "2010"
    ],
    "2,000 metres Relay, Mixed": [
      "2022"
    ]
  },
  "Beach Volleyball": {
    "Beach Volleyball, Women": [
      "1996",
      "2000",
      "2020",
      "2004",
      "2012",
      "2016",
      "2008"
    ],
    "Beach Volleyball, Men": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "1996",
      "2020"
    ]
  },
  "Softball": {
    "Softball, Women": [
      "1996",
      "2000",
      "2004",
      "2008",
      "2020"
    ]
  },
  "Alpine Skiing": {
    "Slalom, Women": [
      "1998",
      "1948",
      "1956",
      "1992",
      "1994",
      "2006",
      "2010",
      "2014",
      "2018",
      "2022",
      "1960",
      "1968",
      "2002",
      "1964",
      "1972",
      "1984",
      "1952",
      "1976",
      "1980",
      "1988"
    ],
    "Downhill, Men": [
      "1948",
      "1952",
      "1956",
      "1964",
      "1972",
      "1976",
      "1980",
      "1984",
      "1992",
      "1998",
      "2002",
      "2006",
      "2014",
      "2022",
      "1994",
      "1960",
      "1968",
      "1988",
      "2010",
      "2018"
    ],
    "Downhill, Women": [
      "1948",
      "1952",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "1992",
      "2002",
      "2006",
      "2010",
      "1956",
      "1988",
      "1984",
      "1998",
      "1994",
      "2018",
      "2022",
      "2014"
    ],
    "Combined, Women": [
      "1948",
      "1988",
      "1992",
      "2002",
      "2006",
      "2014",
      "1936",
      "1998",
      "2010",
      "2022",
      "1994",
      "2018"
    ],
    "Giant Slalom, Men": [
      "1952",
      "1956",
      "1960",
      "1964",
      "1968",
      "1980",
      "1988",
      "1994",
      "1998",
      "2002",
      "2006",
      "2018",
      "2014",
      "2022",
      "1972",
      "1992",
      "1984",
      "2010",
      "1976"
    ],
    "Slalom, Men": [
      "1952",
      "1956",
      "1960",
      "1964",
      "1968",
      "1992",
      "1994",
      "1998",
      "2002",
      "2006",
      "2014",
      "2018",
      "2022",
      "2010",
      "1948",
      "1984",
      "1972",
      "1976",
      "1988",
      "1980"
    ],
    "Giant Slalom, Women": [
      "1952",
      "1956",
      "1972",
      "1992",
      "1998",
      "2010",
      "2014",
      "1968",
      "1976",
      "2002",
      "2006",
      "1964",
      "1980",
      "1984",
      "1994",
      "1960",
      "2018",
      "2022",
      "1988"
    ],
    "Super G, Men": [
      "1988",
      "1998",
      "2002",
      "2006",
      "2018",
      "2022",
      "2014",
      "1994",
      "1992",
      "2010"
    ],
    "Combined, Men": [
      "1988",
      "1998",
      "2002",
      "2006",
      "2018",
      "2022",
      "2010",
      "2014",
      "1936",
      "1948",
      "1992",
      "1994"
    ],
    "Super G, Women": [
      "1988",
      "1998",
      "2006",
      "2010",
      "2014",
      "2018",
      "2022",
      "2002",
      "1992",
      "1994"
    ],
    "Team, Mixed": [
      "2018",
      "2022"
    ]
  },
  "Archery": {
    "Individual, Men": [
      "2000",
      "2004",
      "2012",
      "1972",
      "1980",
      "1992",
      "2016",
      "1976",
      "2020",
      "1984",
      "2008",
      "1988",
      "1996"
    ],
    "Team, Men": [
      "2016",
      "2008",
      "2004",
      "2020",
      "1992",
      "1988",
      "1996",
      "2000",
      "2012"
    ],
    "Au Chapelet, 33 metres, Men": [
      "1900"
    ],
    "Au Cordon Doré, 33 metres, Men": [
      "1900"
    ],
    "Au Cordon Doré, 50 metres, Men": [
      "1900"
    ],
    "Sur La Perche À La Herse, Men": [
      "1900"
    ],
    "Sur La Perche À La Pyramide, Men": [
      "1900"
    ],
    "Championnat Du Monde, Men": [
      "1900"
    ],
    "Target Archery, 28 metres, Individual, Men": [
      "1920"
    ],
    "Target Archery, 33 metres, Individual, Men": [
      "1920"
    ],
    "Target Archery, 50 metres, Individual, Men": [
      "1920"
    ],
    "Target Archery, 28 metres, Team, Men": [
      "1920"
    ],
    "Target Archery, 33 metres, Team, Men": [
      "1920"
    ],
    "Target Archery, 50 metres, Team, Men": [
      "1920"
    ],
    "Pole Archery, Small Birds, Individual, Men": [
      "1920"
    ],
    "Pole Archery, Large Birds, Individual, Men": [
      "1920"
    ],
    "Pole Archery, Small Birds, Team, Men": [
      "1920"
    ],
    "Pole Archery, Large Birds, Team, Men": [
      "1920"
    ],
    "Individual, Women": [
      "1984",
      "1996",
      "2008",
      "1980",
      "2016",
      "2004",
      "2020",
      "2012",
      "1972",
      "1988",
      "1992",
      "2000",
      "1976"
    ],
    "Team, Women": [
      "1992",
      "2004",
      "2008",
      "2012",
      "2016",
      "1996",
      "2000",
      "2020",
      "1988"
    ],
    "Au Chapelet, 50 metres, Men": [
      "1900"
    ],
    "Continental Style, Men": [
      "1908"
    ],
    "Double York Round, Men": [
      "1908",
      "1904"
    ],
    "Double National Round, Women": [
      "1908",
      "1904"
    ],
    "Team, Mixed": [
      "2020"
    ],
    "Double American Round, Men": [
      "1904"
    ],
    "Team Round, Men": [
      "1904"
    ],
    "Double Columbia Round, Women": [
      "1904"
    ],
    "Team Round, Women": [
      "1904"
    ]
  },
  "Trampolining": {
    "Individual, Men": [
      "2000",
      "2016",
      "2020",
      "2008",
      "2012",
      "2004"
    ],
    "Individual, Women": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ]
  },
  "Triathlon": {
    "Olympic Distance, Women": [
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "2016"
    ],
    "Olympic Distance, Men": [
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "2004"
    ],
    "Relay, Mixed": [
      "2020"
    ]
  },
  "Water Polo": {
    "Water Polo, Women": [
      "2000",
      "2008",
      "2012",
      "2004",
      "2020",
      "2016"
    ],
    "Water Polo, Men": [
      "1900",
      "1908",
      "1912",
      "1920",
      "1924",
      "1936",
      "1996",
      "2012",
      "2016",
      "1928",
      "1932",
      "2020",
      "1948",
      "1952",
      "1956",
      "1960",
      "1964",
      "1968",
      "1972",
      "1976",
      "1980",
      "2000",
      "2004",
      "2008",
      "1992",
      "1988",
      "1904",
      "1984"
    ]
  },
  "Freestyle Skiing": {
    "Aerials, Women": [
      "2002",
      "2006",
      "2010",
      "2014",
      "2018",
      "2022",
      "1998",
      "1994"
    ],
    "Moguls, Men": [
      "2006",
      "2010",
      "2018",
      "1994",
      "2014",
      "2022",
      "1998",
      "2002",
      "1992"
    ],
    "Aerials, Men": [
      "2014",
      "1998",
      "2002",
      "2006",
      "2010",
      "1994",
      "2018",
      "2022"
    ],
    "Moguls, Women": [
      "2022",
      "2006",
      "2010",
      "2014",
      "2018",
      "1998",
      "2002",
      "1992",
      "1994"
    ],
    "Ski Cross, Men": [
      "2010",
      "2018",
      "2014",
      "2022"
    ],
    "Ski Cross, Women": [
      "2010",
      "2014",
      "2018",
      "2022"
    ],
    "Halfpipe, Men": [
      "2014",
      "2018",
      "2022"
    ],
    "Slopestyle, Women": [
      "2014",
      "2022",
      "2018"
    ],
    "Slopestyle, Men": [
      "2018",
      "2022",
      "2014"
    ],
    "Halfpipe, Women": [
      "2018",
      "2022",
      "2014"
    ],
    "Team Aerials, Mixed": [
      "2022"
    ],
    "Big Air, Women": [
      "2022"
    ],
    "Big Air, Men": [
      "2022"
    ]
  },
  "Baseball": {
    "Baseball, Men": [
      "2004",
      "1992",
      "1996",
      "2000",
      "2008",
      "2020"
    ]
  },
  "Snowboarding": {
    "Halfpipe, Women": [
      "2010",
      "2014",
      "2018",
      "2002",
      "1998",
      "2022",
      "2006"
    ],
    "Halfpipe, Men": [
      "2018",
      "2022",
      "2006",
      "2010",
      "2014",
      "1998",
      "2002"
    ],
    "Cross, Men": [
      "2018",
      "2022",
      "2010",
      "2006",
      "2014"
    ],
    "Slopestyle, Women": [
      "2022",
      "2018",
      "2014"
    ],
    "Giant Slalom, Women": [
      "1998"
    ],
    "Parallel Giant Slalom, Men": [
      "2006",
      "2010",
      "2022",
      "2014",
      "2018",
      "2002"
    ],
    "Parallel Giant Slalom, Women": [
      "2010",
      "2022",
      "2018",
      "2002",
      "2006",
      "2014"
    ],
    "Parallel Slalom, Men": [
      "2014"
    ],
    "Parallel Slalom, Women": [
      "2014"
    ],
    "Big Air, Women": [
      "2018",
      "2022"
    ],
    "Giant Slalom, Men": [
      "1998"
    ],
    "Cross, Women": [
      "2006",
      "2010",
      "2014",
      "2022",
      "2018"
    ],
    "Slopestyle, Men": [
      "2014",
      "2018",
      "2022"
    ],
    "Big Air, Men": [
      "2018",
      "2022"
    ],
    "Team Cross, Mixed": [
      "2022"
    ]
  },
  "Cycling BMX Racing": {
    "BMX, Men": [
      "2012",
      "2016",
      "2020",
      "2008"
    ],
    "BMX, Women": [
      "2012",
      "2016",
      "2020",
      "2008"
    ]
  },
  "Modern Pentathlon": {
    "Individual, Women": [
      "2016",
      "2008",
      "2012",
      "2000",
      "2004",
      "2020"
    ],
    "Individual, Men": [
      "2000",
      "2012",
      "2004",
      "1976",
      "1956",
      "1928",
      "1936",
      "2020",
      "1952",
      "1960",
      "1964",
      "1968",
      "1972",
      "1980",
      "1988",
      "1992",
      "1996",
      "1984",
      "2008",
      "2016",
      "1912",
      "1920",
      "1924",
      "1932",
      "1948"
    ],
    "Team, Men": [
      "1976",
      "1952",
      "1956",
      "1972",
      "1968",
      "1984",
      "1988",
      "1960",
      "1964",
      "1980",
      "1992"
    ]
  },
  "Cycling BMX Freestyle": {
    "Park, Men": [
      "2020"
    ],
    "Park, Women": [
      "2020"
    ]
  },
  "Marathon Swimming": {
    "10 kilometres Open Water, Women": [
      "2020",
      "2016",
      "2008",
      "2012"
    ],
    "10 kilometres Open Water, Men": [
      "2012",
      "2016",
      "2008",
      "2020"
    ]
  },
  "Skateboarding": {
    "Park, Men": [
      "2020"
    ],
    "Street, Men": [
      "2020"
    ],
    "Street, Women": [
      "2020"
    ],
    "Park, Women": [
      "2020"
    ]
  },
  "Surfing": {
    "Shortboard, Men": [
      "2020"
    ],
    "Shortboard, Women": [
      "2020"
    ]
  },
  "Skeleton": {
    "Skeleton, Women": [
      "2022",
      "2006",
      "2010",
      "2018",
      "2002",
      "2014"
    ],
    "Skeleton, Men": [
      "2002",
      "2006",
      "2010",
      "2022",
      "1928",
      "1948",
      "2018",
      "2014"
    ]
  },
  "Figure Skating": {
    "Singles, Men": [
      "1924",
      "1928",
      "1932",
      "1936",
      "1948",
      "1952",
      "1968",
      "1960",
      "1976",
      "1984",
      "1988",
      "1994",
      "1998",
      "2006",
      "2014",
      "1972",
      "1992",
      "1980",
      "1964",
      "2010",
      "2018",
      "2022",
      "1920",
      "2002",
      "1908",
      "1956"
    ],
    "Singles, Women": [
      "1924",
      "1928",
      "1932",
      "1948",
      "1956",
      "1964",
      "1972",
      "1988",
      "2010",
      "2018",
      "1994",
      "1998",
      "1968",
      "1976",
      "1980",
      "1984",
      "1952",
      "1908",
      "1936",
      "2014",
      "1992",
      "2006",
      "2022",
      "1960",
      "2002",
      "1920"
    ],
    "Pairs, Mixed": [
      "1924",
      "1928",
      "1936",
      "1956",
      "1948",
      "1960",
      "1964",
      "1992",
      "1994",
      "2002",
      "2018",
      "2006",
      "2010",
      "2022",
      "1972",
      "1976",
      "1980",
      "1920",
      "1932",
      "1908",
      "1952",
      "1998",
      "2014",
      "1968",
      "1984",
      "1988"
    ],
    "Ice Dancing, Mixed": [
      "1988",
      "2010",
      "2014",
      "2018",
      "1992",
      "1998",
      "2002",
      "2022",
      "1984",
      "1994",
      "1980",
      "2006",
      "1976"
    ],
    "Team, Mixed": [
      "2014",
      "2018",
      "2022"
    ],
    "Special Figures, Men": [
      "1908"
    ]
  },
  "Art Competitions": {
    "Sculpturing, Medals And Reliefs, Open": [
      "1928",
      "1932"
    ],
    "Architecture, Architectural Designs, Open": [
      "1936",
      "1948",
      "1928",
      "1932"
    ],
    "Literature, Lyric Works, Open": [
      "1936",
      "1928",
      "1948"
    ],
    "Painting, Paintings, Open": [
      "1936",
      "1928",
      "1948",
      "1932"
    ],
    "Sculpturing, Medals And Plaques, Open": [
      "1948"
    ],
    "Literature, Open": [
      "1920",
      "1924",
      "1932",
      "1912"
    ],
    "Music, Open": [
      "1920",
      "1932",
      "1912"
    ],
    "Painting, Open": [
      "1920",
      "1924",
      "1912"
    ],
    "Sculpturing, Open": [
      "1920",
      "1924",
      "1912"
    ],
    "Architecture, Designs For Town Planning, Open": [
      "1932",
      "1948",
      "1928",
      "1936"
    ],
    "Sculpturing, Medals, Open": [
      "1936"
    ],
    "Music, Instrumental And Chamber, Open": [
      "1948"
    ],
    "Sculpturing, Statues, Open": [
      "1932",
      "1928",
      "1948",
      "1936"
    ],
    "Music, Compositions For Orchestra, Open": [
      "1936",
      "1928",
      "1948"
    ],
    "Literature, Epic Works, Open": [
      "1948",
      "1936",
      "1928"
    ],
    "Painting, Drawings And Water Colors, Open": [
      "1928",
      "1936",
      "1932"
    ],
    "Painting, Graphic Arts, Open": [
      "1948",
      "1928",
      "1932"
    ],
    "Music, Compositions For Solo Or Chorus, Open": [
      "1936",
      "1948"
    ],
    "Painting, Applied Arts, Open": [
      "1936",
      "1948"
    ],
    "Sculpturing, Reliefs, Open": [
      "1936",
      "1948"
    ],
    "Architecture, Open": [
      "1924",
      "1920",
      "1912"
    ],
    "Literature, Dramatic Works, Open": [
      "1928"
    ]
  },
  "Equestrian Dressage": {
    "Individual, Men": [
      "1936",
      "1924",
      "1928",
      "1932",
      "1948",
      "1912",
      "1920"
    ],
    "Individual, Open": [
      "1980",
      "1952",
      "1984",
      "1988",
      "1960",
      "1964",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2016",
      "2020",
      "2012",
      "1968",
      "1972",
      "1976"
    ],
    "Team, Open": [
      "1980",
      "1988",
      "2008",
      "1952",
      "1964",
      "1992",
      "1996",
      "2000",
      "2004",
      "2012",
      "2016",
      "2020",
      "1968",
      "1972",
      "1984",
      "1976"
    ],
    "Hacks and Hunter Combined, Open": [
      "1900"
    ],
    "Team, Men": [
      "1932",
      "1936",
      "1948",
      "1928"
    ]
  },
  "Handball": {
    "Handball, Men": [
      "1936",
      "1996",
      "2004",
      "2012",
      "1972",
      "2016",
      "2020",
      "1980",
      "1992",
      "2008",
      "1976",
      "1984",
      "2000",
      "1988"
    ],
    "Handball, Women": [
      "1984",
      "1996",
      "2000",
      "2004",
      "1976",
      "1980",
      "2016",
      "2020",
      "2012",
      "1988",
      "1992",
      "2008"
    ]
  },
  "Speed Skating": {
    "10,000 metres, Men": [
      "1936",
      "1988",
      "1932",
      "2018",
      "1984",
      "1924",
      "1948",
      "2022",
      "1952",
      "1972",
      "1976",
      "1980",
      "1992",
      "1994",
      "1998",
      "2002",
      "2006",
      "2010",
      "2014",
      "1956",
      "1960",
      "1964",
      "1968"
    ],
    "1,500 metres, Men": [
      "1988",
      "1932",
      "1984",
      "2014",
      "1924",
      "1928",
      "1936",
      "1956",
      "2006",
      "1952",
      "1964",
      "1968",
      "1972",
      "1976",
      "1992",
      "1994",
      "1998",
      "2002",
      "2010",
      "2018",
      "2022",
      "1948",
      "1960",
      "1980"
    ],
    "3,000 metres, Women": [
      "1992",
      "1994",
      "2002",
      "2006",
      "2010",
      "2022",
      "2014",
      "1976",
      "1980",
      "1984",
      "1988",
      "1960",
      "1968",
      "1998",
      "1972",
      "2018",
      "1964"
    ],
    "1,500 metres, Women": [
      "1994",
      "2006",
      "2010",
      "1980",
      "1984",
      "1988",
      "1964",
      "1968",
      "1992",
      "1998",
      "2002",
      "2018",
      "2022",
      "1972",
      "2014",
      "1960",
      "1976"
    ],
    "1,000 metres, Men": [
      "1994",
      "1980",
      "1984",
      "2014",
      "2022",
      "1988",
      "1992",
      "1998",
      "2002",
      "2006",
      "2018",
      "1976",
      "2010"
    ],
    "5,000 metres, Men": [
      "1998",
      "1932",
      "2018",
      "1984",
      "1924",
      "1928",
      "1936",
      "2002",
      "2006",
      "1952",
      "1960",
      "1968",
      "1972",
      "1976",
      "1988",
      "1992",
      "1994",
      "2010",
      "2014",
      "2022",
      "1948",
      "1964",
      "1980",
      "1956"
    ],
    "Mass Start, Men": [
      "2018",
      "2022"
    ],
    "500 metres, Men": [
      "1932",
      "1952",
      "1984",
      "1998",
      "2018",
      "2022",
      "1988",
      "1924",
      "1928",
      "1992",
      "1994",
      "2002",
      "2010",
      "1980",
      "2014",
      "1936",
      "1948",
      "1956",
      "1964",
      "1968",
      "2006",
      "1960",
      "1972",
      "1976"
    ],
    "500 metres, Women": [
      "1976",
      "1994",
      "1998",
      "2002",
      "1992",
      "2006",
      "2010",
      "2018",
      "1980",
      "1984",
      "1988",
      "1960",
      "2022",
      "2014",
      "1964",
      "1968",
      "1972"
    ],
    "1,000 metres, Women": [
      "1998",
      "2006",
      "2010",
      "1992",
      "1994",
      "2014",
      "1980",
      "1984",
      "1988",
      "1964",
      "1960",
      "2002",
      "2018",
      "2022",
      "1968",
      "1972",
      "1976"
    ],
    "5,000 metres, Women": [
      "2002",
      "2006",
      "2010",
      "2022",
      "2014",
      "2018",
      "1988",
      "1992",
      "1994",
      "1998"
    ],
    "Team Pursuit (8 laps), Men": [
      "2006",
      "2010",
      "2014",
      "2018",
      "2022"
    ],
    "Team Pursuit (6 laps), Women": [
      "2006",
      "2022",
      "2010",
      "2018",
      "2014"
    ],
    "Mass Start, Women": [
      "2022",
      "2018"
    ],
    "Allround, Men": [
      "1924"
    ]
  },
  "Ski Jumping": {
    "Large Hill, Individual, Men": [
      "1960",
      "1976",
      "1980",
      "1992",
      "1994",
      "2006",
      "2010",
      "1928",
      "1968",
      "1984",
      "1972",
      "1956",
      "1964",
      "1988",
      "1998",
      "2002",
      "2018",
      "2014",
      "2022",
      "1924",
      "1932",
      "1936",
      "1948",
      "1952"
    ],
    "Normal Hill, Individual, Men": [
      "1968",
      "1976",
      "1980",
      "1992",
      "1998",
      "2010",
      "2022",
      "1988",
      "1984",
      "1964",
      "2006",
      "1994",
      "2002",
      "2018",
      "1972",
      "2014"
    ],
    "Large Hill, Team, Men": [
      "1992",
      "1994",
      "1998",
      "2006",
      "2010",
      "2014",
      "2022",
      "1988",
      "2002",
      "2018"
    ],
    "Normal Hill, Individual, Women": [
      "2014",
      "2018",
      "2022"
    ],
    "Normal Hill, Team, Mixed": [
      "2022"
    ]
  },
  "Bobsleigh": {
    "Four, Men": [
      "1964",
      "1968",
      "1992",
      "1948",
      "2010",
      "1976",
      "1980",
      "1984",
      "1988",
      "1998",
      "1932",
      "1952",
      "1994",
      "2002",
      "2006",
      "1936",
      "2014",
      "1956",
      "1972"
    ],
    "Four/Five, Men": [
      "1924",
      "1928"
    ],
    "Two, Men": [
      "1998",
      "2006",
      "2018",
      "1976",
      "1980",
      "1984",
      "1988",
      "1952",
      "1992",
      "2002",
      "2010",
      "1964",
      "1956",
      "1968",
      "1994",
      "2014",
      "1932",
      "1936",
      "1948",
      "1972"
    ],
    "Two, Women": [
      "2010",
      "2014",
      "2018",
      "2002",
      "2006",
      "2022"
    ],
    "Four, Open": [
      "2022",
      "2018"
    ],
    "Monobob, Women": [
      "2022"
    ]
  },
  "Luge": {
    "Doubles, Open": [
      "1964",
      "1968",
      "1976",
      "1980",
      "2006",
      "2010",
      "2014",
      "2018",
      "2022",
      "1972",
      "1984",
      "1988",
      "1992",
      "1994",
      "1998",
      "2002"
    ],
    "Singles, Women": [
      "1964",
      "1992",
      "1994",
      "1998",
      "2010",
      "2018",
      "1972",
      "1976",
      "1980",
      "1984",
      "1988",
      "2002",
      "2006",
      "2014",
      "1968",
      "2022"
    ],
    "Singles, Men": [
      "1968",
      "1992",
      "1994",
      "2002",
      "2018",
      "2022",
      "1972",
      "1976",
      "1980",
      "1988",
      "1964",
      "1998",
      "2010",
      "2014",
      "1984",
      "2006"
    ],
    "Team Relay, Mixed": [
      "2018",
      "2022",
      "2014"
    ]
  },
  "Nordic Combined": {
    "Team, Men": [
      "1988",
      "1992",
      "2002",
      "2006",
      "2010",
      "2014",
      "2018",
      "1998",
      "1994",
      "2022"
    ],
    "Individual, Men": [
      "1988",
      "1992",
      "2002",
      "2006",
      "1968",
      "1972",
      "1976",
      "1980",
      "1948",
      "1952",
      "1984",
      "1998",
      "1960",
      "1964",
      "1994",
      "1924",
      "1928",
      "1932",
      "1936",
      "1956"
    ],
    "Sprint, Men": [
      "2002",
      "2006"
    ],
    "Large Hill / 10 km, Individual, Men": [
      "2010",
      "2014",
      "2018",
      "2022"
    ],
    "Normal Hill / 10 km, Individual, Men": [
      "2018",
      "2022",
      "2010",
      "2014"
    ]
  },
  "Equestrian Jumping": {
    "Team, Open": [
      "1992",
      "1976",
      "2020",
      "1996",
      "2000",
      "1968",
      "2008",
      "1964",
      "1988",
      "2016",
      "1960",
      "2004",
      "1984",
      "2012",
      "1972",
      "1980"
    ],
    "Individual, Open": [
      "1900",
      "1976",
      "2004",
      "2008",
      "2016",
      "1964",
      "1988",
      "1996",
      "1992",
      "1960",
      "1968",
      "1972",
      "2020",
      "2012",
      "2000",
      "1980",
      "1984"
    ],
    "Long Jump, Open": [
      "1900"
    ],
    "High Jump, Open": [
      "1900"
    ],
    "Individual, Men": [
      "1912",
      "1952",
      "1928",
      "1948",
      "1936",
      "1920",
      "1924",
      "1932"
    ],
    "Team, Men": [
      "1920",
      "1952",
      "1912",
      "1936",
      "1948",
      "1928",
      "1924"
    ]
  },
  "Cross Country Skiing": {
    "10 kilometres, Men": [
      "1998",
      "1992",
      "1994"
    ],
    "50 kilometres, Men": [
      "1998",
      "2006",
      "1976",
      "2002",
      "1932",
      "1948",
      "1952",
      "1956",
      "1960",
      "1964",
      "1980",
      "1984",
      "1994",
      "2018",
      "2010",
      "1988",
      "1992",
      "1924",
      "1968",
      "1972",
      "2022",
      "2014",
      "1928",
      "1936"
    ],
    "30 kilometres, Men": [
      "2002",
      "1980",
      "1956",
      "1964",
      "1968",
      "1994",
      "1998",
      "1972",
      "1988",
      "1992",
      "1960",
      "1976",
      "1984"
    ],
    "15 kilometres Skiathlon, Women": [
      "2022",
      "2006",
      "2018",
      "2010",
      "2014"
    ],
    "5/5 kilometres Pursuit, Women": [
      "2002"
    ],
    "Sprint, Women": [
      "2006",
      "2002",
      "2010",
      "2014",
      "2018",
      "2022"
    ],
    "Team Sprint, Women": [
      "2006",
      "2014",
      "2010",
      "2018",
      "2022"
    ],
    "5 kilometres, Women": [
      "1998",
      "1972",
      "1980",
      "1984",
      "1964",
      "1976",
      "1988",
      "1992",
      "1994",
      "1968"
    ],
    "5/10 kilometres Pursuit, Women": [
      "1998",
      "1992",
      "1994"
    ],
    "15 kilometres, Women": [
      "2002",
      "1992",
      "1994",
      "1998"
    ],
    "15 kilometres, Men": [
      "2006",
      "2010",
      "2002",
      "1960",
      "1964",
      "1968",
      "1976",
      "1980",
      "1984",
      "2022",
      "1956",
      "1972",
      "1988",
      "2018",
      "2014"
    ],
    "30 kilometres, Women": [
      "2006",
      "1994",
      "2010",
      "2018",
      "2022",
      "1992",
      "1998",
      "2002",
      "2014"
    ],
    "4 × 10 kilometres Relay, Men": [
      "2010",
      "1988",
      "1936",
      "1948",
      "1952",
      "1956",
      "1960",
      "1964",
      "1968",
      "1976",
      "1980",
      "1984",
      "1992",
      "1994",
      "1998",
      "2014",
      "2018",
      "2022",
      "2002",
      "2006",
      "1972"
    ],
    "4 × 5 kilometres Relay, Women": [
      "1984",
      "1976",
      "1980",
      "1988",
      "2010",
      "2014",
      "2002",
      "2006",
      "1992",
      "1994",
      "1998",
      "2018",
      "2022"
    ],
    "10 kilometres, Women": [
      "1980",
      "2006",
      "2010",
      "1952",
      "1972",
      "1976",
      "1984",
      "1988",
      "2018",
      "2022",
      "2002",
      "1968",
      "2014",
      "1956",
      "1960",
      "1964"
    ],
    "18 kilometres, Men": [
      "1924",
      "1932",
      "1936",
      "1952",
      "1928",
      "1948"
    ],
    "3 × 5 kilometres Relay, Women": [
      "1956",
      "1960",
      "1964",
      "1972",
      "1968"
    ],
    "20 kilometres, Women": [
      "1984",
      "1988"
    ],
    "Team Sprint, Men": [
      "2014",
      "2022",
      "2018",
      "2010",
      "2006"
    ],
    "30 kilometres Skiathlon, Men": [
      "2022",
      "2010",
      "2006",
      "2014",
      "2018"
    ],
    "Sprint, Men": [
      "2006",
      "2002",
      "2018",
      "2022",
      "2010",
      "2014"
    ],
    "10/15 kilometres Pursuit, Men": [
      "1992",
      "1994",
      "1998"
    ],
    "10/10 kilometres Pursuit, Men": [
      "2002"
    ]
  },
  "Biathlon": {
    "10 kilometres Sprint, Men": [
      "2002",
      "2014",
      "2010",
      "2018",
      "1980",
      "1984",
      "1988",
      "1992",
      "1998",
      "2022",
      "1994",
      "2006"
    ],
    "12.5 kilometres Pursuit, Men": [
      "2010",
      "2014",
      "2002",
      "2006",
      "2018",
      "2022"
    ],
    "4 × 7.5 kilometres Relay, Men": [
      "2010",
      "2014",
      "1972",
      "1976",
      "1980",
      "1994",
      "2002",
      "2006",
      "2022",
      "1992",
      "1998",
      "2018",
      "1988",
      "1968",
      "1984"
    ],
    "20 kilometres, Men": [
      "2018",
      "1998",
      "2010",
      "2022",
      "1972",
      "1980",
      "1984",
      "1988",
      "1960",
      "1976",
      "2014",
      "1992",
      "1994",
      "2002",
      "2006",
      "1964",
      "1968"
    ],
    "7.5 kilometres Sprint, Women": [
      "1994",
      "2018",
      "2006",
      "2010",
      "1992",
      "1998",
      "2002",
      "2022",
      "2014"
    ],
    "15 kilometres, Women": [
      "2010",
      "2014",
      "1998",
      "1992",
      "1994",
      "2022",
      "2002",
      "2006",
      "2018"
    ],
    "10 kilometres Pursuit, Women": [
      "2014",
      "2002",
      "2010",
      "2018",
      "2006",
      "2022"
    ],
    "12.5 kilometres Mass Start, Women": [
      "2014",
      "2018",
      "2022",
      "2006",
      "2010"
    ],
    "4 × 6 kilometres Relay, Women": [
      "2018",
      "2014",
      "2006",
      "2010",
      "2022"
    ],
    "15 kilometres Mass Start, Men": [
      "2014",
      "2010",
      "2018",
      "2006",
      "2022"
    ],
    "2 × 6 kilometres and 2 × 7.5 kilometres Relay, Mixed": [
      "2014",
      "2018",
      "2022"
    ],
    "3 × 7.5 kilometres Relay, Women": [
      "1992"
    ],
    "4 × 7.5 kilometres Relay, Women": [
      "1994",
      "1998",
      "2002"
    ]
  },
  "Karate": {
    "Kumite, ≤55 kg, Women": [
      "2020"
    ],
    "Kumite, ≤75 kg, Men": [
      "2020"
    ],
    "Kumite, >61 kg, Women": [
      "2020"
    ],
    "Kumite, ≤61 kg, Women": [
      "2020"
    ],
    "Kumite, ≤67 kg, Men": [
      "2020"
    ],
    "Kata, Women": [
      "2020"
    ],
    "Kumite, >75 kg, Men": [
      "2020"
    ],
    "Kata, Men": [
      "2020"
    ]
  },
  "Sport Climbing": {
    "Combined, Men": [
      "2020"
    ],
    "Combined, Women": [
      "2020"
    ]
  },
  "Rhythmic Gymnastics": {
    "Individual, Women": [
      "2000",
      "2008",
      "2012",
      "2020",
      "1988",
      "1984",
      "1996",
      "2004",
      "2016",
      "1992"
    ],
    "Group, Women": [
      "2000",
      "2008",
      "2012",
      "1996",
      "2004",
      "2016",
      "2020"
    ]
  },
  "Equestrian Driving": {
    "Four-In-Hand Competition, Open": [
      "1900"
    ]
  },
  "Equestrian Vaulting": {
    "Individual, Men": [
      "1920"
    ],
    "Team, Men": [
      "1920"
    ]
  },
  "Tug-Of-War": {
    "Tug-Of-War, Men": [
      "1920",
      "1900",
      "1908",
      "1912",
      "1904"
    ]
  },
  "Cycling Mountain Bike": {
    "Cross-Country, Men": [
      "2000",
      "2012",
      "2016",
      "1996",
      "2004",
      "2008",
      "2020"
    ],
    "Cross-Country, Women": [
      "1996",
      "2004",
      "2016",
      "2012",
      "2008",
      "2000",
      "2020"
    ]
  },
  "Golf": {
    "Individual, Men": [
      "1904",
      "2020",
      "1900",
      "2016"
    ],
    "Individual, Women": [
      "2016",
      "1900",
      "2020"
    ],
    "Team, Men": [
      "1904"
    ]
  },
  "Lacrosse": {
    "Lacrosse, Men": [
      "1904",
      "1908"
    ]
  },
  "Ice Hockey": {
    "Ice Hockey, Men": [
      "1920",
      "1924",
      "1928",
      "1932",
      "1936",
      "1948",
      "1952",
      "1956",
      "1960",
      "1968",
      "1992",
      "1994",
      "2002",
      "2010",
      "2014",
      "2018",
      "1998",
      "2006",
      "1964",
      "1972",
      "1976",
      "1984",
      "1988",
      "2022",
      "1980"
    ],
    "Ice Hockey, Women": [
      "1998",
      "2002",
      "2006",
      "2010",
      "2014",
      "2018",
      "2022"
    ]
  },
  "Artistic Swimming": {
    "Solo, Women": [
      "1984",
      "1988",
      "1992"
    ],
    "Duet, Women": [
      "1984",
      "1988",
      "1992",
      "2012",
      "2016",
      "2020",
      "2000",
      "2004",
      "2008"
    ],
    "Team, Women": [
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "2004"
    ]
  },
  "Curling": {
    "Curling, Men": [
      "1998",
      "2002",
      "2006",
      "2010",
      "2014",
      "2022",
      "1924",
      "2018"
    ],
    "Curling, Women": [
      "1998",
      "2002",
      "2006",
      "2010",
      "2014",
      "2022",
      "2018"
    ],
    "Mixed Doubles, Mixed": [
      "2018",
      "2022"
    ]
  },
  "Table Tennis": {
    "Doubles, Men": [
      "1988",
      "1992",
      "1996",
      "2000",
      "2004"
    ],
    "Singles, Women": [
      "1988",
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Doubles, Women": [
      "1988",
      "1992",
      "1996",
      "2000",
      "2004"
    ],
    "Singles, Men": [
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020",
      "1988"
    ],
    "Team, Men": [
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Team, Women": [
      "2008",
      "2012",
      "2016",
      "2020"
    ],
    "Doubles, Mixed": [
      "2020"
    ]
  },
  "Badminton": {
    "Doubles, Men": [
      "1992",
      "2008",
      "2012",
      "2016",
      "2020",
      "1996",
      "2000",
      "2004"
    ],
    "Singles, Women": [
      "1992",
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "2016",
      "1996"
    ],
    "Doubles, Women": [
      "1992",
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2020",
      "2016"
    ],
    "Singles, Men": [
      "1996",
      "2000",
      "2008",
      "2012",
      "2016",
      "2020",
      "1992",
      "2004"
    ],
    "Doubles, Mixed": [
      "1996",
      "2000",
      "2004",
      "2008",
      "2012",
      "2016",
      "2020"
    ]
  },
  "3x3 Basketball": {
    "3x3 Basketball, Women": [
      "2020"
    ],
    "3x3 Basketball, Men": [
      "2020"
    ]
  },
  "Military Ski Patrol": {
    "Military Ski Patrol, Men": [
      "1924"
    ]
  },
  "Cricket": {
    "Cricket, Men": [
      "1900"
    ]
  },
  "Croquet": {
    "Singles, One Ball, Open": [
      "1900"
    ],
    "Singles, Two Balls, Open": [
      "1900"
    ],
    "Doubles, Open": [
      "1900"
    ]
  },
  "Motorboating": {
    "A-Class (Open), Open": [
      "1908"
    ],
    "B-Class (Under 60 feet), Open": [
      "1908"
    ],
    "C-Class, Open": [
      "1908"
    ]
  },
  "Jeu De Paume": {
    "Singles, Men": [
      "1908"
    ]
  },
  "Racquets": {
    "Singles, Men": [
      "1908"
    ],
    "Doubles, Men": [
      "1908"
    ]
  },
  "Basque pelota": {
    "Two-Man Teams With Cesta, Men": [
      "1900"
    ]
  },
  "Aeronautics": {
    "Aeronautics, Open": [
      "1936"
    ]
  },
  "Roque": {
    "Singles, Men": [
      "1904"
    ]
  }
}

export const eventsByYear = {
  "1896": {
    "Athletics": [
      "800 metres, Men",
      "1,500 metres, Men",
      "Triple Jump, Men",
      "100 metres, Men",
      "400 metres, Men",
      "110 metres Hurdles, Men",
      "Marathon, Men",
      "Pole Vault, Men",
      "Shot Put, Men",
      "Discus Throw, Men",
      "High Jump, Men",
      "Long Jump, Men"
    ],
    "Tennis": [
      "Doubles, Men",
      "Singles, Men"
    ],
    "Cycling Track": [
      "333⅓ metres Time Trial, Men",
      "10,000 metres, Men",
      "12-Hours Race, Men",
      "Sprint, Men",
      "100 kilometres, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "500 metres Freestyle, Men",
      "1,200 metres Freestyle, Men",
      "100 metres Freestyle For Sailors, Men"
    ],
    "Fencing": [
      "Sabre, Individual, Men",
      "Foil, Individual, Men",
      "Foil, Masters, Individual, Men"
    ],
    "Shooting": [
      "Free Pistol, 30 metres, Men",
      "Muzzle-Loading Pistol, 25 metres, Men",
      "Free Rifle, Any Position, 300 metres, Men",
      "Military Pistol, 25 metres, Men",
      "Military Rifle, 200 metres, Men"
    ],
    "Weightlifting": [
      "Unlimited, One Hand, Men",
      "Unlimited, Two Hands, Men"
    ],
    "Artistic Gymnastics": [
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Parallel Bars, Teams, Men",
      "Horizontal Bar, Men",
      "Horizontal Bar, Teams, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Rope Climbing, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men"
    ],
    "Wrestling": [
      "Unlimited Class, Greco-Roman, Men"
    ]
  },
  "1900": {
    "Athletics": [
      "60 metres, Men",
      "100 metres, Men",
      "200 metres, Men",
      "Discus Throw, Men",
      "400 metres, Men",
      "1,500 metres, Men",
      "Marathon, Men",
      "400 metres Hurdles, Men",
      "2,500 metres Steeplechase, Men",
      "5,000 metres, Team, Men",
      "Standing Long Jump, Men",
      "800 metres, Men",
      "4,000 metres Steeplechase, Men",
      "High Jump, Men",
      "Long Jump, Men",
      "200 metres Hurdles, Men",
      "Pole Vault, Men",
      "110 metres Hurdles, Men",
      "Standing High Jump, Men",
      "Triple Jump, Men",
      "Standing Triple Jump, Men",
      "Shot Put, Men",
      "Hammer Throw, Men"
    ],
    "Fencing": [
      "Sabre, Individual, Men",
      "Sabre, Masters, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Masters and Amateurs, Individual, Men",
      "Foil, Individual, Men",
      "Foil, Masters, Individual, Men",
      "Épée, Masters, Individual, Men"
    ],
    "Swimming": [
      "200 metres Freestyle, Men",
      "1,000 metres Freestyle, Men",
      "200 metres Backstroke, Men",
      "200 metres Obstacle Course, Men",
      "Underwater Swimming, Men",
      "4,000 metres Freestyle, Men",
      "200 metres Team Swimming, Men"
    ],
    "Archery": [
      "Au Chapelet, 33 metres, Men",
      "Au Cordon Doré, 33 metres, Men",
      "Au Cordon Doré, 50 metres, Men",
      "Sur La Perche À La Herse, Men",
      "Sur La Perche À La Pyramide, Men",
      "Championnat Du Monde, Men",
      "Au Chapelet, 50 metres, Men"
    ],
    "Equestrian Driving": [
      "Four-In-Hand Competition, Open"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Long Jump, Open",
      "High Jump, Open"
    ],
    "Football": [
      "Football, Men"
    ],
    "Rowing": [
      "Eights, Men",
      "Single Sculls, Men",
      "Coxed Pairs, Men",
      "Coxed Fours, Men"
    ],
    "Shooting": [
      "Free Rifle, Three Positions, 300 metres, Men",
      "Free Rifle, Standing, 300 metres, Men",
      "Trap, Men",
      "Free Rifle, Kneeling, 300 metres, Men",
      "Free Rifle, Prone, 300 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Free Pistol, 50 metres, Team, Men",
      "Free Rifle, Three Positions, 300 metres, Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Tennis": [
      "Singles, Women",
      "Doubles, Mixed",
      "Doubles, Men",
      "Singles, Men"
    ],
    "Tug-Of-War": [
      "Tug-Of-War, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men"
    ],
    "Cricket": [
      "Cricket, Men"
    ],
    "Croquet": [
      "Singles, One Ball, Open",
      "Singles, Two Balls, Open",
      "Doubles, Open"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "Points Race, Men",
      "25 kilometres, Men"
    ],
    "Equestrian Dressage": [
      "Hacks and Hunter Combined, Open"
    ],
    "Golf": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Polo": [
      "Polo, Men"
    ],
    "Rugby": [
      "Rugby, Men"
    ],
    "Sailing": [
      "Open, Open",
      "0-½ Ton, Open",
      "½-1 Ton, Open",
      "1-2 Ton, Open",
      "2-3 Ton, Open",
      "3-10 Ton, Open",
      "10-20 Ton, Open",
      "20+ Ton, Open"
    ],
    "Basque pelota": [
      "Two-Man Teams With Cesta, Men"
    ]
  },
  "1904": {
    "Athletics": [
      "56-pound Weight Throw, Men",
      "High Jump, Men",
      "2,590 metres Steeplechase, Men",
      "All-Around Championship, Men",
      "Discus Throw, Men",
      "60 metres, Men",
      "100 metres, Men",
      "200 metres, Men",
      "400 metres, Men",
      "800 metres, Men",
      "1,500 metres, Men",
      "Marathon, Men",
      "110 metres Hurdles, Men",
      "200 metres Hurdles, Men",
      "400 metres Hurdles, Men",
      "4 miles, Team, Men",
      "Standing High Jump, Men",
      "Pole Vault, Men",
      "Long Jump, Men",
      "Standing Long Jump, Men",
      "Triple Jump, Men",
      "Standing Triple Jump, Men",
      "Shot Put, Men",
      "Hammer Throw, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Golf": [
      "Individual, Men",
      "Team, Men"
    ],
    "Lacrosse": [
      "Lacrosse, Men"
    ],
    "Rowing": [
      "Eights, Men",
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Single Sticks, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Individual All-Around, Apparatus Work, Men",
      "Individual All-Around, Field Sports, Men",
      "Individual All-Around, 4 Events, Men",
      "Team All-Around, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Rope Climbing, Men",
      "Club Swinging, Men",
      "Side Horse, Men"
    ],
    "Diving": [
      "Springboard, Men"
    ],
    "Swimming": [
      "220 yards Freestyle, Men",
      "880 yards Freestyle, Men",
      "1 mile Freestyle, Men",
      "100 yards Backstroke, Men",
      "440 yards Breaststroke, Men",
      "50 yards Freestyle, Men",
      "100 yards Freestyle, Men",
      "440 yards Freestyle, Men",
      "4 × 50 yards Freestyle Relay, Men",
      "Plunge For Distance, Men"
    ],
    "Weightlifting": [
      "Unlimited, Two Hands, Men",
      "All-Around Dumbbell Contest, Men"
    ],
    "Archery": [
      "Double American Round, Men",
      "Double York Round, Men",
      "Team Round, Men",
      "Double Columbia Round, Women",
      "Double National Round, Women",
      "Team Round, Women"
    ],
    "Boxing": [
      "Flyweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men"
    ],
    "Cycling Track": [
      "¼ mile, Men",
      "⅓ mile, Men",
      "½ mile, Men",
      "1 mile, Men",
      "2 miles, Men",
      "5 miles, Men",
      "25 miles, Men"
    ],
    "Roque": [
      "Singles, Men"
    ],
    "Tennis": [
      "Singles, Men",
      "Doubles, Men"
    ],
    "Tug-Of-War": [
      "Tug-Of-War, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Wrestling": [
      "Light-Flyweight, Freestyle, Men",
      "Flyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men"
    ]
  },
  "1908": {
    "Athletics": [
      "3,500 metres Race Walk, Men",
      "100 metres, Men",
      "200 metres, Men",
      "Pole Vault, Men",
      "Long Jump, Men",
      "Triple Jump, Men",
      "Hammer Throw, Men",
      "Discus Throw, Greek Style, Men",
      "3 miles, Team, Men",
      "High Jump, Men",
      "800 metres, Men",
      "1,600 metres Medley Relay, Men",
      "400 metres, Men",
      "1,500 metres, Men",
      "5 miles, Men",
      "400 metres Hurdles, Men",
      "3,200 metres Steeplechase, Men",
      "10 miles Race Walk, Men",
      "Shot Put, Men",
      "Standing High Jump, Men",
      "Standing Long Jump, Men",
      "Javelin Throw, Freestyle, Men",
      "Javelin Throw, Men",
      "Marathon, Men",
      "110 metres Hurdles, Men",
      "Discus Throw, Men"
    ],
    "Boxing": [
      "Middleweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men"
    ],
    "Rugby": [
      "Rugby, Men"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Breaststroke, Men",
      "100 metres Freestyle, Men"
    ],
    "Cycling Track": [
      "20 kilometres, Men",
      "Team Pursuit, 1,980 yards, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "5,000 metres, Men",
      "100 kilometres, Men"
    ],
    "Fencing": [
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Men"
    ],
    "Rowing": [
      "Eights, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Single Sculls, Men"
    ],
    "Sailing": [
      "6 metres, Open",
      "7 metres, Open",
      "8 metres, Open",
      "12 metres, Open"
    ],
    "Shooting": [
      "Free Pistol, 50 yards, Men",
      "Free Pistol, 50 yards, Team, Men",
      "Military Rifle, 200/500/600/800/900/1,000 yards, Team, Men",
      "Trap, Men",
      "Trap, Team, Men",
      "Free Rifle, Three Positions, 300 metres, Team, Men",
      "Small-Bore Rifle, 50 and 100 yards, Team, Men",
      "Free Rifle, 1,000 yards, Men",
      "Small-Bore Rifle, Prone, 50 and 100 yards, Men",
      "Small-Bore Rifle, Disappearing Target, 25 yards, Men",
      "Small-Bore Rifle, Moving Target, 25 yards, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Single Shot, Team, Men",
      "Running Target, Double Shot, Men",
      "Free Rifle, Three Positions, 300 metres, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Lacrosse": [
      "Lacrosse, Men"
    ],
    "Wrestling": [
      "Bantamweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Individual All-Around, Men"
    ],
    "Archery": [
      "Continental Style, Men",
      "Double York Round, Men",
      "Double National Round, Women"
    ],
    "Motorboating": [
      "A-Class (Open), Open",
      "B-Class (Under 60 feet), Open",
      "C-Class, Open"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Pairs, Mixed",
      "Special Figures, Men",
      "Singles, Men"
    ],
    "Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Covered Courts, Men",
      "Doubles, Covered Courts, Men",
      "Singles, Women",
      "Singles, Covered Courts, Women"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Jeu De Paume": [
      "Singles, Men"
    ],
    "Polo": [
      "Polo, Men"
    ],
    "Racquets": [
      "Singles, Men",
      "Doubles, Men"
    ],
    "Tug-Of-War": [
      "Tug-Of-War, Men"
    ]
  },
  "1912": {
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Men",
      "200 metres Breaststroke, Men",
      "400 metres Breaststroke, Men"
    ],
    "Tennis": [
      "Singles, Covered Courts, Men",
      "Doubles, Men",
      "Singles, Covered Courts, Women",
      "Doubles, Covered Courts, Men",
      "Singles, Women",
      "Doubles, Mixed",
      "Singles, Men",
      "Doubles, Covered Courts, Mixed"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Coxed Fours, Outriggers, Men",
      "Coxed Fours, Inriggers, Men",
      "Eights, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Athletics": [
      "10 kilometres Race Walk, Men",
      "Pole Vault, Men",
      "Long Jump, Men",
      "Hammer Throw, Men",
      "Pentathlon, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Cross-Country, Individual, Men",
      "Cross-Country, Team, Men",
      "Shot Put, Both Hands, Men",
      "Discus Throw, Men",
      "Discus Throw, Both Hands, Men",
      "Javelin Throw, Men",
      "Javelin Throw, Both Hands, Men",
      "4 × 400 metres Relay, Men",
      "400 metres, Men",
      "High Jump, Men",
      "200 metres, Men",
      "1,500 metres, Men",
      "4 × 100 metres Relay, Men",
      "3,000 metres, Team, Men",
      "Standing High Jump, Men",
      "Standing Long Jump, Men",
      "Marathon, Men",
      "Triple Jump, Men",
      "Decathlon, Men",
      "100 metres, Men",
      "800 metres, Men",
      "110 metres Hurdles, Men",
      "Shot Put, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Free System, Men",
      "Team All-Around, Swedish System, Men",
      "Individual All-Around, Men",
      "Team All-Around, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Sailing": [
      "6 metres, Open",
      "8 metres, Open",
      "10 metres, Open",
      "12 metres, Open"
    ],
    "Shooting": [
      "Free Rifle, Three Positions, 300 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Team, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Single Shot, Team, Men",
      "Military Rifle, Any Position, 600 metres, Men",
      "Trap, Men",
      "Trap, Team, Men",
      "Free Pistol, 50 metres, Men",
      "Free Pistol, 50 metres, Team, Men",
      "Dueling Pistol, 30 metres, Team, Men",
      "Military Rifle, 200, 400, 500 and 600 metres, Team, Men",
      "Small-Bore Rifle, Any Position, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Team, Men",
      "Small-Bore Rifle, Disappearing Target, 25 metres, Team, Men",
      "Military Rifle, Three Positions, 300 metres, Men",
      "Dueling Pistol, 30 metres, Men",
      "Small-Bore Rifle, Disappearing Target, 25 metres, Men",
      "Running Target, Double Shot, Men"
    ],
    "Wrestling": [
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight A, Greco-Roman, Men",
      "Middleweight B, Greco-Roman, Men"
    ],
    "Art Competitions": [
      "Sculpturing, Open",
      "Literature, Open",
      "Music, Open",
      "Painting, Open",
      "Architecture, Open"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men",
      "Plain High, Women",
      "Plain High, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Tug-Of-War": [
      "Tug-Of-War, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ]
  },
  "1920": {
    "Athletics": [
      "3,000 metres Race Walk, Men",
      "110 metres Hurdles, Men",
      "Pole Vault, Men",
      "Marathon, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Cross-Country, Individual, Men",
      "Cross-Country, Team, Men",
      "Triple Jump, Men",
      "Shot Put, Men",
      "Discus Throw, Men",
      "Javelin Throw, Men",
      "Pentathlon, Men",
      "4 × 100 metres Relay, Men",
      "4 × 400 metres Relay, Men",
      "100 metres, Men",
      "200 metres, Men",
      "400 metres, Men",
      "800 metres, Men",
      "1,500 metres, Men",
      "3,000 metres Steeplechase, Men",
      "3,000 metres, Team, Men",
      "10 kilometres Race Walk, Men",
      "Decathlon, Men",
      "High Jump, Men",
      "Long Jump, Men",
      "56-pound Weight Throw, Men",
      "Hammer Throw, Men",
      "400 metres Hurdles, Men"
    ],
    "Swimming": [
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "400 metres Freestyle, Men",
      "200 metres Breaststroke, Men",
      "400 metres Breaststroke, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Freestyle, Men",
      "100 metres Freestyle, Women",
      "300 metres Freestyle, Women"
    ],
    "Archery": [
      "Target Archery, 28 metres, Individual, Men",
      "Target Archery, 33 metres, Individual, Men",
      "Target Archery, 50 metres, Individual, Men",
      "Target Archery, 28 metres, Team, Men",
      "Target Archery, 33 metres, Team, Men",
      "Target Archery, 50 metres, Team, Men",
      "Pole Archery, Small Birds, Individual, Men",
      "Pole Archery, Large Birds, Individual, Men",
      "Pole Archery, Small Birds, Team, Men",
      "Pole Archery, Large Birds, Team, Men"
    ],
    "Art Competitions": [
      "Literature, Open",
      "Music, Open",
      "Painting, Open",
      "Sculpturing, Open",
      "Architecture, Open"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Team All-Around, Swedish System, Men",
      "Team All-Around, Free System, Men",
      "Individual All-Around, Men"
    ],
    "Cycling Road": [
      "Road Race, Team, Men",
      "Road Race, Individual, Men"
    ],
    "Cycling Track": [
      "50 kilometres, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Equestrian Eventing": [
      "Team, Men",
      "Individual, Men"
    ],
    "Equestrian Jumping": [
      "Team, Men",
      "Individual, Men"
    ],
    "Equestrian Vaulting": [
      "Individual, Men",
      "Team, Men"
    ],
    "Fencing": [
      "Épée, Team, Men",
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Sabre, Team, Men",
      "Sabre, Individual, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Sailing": [
      "6 metres, Open",
      "8 metres, Open",
      "6.5 metres, Open",
      "7 metres, Open",
      "12 foot, Open",
      "10 metres, Open",
      "12 metres, Open",
      "30 metres², Open",
      "40 metres², Open"
    ],
    "Shooting": [
      "Trap, Team, Men",
      "Free Pistol, 50 metres, Men",
      "Free Pistol, 50 metres, Team, Men",
      "Military Pistol, 30 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Men",
      "Military Rifle, Standing, 300 metres, Men",
      "Military Rifle, Standing, 300 metres, Team, Men",
      "Military Rifle, Prone, 300 metres, Team, Men",
      "Running Target, Single Shot, Team, Men",
      "Running Target, Double Shot, Team, Men",
      "Military Rifle, Prone, 300 metres, Men",
      "Military Pistol, Team, Men",
      "Free Rifle, Three Positions, 300 metres, Team, Men",
      "Military Rifle, Prone, 300 and 600 metres, Team, Men",
      "Smal-Bore Rifle, Standing, 50 metres, Team, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Double Shot, Men",
      "Military Rifle, Prone, 600 metres, Team, Men",
      "Military Rifle, Prone, 600 metres, Men",
      "Small-Bore Rifle, Standing, 50 metres, Men",
      "Trap, Men"
    ],
    "Tug-Of-War": [
      "Tug-Of-War, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Weightlifting": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men"
    ],
    "Boxing": [
      "Bantamweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Middleweight, Men",
      "Flyweight, Men",
      "Heavyweight, Men",
      "Featherweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Tennis": [
      "Doubles, Mixed",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Singles, Men"
    ],
    "Diving": [
      "Plain High, Women",
      "Platform, Men",
      "Plain High, Men",
      "Springboard, Men",
      "Springboard, Women"
    ],
    "Wrestling": [
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men"
    ],
    "Figure Skating": [
      "Pairs, Mixed",
      "Singles, Men",
      "Singles, Women"
    ],
    "Rowing": [
      "Double Sculls, Men",
      "Coxed Pairs, Men",
      "Single Sculls, Men",
      "Eights, Men",
      "Coxed Fours, Men"
    ],
    "Rugby": [
      "Rugby, Men"
    ],
    "Polo": [
      "Polo, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ]
  },
  "1924": {
    "Athletics": [
      "Triple Jump, Men",
      "Decathlon, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Marathon, Men",
      "400 metres Hurdles, Men",
      "3,000 metres Steeplechase, Men",
      "3,000 metres, Team, Men",
      "Cross-Country, Individual, Men",
      "Cross-Country, Team, Men",
      "Discus Throw, Men",
      "Javelin Throw, Men",
      "Pentathlon, Men",
      "High Jump, Men",
      "100 metres, Men",
      "200 metres, Men",
      "400 metres, Men",
      "800 metres, Men",
      "4 × 100 metres Relay, Men",
      "4 × 400 metres Relay, Men",
      "10 kilometres Race Walk, Men",
      "Hammer Throw, Men",
      "Long Jump, Men",
      "110 metres Hurdles, Men",
      "Pole Vault, Men",
      "Shot Put, Men"
    ],
    "Boxing": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Heavyweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Bantamweight, Men",
      "Flyweight, Men"
    ],
    "Polo": [
      "Polo, Men"
    ],
    "Diving": [
      "Plain High, Men",
      "Plain High, Women",
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Breaststroke, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Backstroke, Men",
      "100 metres Freestyle, Men",
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women"
    ],
    "Alpinism": [
      "Alpinism, Open"
    ],
    "Weightlifting": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Middleweight, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Sprint, Men",
      "50 kilometres, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Team, Men"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "6 metres, Open",
      "8 metres, Open"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Wrestling": [
      "Middleweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Bobsleigh": [
      "Four/Five, Men"
    ],
    "Rowing": [
      "Coxless Fours, Men",
      "Eights, Men",
      "Double Sculls, Men",
      "Coxless Pairs, Men",
      "Coxed Fours, Men",
      "Single Sculls, Men",
      "Coxed Pairs, Men"
    ],
    "Shooting": [
      "Trap, Team, Men",
      "Free Rifle, Prone, 600 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Trap, Men",
      "Free Rifle, 400, 600 and 800 metres, Team, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Double Shot, Men",
      "Running Target, Double Shot, Team, Men",
      "Running Target, Single Shot, Team, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Rope Climbing, Men",
      "Team All-Around, Men",
      "Horizontal Bar, Men",
      "Side Horse, Men",
      "Pommelled Horse, Men"
    ],
    "Art Competitions": [
      "Literature, Open",
      "Sculpturing, Open",
      "Architecture, Open",
      "Painting, Open"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "50 kilometres, Men"
    ],
    "Military Ski Patrol": [
      "Military Ski Patrol, Men"
    ],
    "Speed Skating": [
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Allround, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men"
    ],
    "Rugby": [
      "Rugby, Men"
    ],
    "Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed"
    ],
    "Curling": [
      "Curling, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ]
  },
  "1928": {
    "Boxing": [
      "Featherweight, Men",
      "Welterweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Middleweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men"
    ],
    "Fencing": [
      "Foil, Team, Men",
      "Foil, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Team, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Breaststroke, Men",
      "200 metres Breaststroke, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Women",
      "100 metres Backstroke, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Coxed Pairs, Men",
      "Eights, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men"
    ],
    "Art Competitions": [
      "Sculpturing, Medals And Reliefs, Open",
      "Architecture, Architectural Designs, Open",
      "Literature, Lyric Works, Open",
      "Music, Compositions For Orchestra, Open",
      "Architecture, Designs For Town Planning, Open",
      "Painting, Drawings And Water Colors, Open",
      "Sculpturing, Statues, Open",
      "Literature, Epic Works, Open",
      "Painting, Graphic Arts, Open",
      "Painting, Paintings, Open",
      "Literature, Dramatic Works, Open"
    ],
    "Weightlifting": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Wrestling": [
      "Bantamweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Athletics": [
      "100 metres, Men",
      "200 metres, Men",
      "400 metres, Men",
      "4 × 400 metres Relay, Men",
      "100 metres, Women",
      "4 × 100 metres Relay, Women",
      "High Jump, Women",
      "Marathon, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "Triple Jump, Men",
      "Discus Throw, Men",
      "Decathlon, Men",
      "High Jump, Men",
      "800 metres, Men",
      "4 × 100 metres Relay, Men",
      "Shot Put, Men",
      "800 metres, Women",
      "400 metres Hurdles, Men",
      "Long Jump, Men",
      "Javelin Throw, Men",
      "Hammer Throw, Men",
      "Discus Throw, Women",
      "110 metres Hurdles, Men",
      "Pole Vault, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Team All-Around, Women",
      "Horizontal Bar, Men",
      "Individual All-Around, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Sailing": [
      "6 metres, Open",
      "One Person Dinghy, Open",
      "8 metres, Open"
    ],
    "Speed Skating": [
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ],
    "Bobsleigh": [
      "Four/Five, Men"
    ],
    "Skeleton": [
      "Skeleton, Men"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "50 kilometres, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Diving": [
      "Platform, Women",
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women"
    ]
  },
  "1932": {
    "Athletics": [
      "Marathon, Men",
      "400 metres, Men",
      "800 metres, Men",
      "1,500 metres, Men",
      "4 × 400 metres Relay, Men",
      "High Jump, Men",
      "100 metres, Women",
      "4 × 100 metres Relay, Women",
      "High Jump, Women",
      "Shot Put, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "Hammer Throw, Men",
      "Javelin Throw, Men",
      "Decathlon, Men",
      "Discus Throw, Men",
      "100 metres, Men",
      "4 × 100 metres Relay, Men",
      "Javelin Throw, Women",
      "110 metres Hurdles, Men",
      "50 kilometres Race Walk, Men",
      "400 metres Hurdles, Men",
      "Pole Vault, Men",
      "Long Jump, Men",
      "Triple Jump, Men",
      "Discus Throw, Women",
      "80 metres Hurdles, Women",
      "200 metres, Men"
    ],
    "Boxing": [
      "Featherweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Welterweight, Men",
      "Flyweight, Men",
      "Lightweight, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Sprint, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Eights, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Coxless Pairs, Men"
    ],
    "Swimming": [
      "100 metres Backstroke, Women",
      "200 metres Breaststroke, Women",
      "400 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "200 metres Breaststroke, Men",
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women"
    ],
    "Wrestling": [
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Individual, Men"
    ],
    "Weightlifting": [
      "Lightweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Light-Heavyweight, Men",
      "Featherweight, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Art Competitions": [
      "Architecture, Designs For Town Planning, Open",
      "Sculpturing, Medals And Reliefs, Open",
      "Music, Open",
      "Sculpturing, Statues, Open",
      "Literature, Open",
      "Architecture, Architectural Designs, Open",
      "Painting, Graphic Arts, Open",
      "Painting, Drawings And Water Colors, Open",
      "Painting, Paintings, Open"
    ],
    "Sailing": [
      "6 metres, Open",
      "8 metres, Open",
      "One Person Dinghy, Open",
      "Two Person Keelboat, Open"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Speed Skating": [
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men"
    ],
    "Cycling Road": [
      "Road Race, Team, Men",
      "Road Race, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Floor Exercise, Men",
      "Pommelled Horse, Men",
      "Horse Vault, Men",
      "Rings, Men",
      "Rope Climbing, Men",
      "Club Swinging, Men",
      "Tumbling, Men"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "50 kilometres, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Team, Men"
    ],
    "Alpinism": [
      "Alpinism, Open"
    ],
    "Shooting": [
      "Rapid-Fire Pistol, 25 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women",
      "Platform, Women"
    ]
  },
  "1936": {
    "Boxing": [
      "Featherweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Welterweight, Men",
      "Lightweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men"
    ],
    "Polo": [
      "Polo, Men"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Single Sculls, Men",
      "Coxed Pairs, Men",
      "Coxed Fours, Men",
      "Double Sculls, Men",
      "Coxless Fours, Men",
      "Eights, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "200 metres Breaststroke, Women",
      "200 metres Breaststroke, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "100 metres Backstroke, Women"
    ],
    "Athletics": [
      "Triple Jump, Men",
      "800 metres, Men",
      "400 metres Hurdles, Men",
      "80 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "Shot Put, Men",
      "Javelin Throw, Men",
      "4 × 100 metres Relay, Men",
      "4 × 400 metres Relay, Men",
      "Long Jump, Men",
      "Hammer Throw, Men",
      "100 metres, Women",
      "High Jump, Women",
      "Discus Throw, Women",
      "Javelin Throw, Women",
      "400 metres, Men",
      "Marathon, Men",
      "110 metres Hurdles, Men",
      "50 kilometres Race Walk, Men",
      "1,500 metres, Men",
      "Discus Throw, Men",
      "Pole Vault, Men",
      "100 metres, Men",
      "200 metres, Men",
      "High Jump, Men",
      "Decathlon, Men"
    ],
    "Art Competitions": [
      "Architecture, Architectural Designs, Open",
      "Literature, Lyric Works, Open",
      "Painting, Paintings, Open",
      "Sculpturing, Medals, Open",
      "Music, Compositions For Orchestra, Open",
      "Literature, Epic Works, Open",
      "Architecture, Designs For Town Planning, Open",
      "Music, Compositions For Solo Or Chorus, Open",
      "Painting, Applied Arts, Open",
      "Sculpturing, Reliefs, Open",
      "Sculpturing, Statues, Open",
      "Painting, Drawings And Water Colors, Open"
    ],
    "Canoe Marathon": [
      "Kayak Singles, 10,000 metres, Men",
      "Kayak Doubles, 10,000 metres, Men",
      "Canadian Doubles, 10,000 metres, Men",
      "Folding Kayak Singles, 10,000 metres, Men",
      "Folding Kayak Doubles, 10,000 metres, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Team, Men"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Team, Men",
      "Sabre, Team, Men",
      "Sabre, Individual, Men",
      "Épée, Individual, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Handball": [
      "Handball, Men"
    ],
    "Weightlifting": [
      "Lightweight, Men",
      "Heavyweight, Men",
      "Light-Heavyweight, Men",
      "Middleweight, Men",
      "Featherweight, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Pairs, Mixed",
      "Singles, Women"
    ],
    "Speed Skating": [
      "10,000 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "500 metres, Men"
    ],
    "Cycling Road": [
      "Road Race, Team, Men",
      "Road Race, Individual, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Wrestling": [
      "Welterweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Rings, Men",
      "Team All-Around, Women",
      "Team All-Around, Men",
      "Horizontal Bar, Men",
      "Individual All-Around, Men",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Pommelled Horse, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "50 kilometres, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Shooting": [
      "Free Pistol, 50 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men"
    ],
    "Alpine Skiing": [
      "Combined, Men",
      "Combined, Women"
    ],
    "Diving": [
      "Platform, Men",
      "Platform, Women",
      "Springboard, Men",
      "Springboard, Women"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "Two Person Keelboat, Open",
      "8 metres, Open",
      "6 metres, Open"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Aeronautics": [
      "Aeronautics, Open"
    ],
    "Alpinism": [
      "Alpinism, Open"
    ]
  },
  "1948": {
    "Athletics": [
      "Marathon, Men",
      "Long Jump, Women",
      "High Jump, Men",
      "Long Jump, Men",
      "Triple Jump, Men",
      "100 metres, Women",
      "80 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "Shot Put, Women",
      "Javelin Throw, Women",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Pole Vault, Men",
      "Javelin Throw, Men",
      "800 metres, Men",
      "4 × 400 metres Relay, Men",
      "Decathlon, Men",
      "High Jump, Women",
      "Discus Throw, Women",
      "4 × 100 metres Relay, Men",
      "50 kilometres Race Walk, Men",
      "200 metres, Women",
      "Hammer Throw, Men",
      "Discus Throw, Men",
      "400 metres, Men",
      "1,500 metres, Men",
      "100 metres, Men",
      "200 metres, Men",
      "400 metres Hurdles, Men",
      "3,000 metres Steeplechase, Men",
      "10 kilometres Race Walk, Men",
      "110 metres Hurdles, Men",
      "Shot Put, Men"
    ],
    "Boxing": [
      "Flyweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Middleweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men"
    ],
    "Sailing": [
      "6 metres, Open",
      "Two Person Keelboat, Open",
      "One Person Dinghy, Open",
      "Three Person Keelboat, Open"
    ],
    "Shooting": [
      "Rapid-Fire Pistol, 25 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Coxless Pairs, Men",
      "Eights, Men"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Backstroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "100 metres Freestyle, Men",
      "200 metres Breaststroke, Men"
    ],
    "Wrestling": [
      "Welterweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Flyweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Art Competitions": [
      "Architecture, Architectural Designs, Open",
      "Sculpturing, Medals And Plaques, Open",
      "Music, Instrumental And Chamber, Open",
      "Literature, Epic Works, Open",
      "Music, Compositions For Orchestra, Open",
      "Architecture, Designs For Town Planning, Open",
      "Literature, Lyric Works, Open",
      "Painting, Graphic Arts, Open",
      "Sculpturing, Statues, Open",
      "Painting, Paintings, Open",
      "Sculpturing, Reliefs, Open",
      "Music, Compositions For Solo Or Chorus, Open",
      "Painting, Applied Arts, Open"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 500 metres, Women",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Team, Men",
      "Foil, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Downhill, Women",
      "Slalom, Women",
      "Combined, Women",
      "Slalom, Men",
      "Combined, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Canoe Marathon": [
      "Canadian Singles, 10,000 metres, Men",
      "Canadian Doubles, 10,000 metres, Men",
      "Kayak Singles, 10,000 metres, Men",
      "Kayak Doubles, 10,000 metres, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Rings, Men",
      "Team All-Around, Women",
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Pommelled Horse, Men"
    ],
    "Diving": [
      "Platform, Women",
      "Platform, Men",
      "Springboard, Men",
      "Springboard, Women"
    ],
    "Football": [
      "Football, Men"
    ],
    "Cross Country Skiing": [
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "18 kilometres, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Speed Skating": [
      "10,000 metres, Men",
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Team, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Weightlifting": [
      "Bantamweight, Men",
      "Lightweight, Men",
      "Featherweight, Men",
      "Heavyweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Skeleton": [
      "Skeleton, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ]
  },
  "1952": {
    "Athletics": [
      "Marathon, Men",
      "100 metres, Women",
      "200 metres, Women",
      "80 metres Hurdles, Women",
      "High Jump, Men",
      "Triple Jump, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "50 kilometres Race Walk, Men",
      "Javelin Throw, Women",
      "Javelin Throw, Men",
      "800 metres, Men",
      "1,500 metres, Men",
      "4 × 400 metres Relay, Men",
      "Hammer Throw, Men",
      "4 × 100 metres Relay, Women",
      "Shot Put, Women",
      "100 metres, Men",
      "3,000 metres Steeplechase, Men",
      "High Jump, Women",
      "Long Jump, Women",
      "4 × 100 metres Relay, Men",
      "Long Jump, Men",
      "Discus Throw, Men",
      "400 metres, Men",
      "400 metres Hurdles, Men",
      "10 kilometres Race Walk, Men",
      "Discus Throw, Women",
      "Pole Vault, Men",
      "200 metres, Men",
      "110 metres Hurdles, Men",
      "Shot Put, Men",
      "Decathlon, Men"
    ],
    "Boxing": [
      "Light-Middleweight, Men",
      "Light-Heavyweight, Men",
      "Middleweight, Men",
      "Featherweight, Men",
      "Welterweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Light-Welterweight, Men",
      "Heavyweight, Men",
      "Flyweight, Men"
    ],
    "Rowing": [
      "Double Sculls, Men",
      "Single Sculls, Men",
      "Eights, Men",
      "Coxless Pairs, Men",
      "Coxed Fours, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men"
    ],
    "Weightlifting": [
      "Heavyweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Swimming": [
      "200 metres Breaststroke, Men",
      "1,500 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "200 metres Breaststroke, Women",
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Freestyle, Men",
      "100 metres Backstroke, Women"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 1,000 metres, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Canoe Marathon": [
      "Canadian Doubles, 10,000 metres, Men",
      "Canadian Singles, 10,000 metres, Men",
      "Kayak Singles, 10,000 metres, Men",
      "Kayak Doubles, 10,000 metres, Men"
    ],
    "Shooting": [
      "Trap, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Running Target, Single and Double Shot, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Speed Skating": [
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Team, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Women",
      "Team All-Around, Men",
      "Horizontal Bar, Men",
      "Individual All-Around, Women",
      "Team Portable Apparatus, Women",
      "Floor Exercise, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Individual All-Around, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Horse Vault, Women"
    ],
    "Wrestling": [
      "Lightweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Flyweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Flyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Sabre, Team, Men",
      "Sabre, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "6 metres, Open",
      "Three Person Keelboat, Open",
      "Two Person Keelboat, Open",
      "5.5 metres, Open"
    ],
    "Modern Pentathlon": [
      "Team, Men",
      "Individual, Men"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "10 kilometres, Women"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Platform, Men",
      "Springboard, Men",
      "Platform, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ]
  },
  "1956": {
    "Boxing": [
      "Middleweight, Men",
      "Welterweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Featherweight, Men",
      "Flyweight, Men",
      "Lightweight, Men",
      "Light-Middleweight, Men",
      "Light-Welterweight, Men",
      "Heavyweight, Men"
    ],
    "Weightlifting": [
      "Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Bantamweight, Men",
      "Middleweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Athletics": [
      "100 metres, Men",
      "1,500 metres, Men",
      "10,000 metres, Men",
      "4 × 400 metres Relay, Men",
      "High Jump, Men",
      "100 metres, Women",
      "200 metres, Women",
      "80 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "Triple Jump, Men",
      "Javelin Throw, Women",
      "Shot Put, Men",
      "Discus Throw, Women",
      "400 metres, Men",
      "Marathon, Men",
      "Long Jump, Men",
      "4 × 100 metres Relay, Men",
      "Shot Put, Women",
      "800 metres, Men",
      "5,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "High Jump, Women",
      "Pole Vault, Men",
      "50 kilometres Race Walk, Men",
      "Javelin Throw, Men",
      "Long Jump, Women",
      "20 kilometres Race Walk, Men",
      "Hammer Throw, Men",
      "Decathlon, Men",
      "200 metres, Men",
      "110 metres Hurdles, Men",
      "400 metres Hurdles, Men",
      "Discus Throw, Men"
    ],
    "Canoe Marathon": [
      "Kayak Doubles, 10,000 metres, Men",
      "Canadian Doubles, 10,000 metres, Men",
      "Kayak Singles, 10,000 metres, Men",
      "Canadian Singles, 10,000 metres, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "1,000 metres Time Trial, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Eights, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Coxed Pairs, Men"
    ],
    "Sailing": [
      "Two Person Heavyweight Dinghy, Open",
      "5.5 metres, Open",
      "One Person Dinghy, Open",
      "Three Person Keelboat, Open",
      "Two Person Keelboat, Open"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "100 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "200 metres Breaststroke, Women",
      "100 metres Backstroke, Women",
      "200 metres Butterfly, Men",
      "200 metres Breaststroke, Men",
      "100 metres Butterfly, Women"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Singles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Downhill, Women"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Pairs, Mixed",
      "Singles, Men"
    ],
    "Wrestling": [
      "Featherweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Flyweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Springboard, Men",
      "Platform, Men",
      "Platform, Women"
    ],
    "Shooting": [
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Men",
      "Trap, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Running Target, Single and Double Shot, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Balance Beam, Women",
      "Team All-Around, Men",
      "Horse Vault, Men",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Team Portable Apparatus, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Individual All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Pommelled Horse, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Cross Country Skiing": [
      "30 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "3 × 5 kilometres Relay, Women",
      "15 kilometres, Men",
      "10 kilometres, Women"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Speed Skating": [
      "1,500 metres, Men",
      "500 metres, Men",
      "10,000 metres, Men",
      "5,000 metres, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Team, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Team, Men",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ]
  },
  "1960": {
    "Boxing": [
      "Lightweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Light-Welterweight, Men",
      "Heavyweight, Men",
      "Featherweight, Men",
      "Welterweight, Men",
      "Light-Middleweight, Men",
      "Flyweight, Men",
      "Middleweight, Men"
    ],
    "Sailing": [
      "Three Person Keelboat, Open",
      "One Person Dinghy, Open",
      "Two Person Heavyweight Dinghy, Open",
      "5.5 metres, Open",
      "Two Person Keelboat, Open"
    ],
    "Athletics": [
      "1,500 metres, Men",
      "10,000 metres, Men",
      "20 kilometres Race Walk, Men",
      "800 metres, Women",
      "800 metres, Men",
      "Decathlon, Men",
      "Javelin Throw, Women",
      "Marathon, Men",
      "Pole Vault, Men",
      "200 metres, Men",
      "100 metres, Men",
      "400 metres, Men",
      "5,000 metres, Men",
      "4 × 100 metres Relay, Men",
      "4 × 400 metres Relay, Men",
      "Javelin Throw, Men",
      "200 metres, Women",
      "80 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "Long Jump, Women",
      "Shot Put, Women",
      "50 kilometres Race Walk, Men",
      "100 metres, Women",
      "High Jump, Women",
      "Hammer Throw, Men",
      "3,000 metres Steeplechase, Men",
      "Triple Jump, Men",
      "Discus Throw, Women",
      "High Jump, Men",
      "Long Jump, Men",
      "110 metres Hurdles, Men",
      "400 metres Hurdles, Men",
      "Shot Put, Men",
      "Discus Throw, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Team, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "200 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "200 metres Breaststroke, Women",
      "100 metres Backstroke, Women",
      "200 metres Breaststroke, Men",
      "400 metres Freestyle, Women"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Eights, Men",
      "Double Sculls, Men",
      "Coxed Fours, Men",
      "Single Sculls, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men"
    ],
    "Shooting": [
      "Free Rifle, Three Positions, 300 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Trap, Men",
      "Free Pistol, 50 metres, Men"
    ],
    "Alpine Skiing": [
      "Giant Slalom, Men",
      "Slalom, Men",
      "Downhill, Women",
      "Slalom, Women",
      "Downhill, Men",
      "Giant Slalom, Women"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Artistic Gymnastics": [
      "Rings, Men",
      "Team All-Around, Women",
      "Balance Beam, Women",
      "Pommelled Horse, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Individual All-Around, Men",
      "Horse Vault, Men",
      "Horizontal Bar, Men",
      "Individual All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women"
    ],
    "Wrestling": [
      "Bantamweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Heavyweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Flyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Pairs, Mixed",
      "Singles, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Relay, 4 × 500 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Biathlon": [
      "20 kilometres, Men"
    ],
    "Cross Country Skiing": [
      "15 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "3 × 5 kilometres Relay, Women",
      "30 kilometres, Men",
      "10 kilometres, Women"
    ],
    "Speed Skating": [
      "3,000 metres, Women",
      "500 metres, Women",
      "1,000 metres, Women",
      "5,000 metres, Men",
      "1,500 metres, Men",
      "10,000 metres, Men",
      "1,500 metres, Women",
      "500 metres, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Platform, Women",
      "Platform, Men",
      "Springboard, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Fencing": [
      "Foil, Team, Men",
      "Foil, Individual, Women",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Team, Women",
      "Foil, Individual, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Weightlifting": [
      "Middle-Heavyweight, Men",
      "Middleweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Light-Heavyweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ]
  },
  "1964": {
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Athletics": [
      "10,000 metres, Men",
      "200 metres, Women",
      "400 metres, Women",
      "80 metres Hurdles, Women",
      "High Jump, Women",
      "3,000 metres Steeplechase, Men",
      "100 metres, Men",
      "800 metres, Men",
      "1,500 metres, Men",
      "Discus Throw, Men",
      "Marathon, Men",
      "Javelin Throw, Men",
      "4 × 100 metres Relay, Men",
      "800 metres, Women",
      "5,000 metres, Men",
      "20 kilometres Race Walk, Men",
      "Pole Vault, Men",
      "Hammer Throw, Men",
      "Decathlon, Men",
      "Shot Put, Women",
      "Discus Throw, Women",
      "400 metres Hurdles, Men",
      "4 × 400 metres Relay, Men",
      "50 kilometres Race Walk, Men",
      "Long Jump, Men",
      "4 × 100 metres Relay, Women",
      "Long Jump, Women",
      "Pentathlon, Women",
      "Shot Put, Men",
      "Javelin Throw, Women",
      "400 metres, Men",
      "Triple Jump, Men",
      "100 metres, Women",
      "110 metres Hurdles, Men",
      "High Jump, Men",
      "200 metres, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Judo": [
      "Open Class, Men",
      "Heavyweight, Men",
      "Middleweight, Men",
      "Lightweight, Men"
    ],
    "Sailing": [
      "5.5 metres, Open",
      "One Person Dinghy, Open",
      "Three Person Keelboat, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Two Person Keelboat, Open"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "200 metres Breaststroke, Men",
      "200 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "100 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "400 metres Individual Medley, Men",
      "100 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "200 metres Breaststroke, Women",
      "200 metres Backstroke, Men",
      "400 metres Freestyle, Women",
      "400 metres Individual Medley, Women"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Pairs, Mixed",
      "Singles, Men"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Women",
      "Singles, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Boxing": [
      "Light-Heavyweight, Men",
      "Welterweight, Men",
      "Light-Middleweight, Men",
      "Featherweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Light-Welterweight, Men",
      "Lightweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men"
    ],
    "Shooting": [
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Trap, Men",
      "Free Rifle, Three Positions, 300 metres, Men"
    ],
    "Wrestling": [
      "Flyweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Double Sculls, Men",
      "Eights, Men",
      "Coxless Fours, Men",
      "Coxed Pairs, Men",
      "Single Sculls, Men",
      "Coxed Fours, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Horse Vault, Women",
      "Balance Beam, Women",
      "Horse Vault, Men",
      "Team All-Around, Men",
      "Floor Exercise, Women",
      "Uneven Bars, Women",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Individual All-Around, Men",
      "Pommelled Horse, Men",
      "Horizontal Bar, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Weightlifting": [
      "Middleweight, Men",
      "Middle-Heavyweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Canoe Sprint": [
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women"
    ],
    "Cross Country Skiing": [
      "15 kilometres, Men",
      "30 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "5 kilometres, Women",
      "3 × 5 kilometres Relay, Women",
      "10 kilometres, Women"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men"
    ],
    "Speed Skating": [
      "1,000 metres, Women",
      "1,500 metres, Women",
      "1,500 metres, Men",
      "3,000 metres, Women",
      "500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "500 metres, Women"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women",
      "Épée, Individual, Men",
      "Sabre, Team, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Platform, Women",
      "Platform, Men",
      "Springboard, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Biathlon": [
      "20 kilometres, Men"
    ]
  },
  "1968": {
    "Boxing": [
      "Welterweight, Men",
      "Flyweight, Men",
      "Featherweight, Men",
      "Light-Heavyweight, Men",
      "Light-Welterweight, Men",
      "Light-Middleweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Bantamweight, Men",
      "Light-Flyweight, Men",
      "Lightweight, Men"
    ],
    "Rowing": [
      "Single Sculls, Men",
      "Eights, Men",
      "Coxless Pairs, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Double Sculls, Men"
    ],
    "Athletics": [
      "200 metres, Men",
      "800 metres, Men",
      "200 metres, Women",
      "80 metres Hurdles, Women",
      "Javelin Throw, Women",
      "Pentathlon, Women",
      "Triple Jump, Men",
      "4 × 100 metres Relay, Men",
      "4 × 100 metres Relay, Women",
      "Discus Throw, Men",
      "High Jump, Women",
      "50 kilometres Race Walk, Men",
      "Pole Vault, Men",
      "Long Jump, Men",
      "Shot Put, Women",
      "10,000 metres, Men",
      "Marathon, Men",
      "Javelin Throw, Men",
      "400 metres, Women",
      "400 metres Hurdles, Men",
      "Long Jump, Women",
      "Hammer Throw, Men",
      "Discus Throw, Women",
      "110 metres Hurdles, Men",
      "100 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "4 × 400 metres Relay, Men",
      "20 kilometres Race Walk, Men",
      "800 metres, Women",
      "100 metres, Women",
      "High Jump, Men",
      "Shot Put, Men",
      "400 metres, Men",
      "Decathlon, Men"
    ],
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "200 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "400 metres Freestyle, Women",
      "100 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "400 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Butterfly, Women",
      "400 metres Individual Medley, Women",
      "200 metres Butterfly, Men",
      "200 metres Breaststroke, Men",
      "800 metres Freestyle, Women",
      "100 metres Breaststroke, Men",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Butterfly, Men",
      "200 metres Individual Medley, Men",
      "400 metres Individual Medley, Men",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "200 metres Individual Medley, Women"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Singles, 500 metres, Women"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Three Person Keelboat, Open",
      "5.5 metres, Open",
      "Two Person Keelboat, Open"
    ],
    "Alpine Skiing": [
      "Giant Slalom, Men",
      "Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Downhill, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Singles, Women"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men"
    ],
    "Cycling Track": [
      "Tandem Sprint, 2,000 metres, Men",
      "1,000 metres Time Trial, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Sprint, Men"
    ],
    "Weightlifting": [
      "Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Bantamweight, Men",
      "Middleweight, Men",
      "Lightweight, Men",
      "Featherweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Wrestling": [
      "Flyweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Heavyweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Bantamweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Team All-Around, Men",
      "Pommelled Horse, Men",
      "Individual All-Around, Men",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men"
    ],
    "Diving": [
      "Platform, Women",
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women"
    ],
    "Shooting": [
      "Small-Bore Rifle, Prone, 50 metres, Open",
      "Free Pistol, 50 metres, Open",
      "Trap, Open",
      "Skeet, Open",
      "Rapid-Fire Pistol, 25 metres, Open",
      "Free Rifle, Three Positions, 300 metres, Open",
      "Small-Bore Rifle, Three Positions, 50 metres, Open"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Cross Country Skiing": [
      "15 kilometres, Men",
      "30 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "50 kilometres, Men",
      "10 kilometres, Women",
      "3 × 5 kilometres Relay, Women",
      "5 kilometres, Women"
    ],
    "Speed Skating": [
      "1,500 metres, Women",
      "3,000 metres, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "1,000 metres, Women",
      "500 metres, Men",
      "10,000 metres, Men",
      "500 metres, Women"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women"
    ],
    "Modern Pentathlon": [
      "Team, Men",
      "Individual, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Biathlon": [
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ]
  },
  "1972": {
    "Rowing": [
      "Single Sculls, Men",
      "Coxed Pairs, Men",
      "Coxed Fours, Men",
      "Double Sculls, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Eights, Men"
    ],
    "Athletics": [
      "100 metres, Women",
      "200 metres, Women",
      "High Jump, Women",
      "10,000 metres, Men",
      "Marathon, Men",
      "Triple Jump, Men",
      "Long Jump, Women",
      "Shot Put, Women",
      "Discus Throw, Women",
      "4 × 100 metres Relay, Women",
      "Discus Throw, Men",
      "20 kilometres Race Walk, Men",
      "High Jump, Men",
      "Pole Vault, Men",
      "Shot Put, Men",
      "Hammer Throw, Men",
      "400 metres, Women",
      "800 metres, Women",
      "1,500 metres, Women",
      "100 metres Hurdles, Women",
      "4 × 400 metres Relay, Women",
      "Javelin Throw, Women",
      "Pentathlon, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "110 metres Hurdles, Men",
      "4 × 400 metres Relay, Men",
      "400 metres Hurdles, Men",
      "200 metres, Men",
      "100 metres, Men",
      "400 metres, Men",
      "800 metres, Men",
      "Decathlon, Men",
      "4 × 100 metres Relay, Men",
      "50 kilometres Race Walk, Men",
      "Javelin Throw, Men",
      "Long Jump, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Individual Pursuit, 4,000 metres, Men"
    ],
    "Sailing": [
      "Two Person Keelboat, Open",
      "Three Person Keelboat, Open",
      "One Person Dinghy, Open",
      "Two Person Heavyweight Dinghy, Open"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "100 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Backstroke, Women",
      "4 × 100 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "200 metres Breaststroke, Men",
      "400 metres Individual Medley, Men",
      "100 metres Backstroke, Women",
      "100 metres Breaststroke, Men",
      "100 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Individual Medley, Men",
      "200 metres Freestyle, Men",
      "200 metres Butterfly, Men",
      "200 metres Butterfly, Women"
    ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men",
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Women"
    ],
    "Shooting": [
      "Free Pistol, 50 metres, Open",
      "Running Target, 50 metres, Open",
      "Rapid-Fire Pistol, 25 metres, Open",
      "Small-Bore Rifle, Three Positions, 50 metres, Open",
      "Skeet, Open",
      "Trap, Open",
      "Free Rifle, Three Positions, 300 metres, Open",
      "Small-Bore Rifle, Prone, 50 metres, Open"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Giant Slalom, Men",
      "Slalom, Men"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Singles, Men",
      "Pairs, Mixed"
    ],
    "Judo": [
      "Half-Heavyweight, Men",
      "Half-Middleweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Open Class, Men",
      "Heavyweight, Men"
    ],
    "Boxing": [
      "Flyweight, Men",
      "Light-Welterweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Bantamweight, Men",
      "Welterweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Light-Middleweight, Men",
      "Middleweight, Men",
      "Light-Flyweight, Men"
    ],
    "Canoe Sprint": [
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Fours, 1,000 metres, Men"
    ],
    "Weightlifting": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Wrestling": [
      "Light-Flyweight, Greco-Roman, Men",
      "Flyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Light-Flyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Bantamweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Flyweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Men",
      "Welterweight, Freestyle, Men"
    ],
    "Basketball": [
      "Basketball, Men"
    ],
    "Diving": [
      "Platform, Women",
      "Springboard, Women",
      "Springboard, Men",
      "Platform, Men"
    ],
    "Handball": [
      "Handball, Men"
    ],
    "Cross Country Skiing": [
      "5 kilometres, Women",
      "10 kilometres, Women",
      "3 × 5 kilometres Relay, Women",
      "15 kilometres, Men",
      "30 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Horse Vault, Men",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Individual All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Floor Exercise, Women"
    ],
    "Football": [
      "Football, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Biathlon": [
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Singles, Women"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Normal Hill, Individual, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Modern Pentathlon": [
      "Team, Men",
      "Individual, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Speed Skating": [
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "500 metres, Men",
      "500 metres, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ]
  },
  "1976": {
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Hockey": [
      "Hockey, Men"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "Two Person Dinghy, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Three Person Keelboat, Open",
      "Multihull, Open",
      "Two Person Keelboat, Open"
    ],
    "Swimming": [
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Medley Relay, Men",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "400 metres Individual Medley, Women",
      "4 × 100 metres Medley Relay, Women",
      "100 metres Backstroke, Men",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "100 metres Breaststroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Butterfly, Women",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Breaststroke, Men",
      "200 metres Breaststroke, Men",
      "400 metres Freestyle, Men",
      "400 metres Individual Medley, Men",
      "200 metres Breaststroke, Women",
      "100 metres Freestyle, Men",
      "200 metres Freestyle, Men",
      "200 metres Backstroke, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men"
    ],
    "Shooting": [
      "Free Pistol, 50 metres, Open",
      "Skeet, Open",
      "Rapid-Fire Pistol, 25 metres, Open",
      "Trap, Open",
      "Running Target, 50 metres, Open",
      "Small-Bore Rifle, Prone, 50 metres, Open",
      "Small-Bore Rifle, Three Positions, 50 metres, Open"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Men",
      "Slalom, Women",
      "Giant Slalom, Men"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Men",
      "Singles, Women"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men"
    ],
    "Athletics": [
      "800 metres, Men",
      "1,500 metres, Men",
      "Marathon, Men",
      "Triple Jump, Men",
      "800 metres, Women",
      "High Jump, Women",
      "Shot Put, Women",
      "Discus Throw, Women",
      "High Jump, Men",
      "400 metres, Men",
      "110 metres Hurdles, Men",
      "3,000 metres Steeplechase, Men",
      "4 × 100 metres Relay, Men",
      "20 kilometres Race Walk, Men",
      "Long Jump, Men",
      "Shot Put, Men",
      "Discus Throw, Men",
      "100 metres, Women",
      "200 metres, Women",
      "400 metres, Women",
      "1,500 metres, Women",
      "100 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "Long Jump, Women",
      "Javelin Throw, Women",
      "Pentathlon, Women",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Pole Vault, Men",
      "Javelin Throw, Men",
      "100 metres, Men",
      "200 metres, Men",
      "4 × 400 metres Relay, Men",
      "400 metres Hurdles, Men",
      "Hammer Throw, Men",
      "Decathlon, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Sprint, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Boxing": [
      "Heavyweight, Men",
      "Light-Welterweight, Men",
      "Light-Flyweight, Men",
      "Flyweight, Men",
      "Featherweight, Men",
      "Light-Middleweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Welterweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Rowing": [
      "Double Sculls, Women",
      "Coxless Pairs, Women",
      "Coxed Fours, Women",
      "Quadruple Sculls, Men",
      "Coxed Pairs, Men",
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Eights, Men",
      "Single Sculls, Women",
      "Coxed Quadruple Sculls, Women",
      "Eights, Women"
    ],
    "Weightlifting": [
      "Bantamweight, Men",
      "Featherweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Lightweight, Men",
      "Flyweight, Men"
    ],
    "Wrestling": [
      "Light-Flyweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Light-Flyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Flyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Middleweight, Freestyle, Men"
    ],
    "Canoe Sprint": [
      "Canadian Singles, 500 metres, Men",
      "Kayak Singles, 500 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Doubles, 500 metres, Women",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men",
      "Canadian Doubles, 1,000 metres, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed",
      "Ice Dancing, Mixed"
    ],
    "Speed Skating": [
      "500 metres, Women",
      "3,000 metres, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "1,000 metres, Men",
      "500 metres, Men",
      "1,000 metres, Women",
      "1,500 metres, Women"
    ],
    "Judo": [
      "Lightweight, Men",
      "Half-Middleweight, Men",
      "Half-Heavyweight, Men",
      "Open Class, Men",
      "Middleweight, Men",
      "Heavyweight, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Cycling Road": [
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Pommelled Horse, Men",
      "Team All-Around, Women",
      "Horse Vault, Women",
      "Horizontal Bar, Men",
      "Uneven Bars, Women",
      "Individual All-Around, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Individual All-Around, Women",
      "Floor Exercise, Women",
      "Balance Beam, Women",
      "Floor Exercise, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Springboard, Men",
      "Platform, Men",
      "Platform, Women"
    ],
    "Football": [
      "Football, Men"
    ],
    "Handball": [
      "Handball, Women",
      "Handball, Men"
    ],
    "Biathlon": [
      "4 × 7.5 kilometres Relay, Men",
      "20 kilometres, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Cross Country Skiing": [
      "50 kilometres, Men",
      "4 × 5 kilometres Relay, Women",
      "15 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "5 kilometres, Women",
      "10 kilometres, Women",
      "30 kilometres, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Foil, Team, Women",
      "Épée, Individual, Men",
      "Foil, Individual, Women",
      "Sabre, Team, Men",
      "Sabre, Individual, Men",
      "Épée, Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ]
  },
  "1980": {
    "Athletics": [
      "400 metres, Men",
      "Triple Jump, Men",
      "100 metres, Men",
      "Discus Throw, Women",
      "110 metres Hurdles, Men",
      "Discus Throw, Men",
      "Javelin Throw, Women",
      "400 metres, Women",
      "1,500 metres, Men",
      "Marathon, Men",
      "400 metres Hurdles, Men",
      "4 × 400 metres Relay, Men",
      "20 kilometres Race Walk, Men",
      "50 kilometres Race Walk, Men",
      "High Jump, Men",
      "Long Jump, Men",
      "Shot Put, Men",
      "Javelin Throw, Men",
      "100 metres, Women",
      "200 metres, Women",
      "1,500 metres, Women",
      "100 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "High Jump, Women",
      "Long Jump, Women",
      "Shot Put, Women",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "4 × 100 metres Relay, Men",
      "200 metres, Men",
      "800 metres, Men",
      "Decathlon, Men",
      "Pole Vault, Men",
      "Hammer Throw, Men",
      "800 metres, Women",
      "Pentathlon, Women"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 500 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Doubles, 1,000 metres, Men"
    ],
    "Swimming": [
      "200 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "200 metres Backstroke, Men",
      "100 metres Breaststroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "800 metres Freestyle, Women",
      "200 metres Butterfly, Women",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Breaststroke, Women",
      "100 metres Freestyle, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "100 metres Butterfly, Women",
      "400 metres Individual Medley, Women",
      "4 × 100 metres Medley Relay, Women",
      "200 metres Breaststroke, Men",
      "400 metres Individual Medley, Men",
      "400 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "200 metres Breaststroke, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "Two Person Keelboat, Open",
      "Two Person Dinghy, Open",
      "Multihull, Open",
      "Three Person Keelboat, Open",
      "Two Person Heavyweight Dinghy, Open"
    ],
    "Shooting": [
      "Rapid-Fire Pistol, 25 metres, Open",
      "Free Pistol, 50 metres, Open",
      "Small-Bore Rifle, Prone, 50 metres, Open",
      "Skeet, Open",
      "Small-Bore Rifle, Three Positions, 50 metres, Open",
      "Running Target, 50 metres, Open",
      "Trap, Open"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Giant Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Slalom, Men"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Men",
      "Singles, Women"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men"
    ],
    "Judo": [
      "Half-Heavyweight, Men",
      "Half-Lightweight, Men",
      "Heavyweight, Men",
      "Extra-Lightweight, Men",
      "Half-Middleweight, Men",
      "Middleweight, Men",
      "Lightweight, Men",
      "Open Class, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Pommelled Horse, Men",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Boxing": [
      "Light-Flyweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Light-Welterweight, Men",
      "Welterweight, Men",
      "Light-Middleweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men"
    ],
    "Rowing": [
      "Quadruple Sculls, Men",
      "Coxless Pairs, Women",
      "Coxed Fours, Women",
      "Coxed Quadruple Sculls, Women",
      "Double Sculls, Men",
      "Single Sculls, Men",
      "Coxless Pairs, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Eights, Men",
      "Single Sculls, Women",
      "Double Sculls, Women",
      "Eights, Women"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Weightlifting": [
      "Featherweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight II, Men",
      "Bantamweight, Men",
      "Heavyweight I, Men",
      "Super-Heavyweight, Men",
      "Flyweight, Men"
    ],
    "Wrestling": [
      "Flyweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Light-Flyweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Light-Flyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men"
    ],
    "Cross Country Skiing": [
      "30 kilometres, Men",
      "5 kilometres, Women",
      "10 kilometres, Women",
      "4 × 5 kilometres Relay, Women",
      "15 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men"
    ],
    "Speed Skating": [
      "1,000 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "500 metres, Men",
      "10,000 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men"
    ],
    "Cycling Road": [
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Men"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Sprint, Men",
      "1,000 metres Time Trial, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Diving": [
      "Platform, Men",
      "Springboard, Women",
      "Platform, Women",
      "Springboard, Men"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Biathlon": [
      "10 kilometres Sprint, Men",
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed",
      "Ice Dancing, Mixed"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women",
      "Sabre, Individual, Men",
      "Sabre, Team, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ]
  },
  "1984": {
    "Boxing": [
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Lightweight, Men",
      "Bantamweight, Men",
      "Light-Middleweight, Men",
      "Heavyweight, Men",
      "Welterweight, Men",
      "Super-Heavyweight, Men",
      "Light-Flyweight, Men",
      "Flyweight, Men",
      "Featherweight, Men",
      "Light-Welterweight, Men"
    ],
    "Athletics": [
      "Long Jump, Men",
      "Shot Put, Women",
      "Heptathlon, Women",
      "800 metres, Men",
      "100 metres, Men",
      "4 × 100 metres Relay, Men",
      "3,000 metres, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "High Jump, Men",
      "400 metres, Men",
      "110 metres Hurdles, Men",
      "Hammer Throw, Men",
      "Javelin Throw, Men",
      "Javelin Throw, Women",
      "3,000 metres Steeplechase, Men",
      "Pole Vault, Men",
      "100 metres Hurdles, Women",
      "1,500 metres, Men",
      "10,000 metres, Men",
      "Marathon, Men",
      "4 × 400 metres Relay, Men",
      "Triple Jump, Men",
      "Decathlon, Men",
      "400 metres, Women",
      "Long Jump, Women",
      "20 kilometres Race Walk, Men",
      "50 kilometres Race Walk, Men",
      "Shot Put, Men",
      "1,500 metres, Women",
      "High Jump, Women",
      "100 metres, Women",
      "200 metres, Women",
      "5,000 metres, Men",
      "400 metres Hurdles, Women",
      "Discus Throw, Women",
      "Marathon, Women",
      "800 metres, Women",
      "200 metres, Men",
      "400 metres Hurdles, Men",
      "Discus Throw, Men"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Fours, 500 metres, Women",
      "Kayak Singles, 500 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Singles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Points Race, Men",
      "1,000 metres Time Trial, Men",
      "Sprint, Men",
      "Individual Pursuit, 4,000 metres, Men"
    ],
    "Rowing": [
      "Quadruple Sculls, Men",
      "Eights, Men",
      "Coxed Fours, Women",
      "Double Sculls, Men",
      "Single Sculls, Women",
      "Single Sculls, Men",
      "Double Sculls, Women",
      "Coxless Pairs, Women",
      "Coxless Fours, Men",
      "Coxed Quadruple Sculls, Women",
      "Coxed Fours, Men",
      "Coxed Pairs, Men",
      "Eights, Women",
      "Coxless Pairs, Men"
    ],
    "Sailing": [
      "Multihull, Open",
      "Three Person Keelboat, Open",
      "One Person Dinghy, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Two Person Dinghy, Open",
      "Two Person Keelboat, Open",
      "Windsurfer, Men"
    ],
    "Shooting": [
      "Sporting Pistol, 25 metres, Women",
      "Air Rifle, 10 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Running Target, 50 metres, Men",
      "Air Rifle, 10 metres, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Skeet, Open",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Trap, Open"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "100 metres Breaststroke, Men",
      "200 metres Breaststroke, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "400 metres Individual Medley, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "200 metres Breaststroke, Women",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "200 metres Individual Medley, Men",
      "100 metres Breaststroke, Women",
      "4 × 100 metres Medley Relay, Women",
      "4 × 200 metres Freestyle Relay, Men",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "200 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Butterfly, Women"
    ],
    "Weightlifting": [
      "Light-Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Middleweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight I, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight II, Men"
    ],
    "Judo": [
      "Half-Lightweight, Men",
      "Middleweight, Men",
      "Lightweight, Men",
      "Half-Heavyweight, Men",
      "Heavyweight, Men",
      "Half-Middleweight, Men",
      "Extra-Lightweight, Men",
      "Open Class, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Downhill, Women",
      "Slalom, Men",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Giant Slalom, Men"
    ],
    "Football": [
      "Football, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Artistic Swimming": [
      "Solo, Women",
      "Duet, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Women"
    ],
    "Diving": [
      "Springboard, Women",
      "Springboard, Men",
      "Platform, Men",
      "Platform, Women"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women"
    ],
    "Wrestling": [
      "Middleweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Flyweight, Greco-Roman, Men",
      "Flyweight, Greco-Roman, Men",
      "Light-Flyweight, Freestyle, Men",
      "Flyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Featherweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Ice Dancing, Mixed",
      "Pairs, Mixed"
    ],
    "Speed Skating": [
      "500 metres, Men",
      "1,000 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women"
    ],
    "Archery": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Team All-Around, Women",
      "Uneven Bars, Women",
      "Parallel Bars, Men",
      "Individual All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Balance Beam, Women"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Team, Women",
      "Foil, Individual, Men"
    ],
    "Handball": [
      "Handball, Women",
      "Handball, Men"
    ],
    "Cross Country Skiing": [
      "5 kilometres, Women",
      "4 × 5 kilometres Relay, Women",
      "15 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "10 kilometres, Women",
      "20 kilometres, Women",
      "30 kilometres, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Normal Hill, Individual, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Biathlon": [
      "10 kilometres Sprint, Men",
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Women",
      "Singles, Men"
    ],
    "Nordic Combined": [
      "Individual, Men"
    ],
    "Modern Pentathlon": [
      "Team, Men",
      "Individual, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Hockey": [
      "Hockey, Men",
      "Hockey, Women"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ]
  },
  "1988": {
    "Tennis": [
      "Singles, Women",
      "Doubles, Women",
      "Singles, Men",
      "Doubles, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Athletics": [
      "Marathon, Women",
      "400 metres Hurdles, Women",
      "200 metres, Men",
      "800 metres, Men",
      "Triple Jump, Men",
      "100 metres Hurdles, Women",
      "High Jump, Women",
      "Discus Throw, Women",
      "Decathlon, Men",
      "Shot Put, Women",
      "20 kilometres Race Walk, Men",
      "Javelin Throw, Men",
      "Marathon, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "50 kilometres Race Walk, Men",
      "Shot Put, Men",
      "Discus Throw, Men",
      "100 metres, Women",
      "200 metres, Women",
      "400 metres, Women",
      "800 metres, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "Long Jump, Women",
      "Javelin Throw, Women",
      "Heptathlon, Women",
      "4 × 100 metres Relay, Men",
      "100 metres, Men",
      "110 metres Hurdles, Men",
      "3,000 metres Steeplechase, Men",
      "3,000 metres, Women",
      "10,000 metres, Women",
      "10,000 metres, Men",
      "4 × 400 metres Relay, Men",
      "1,500 metres, Women",
      "400 metres Hurdles, Men",
      "High Jump, Men",
      "Pole Vault, Men",
      "Hammer Throw, Men",
      "400 metres, Men",
      "Long Jump, Men"
    ],
    "Boxing": [
      "Light-Welterweight, Men",
      "Light-Flyweight, Men",
      "Bantamweight, Men",
      "Light-Middleweight, Men",
      "Middleweight, Men",
      "Super-Heavyweight, Men",
      "Flyweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Featherweight, Men",
      "Heavyweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Fours, 500 metres, Women",
      "Kayak Singles, 500 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men",
      "Kayak Doubles, 500 metres, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Points Race, Men",
      "Sprint, Women"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Swimming": [
      "200 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "800 metres Freestyle, Women",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "4 × 100 metres Medley Relay, Men",
      "4 × 100 metres Medley Relay, Women",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "100 metres Butterfly, Women",
      "200 metres Freestyle, Women",
      "200 metres Butterfly, Men",
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Backstroke, Men",
      "200 metres Individual Medley, Men",
      "400 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "200 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "100 metres Freestyle, Men",
      "100 metres Breaststroke, Men",
      "200 metres Breaststroke, Men",
      "100 metres Butterfly, Men",
      "400 metres Individual Medley, Men",
      "100 metres Backstroke, Men",
      "50 metres Freestyle, Men"
    ],
    "Judo": [
      "Middleweight, Men",
      "Half-Heavyweight, Men",
      "Lightweight, Men",
      "Half-Middleweight, Men",
      "Heavyweight, Men",
      "Half-Lightweight, Men",
      "Extra-Lightweight, Men"
    ],
    "Alpine Skiing": [
      "Super G, Men",
      "Giant Slalom, Men",
      "Combined, Men",
      "Super G, Women",
      "Combined, Women",
      "Downhill, Women",
      "Downhill, Men",
      "Slalom, Men",
      "Giant Slalom, Women",
      "Slalom, Women"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men"
    ],
    "Speed Skating": [
      "1,500 metres, Men",
      "10,000 metres, Men",
      "500 metres, Men",
      "1,000 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "5,000 metres, Men"
    ],
    "Shooting": [
      "Trap, Open",
      "Air Pistol, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Skeet, Open",
      "Running Target, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Air Rifle, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Sporting Pistol, 25 metres, Women",
      "Free Pistol, 50 metres, Men",
      "Air Pistol, 10 metres, Women",
      "Air Rifle, 10 metres, Women"
    ],
    "Football": [
      "Football, Men"
    ],
    "Sailing": [
      "Two Person Keelboat, Open",
      "Multihull, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Three Person Keelboat, Open",
      "Two Person Dinghy, Men",
      "Windsurfer, Open",
      "One Person Dinghy, Open",
      "Two Person Dinghy, Women"
    ],
    "Artistic Gymnastics": [
      "Pommelled Horse, Men",
      "Floor Exercise, Women",
      "Floor Exercise, Men",
      "Horse Vault, Men",
      "Team All-Around, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Team All-Around, Women",
      "Uneven Bars, Women",
      "Individual All-Around, Women",
      "Horse Vault, Women",
      "Balance Beam, Women",
      "Individual All-Around, Men"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women"
    ],
    "Rowing": [
      "Single Sculls, Women",
      "Double Sculls, Women",
      "Coxless Pairs, Women",
      "Coxed Fours, Women",
      "Eights, Women",
      "Single Sculls, Men",
      "Quadruple Sculls, Men",
      "Coxed Pairs, Men",
      "Coxless Fours, Men",
      "Coxed Fours, Men",
      "Quadruple Sculls, Women",
      "Coxless Pairs, Men",
      "Double Sculls, Men",
      "Eights, Men"
    ],
    "Weightlifting": [
      "Flyweight, Men",
      "Featherweight, Men",
      "Middleweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Heavyweight II, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight I, Men",
      "Super-Heavyweight, Men"
    ],
    "Wrestling": [
      "Light-Flyweight, Greco-Roman, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Light-Flyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Flyweight, Greco-Roman, Men",
      "Flyweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Lightweight, Freestyle, Men"
    ],
    "Artistic Swimming": [
      "Solo, Women",
      "Duet, Women"
    ],
    "Equestrian Dressage": [
      "Team, Open",
      "Individual, Open"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Ice Dancing, Mixed",
      "Pairs, Mixed"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women",
      "Platform, Women"
    ],
    "Table Tennis": [
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Singles, Men"
    ],
    "Cross Country Skiing": [
      "4 × 10 kilometres Relay, Men",
      "5 kilometres, Women",
      "10 kilometres, Women",
      "4 × 5 kilometres Relay, Women",
      "50 kilometres, Men",
      "15 kilometres, Men",
      "30 kilometres, Men",
      "20 kilometres, Women"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Women"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Foil, Team, Men",
      "Sabre, Team, Men",
      "Foil, Team, Women",
      "Foil, Individual, Women"
    ],
    "Biathlon": [
      "10 kilometres Sprint, Men",
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Singles, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Archery": [
      "Team, Men",
      "Team, Women",
      "Individual, Men",
      "Individual, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Modern Pentathlon": [
      "Team, Men",
      "Individual, Men"
    ],
    "Handball": [
      "Handball, Women",
      "Handball, Men"
    ],
    "Basketball": [
      "Basketball, Men",
      "Basketball, Women"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ]
  },
  "1992": {
    "Athletics": [
      "1,500 metres, Women",
      "High Jump, Men",
      "Discus Throw, Women",
      "100 metres Hurdles, Women",
      "110 metres Hurdles, Men",
      "20 kilometres Race Walk, Men",
      "3,000 metres, Women",
      "10 kilometres Race Walk, Women",
      "Shot Put, Women",
      "400 metres, Women",
      "4 × 100 metres Relay, Men",
      "4 × 400 metres Relay, Men",
      "Discus Throw, Men",
      "800 metres, Women",
      "High Jump, Women",
      "Javelin Throw, Men",
      "Decathlon, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "10,000 metres, Women",
      "Marathon, Men",
      "50 kilometres Race Walk, Men",
      "Long Jump, Women",
      "Javelin Throw, Women",
      "Heptathlon, Women",
      "100 metres, Men",
      "400 metres Hurdles, Men",
      "400 metres Hurdles, Women",
      "4 × 400 metres Relay, Women",
      "100 metres, Women",
      "200 metres, Women",
      "Marathon, Women",
      "400 metres, Men",
      "800 metres, Men",
      "3,000 metres Steeplechase, Men",
      "1,500 metres, Men",
      "200 metres, Men",
      "4 × 100 metres Relay, Women",
      "Pole Vault, Men",
      "Triple Jump, Men",
      "Long Jump, Men",
      "Shot Put, Men"
    ],
    "Boxing": [
      "Featherweight, Men",
      "Light-Flyweight, Men",
      "Super-Heavyweight, Men",
      "Light-Welterweight, Men",
      "Middleweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Welterweight, Men",
      "Light-Middleweight, Men",
      "Heavyweight, Men",
      "Lightweight, Men",
      "Light-Heavyweight, Men"
    ],
    "Tennis": [
      "Doubles, Men",
      "Doubles, Women",
      "Singles, Men",
      "Singles, Women"
    ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Women",
      "Canadian Singles, Slalom, Men",
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Fours, 500 metres, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Women",
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Men"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Individual Pursuit, Women",
      "Points Race, Men",
      "Sprint, Women",
      "Individual Pursuit, 4,000 metres, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Hockey": [
      "Hockey, Men",
      "Hockey, Women"
    ],
    "Rowing": [
      "Double Sculls, Men",
      "Coxless Fours, Men",
      "Single Sculls, Women",
      "Eights, Men",
      "Coxless Pairs, Women",
      "Coxless Fours, Women",
      "Eights, Women",
      "Double Sculls, Women",
      "Single Sculls, Men",
      "Quadruple Sculls, Men",
      "Coxless Pairs, Men",
      "Coxed Fours, Men",
      "Quadruple Sculls, Women",
      "Coxed Pairs, Men"
    ],
    "Sailing": [
      "Windsurfer, Men",
      "Multihull, Open",
      "Two Person Keelboat, Open",
      "Windsurfer, Women",
      "Three Person Keelboat, Open",
      "Two Person Heavyweight Dinghy, Open",
      "Two Person Dinghy, Men",
      "One Person Dinghy, Men",
      "Two Person Dinghy, Women",
      "One Person Dinghy, Women"
    ],
    "Swimming": [
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Breaststroke, Men",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "200 metres Backstroke, Women",
      "100 metres Breaststroke, Women",
      "200 metres Butterfly, Women",
      "100 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "200 metres Breaststroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "200 metres Freestyle, Men",
      "200 metres Butterfly, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "200 metres Freestyle, Women",
      "4 × 100 metres Medley Relay, Women",
      "200 metres Breaststroke, Men",
      "200 metres Individual Medley, Men",
      "400 metres Individual Medley, Men",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Men",
      "100 metres Butterfly, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "50 metres Freestyle, Men"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Combined, Women",
      "Super G, Women",
      "Giant Slalom, Men",
      "Combined, Men",
      "Super G, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Luge": [
      "Singles, Men",
      "Singles, Women",
      "Doubles, Open"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men"
    ],
    "Speed Skating": [
      "3,000 metres, Women",
      "500 metres, Women",
      "1,000 metres, Women",
      "500 metres, Men",
      "1,000 metres, Men",
      "1,500 metres, Women",
      "5,000 metres, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men"
    ],
    "Judo": [
      "Middleweight, Women",
      "Half-Lightweight, Men",
      "Middleweight, Men",
      "Half-Lightweight, Women",
      "Half-Middleweight, Women",
      "Heavyweight, Women",
      "Extra-Lightweight, Women",
      "Lightweight, Women",
      "Half-Middleweight, Men",
      "Heavyweight, Men",
      "Half-Heavyweight, Women",
      "Extra-Lightweight, Men",
      "Half-Heavyweight, Men",
      "Lightweight, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Shooting": [
      "Air Pistol, 10 metres, Women",
      "Air Rifle, 10 metres, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Air Pistol, 10 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Skeet, Open",
      "Sporting Pistol, 25 metres, Women",
      "Running Target, 10 metres, Men",
      "Trap, Open",
      "Air Rifle, 10 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men"
    ],
    "Weightlifting": [
      "Flyweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight II, Men",
      "Bantamweight, Men",
      "Middleweight, Men",
      "Super-Heavyweight, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight I, Men"
    ],
    "Wrestling": [
      "Flyweight, Freestyle, Men",
      "Lightweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Light-Flyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Bantamweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Lightweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Light-Flyweight, Freestyle, Men",
      "Flyweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Artistic Swimming": [
      "Solo, Women",
      "Duet, Women"
    ],
    "Biathlon": [
      "15 kilometres, Women",
      "10 kilometres Sprint, Men",
      "3 × 7.5 kilometres Relay, Women",
      "20 kilometres, Men",
      "4 × 7.5 kilometres Relay, Men",
      "7.5 kilometres Sprint, Women"
    ],
    "Figure Skating": [
      "Pairs, Mixed",
      "Singles, Men",
      "Ice Dancing, Mixed",
      "Singles, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Short Track Speed Skating": [
      "1,000 metres, Men",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "500 metres, Women"
    ],
    "Archery": [
      "Team, Women",
      "Team, Men",
      "Individual, Men",
      "Individual, Women"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Horizontal Bar, Men",
      "Pommelled Horse, Men",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Horse Vault, Men"
    ],
    "Badminton": [
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Singles, Men"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men",
      "Springboard, Women",
      "Platform, Women"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Team, Men",
      "Foil, Team, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Cross Country Skiing": [
      "4 × 10 kilometres Relay, Men",
      "5 kilometres, Women",
      "15 kilometres, Women",
      "10 kilometres, Men",
      "50 kilometres, Men",
      "10/15 kilometres Pursuit, Men",
      "30 kilometres, Women",
      "5/10 kilometres Pursuit, Women",
      "4 × 5 kilometres Relay, Women",
      "30 kilometres, Men"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Freestyle Skiing": [
      "Moguls, Men",
      "Moguls, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Football": [
      "Football, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Team, Men"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women"
    ]
  },
  "1994": {
    "Short Track Speed Skating": [
      "5,000 metres Relay, Men",
      "1,000 metres, Men",
      "1,000 metres, Women",
      "3,000 metres Relay, Women",
      "500 metres, Women",
      "500 metres, Men"
    ],
    "Alpine Skiing": [
      "Giant Slalom, Men",
      "Slalom, Men",
      "Slalom, Women",
      "Downhill, Men",
      "Super G, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Super G, Women",
      "Combined, Men",
      "Combined, Women"
    ],
    "Luge": [
      "Singles, Men",
      "Singles, Women",
      "Doubles, Open"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Normal Hill, Individual, Men"
    ],
    "Speed Skating": [
      "1,500 metres, Women",
      "3,000 metres, Women",
      "1,000 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "5,000 metres, Women",
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men"
    ],
    "Biathlon": [
      "7.5 kilometres Sprint, Women",
      "15 kilometres, Women",
      "4 × 7.5 kilometres Relay, Men",
      "4 × 7.5 kilometres Relay, Women",
      "10 kilometres Sprint, Men",
      "20 kilometres, Men"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Pairs, Mixed",
      "Singles, Women",
      "Ice Dancing, Mixed"
    ],
    "Freestyle Skiing": [
      "Moguls, Men",
      "Aerials, Men",
      "Moguls, Women",
      "Aerials, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Cross Country Skiing": [
      "30 kilometres, Men",
      "50 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "5 kilometres, Women",
      "30 kilometres, Women",
      "10 kilometres, Men",
      "10/15 kilometres Pursuit, Men",
      "15 kilometres, Women",
      "5/10 kilometres Pursuit, Women",
      "4 × 5 kilometres Relay, Women"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Men"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men"
    ]
  },
  "1996": {
    "Athletics": [
      "1,500 metres, Men",
      "400 metres, Women",
      "Javelin Throw, Women",
      "1,500 metres, Women",
      "Discus Throw, Men",
      "Discus Throw, Women",
      "Heptathlon, Women",
      "4 × 100 metres Relay, Men",
      "High Jump, Women",
      "5,000 metres, Men",
      "100 metres, Men",
      "5,000 metres, Women",
      "10,000 metres, Women",
      "10 kilometres Race Walk, Women",
      "Shot Put, Women",
      "Triple Jump, Men",
      "800 metres, Women",
      "Javelin Throw, Men",
      "Decathlon, Men",
      "Triple Jump, Women",
      "20 kilometres Race Walk, Men",
      "10,000 metres, Men",
      "Marathon, Women",
      "Pole Vault, Men",
      "200 metres, Women",
      "100 metres Hurdles, Women",
      "110 metres Hurdles, Men",
      "4 × 400 metres Relay, Women",
      "400 metres, Men",
      "4 × 400 metres Relay, Men",
      "High Jump, Men",
      "Hammer Throw, Men",
      "3,000 metres Steeplechase, Men",
      "Long Jump, Women",
      "Long Jump, Men",
      "100 metres, Women",
      "400 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "800 metres, Men",
      "Marathon, Men",
      "200 metres, Men",
      "50 kilometres Race Walk, Men",
      "Shot Put, Men",
      "400 metres Hurdles, Men"
    ],
    "Boxing": [
      "Lightweight, Men",
      "Middleweight, Men",
      "Featherweight, Men",
      "Light-Flyweight, Men",
      "Heavyweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Light-Welterweight, Men",
      "Welterweight, Men",
      "Light-Middleweight, Men",
      "Light-Heavyweight, Men",
      "Super-Heavyweight, Men"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Sailing": [
      "Windsurfer, Men",
      "Two Person Keelboat, Open",
      "Multihull, Open",
      "One Person Dinghy, Men",
      "One Person Dinghy, Open",
      "One Person Dinghy, Women",
      "Three Person Keelboat, Open",
      "Two Person Dinghy, Men",
      "Windsurfer, Women",
      "Two Person Dinghy, Women"
    ],
    "Wrestling": [
      "Flyweight, Greco-Roman, Men",
      "Light-Flyweight, Freestyle, Men",
      "Flyweight, Freestyle, Men",
      "Light-Flyweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Bantamweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Featherweight, Freestyle, Men"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Women",
      "Beach Volleyball, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Fours, 500 metres, Women",
      "Canadian Doubles, 500 metres, Men",
      "Kayak Singles, 500 metres, Men"
    ],
    "Cycling Track": [
      "Individual Pursuit, 4,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Points Race, Men",
      "Sprint, Women",
      "Points Race, Women",
      "Sprint, Men",
      "1,000 metres Time Trial, Men",
      "Individual Pursuit, Women"
    ],
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Hockey": [
      "Hockey, Men",
      "Hockey, Women"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Quadruple Sculls, Men",
      "Coxless Fours, Men",
      "Lightweight Double Sculls, Men",
      "Coxless Pairs, Women",
      "Lightweight Double Sculls, Women",
      "Single Sculls, Women",
      "Eights, Women",
      "Single Sculls, Men",
      "Lightweight Coxless Fours, Men",
      "Double Sculls, Women",
      "Quadruple Sculls, Women",
      "Double Sculls, Men",
      "Eights, Men"
    ],
    "Shooting": [
      "Trap, Men",
      "Double Trap, Men",
      "Double Trap, Women",
      "Air Rifle, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Air Pistol, 10 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Air Pistol, 10 metres, Women",
      "Sporting Pistol, 25 metres, Women",
      "Running Target, 10 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Air Rifle, 10 metres, Women",
      "Skeet, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Women"
    ],
    "Softball": [
      "Softball, Women"
    ],
    "Swimming": [
      "200 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "4 × 200 metres Freestyle Relay, Women",
      "100 metres Breaststroke, Women",
      "200 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "100 metres Breaststroke, Men",
      "50 metres Freestyle, Men",
      "100 metres Freestyle, Men",
      "200 metres Individual Medley, Men",
      "400 metres Individual Medley, Men",
      "200 metres Individual Medley, Women",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Butterfly, Women",
      "200 metres Freestyle, Women",
      "100 metres Backstroke, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "200 metres Backstroke, Women",
      "200 metres Breaststroke, Men",
      "200 metres Breaststroke, Women",
      "400 metres Individual Medley, Women",
      "200 metres Backstroke, Men",
      "100 metres Backstroke, Women"
    ],
    "Tennis": [
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Singles, Men"
    ],
    "Weightlifting": [
      "Super-Heavyweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Middleweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight I, Men",
      "Heavyweight II, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Horse Vault, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Balance Beam, Women"
    ],
    "Judo": [
      "Heavyweight, Men",
      "Lightweight, Women",
      "Half-Middleweight, Women",
      "Half-Heavyweight, Women",
      "Half-Lightweight, Men",
      "Half-Heavyweight, Men",
      "Middleweight, Women",
      "Heavyweight, Women",
      "Extra-Lightweight, Women",
      "Half-Lightweight, Women",
      "Lightweight, Men",
      "Half-Middleweight, Men",
      "Extra-Lightweight, Men",
      "Middleweight, Men"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Volleyball": [
      "Volleyball, Women",
      "Volleyball, Men"
    ],
    "Rhythmic Gymnastics": [
      "Group, Women",
      "Individual, Women"
    ],
    "Artistic Swimming": [
      "Team, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Women",
      "Cross-Country, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Women",
      "Individual Time Trial, Women",
      "Road Race, Individual, Men",
      "Individual Time Trial, Men"
    ],
    "Diving": [
      "Springboard, Women",
      "Springboard, Men",
      "Platform, Men",
      "Platform, Women"
    ],
    "Archery": [
      "Individual, Women",
      "Team, Women",
      "Team, Men",
      "Individual, Men"
    ],
    "Badminton": [
      "Singles, Men",
      "Doubles, Women",
      "Doubles, Mixed",
      "Doubles, Men",
      "Singles, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Fencing": [
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Foil, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Épée, Individual, Women",
      "Épée, Team, Women",
      "Foil, Team, Women",
      "Sabre, Team, Men",
      "Foil, Individual, Women"
    ],
    "Canoe Slalom": [
      "Canadian Singles, Slalom, Men",
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Women",
      "Kayak Singles, Slalom, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Modern Pentathlon": [
      "Individual, Men"
    ]
  },
  "1998": {
    "Alpine Skiing": [
      "Slalom, Women",
      "Downhill, Men",
      "Super G, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Combined, Men",
      "Super G, Women",
      "Giant Slalom, Women",
      "Downhill, Women",
      "Combined, Women"
    ],
    "Cross Country Skiing": [
      "10 kilometres, Men",
      "50 kilometres, Men",
      "5 kilometres, Women",
      "5/10 kilometres Pursuit, Women",
      "30 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "30 kilometres, Women",
      "4 × 5 kilometres Relay, Women",
      "10/15 kilometres Pursuit, Men",
      "15 kilometres, Women"
    ],
    "Luge": [
      "Singles, Women",
      "Singles, Men",
      "Doubles, Open"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Large Hill, Individual, Men"
    ],
    "Snowboarding": [
      "Giant Slalom, Women",
      "Giant Slalom, Men",
      "Halfpipe, Women",
      "Halfpipe, Men"
    ],
    "Biathlon": [
      "20 kilometres, Men",
      "15 kilometres, Women",
      "10 kilometres Sprint, Men",
      "4 × 7.5 kilometres Relay, Men",
      "7.5 kilometres Sprint, Women",
      "4 × 7.5 kilometres Relay, Women"
    ],
    "Freestyle Skiing": [
      "Aerials, Men",
      "Aerials, Women",
      "Moguls, Men",
      "Moguls, Women"
    ],
    "Speed Skating": [
      "5,000 metres, Men",
      "500 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "1,000 metres, Men",
      "1,500 metres, Men",
      "10,000 metres, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Ice Dancing, Mixed",
      "Pairs, Mixed"
    ],
    "Ice Hockey": [
      "Ice Hockey, Women",
      "Ice Hockey, Men"
    ],
    "Short Track Speed Skating": [
      "1,000 metres, Men",
      "5,000 metres Relay, Men",
      "500 metres, Women",
      "3,000 metres Relay, Women",
      "500 metres, Men",
      "1,000 metres, Women"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men"
    ]
  },
  "2000": {
    "Athletics": [
      "800 metres, Men",
      "5,000 metres, Men",
      "High Jump, Men",
      "1,500 metres, Women",
      "Long Jump, Men",
      "400 metres, Women",
      "Pole Vault, Women",
      "800 metres, Women",
      "100 metres, Men",
      "Hammer Throw, Men",
      "Shot Put, Women",
      "Discus Throw, Women",
      "Heptathlon, Women",
      "4 × 100 metres Relay, Men",
      "Triple Jump, Women",
      "20 kilometres Race Walk, Women",
      "110 metres Hurdles, Men",
      "Triple Jump, Men",
      "Javelin Throw, Women",
      "Javelin Throw, Men",
      "Decathlon, Men",
      "10,000 metres, Men",
      "Marathon, Men",
      "5,000 metres, Women",
      "10,000 metres, Women",
      "Shot Put, Men",
      "Discus Throw, Men",
      "Long Jump, Women",
      "Hammer Throw, Women",
      "200 metres, Men",
      "100 metres, Women",
      "400 metres, Men",
      "4 × 400 metres Relay, Men",
      "200 metres, Women",
      "400 metres Hurdles, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "Marathon, Women",
      "100 metres Hurdles, Women",
      "1,500 metres, Men",
      "3,000 metres Steeplechase, Men",
      "400 metres Hurdles, Men",
      "50 kilometres Race Walk, Men",
      "20 kilometres Race Walk, Men",
      "High Jump, Women",
      "Pole Vault, Men"
    ],
    "Boxing": [
      "Light-Welterweight, Men",
      "Middleweight, Men",
      "Light-Flyweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men",
      "Light-Heavyweight, Men",
      "Flyweight, Men",
      "Super-Heavyweight, Men",
      "Featherweight, Men",
      "Light-Middleweight, Men",
      "Welterweight, Men"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Sailing": [
      "Windsurfer, Men",
      "Two Person Dinghy, Men",
      "One Person Dinghy, Women",
      "One Person Dinghy, Open",
      "Multihull, Open",
      "Two Person Dinghy, Women",
      "Two Person Keelboat, Open",
      "Three Person Keelboat, Open",
      "Skiff, Open",
      "Windsurfer, Women",
      "One Person Dinghy, Men"
    ],
    "Weightlifting": [
      "Middleweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Heavyweight, Men",
      "Bantamweight, Men",
      "Featherweight, Women",
      "Middleweight, Women",
      "Light-Heavyweight, Women",
      "Super-Heavyweight, Women",
      "Heavyweight, Women",
      "Light-Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Flyweight, Women",
      "Lightweight, Women"
    ],
    "Archery": [
      "Individual, Men",
      "Team, Women",
      "Team, Men",
      "Individual, Women"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Women",
      "Beach Volleyball, Men"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 500 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Singles, 500 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Fours, 500 metres, Women",
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men"
    ],
    "Cycling Track": [
      "1,000 metres Time Trial, Men",
      "Keirin, Men",
      "Team Sprint, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Madison, Men",
      "500 metres Time Trial, Women",
      "Sprint, Men",
      "Sprint, Women",
      "Individual Pursuit, Women",
      "Team Pursuit, 4,000 metres, Men",
      "Points Race, Women",
      "Points Race, Men"
    ],
    "Diving": [
      "Synchronized Springboard, Men",
      "Synchronized Platform, Women",
      "Platform, Women",
      "Springboard, Men",
      "Platform, Men",
      "Synchronized Platform, Men",
      "Springboard, Women",
      "Synchronized Springboard, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Judo": [
      "Lightweight, Women",
      "Lightweight, Men",
      "Extra-Lightweight, Women",
      "Half-Middleweight, Women",
      "Middleweight, Men",
      "Half-Heavyweight, Men",
      "Half-Lightweight, Women",
      "Half-Heavyweight, Women",
      "Heavyweight, Women",
      "Extra-Lightweight, Men",
      "Middleweight, Women",
      "Half-Middleweight, Men",
      "Heavyweight, Men",
      "Half-Lightweight, Men"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Eights, Men",
      "Lightweight Coxless Fours, Men",
      "Coxless Pairs, Women",
      "Single Sculls, Women",
      "Eights, Women",
      "Lightweight Double Sculls, Men",
      "Single Sculls, Men",
      "Quadruple Sculls, Men",
      "Double Sculls, Women",
      "Quadruple Sculls, Women",
      "Lightweight Double Sculls, Women",
      "Double Sculls, Men"
    ],
    "Shooting": [
      "Trap, Men",
      "Double Trap, Men",
      "Air Pistol, 10 metres, Women",
      "Skeet, Women",
      "Air Pistol, 10 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Sporting Pistol, 25 metres, Women",
      "Air Rifle, 10 metres, Men",
      "Running Target, 10 metres, Men",
      "Air Rifle, 10 metres, Women",
      "Trap, Women",
      "Skeet, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Double Trap, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Rapid-Fire Pistol, 25 metres, Men"
    ],
    "Softball": [
      "Softball, Women"
    ],
    "Swimming": [
      "200 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Freestyle, Women",
      "4 × 200 metres Freestyle Relay, Women",
      "100 metres Breaststroke, Women",
      "200 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "400 metres Individual Medley, Men",
      "400 metres Freestyle, Women",
      "200 metres Backstroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Breaststroke, Men",
      "200 metres Breaststroke, Men",
      "200 metres Individual Medley, Men",
      "100 metres Backstroke, Women",
      "400 metres Individual Medley, Women",
      "50 metres Freestyle, Men",
      "100 metres Freestyle, Men",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "800 metres Freestyle, Women"
    ],
    "Taekwondo": [
      "Heavyweight, Men",
      "Flyweight, Women",
      "Heavyweight, Women",
      "Flyweight, Men",
      "Welterweight, Men",
      "Featherweight, Men",
      "Welterweight, Women",
      "Featherweight, Women"
    ],
    "Tennis": [
      "Doubles, Men",
      "Doubles, Women",
      "Singles, Men",
      "Singles, Women"
    ],
    "Trampolining": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Triathlon": [
      "Olympic Distance, Women",
      "Olympic Distance, Men"
    ],
    "Water Polo": [
      "Water Polo, Women",
      "Water Polo, Men"
    ],
    "Wrestling": [
      "Bantamweight, Freestyle, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Bantamweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Welterweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Heavyweight, Greco-Roman, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women",
      "Group, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Men",
      "Cross-Country, Women"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Volleyball": [
      "Volleyball, Women",
      "Volleyball, Men"
    ],
    "Artistic Gymnastics": [
      "Floor Exercise, Men",
      "Rings, Men",
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Parallel Bars, Men",
      "Individual All-Around, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Horizontal Bar, Men",
      "Pommelled Horse, Men",
      "Horse Vault, Men",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Artistic Swimming": [
      "Team, Women",
      "Duet, Women"
    ],
    "Badminton": [
      "Singles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed",
      "Doubles, Men"
    ],
    "Fencing": [
      "Foil, Team, Men",
      "Épée, Team, Women",
      "Épée, Team, Men",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Canoe Slalom": [
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Women",
      "Canadian Singles, Slalom, Men",
      "Kayak Singles, Slalom, Men"
    ],
    "Handball": [
      "Handball, Women",
      "Handball, Men"
    ],
    "Cycling Road": [
      "Individual Time Trial, Women",
      "Road Race, Individual, Men",
      "Individual Time Trial, Men",
      "Road Race, Individual, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ]
  },
  "2002": {
    "Freestyle Skiing": [
      "Aerials, Women",
      "Aerials, Men",
      "Moguls, Men",
      "Moguls, Women"
    ],
    "Short Track Speed Skating": [
      "1,000 metres, Men",
      "500 metres, Women",
      "1,500 metres, Women",
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "1,000 metres, Women"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Super G, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Combined, Men",
      "Downhill, Women",
      "Combined, Women",
      "Super G, Women",
      "Giant Slalom, Women",
      "Slalom, Women"
    ],
    "Biathlon": [
      "10 kilometres Sprint, Men",
      "10 kilometres Pursuit, Women",
      "12.5 kilometres Pursuit, Men",
      "4 × 7.5 kilometres Relay, Men",
      "20 kilometres, Men",
      "7.5 kilometres Sprint, Women",
      "15 kilometres, Women",
      "4 × 7.5 kilometres Relay, Women"
    ],
    "Cross Country Skiing": [
      "30 kilometres, Men",
      "5/5 kilometres Pursuit, Women",
      "15 kilometres, Women",
      "15 kilometres, Men",
      "50 kilometres, Men",
      "Sprint, Men",
      "4 × 10 kilometres Relay, Men",
      "Sprint, Women",
      "4 × 5 kilometres Relay, Women",
      "10 kilometres, Women",
      "30 kilometres, Women",
      "10/10 kilometres Pursuit, Men"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Singles, Women"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men",
      "Sprint, Men"
    ],
    "Skeleton": [
      "Skeleton, Men",
      "Skeleton, Women"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women"
    ],
    "Figure Skating": [
      "Pairs, Mixed",
      "Ice Dancing, Mixed",
      "Singles, Men",
      "Singles, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men",
      "Ice Hockey, Women"
    ],
    "Speed Skating": [
      "500 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "5,000 metres, Men",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "500 metres, Men",
      "1,000 metres, Men",
      "1,500 metres, Men",
      "10,000 metres, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Normal Hill, Individual, Men"
    ],
    "Snowboarding": [
      "Parallel Giant Slalom, Women",
      "Halfpipe, Women",
      "Parallel Giant Slalom, Men",
      "Halfpipe, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men",
      "Two, Women"
    ]
  },
  "2004": {
    "Basketball": [
      "Basketball, Men",
      "Basketball, Women"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Sailing": [
      "Multihull, Open",
      "One Person Dinghy, Open",
      "Two Person Keelboat, Men",
      "Windsurfer, Women",
      "One Person Dinghy, Women",
      "Three Person Keelboat, Women",
      "Windsurfer, Men",
      "One Person Dinghy, Men",
      "Two Person Dinghy, Men",
      "Skiff, Open",
      "Two Person Dinghy, Women"
    ],
    "Swimming": [
      "400 metres Individual Medley, Women",
      "100 metres Freestyle, Men",
      "200 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "4 × 200 metres Freestyle Relay, Women",
      "50 metres Freestyle, Men",
      "100 metres Breaststroke, Men",
      "200 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "100 metres Backstroke, Women",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Backstroke, Women",
      "200 metres Butterfly, Men",
      "200 metres Breaststroke, Men",
      "400 metres Individual Medley, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "200 metres Individual Medley, Men",
      "100 metres Butterfly, Men",
      "200 metres Individual Medley, Women"
    ],
    "Tennis": [
      "Doubles, Women",
      "Singles, Women",
      "Singles, Men",
      "Doubles, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Team, Women",
      "Team, Men",
      "Individual, Women"
    ],
    "Athletics": [
      "4 × 400 metres Relay, Men",
      "20 kilometres Race Walk, Men",
      "20 kilometres Race Walk, Women",
      "100 metres, Women",
      "Marathon, Men",
      "Triple Jump, Women",
      "110 metres Hurdles, Men",
      "10,000 metres, Women",
      "Shot Put, Women",
      "Hammer Throw, Women",
      "Javelin Throw, Women",
      "High Jump, Men",
      "Decathlon, Men",
      "Discus Throw, Women",
      "800 metres, Men",
      "Shot Put, Men",
      "400 metres Hurdles, Men",
      "10,000 metres, Men",
      "Discus Throw, Men",
      "5,000 metres, Men",
      "5,000 metres, Women",
      "4 × 100 metres Relay, Women",
      "4 × 100 metres Relay, Men",
      "800 metres, Women",
      "1,500 metres, Women",
      "Heptathlon, Women",
      "400 metres Hurdles, Women",
      "Pole Vault, Men",
      "200 metres, Women",
      "4 × 400 metres Relay, Women",
      "Hammer Throw, Men",
      "Marathon, Women",
      "1,500 metres, Men",
      "3,000 metres Steeplechase, Men",
      "Javelin Throw, Men",
      "400 metres, Women",
      "50 kilometres Race Walk, Men",
      "Pole Vault, Women",
      "100 metres, Men",
      "Triple Jump, Men",
      "High Jump, Women",
      "Long Jump, Women",
      "Long Jump, Men",
      "100 metres Hurdles, Women",
      "200 metres, Men",
      "400 metres, Men"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 500 metres, Men",
      "Kayak Doubles, 500 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Canadian Doubles, 500 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Singles, 500 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Fours, 500 metres, Women",
      "Kayak Doubles, 1,000 metres, Men"
    ],
    "Cycling Road": [
      "Individual Time Trial, Men",
      "Road Race, Individual, Women",
      "Road Race, Individual, Men",
      "Individual Time Trial, Women"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "Keirin, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Madison, Men",
      "Sprint, Women",
      "500 metres Time Trial, Women",
      "Individual Pursuit, Women",
      "Points Race, Women",
      "1,000 metres Time Trial, Men",
      "Team Sprint, Men",
      "Points Race, Men"
    ],
    "Diving": [
      "Platform, Men",
      "Synchronized Springboard, Men",
      "Synchronized Platform, Men",
      "Platform, Women",
      "Synchronized Springboard, Women",
      "Springboard, Men",
      "Synchronized Platform, Women",
      "Springboard, Women"
    ],
    "Rowing": [
      "Coxless Pairs, Men",
      "Eights, Men",
      "Lightweight Coxless Fours, Men",
      "Quadruple Sculls, Women",
      "Single Sculls, Women",
      "Coxless Pairs, Women",
      "Single Sculls, Men",
      "Coxless Fours, Men",
      "Quadruple Sculls, Men",
      "Double Sculls, Men",
      "Lightweight Double Sculls, Men",
      "Double Sculls, Women",
      "Lightweight Double Sculls, Women",
      "Eights, Women"
    ],
    "Shooting": [
      "Trap, Men",
      "Trap, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Sporting Pistol, 25 metres, Women",
      "Skeet, Women",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Air Pistol, 10 metres, Women",
      "Air Pistol, 10 metres, Men",
      "Air Rifle, 10 metres, Men",
      "Double Trap, Men",
      "Air Rifle, 10 metres, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Double Trap, Women",
      "Skeet, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Running Target, 10 metres, Men",
      "Free Pistol, 50 metres, Men"
    ],
    "Softball": [
      "Softball, Women"
    ],
    "Triathlon": [
      "Olympic Distance, Women",
      "Olympic Distance, Men"
    ],
    "Judo": [
      "Half-Middleweight, Women",
      "Half-Heavyweight, Men",
      "Half-Lightweight, Women",
      "Lightweight, Men",
      "Half-Middleweight, Men",
      "Half-Lightweight, Men",
      "Extra-Lightweight, Women",
      "Middleweight, Women",
      "Half-Heavyweight, Women",
      "Heavyweight, Women",
      "Lightweight, Women",
      "Heavyweight, Men",
      "Extra-Lightweight, Men",
      "Middleweight, Men"
    ],
    "Boxing": [
      "Flyweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Light-Welterweight, Men",
      "Light-Flyweight, Men",
      "Lightweight, Men",
      "Welterweight, Men",
      "Super-Heavyweight, Men",
      "Featherweight, Men",
      "Middleweight, Men"
    ],
    "Wrestling": [
      "Welterweight, Greco-Roman, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Women",
      "Heavyweight, Freestyle, Women",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Women",
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Featherweight, Freestyle, Men",
      "Flyweight, Freestyle, Women",
      "Super-Heavyweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men"
    ],
    "Weightlifting": [
      "Light-Heavyweight, Men",
      "Middleweight, Women",
      "Middle-Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Flyweight, Women",
      "Lightweight, Women",
      "Light-Heavyweight, Women",
      "Super-Heavyweight, Women",
      "Featherweight, Women",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Heavyweight, Women"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Men",
      "Beach Volleyball, Women"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Artistic Gymnastics": [
      "Floor Exercise, Men",
      "Rings, Men",
      "Parallel Bars, Men",
      "Pommelled Horse, Men",
      "Individual All-Around, Women",
      "Uneven Bars, Women",
      "Horizontal Bar, Men",
      "Team All-Around, Men",
      "Horse Vault, Men",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Balance Beam, Women",
      "Individual All-Around, Men"
    ],
    "Rhythmic Gymnastics": [
      "Group, Women",
      "Individual, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Women",
      "Cross-Country, Men"
    ],
    "Trampolining": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Badminton": [
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed",
      "Singles, Men",
      "Doubles, Men"
    ],
    "Fencing": [
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Sabre, Individual, Women",
      "Foil, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Team, Men",
      "Épée, Individual, Women",
      "Épée, Team, Women",
      "Sabre, Individual, Men",
      "Foil, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women"
    ],
    "Taekwondo": [
      "Welterweight, Women",
      "Heavyweight, Women",
      "Flyweight, Men",
      "Featherweight, Men",
      "Flyweight, Women",
      "Heavyweight, Men",
      "Welterweight, Men",
      "Featherweight, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Canoe Slalom": [
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men",
      "Kayak Singles, Slalom, Women"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Water Polo": [
      "Water Polo, Women",
      "Water Polo, Men"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Team, Women"
    ]
  },
  "2006": {
    "Freestyle Skiing": [
      "Moguls, Men",
      "Aerials, Women",
      "Aerials, Men",
      "Moguls, Women"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Super G, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Combined, Men",
      "Downhill, Women",
      "Super G, Women",
      "Slalom, Women",
      "Combined, Women",
      "Giant Slalom, Women"
    ],
    "Cross Country Skiing": [
      "50 kilometres, Men",
      "Sprint, Women",
      "Team Sprint, Women",
      "15 kilometres, Men",
      "30 kilometres, Women",
      "15 kilometres Skiathlon, Women",
      "10 kilometres, Women",
      "Sprint, Men",
      "4 × 10 kilometres Relay, Men",
      "4 × 5 kilometres Relay, Women",
      "30 kilometres Skiathlon, Men",
      "Team Sprint, Men"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Women",
      "Singles, Men"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Individual, Men",
      "Sprint, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Normal Hill, Individual, Men"
    ],
    "Snowboarding": [
      "Parallel Giant Slalom, Men",
      "Cross, Women",
      "Halfpipe, Men",
      "Cross, Men",
      "Parallel Giant Slalom, Women",
      "Halfpipe, Women"
    ],
    "Short Track Speed Skating": [
      "500 metres, Women",
      "500 metres, Men",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "1,500 metres, Men",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "1,000 metres, Men"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Four, Men",
      "Two, Women"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Pairs, Mixed",
      "Singles, Women",
      "Ice Dancing, Mixed"
    ],
    "Ice Hockey": [
      "Ice Hockey, Women",
      "Ice Hockey, Men"
    ],
    "Skeleton": [
      "Skeleton, Men",
      "Skeleton, Women"
    ],
    "Speed Skating": [
      "Team Pursuit (8 laps), Men",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "Team Pursuit (6 laps), Women",
      "500 metres, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "1,000 metres, Men",
      "10,000 metres, Men",
      "500 metres, Men"
    ],
    "Biathlon": [
      "12.5 kilometres Pursuit, Men",
      "4 × 7.5 kilometres Relay, Men",
      "7.5 kilometres Sprint, Women",
      "4 × 6 kilometres Relay, Women",
      "10 kilometres Sprint, Men",
      "15 kilometres Mass Start, Men",
      "20 kilometres, Men",
      "10 kilometres Pursuit, Women",
      "12.5 kilometres Mass Start, Women",
      "15 kilometres, Women"
    ]
  },
  "2008": {
    "Taekwondo": [
      "Flyweight, Men",
      "Heavyweight, Women",
      "Welterweight, Women",
      "Welterweight, Men",
      "Flyweight, Women",
      "Featherweight, Men",
      "Featherweight, Women",
      "Heavyweight, Men"
    ],
    "Judo": [
      "Middleweight, Men",
      "Half-Lightweight, Women",
      "Extra-Lightweight, Women",
      "Extra-Lightweight, Men",
      "Lightweight, Men",
      "Half-Heavyweight, Men",
      "Half-Middleweight, Men",
      "Lightweight, Women",
      "Half-Heavyweight, Women",
      "Heavyweight, Women",
      "Half-Lightweight, Men",
      "Heavyweight, Men",
      "Middleweight, Women",
      "Half-Middleweight, Women"
    ],
    "Basketball": [
      "Basketball, Men",
      "Basketball, Women"
    ],
    "Cycling Track": [
      "Madison, Men",
      "Sprint, Women",
      "Points Race, Women",
      "Team Pursuit, 4,000 metres, Men",
      "Sprint, Men",
      "Team Sprint, Men",
      "Points Race, Men",
      "Keirin, Men",
      "Individual Pursuit, 4,000 metres, Men",
      "Individual Pursuit, Women"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Sailing": [
      "Multihull, Open",
      "Two Person Dinghy, Men",
      "Two Person Dinghy, Women",
      "Two Person Keelboat, Men",
      "Windsurfer, Women",
      "One Person Dinghy, Women",
      "Skiff, Open",
      "Windsurfer, Men",
      "One Person Dinghy, Open",
      "One Person Dinghy, Men",
      "Three Person Keelboat, Women"
    ],
    "Boxing": [
      "Lightweight, Men",
      "Featherweight, Men",
      "Light-Flyweight, Men",
      "Welterweight, Men",
      "Light-Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Light-Welterweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men"
    ],
    "Weightlifting": [
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Middleweight, Women",
      "Bantamweight, Men",
      "Featherweight, Men",
      "Lightweight, Men",
      "Lightweight, Women",
      "Flyweight, Women",
      "Light-Heavyweight, Women",
      "Middle-Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Featherweight, Women",
      "Heavyweight, Women",
      "Super-Heavyweight, Women"
    ],
    "Wrestling": [
      "Featherweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Flyweight, Freestyle, Women",
      "Welterweight, Greco-Roman, Men",
      "Middleweight, Freestyle, Men",
      "Middleweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Heavyweight, Freestyle, Women",
      "Lightweight, Freestyle, Women",
      "Lightweight, Greco-Roman, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Heavyweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Middleweight, Freestyle, Women"
    ],
    "Athletics": [
      "20 kilometres Race Walk, Men",
      "50 kilometres Race Walk, Men",
      "Pole Vault, Men",
      "100 metres Hurdles, Women",
      "Hammer Throw, Men",
      "Decathlon, Men",
      "4 × 100 metres Relay, Women",
      "High Jump, Women",
      "4 × 100 metres Relay, Men",
      "Long Jump, Women",
      "Triple Jump, Women",
      "Shot Put, Men",
      "Marathon, Women",
      "Shot Put, Women",
      "Discus Throw, Women",
      "Hammer Throw, Women",
      "110 metres Hurdles, Men",
      "Long Jump, Men",
      "Javelin Throw, Women",
      "Discus Throw, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Marathon, Men",
      "5,000 metres, Women",
      "10,000 metres, Women",
      "Javelin Throw, Men",
      "1,500 metres, Men",
      "3,000 metres Steeplechase, Men",
      "4 × 400 metres Relay, Men",
      "High Jump, Men",
      "Triple Jump, Men",
      "400 metres, Women",
      "400 metres Hurdles, Women",
      "4 × 400 metres Relay, Women",
      "Heptathlon, Women",
      "20 kilometres Race Walk, Women",
      "100 metres, Men",
      "200 metres, Men",
      "100 metres, Women",
      "200 metres, Women",
      "800 metres, Men",
      "800 metres, Women",
      "1,500 metres, Women",
      "3,000 metres Steeplechase, Women",
      "Pole Vault, Women",
      "400 metres, Men",
      "400 metres Hurdles, Men"
    ],
    "Canoe Slalom": [
      "Canadian Singles, Slalom, Men",
      "Kayak Singles, Slalom, Women",
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, 500 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Fours, 500 metres, Women",
      "Kayak Doubles, 500 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 500 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Singles, 500 metres, Women",
      "Canadian Singles, 500 metres, Men"
    ],
    "Diving": [
      "Platform, Men",
      "Synchronized Platform, Women",
      "Springboard, Men",
      "Platform, Women",
      "Synchronized Springboard, Men",
      "Synchronized Platform, Men",
      "Springboard, Women",
      "Synchronized Springboard, Women"
    ],
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Rowing": [
      "Double Sculls, Men",
      "Coxless Pairs, Men",
      "Coxless Fours, Men",
      "Single Sculls, Women",
      "Coxless Pairs, Women",
      "Eights, Men",
      "Lightweight Coxless Fours, Men",
      "Lightweight Double Sculls, Women",
      "Quadruple Sculls, Women",
      "Single Sculls, Men",
      "Lightweight Double Sculls, Men",
      "Quadruple Sculls, Men",
      "Double Sculls, Women",
      "Eights, Women"
    ],
    "Shooting": [
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Air Pistol, 10 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Air Rifle, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Double Trap, Men",
      "Air Pistol, 10 metres, Women",
      "Sporting Pistol, 25 metres, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Air Rifle, 10 metres, Women",
      "Trap, Men",
      "Trap, Women",
      "Skeet, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Skeet, Women"
    ],
    "Softball": [
      "Softball, Women"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "1,500 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Backstroke, Men",
      "200 metres Breaststroke, Men",
      "100 metres Butterfly, Men",
      "4 × 100 metres Medley Relay, Men",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Women",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "4 × 100 metres Medley Relay, Women",
      "50 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "200 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "100 metres Breaststroke, Men",
      "400 metres Freestyle, Women",
      "200 metres Butterfly, Men",
      "200 metres Individual Medley, Men",
      "400 metres Individual Medley, Men",
      "200 metres Backstroke, Women",
      "200 metres Backstroke, Men",
      "200 metres Freestyle, Men",
      "100 metres Backstroke, Women"
    ],
    "Triathlon": [
      "Olympic Distance, Women",
      "Olympic Distance, Men"
    ],
    "Water Polo": [
      "Water Polo, Women",
      "Water Polo, Men"
    ],
    "Modern Pentathlon": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women",
      "Group, Women"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Men",
      "Beach Volleyball, Women"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Trampolining": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Tennis": [
      "Singles, Men",
      "Doubles, Women",
      "Singles, Women",
      "Doubles, Men"
    ],
    "Archery": [
      "Team, Men",
      "Individual, Women",
      "Team, Women",
      "Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Rings, Men",
      "Pommelled Horse, Men",
      "Individual All-Around, Women",
      "Team All-Around, Women",
      "Horse Vault, Women",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Horse Vault, Men",
      "Floor Exercise, Women"
    ],
    "Artistic Swimming": [
      "Team, Women",
      "Duet, Women"
    ],
    "Badminton": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed"
    ],
    "Fencing": [
      "Sabre, Individual, Men",
      "Sabre, Team, Women",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Team, Men",
      "Foil, Individual, Men",
      "Épée, Individual, Women",
      "Foil, Individual, Women",
      "Foil, Team, Women",
      "Sabre, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Team, Men",
      "Singles, Women",
      "Team, Women"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Equestrian Dressage": [
      "Team, Open",
      "Individual, Open"
    ],
    "Cycling BMX Racing": [
      "BMX, Women",
      "BMX, Men"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Men",
      "Cross-Country, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Marathon Swimming": [
      "10 kilometres Open Water, Men",
      "10 kilometres Open Water, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Women",
      "Individual Time Trial, Women",
      "Road Race, Individual, Men",
      "Individual Time Trial, Men"
    ]
  },
  "2010": {
    "Freestyle Skiing": [
      "Moguls, Men",
      "Aerials, Women",
      "Ski Cross, Men",
      "Aerials, Men",
      "Moguls, Women",
      "Ski Cross, Women"
    ],
    "Snowboarding": [
      "Halfpipe, Women",
      "Parallel Giant Slalom, Men",
      "Parallel Giant Slalom, Women",
      "Cross, Men",
      "Cross, Women",
      "Halfpipe, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Women",
      "Super G, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Slalom, Men",
      "Combined, Men",
      "Combined, Women",
      "Downhill, Men",
      "Super G, Men",
      "Giant Slalom, Men"
    ],
    "Biathlon": [
      "12.5 kilometres Pursuit, Men",
      "4 × 7.5 kilometres Relay, Men",
      "20 kilometres, Men",
      "15 kilometres, Women",
      "10 kilometres Sprint, Men",
      "15 kilometres Mass Start, Men",
      "7.5 kilometres Sprint, Women",
      "10 kilometres Pursuit, Women",
      "4 × 6 kilometres Relay, Women",
      "12.5 kilometres Mass Start, Women"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Women",
      "Singles, Men"
    ],
    "Nordic Combined": [
      "Large Hill / 10 km, Individual, Men",
      "Team, Men",
      "Normal Hill / 10 km, Individual, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men"
    ],
    "Bobsleigh": [
      "Four, Men",
      "Two, Women",
      "Two, Men"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Ice Dancing, Mixed",
      "Pairs, Mixed",
      "Singles, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men",
      "Ice Hockey, Women"
    ],
    "Short Track Speed Skating": [
      "500 metres, Men",
      "5,000 metres Relay, Men",
      "500 metres, Women",
      "3,000 metres Relay, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "1,000 metres, Men",
      "1,500 metres, Men"
    ],
    "Skeleton": [
      "Skeleton, Men",
      "Skeleton, Women"
    ],
    "Speed Skating": [
      "Team Pursuit (8 laps), Men",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "500 metres, Women",
      "Team Pursuit (6 laps), Women",
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "1,000 metres, Men"
    ],
    "Cross Country Skiing": [
      "15 kilometres, Men",
      "4 × 10 kilometres Relay, Men",
      "10 kilometres, Women",
      "30 kilometres, Women",
      "4 × 5 kilometres Relay, Women",
      "50 kilometres, Men",
      "30 kilometres Skiathlon, Men",
      "Team Sprint, Men",
      "Team Sprint, Women",
      "Sprint, Men",
      "Sprint, Women",
      "15 kilometres Skiathlon, Women"
    ]
  },
  "2012": {
    "Taekwondo": [
      "Featherweight, Men",
      "Welterweight, Men",
      "Heavyweight, Men",
      "Flyweight, Women",
      "Featherweight, Women",
      "Flyweight, Men",
      "Heavyweight, Women",
      "Welterweight, Women"
    ],
    "Athletics": [
      "1,500 metres, Men",
      "50 kilometres Race Walk, Men",
      "Long Jump, Men",
      "100 metres Hurdles, Women",
      "1,500 metres, Women",
      "800 metres, Men",
      "High Jump, Men",
      "20 kilometres Race Walk, Men",
      "20 kilometres Race Walk, Women",
      "Shot Put, Women",
      "Discus Throw, Women",
      "Hammer Throw, Women",
      "Triple Jump, Women",
      "Decathlon, Men",
      "Pole Vault, Women",
      "Javelin Throw, Men",
      "400 metres Hurdles, Women",
      "Javelin Throw, Women",
      "400 metres, Men",
      "400 metres Hurdles, Men",
      "Discus Throw, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "5,000 metres, Women",
      "10,000 metres, Women",
      "Marathon, Women",
      "3,000 metres Steeplechase, Women",
      "3,000 metres Steeplechase, Men",
      "4 × 100 metres Relay, Men",
      "Pole Vault, Men",
      "Shot Put, Men",
      "Heptathlon, Women",
      "400 metres, Women",
      "Hammer Throw, Men",
      "Triple Jump, Men",
      "100 metres, Men",
      "200 metres, Men",
      "110 metres Hurdles, Men",
      "100 metres, Women",
      "200 metres, Women",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "Marathon, Men",
      "800 metres, Women",
      "High Jump, Women",
      "Long Jump, Women",
      "4 × 400 metres Relay, Men"
    ],
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Sailing": [
      "Two Person Dinghy, Men",
      "One Person Dinghy, Men",
      "Skiff, Men",
      "Three Person Keelboat, Women",
      "One Person Dinghy, Women",
      "Two Person Keelboat, Men",
      "One Person Heavyweight Dinghy, Men",
      "Windsurfer, Women",
      "Windsurfer, Men",
      "Two Person Dinghy, Women"
    ],
    "Tennis": [
      "Singles, Men",
      "Singles, Women",
      "Doubles, Mixed",
      "Doubles, Women",
      "Doubles, Men"
    ],
    "Wrestling": [
      "Middleweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Featherweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Flyweight, Freestyle, Women",
      "Lightweight, Freestyle, Women",
      "Heavyweight, Freestyle, Women",
      "Middleweight, Freestyle, Women",
      "Super-Heavyweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Lightweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Women",
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men",
      "Canadian Doubles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Fours, 1,000 metres, Men",
      "Kayak Doubles, 200 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Fours, 500 metres, Women",
      "Kayak Singles, 200 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Canadian Singles, 1,000 metres, Men",
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Singles, 200 metres, Women",
      "Kayak Singles, 500 metres, Women",
      "Canadian Singles, 200 metres, Men"
    ],
    "Cycling BMX Racing": [
      "BMX, Men",
      "BMX, Women"
    ],
    "Cycling Track": [
      "Sprint, Men",
      "Team Pursuit, 4,000 metres, Men",
      "Sprint, Women",
      "Team Sprint, Women",
      "Omnium, Women",
      "Team Pursuit, Women",
      "Keirin, Women",
      "Omnium, Men",
      "Team Sprint, Men",
      "Keirin, Men"
    ],
    "Diving": [
      "Platform, Women",
      "Synchronized Springboard, Women",
      "Synchronized Platform, Women",
      "Springboard, Men",
      "Platform, Men",
      "Synchronized Springboard, Men",
      "Synchronized Platform, Men",
      "Springboard, Women"
    ],
    "Rowing": [
      "Quadruple Sculls, Men",
      "Coxless Fours, Men",
      "Single Sculls, Women",
      "Double Sculls, Women",
      "Coxless Pairs, Women",
      "Eights, Men",
      "Eights, Women",
      "Lightweight Double Sculls, Women",
      "Single Sculls, Men",
      "Lightweight Double Sculls, Men",
      "Lightweight Coxless Fours, Men",
      "Coxless Pairs, Men",
      "Quadruple Sculls, Women",
      "Double Sculls, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "100 metres Breaststroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Individual Medley, Women",
      "4 × 100 metres Medley Relay, Women",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "50 metres Freestyle, Men",
      "400 metres Individual Medley, Men",
      "1,500 metres Freestyle, Men",
      "200 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Butterfly, Women",
      "400 metres Individual Medley, Women",
      "4 × 100 metres Freestyle Relay, Men",
      "400 metres Freestyle, Women",
      "200 metres Breaststroke, Men",
      "800 metres Freestyle, Women",
      "200 metres Individual Medley, Men",
      "100 metres Backstroke, Men",
      "200 metres Backstroke, Men",
      "200 metres Butterfly, Men",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "100 metres Butterfly, Men",
      "200 metres Backstroke, Women"
    ],
    "Triathlon": [
      "Olympic Distance, Women",
      "Olympic Distance, Men"
    ],
    "Water Polo": [
      "Water Polo, Women",
      "Water Polo, Men"
    ],
    "Boxing": [
      "Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Lightweight, Women",
      "Light-Flyweight, Men",
      "Flyweight, Women",
      "Middleweight, Women",
      "Flyweight, Men",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Light-Welterweight, Men",
      "Welterweight, Men"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women",
      "Group, Women"
    ],
    "Shooting": [
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Free Pistol, 50 metres, Men",
      "Air Pistol, 10 metres, Women",
      "Sporting Pistol, 25 metres, Women",
      "Air Rifle, 10 metres, Women",
      "Skeet, Women",
      "Trap, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Skeet, Men",
      "Trap, Women",
      "Double Trap, Men",
      "Air Rifle, 10 metres, Men",
      "Air Pistol, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men"
    ],
    "Judo": [
      "Extra-Lightweight, Women",
      "Extra-Lightweight, Men",
      "Heavyweight, Men",
      "Half-Heavyweight, Women",
      "Half-Middleweight, Men",
      "Half-Middleweight, Women",
      "Heavyweight, Women",
      "Middleweight, Women",
      "Middleweight, Men",
      "Half-Lightweight, Women",
      "Lightweight, Men",
      "Lightweight, Women",
      "Half-Lightweight, Men",
      "Half-Heavyweight, Men"
    ],
    "Artistic Gymnastics": [
      "Rings, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Horizontal Bar, Men",
      "Uneven Bars, Women",
      "Balance Beam, Women",
      "Individual All-Around, Men",
      "Pommelled Horse, Men",
      "Team All-Around, Women",
      "Floor Exercise, Women",
      "Horse Vault, Women",
      "Horse Vault, Men",
      "Individual All-Around, Women"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Men",
      "Beach Volleyball, Women"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Modern Pentathlon": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Weightlifting": [
      "Middleweight, Women",
      "Heavyweight, Women",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Flyweight, Women",
      "Lightweight, Women",
      "Super-Heavyweight, Women",
      "Featherweight, Women",
      "Featherweight, Men",
      "Light-Heavyweight, Women",
      "Light-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight, Men",
      "Super-Heavyweight, Men"
    ],
    "Marathon Swimming": [
      "10 kilometres Open Water, Men",
      "10 kilometres Open Water, Women"
    ],
    "Trampolining": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Team, Women",
      "Team, Men",
      "Individual, Women"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Team, Women"
    ],
    "Badminton": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Épée, Individual, Women",
      "Épée, Team, Women",
      "Foil, Team, Men",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Foil, Individual, Women",
      "Foil, Team, Women",
      "Épée, Individual, Men",
      "Sabre, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Team, Men",
      "Singles, Women",
      "Team, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Individual Time Trial, Men",
      "Individual Time Trial, Women",
      "Road Race, Individual, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Men",
      "Cross-Country, Women"
    ],
    "Equestrian Dressage": [
      "Team, Open",
      "Individual, Open"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ]
  },
  "2014": {
    "Freestyle Skiing": [
      "Aerials, Men",
      "Aerials, Women",
      "Moguls, Men",
      "Halfpipe, Men",
      "Moguls, Women",
      "Ski Cross, Women",
      "Slopestyle, Women",
      "Ski Cross, Men",
      "Halfpipe, Women",
      "Slopestyle, Men"
    ],
    "Snowboarding": [
      "Halfpipe, Women",
      "Parallel Slalom, Men",
      "Parallel Slalom, Women",
      "Slopestyle, Men",
      "Cross, Women",
      "Slopestyle, Women",
      "Cross, Men",
      "Halfpipe, Men",
      "Parallel Giant Slalom, Women",
      "Parallel Giant Slalom, Men"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Slalom, Men",
      "Super G, Women",
      "Giant Slalom, Women",
      "Slalom, Women",
      "Combined, Women",
      "Super G, Men",
      "Combined, Men",
      "Giant Slalom, Men",
      "Downhill, Women"
    ],
    "Biathlon": [
      "10 kilometres Sprint, Men",
      "4 × 7.5 kilometres Relay, Men",
      "10 kilometres Pursuit, Women",
      "12.5 kilometres Mass Start, Women",
      "15 kilometres, Women",
      "12.5 kilometres Pursuit, Men",
      "15 kilometres Mass Start, Men",
      "4 × 6 kilometres Relay, Women",
      "2 × 6 kilometres and 2 × 7.5 kilometres Relay, Mixed",
      "20 kilometres, Men",
      "7.5 kilometres Sprint, Women"
    ],
    "Luge": [
      "Doubles, Open",
      "Singles, Men",
      "Singles, Women",
      "Team Relay, Mixed"
    ],
    "Nordic Combined": [
      "Team, Men",
      "Normal Hill / 10 km, Individual, Men",
      "Large Hill / 10 km, Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Team, Men",
      "Normal Hill, Individual, Women",
      "Large Hill, Individual, Men",
      "Normal Hill, Individual, Men"
    ],
    "Bobsleigh": [
      "Two, Women",
      "Four, Men",
      "Two, Men"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Ice Dancing, Mixed",
      "Team, Mixed",
      "Pairs, Mixed",
      "Singles, Women"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men",
      "Ice Hockey, Women"
    ],
    "Short Track Speed Skating": [
      "500 metres, Men",
      "1,500 metres, Men",
      "3,000 metres Relay, Women",
      "5,000 metres Relay, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "1,000 metres, Men"
    ],
    "Speed Skating": [
      "1,000 metres, Men",
      "1,500 metres, Men",
      "1,000 metres, Women",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "500 metres, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Team Pursuit (8 laps), Men",
      "500 metres, Women",
      "1,500 metres, Women",
      "Team Pursuit (6 laps), Women"
    ],
    "Cross Country Skiing": [
      "Team Sprint, Men",
      "4 × 5 kilometres Relay, Women",
      "Team Sprint, Women",
      "4 × 10 kilometres Relay, Men",
      "Sprint, Men",
      "30 kilometres Skiathlon, Men",
      "Sprint, Women",
      "10 kilometres, Women",
      "30 kilometres, Women",
      "15 kilometres Skiathlon, Women",
      "50 kilometres, Men",
      "15 kilometres, Men"
    ],
    "Skeleton": [
      "Skeleton, Women",
      "Skeleton, Men"
    ]
  },
  "2016": {
    "Athletics": [
      "800 metres, Men",
      "1,500 metres, Men",
      "20 kilometres Race Walk, Men",
      "50 kilometres Race Walk, Men",
      "Marathon, Women",
      "3,000 metres Steeplechase, Women",
      "Hammer Throw, Men",
      "Heptathlon, Women",
      "Pole Vault, Men",
      "High Jump, Women",
      "800 metres, Women",
      "100 metres, Men",
      "200 metres, Men",
      "4 × 100 metres Relay, Men",
      "High Jump, Men",
      "Decathlon, Men",
      "Triple Jump, Men",
      "20 kilometres Race Walk, Women",
      "Hammer Throw, Women",
      "Triple Jump, Women",
      "Discus Throw, Women",
      "Javelin Throw, Women",
      "400 metres Hurdles, Women",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "Marathon, Men",
      "1,500 metres, Women",
      "5,000 metres, Women",
      "10,000 metres, Women",
      "110 metres Hurdles, Men",
      "3,000 metres Steeplechase, Men",
      "Discus Throw, Men",
      "Javelin Throw, Men",
      "Long Jump, Men",
      "4 × 100 metres Relay, Women",
      "4 × 400 metres Relay, Women",
      "Pole Vault, Women",
      "400 metres, Men",
      "Shot Put, Women",
      "4 × 400 metres Relay, Men",
      "100 metres, Women",
      "200 metres, Women",
      "400 metres, Women",
      "400 metres Hurdles, Men",
      "Shot Put, Men",
      "Long Jump, Women",
      "100 metres Hurdles, Women"
    ],
    "Hockey": [
      "Hockey, Men",
      "Hockey, Women"
    ],
    "Judo": [
      "Extra-Lightweight, Women",
      "Lightweight, Men",
      "Half-Heavyweight, Men",
      "Heavyweight, Men",
      "Lightweight, Women",
      "Half-Heavyweight, Women",
      "Middleweight, Men",
      "Heavyweight, Women",
      "Middleweight, Women",
      "Half-Middleweight, Women",
      "Half-Lightweight, Men",
      "Half-Lightweight, Women",
      "Extra-Lightweight, Men",
      "Half-Middleweight, Men"
    ],
    "Sailing": [
      "Multihull, Mixed",
      "One Person Dinghy, Men",
      "Two Person Dinghy, Men",
      "Skiff, Men",
      "Skiff, Women",
      "Windsurfer, Women",
      "One Person Dinghy, Women",
      "Windsurfer, Men",
      "Two Person Dinghy, Women",
      "One Person Heavyweight Dinghy, Men"
    ],
    "Tennis": [
      "Singles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed",
      "Doubles, Men"
    ],
    "Weightlifting": [
      "Heavyweight, Men",
      "Super-Heavyweight, Men",
      "Middle-Heavyweight, Men",
      "Heavyweight, Women",
      "Bantamweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Middleweight, Women",
      "Light-Heavyweight, Women",
      "Super-Heavyweight, Women",
      "Featherweight, Women",
      "Lightweight, Women",
      "Featherweight, Men",
      "Flyweight, Women"
    ],
    "Wrestling": [
      "Welterweight, Greco-Roman, Men",
      "Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Welterweight, Freestyle, Men",
      "Middleweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Heavyweight, Freestyle, Men",
      "Flyweight, Freestyle, Women",
      "Featherweight, Freestyle, Women",
      "Light-Heavyweight, Greco-Roman, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Middleweight, Freestyle, Women",
      "Heavyweight, Freestyle, Women",
      "Featherweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Lightweight, Freestyle, Women",
      "Light-Heavyweight, Freestyle, Women"
    ],
    "Archery": [
      "Team, Men",
      "Team, Women",
      "Individual, Men",
      "Individual, Women"
    ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Women",
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men",
      "Canadian Doubles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Canadian Singles, 200 metres, Men",
      "Kayak Singles, 200 metres, Women",
      "Kayak Fours, 500 metres, Women",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Fours, 1,000 metres, Men",
      "Kayak Singles, 500 metres, Women",
      "Kayak Singles, 200 metres, Men",
      "Kayak Doubles, 500 metres, Women",
      "Kayak Doubles, 200 metres, Men"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Keirin, Women",
      "Omnium, Women",
      "Team Pursuit, Women",
      "Team Sprint, Women",
      "Omnium, Men",
      "Team Sprint, Men",
      "Sprint, Women",
      "Sprint, Men",
      "Keirin, Men"
    ],
    "Diving": [
      "Synchronized Springboard, Women",
      "Platform, Women",
      "Synchronized Platform, Women",
      "Springboard, Men",
      "Platform, Men",
      "Synchronized Springboard, Men",
      "Synchronized Platform, Men",
      "Springboard, Women"
    ],
    "Equestrian Eventing": [
      "Team, Open",
      "Individual, Open"
    ],
    "Modern Pentathlon": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Rowing": [
      "Quadruple Sculls, Men",
      "Coxless Fours, Men",
      "Single Sculls, Women",
      "Lightweight Double Sculls, Women",
      "Single Sculls, Men",
      "Double Sculls, Men",
      "Lightweight Coxless Fours, Men",
      "Coxless Pairs, Women",
      "Lightweight Double Sculls, Men",
      "Eights, Men",
      "Quadruple Sculls, Women",
      "Double Sculls, Women",
      "Eights, Women",
      "Coxless Pairs, Men"
    ],
    "Rugby Sevens": [
      "Rugby Sevens, Women",
      "Rugby Sevens, Men"
    ],
    "Shooting": [
      "Trap, Women",
      "Air Pistol, 10 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Air Pistol, 10 metres, Women",
      "Air Rifle, 10 metres, Women",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Trap, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Sporting Pistol, 25 metres, Women",
      "Double Trap, Men",
      "Air Rifle, 10 metres, Men",
      "Skeet, Men",
      "Skeet, Women",
      "Free Pistol, 50 metres, Men"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "200 metres Backstroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "200 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Women",
      "200 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "100 metres Butterfly, Women",
      "200 metres Freestyle, Men",
      "100 metres Backstroke, Men",
      "200 metres Individual Medley, Men",
      "200 metres Breaststroke, Women",
      "50 metres Freestyle, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "100 metres Breaststroke, Men",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "200 metres Individual Medley, Women",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "400 metres Individual Medley, Women",
      "1,500 metres Freestyle, Men",
      "400 metres Individual Medley, Men",
      "200 metres Breaststroke, Men",
      "100 metres Breaststroke, Women"
    ],
    "Boxing": [
      "Light-Welterweight, Men",
      "Middleweight, Men",
      "Lightweight, Men",
      "Flyweight, Men",
      "Flyweight, Women",
      "Lightweight, Women",
      "Middleweight, Women",
      "Light-Flyweight, Men",
      "Super-Heavyweight, Men",
      "Bantamweight, Men",
      "Light-Heavyweight, Men",
      "Heavyweight, Men",
      "Welterweight, Men"
    ],
    "Taekwondo": [
      "Welterweight, Men",
      "Heavyweight, Men",
      "Flyweight, Women",
      "Flyweight, Men",
      "Heavyweight, Women",
      "Welterweight, Women",
      "Featherweight, Women",
      "Featherweight, Men"
    ],
    "Trampolining": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Individual Time Trial, Men",
      "Road Race, Individual, Women",
      "Individual Time Trial, Women"
    ],
    "Artistic Gymnastics": [
      "Floor Exercise, Men",
      "Rings, Men",
      "Team All-Around, Men",
      "Team All-Around, Women",
      "Horizontal Bar, Men",
      "Uneven Bars, Women",
      "Individual All-Around, Men",
      "Pommelled Horse, Men",
      "Floor Exercise, Women",
      "Horse Vault, Men",
      "Balance Beam, Women",
      "Parallel Bars, Men",
      "Individual All-Around, Women",
      "Horse Vault, Women"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Men",
      "Beach Volleyball, Women"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Marathon Swimming": [
      "10 kilometres Open Water, Women",
      "10 kilometres Open Water, Men"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Rhythmic Gymnastics": [
      "Group, Women",
      "Individual, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Women",
      "Cross-Country, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Team, Women"
    ],
    "Badminton": [
      "Singles, Men",
      "Doubles, Men",
      "Doubles, Mixed",
      "Doubles, Women",
      "Singles, Women"
    ],
    "Fencing": [
      "Épée, Individual, Women",
      "Épée, Team, Women",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Épée, Team, Men",
      "Sabre, Individual, Men",
      "Foil, Individual, Men",
      "Foil, Individual, Women",
      "Sabre, Individual, Women",
      "Sabre, Team, Women"
    ],
    "Golf": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Team, Men",
      "Singles, Women",
      "Team, Women"
    ],
    "Cycling BMX Racing": [
      "BMX, Men",
      "BMX, Women"
    ],
    "Water Polo": [
      "Water Polo, Men",
      "Water Polo, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Triathlon": [
      "Olympic Distance, Men",
      "Olympic Distance, Women"
    ],
    "Basketball": [
      "Basketball, Men",
      "Basketball, Women"
    ]
  },
  "2018": {
    "Freestyle Skiing": [
      "Moguls, Men",
      "Aerials, Women",
      "Ski Cross, Men",
      "Slopestyle, Men",
      "Moguls, Women",
      "Ski Cross, Women",
      "Halfpipe, Women",
      "Aerials, Men",
      "Slopestyle, Women",
      "Halfpipe, Men"
    ],
    "Snowboarding": [
      "Halfpipe, Men",
      "Cross, Men",
      "Big Air, Women",
      "Slopestyle, Men",
      "Big Air, Men",
      "Slopestyle, Women",
      "Halfpipe, Women",
      "Parallel Giant Slalom, Women",
      "Cross, Women",
      "Parallel Giant Slalom, Men"
    ],
    "Alpine Skiing": [
      "Super G, Men",
      "Giant Slalom, Men",
      "Slalom, Men",
      "Combined, Men",
      "Super G, Women",
      "Slalom, Women",
      "Team, Mixed",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Downhill, Men",
      "Combined, Women"
    ],
    "Biathlon": [
      "20 kilometres, Men",
      "12.5 kilometres Mass Start, Women",
      "4 × 6 kilometres Relay, Women",
      "10 kilometres Sprint, Men",
      "7.5 kilometres Sprint, Women",
      "12.5 kilometres Pursuit, Men",
      "15 kilometres Mass Start, Men",
      "10 kilometres Pursuit, Women",
      "2 × 6 kilometres and 2 × 7.5 kilometres Relay, Mixed",
      "4 × 7.5 kilometres Relay, Men",
      "15 kilometres, Women"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Team Relay, Mixed",
      "Singles, Women"
    ],
    "Nordic Combined": [
      "Normal Hill / 10 km, Individual, Men",
      "Team, Men",
      "Large Hill / 10 km, Individual, Men"
    ],
    "Speed Skating": [
      "Mass Start, Men",
      "5,000 metres, Men",
      "10,000 metres, Men",
      "500 metres, Men",
      "500 metres, Women",
      "5,000 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "Mass Start, Women",
      "Team Pursuit (6 laps), Women",
      "1,000 metres, Men",
      "1,500 metres, Men",
      "Team Pursuit (8 laps), Men",
      "3,000 metres, Women"
    ],
    "Bobsleigh": [
      "Two, Men",
      "Two, Women",
      "Four, Open"
    ],
    "Curling": [
      "Mixed Doubles, Mixed",
      "Curling, Women",
      "Curling, Men"
    ],
    "Figure Skating": [
      "Singles, Women",
      "Pairs, Mixed",
      "Ice Dancing, Mixed",
      "Team, Mixed",
      "Singles, Men"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men",
      "Ice Hockey, Women"
    ],
    "Short Track Speed Skating": [
      "1,000 metres, Men",
      "5,000 metres Relay, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "500 metres, Men",
      "3,000 metres Relay, Women",
      "1,500 metres, Men"
    ],
    "Cross Country Skiing": [
      "50 kilometres, Men",
      "10 kilometres, Women",
      "30 kilometres, Women",
      "15 kilometres Skiathlon, Women",
      "4 × 10 kilometres Relay, Men",
      "Team Sprint, Men",
      "Sprint, Men",
      "15 kilometres, Men",
      "30 kilometres Skiathlon, Men",
      "Sprint, Women",
      "4 × 5 kilometres Relay, Women",
      "Team Sprint, Women"
    ],
    "Skeleton": [
      "Skeleton, Women",
      "Skeleton, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Normal Hill, Individual, Women"
    ]
  },
  "2020": {
    "Hockey": [
      "Hockey, Women",
      "Hockey, Men"
    ],
    "Rugby Sevens": [
      "Rugby Sevens, Men",
      "Rugby Sevens, Women"
    ],
    "Volleyball": [
      "Volleyball, Men",
      "Volleyball, Women"
    ],
    "Artistic Gymnastics": [
      "Horse Vault, Men",
      "Uneven Bars, Women",
      "Individual All-Around, Women",
      "Horse Vault, Women",
      "Individual All-Around, Men",
      "Team All-Around, Men",
      "Floor Exercise, Men",
      "Parallel Bars, Men",
      "Rings, Men",
      "Balance Beam, Women",
      "Pommelled Horse, Men",
      "Horizontal Bar, Men",
      "Team All-Around, Women",
      "Floor Exercise, Women"
    ],
    "Boxing": [
      "Lightweight, Men",
      "Light-Heavyweight, Men",
      "Middleweight, Men",
      "Heavyweight, Men",
      "Lightweight, Women",
      "Flyweight, Women",
      "Welterweight, Women",
      "Middleweight, Women",
      "Featherweight, Men",
      "Welterweight, Men",
      "Flyweight, Men",
      "Super-Heavyweight, Men",
      "Featherweight, Women"
    ],
    "Weightlifting": [
      "Heavyweight, Men",
      "Middleweight, Women",
      "Featherweight, Men",
      "Lightweight, Men",
      "Middleweight, Men",
      "Light-Heavyweight, Men",
      "Flyweight, Women",
      "Featherweight, Women",
      "Heavyweight, Women",
      "Super-Heavyweight, Women",
      "Lightweight, Women",
      "Light-Heavyweight, Women",
      "Middle-Heavyweight, Men",
      "Super-Heavyweight, Men"
    ],
    "Wrestling": [
      "Heavyweight, Greco-Roman, Men",
      "Middleweight, Greco-Roman, Men",
      "Welterweight, Freestyle, Men",
      "Flyweight, Freestyle, Women",
      "Middleweight, Freestyle, Men",
      "Featherweight, Freestyle, Women",
      "Lightweight, Freestyle, Women",
      "Middleweight, Freestyle, Women",
      "Featherweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Women",
      "Super-Heavyweight, Greco-Roman, Men",
      "Heavyweight, Freestyle, Men",
      "Super-Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Greco-Roman, Men",
      "Featherweight, Freestyle, Men",
      "Welterweight, Greco-Roman, Men",
      "Light-Heavyweight, Freestyle, Men",
      "Light-Heavyweight, Freestyle, Women"
    ],
    "Athletics": [
      "Decathlon, Men",
      "High Jump, Women",
      "Javelin Throw, Women",
      "Discus Throw, Men",
      "10,000 metres, Women",
      "High Jump, Men",
      "Marathon, Men",
      "Heptathlon, Women",
      "4 × 400 metres Relay, Men",
      "400 metres Hurdles, Men",
      "Pole Vault, Men",
      "Triple Jump, Men",
      "100 metres, Men",
      "200 metres, Men",
      "5,000 metres, Men",
      "4 × 100 metres Relay, Men",
      "50 kilometres Race Walk, Men",
      "20 kilometres Race Walk, Women",
      "Shot Put, Women",
      "Hammer Throw, Women",
      "400 metres, Men",
      "Long Jump, Men",
      "Discus Throw, Women",
      "Javelin Throw, Men",
      "400 metres, Women",
      "4 × 400 metres Relay, Mixed",
      "10,000 metres, Men",
      "3,000 metres Steeplechase, Men",
      "5,000 metres, Women",
      "Long Jump, Women",
      "1,500 metres, Men",
      "800 metres, Women",
      "1,500 metres, Women",
      "4 × 100 metres Relay, Women",
      "Pole Vault, Women",
      "20 kilometres Race Walk, Men",
      "110 metres Hurdles, Men",
      "100 metres, Women",
      "200 metres, Women",
      "100 metres Hurdles, Women",
      "4 × 400 metres Relay, Women",
      "800 metres, Men",
      "Marathon, Women",
      "3,000 metres Steeplechase, Women",
      "400 metres Hurdles, Women",
      "Shot Put, Men",
      "Hammer Throw, Men",
      "Triple Jump, Women"
    ],
    "Basketball": [
      "Basketball, Men",
      "Basketball, Women"
    ],
    "Beach Volleyball": [
      "Beach Volleyball, Women",
      "Beach Volleyball, Men"
    ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Women",
      "Canadian Singles, Slalom, Women",
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, 1,000 metres, Men",
      "Kayak Fours, 500 metres, Women",
      "Canadian Singles, 1,000 metres, Men",
      "Canadian Singles, 200 metres, Women",
      "Canadian Doubles, 500 metres, Women",
      "Canadian Doubles, 1,000 metres, Men",
      "Kayak Singles, 200 metres, Women",
      "Kayak Singles, 500 metres, Women",
      "Kayak Fours, 500 metres, Men",
      "Kayak Singles, 200 metres, Men",
      "Kayak Singles, 1,000 metres, Men",
      "Kayak Doubles, 500 metres, Women"
    ],
    "Cycling BMX Freestyle": [
      "Park, Men",
      "Park, Women"
    ],
    "Cycling Road": [
      "Individual Time Trial, Men",
      "Road Race, Individual, Women",
      "Road Race, Individual, Men",
      "Individual Time Trial, Women"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Sprint, Women",
      "Keirin, Women",
      "Team Sprint, Women",
      "Madison, Men",
      "Madison, Women",
      "Team Sprint, Men",
      "Team Pursuit, Women",
      "Sprint, Men",
      "Keirin, Men",
      "Omnium, Men",
      "Omnium, Women"
    ],
    "Diving": [
      "Platform, Women",
      "Synchronized Springboard, Women",
      "Springboard, Men",
      "Platform, Men",
      "Synchronized Springboard, Men",
      "Synchronized Platform, Men",
      "Springboard, Women",
      "Synchronized Platform, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Marathon Swimming": [
      "10 kilometres Open Water, Women",
      "10 kilometres Open Water, Men"
    ],
    "Rowing": [
      "Quadruple Sculls, Men",
      "Coxless Fours, Men",
      "Quadruple Sculls, Women",
      "Coxless Fours, Women",
      "Single Sculls, Women",
      "Coxless Pairs, Women",
      "Eights, Women",
      "Double Sculls, Men",
      "Single Sculls, Men",
      "Coxless Pairs, Men",
      "Lightweight Double Sculls, Women",
      "Eights, Men",
      "Lightweight Double Sculls, Men",
      "Double Sculls, Women"
    ],
    "Sailing": [
      "One Person Dinghy, Men",
      "Two Person Dinghy, Men",
      "Skiff, Women",
      "Windsurfer, Men",
      "Windsurfer, Women",
      "One Person Dinghy, Women",
      "Two Person Dinghy, Women",
      "Skiff, Men",
      "One Person Heavyweight Dinghy, Men",
      "Multihull, Mixed"
    ],
    "Skateboarding": [
      "Park, Men",
      "Street, Men",
      "Street, Women",
      "Park, Women"
    ],
    "Surfing": [
      "Shortboard, Men",
      "Shortboard, Women"
    ],
    "Swimming": [
      "100 metres Freestyle, Men",
      "400 metres Freestyle, Men",
      "4 × 100 metres Freestyle Relay, Men",
      "4 × 200 metres Freestyle Relay, Men",
      "200 metres Breaststroke, Men",
      "400 metres Individual Medley, Men",
      "50 metres Freestyle, Women",
      "100 metres Freestyle, Women",
      "200 metres Freestyle, Women",
      "400 metres Freestyle, Women",
      "800 metres Freestyle, Women",
      "4 × 100 metres Freestyle Relay, Women",
      "4 × 200 metres Freestyle Relay, Women",
      "100 metres Backstroke, Women",
      "200 metres Backstroke, Women",
      "100 metres Butterfly, Women",
      "4 × 100 metres Medley Relay, Women",
      "4 × 100 metres Medley Relay, Mixed",
      "50 metres Freestyle, Men",
      "200 metres Freestyle, Men",
      "200 metres Individual Medley, Men",
      "200 metres Butterfly, Women",
      "200 metres Backstroke, Men",
      "100 metres Breaststroke, Men",
      "4 × 100 metres Medley Relay, Men",
      "100 metres Butterfly, Men",
      "200 metres Butterfly, Men",
      "800 metres Freestyle, Men",
      "200 metres Individual Medley, Women",
      "400 metres Individual Medley, Women",
      "100 metres Backstroke, Men",
      "100 metres Breaststroke, Women",
      "200 metres Breaststroke, Women",
      "1,500 metres Freestyle, Men",
      "1,500 metres Freestyle, Women"
    ],
    "Tennis": [
      "Doubles, Mixed",
      "Doubles, Women",
      "Doubles, Men",
      "Singles, Women",
      "Singles, Men"
    ],
    "Judo": [
      "Half-Middleweight, Men",
      "Middleweight, Women",
      "Heavyweight, Women",
      "Half-Lightweight, Men",
      "Half-Heavyweight, Women",
      "Lightweight, Women",
      "Half-Middleweight, Women",
      "Extra-Lightweight, Men",
      "Heavyweight, Men",
      "Half-Lightweight, Women",
      "Team, Mixed",
      "Lightweight, Men",
      "Middleweight, Men",
      "Half-Heavyweight, Men",
      "Extra-Lightweight, Women"
    ],
    "Karate": [
      "Kumite, ≤55 kg, Women",
      "Kumite, ≤75 kg, Men",
      "Kumite, >61 kg, Women",
      "Kumite, ≤61 kg, Women",
      "Kumite, ≤67 kg, Men",
      "Kata, Women",
      "Kumite, >75 kg, Men",
      "Kata, Men"
    ],
    "Sport Climbing": [
      "Combined, Men",
      "Combined, Women"
    ],
    "Rhythmic Gymnastics": [
      "Individual, Women",
      "Group, Women"
    ],
    "Trampolining": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Equestrian Jumping": [
      "Team, Open",
      "Individual, Open"
    ],
    "Triathlon": [
      "Olympic Distance, Women",
      "Relay, Mixed",
      "Olympic Distance, Men"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Shooting": [
      "Air Pistol, 10 metres, Women",
      "Air Pistol, 10 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Air Rifle, 10 metres, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Men",
      "Sporting Pistol, 25 metres, Women",
      "Air Rifle, 10 metres, Women",
      "Skeet, Women",
      "Air Pistol, 10 metres, Team, Mixed",
      "Air Rifle, 10 metres, Team, Mixed",
      "Trap, Men",
      "Skeet, Men",
      "Small-Bore Rifle, Three Positions, 50 metres, Women",
      "Trap, Women",
      "Trap, Team, Mixed"
    ],
    "Softball": [
      "Softball, Women"
    ],
    "3x3 Basketball": [
      "3x3 Basketball, Women",
      "3x3 Basketball, Men"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Team, Women"
    ],
    "Badminton": [
      "Singles, Men",
      "Doubles, Men",
      "Singles, Women",
      "Doubles, Women",
      "Doubles, Mixed"
    ],
    "Fencing": [
      "Épée, Individual, Women",
      "Foil, Individual, Men",
      "Épée, Team, Women",
      "Foil, Team, Men",
      "Épée, Individual, Men",
      "Foil, Team, Women",
      "Sabre, Individual, Women",
      "Sabre, Team, Women",
      "Sabre, Individual, Men",
      "Sabre, Team, Men",
      "Épée, Team, Men",
      "Foil, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Team, Men",
      "Singles, Women",
      "Team, Women",
      "Doubles, Mixed"
    ],
    "Taekwondo": [
      "Featherweight, Men",
      "Featherweight, Women",
      "Welterweight, Women",
      "Welterweight, Men",
      "Heavyweight, Men",
      "Heavyweight, Women",
      "Flyweight, Women",
      "Flyweight, Men"
    ],
    "Archery": [
      "Team, Men",
      "Team, Women",
      "Individual, Men",
      "Individual, Women",
      "Team, Mixed"
    ],
    "Golf": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Cycling BMX Racing": [
      "BMX, Men",
      "BMX, Women"
    ],
    "Handball": [
      "Handball, Men",
      "Handball, Women"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Equestrian Dressage": [
      "Individual, Open",
      "Team, Open"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Men",
      "Cross-Country, Women"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Individual, Women"
    ],
    "Water Polo": [
      "Water Polo, Men",
      "Water Polo, Women"
    ]
  },
  "2022": {
    "Freestyle Skiing": [
      "Moguls, Women",
      "Aerials, Women",
      "Moguls, Men",
      "Ski Cross, Women",
      "Halfpipe, Women",
      "Team Aerials, Mixed",
      "Aerials, Men",
      "Slopestyle, Women",
      "Big Air, Women",
      "Halfpipe, Men",
      "Big Air, Men",
      "Ski Cross, Men",
      "Slopestyle, Men"
    ],
    "Skeleton": [
      "Skeleton, Women",
      "Skeleton, Men"
    ],
    "Snowboarding": [
      "Halfpipe, Men",
      "Slopestyle, Women",
      "Parallel Giant Slalom, Men",
      "Cross, Men",
      "Parallel Giant Slalom, Women",
      "Big Air, Women",
      "Slopestyle, Men",
      "Big Air, Men",
      "Cross, Women",
      "Team Cross, Mixed",
      "Halfpipe, Women"
    ],
    "Alpine Skiing": [
      "Downhill, Men",
      "Super G, Men",
      "Slalom, Men",
      "Combined, Men",
      "Super G, Women",
      "Slalom, Women",
      "Team, Mixed",
      "Giant Slalom, Men",
      "Downhill, Women",
      "Giant Slalom, Women",
      "Combined, Women"
    ],
    "Cross Country Skiing": [
      "15 kilometres Skiathlon, Women",
      "15 kilometres, Men",
      "30 kilometres Skiathlon, Men",
      "Team Sprint, Men",
      "10 kilometres, Women",
      "30 kilometres, Women",
      "4 × 10 kilometres Relay, Men",
      "Sprint, Men",
      "50 kilometres, Men",
      "4 × 5 kilometres Relay, Women",
      "Team Sprint, Women",
      "Sprint, Women"
    ],
    "Luge": [
      "Singles, Men",
      "Doubles, Open",
      "Team Relay, Mixed",
      "Singles, Women"
    ],
    "Nordic Combined": [
      "Normal Hill / 10 km, Individual, Men",
      "Large Hill / 10 km, Individual, Men",
      "Team, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Team, Men",
      "Normal Hill, Team, Mixed",
      "Large Hill, Individual, Men",
      "Normal Hill, Individual, Women"
    ],
    "Biathlon": [
      "20 kilometres, Men",
      "10 kilometres Sprint, Men",
      "12.5 kilometres Pursuit, Men",
      "4 × 7.5 kilometres Relay, Men",
      "12.5 kilometres Mass Start, Women",
      "15 kilometres, Women",
      "2 × 6 kilometres and 2 × 7.5 kilometres Relay, Mixed",
      "7.5 kilometres Sprint, Women",
      "15 kilometres Mass Start, Men",
      "10 kilometres Pursuit, Women",
      "4 × 6 kilometres Relay, Women"
    ],
    "Short Track Speed Skating": [
      "1,000 metres, Women",
      "500 metres, Men",
      "1,500 metres, Men",
      "5,000 metres Relay, Men",
      "500 metres, Women",
      "1,000 metres, Men",
      "3,000 metres Relay, Women",
      "2,000 metres Relay, Mixed",
      "1,500 metres, Women"
    ],
    "Speed Skating": [
      "Mass Start, Men",
      "1,000 metres, Men",
      "3,000 metres, Women",
      "5,000 metres, Women",
      "Mass Start, Women",
      "Team Pursuit (6 laps), Women",
      "500 metres, Men",
      "10,000 metres, Men",
      "500 metres, Women",
      "1,000 metres, Women",
      "1,500 metres, Women",
      "1,500 metres, Men",
      "5,000 metres, Men",
      "Team Pursuit (8 laps), Men"
    ],
    "Bobsleigh": [
      "Four, Open",
      "Monobob, Women",
      "Two, Women"
    ],
    "Curling": [
      "Curling, Men",
      "Curling, Women",
      "Mixed Doubles, Mixed"
    ],
    "Ice Hockey": [
      "Ice Hockey, Women",
      "Ice Hockey, Men"
    ],
    "Figure Skating": [
      "Pairs, Mixed",
      "Ice Dancing, Mixed",
      "Singles, Men",
      "Singles, Women",
      "Team, Mixed"
    ]
  },
  "year": {
    "sport": [
      "event"
    ]
  }
}