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
    const key = parseInt(Object.keys(color)[0], 10); // ensure key is an integer
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
      "black", // gray for pointsTotal = 0
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
  "Trampoline",
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

export const eventsByYear = {
  "1896": {
    "Athletics": [
      "Men's 800m",
      "Men's 1500m",
      "Men's Triple Jump",
      "Men's 100m",
      "Men's 400m",
      "Men's 110m Hurdles",
      "Men's Marathon",
      "Men's Pole Vault",
      "Men's Shot Put",
      "Men's Discus Throw",
      "Men's High Jump",
      "Men's Long Jump"
    ],
    "Tennis": [
      "Doubles, Men",
      "Singles, Men"
    ],
    "Cycling Track": [
      "333⅓ metres Time Trial, Men",
      "Men's 10,000m",
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
      "Military Rifle, Men's 200m"
    ],
    "Weightlifting": [
      "Unlimited, One Hand, Men",
      "Unlimited, Two Hands, Men"
    ],
    "Artistic Gymnastics": [
      "Men's Vault",
      "Men's Parallel Bars",
      "Parallel Bars, Teams, Men",
      "Men's Horizontal Bar",
      "Horizontal Bar, Teams, Men",
      "Men's Rings",
      "Men's Pommel Horse",
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
      "Men's 100m",
      "Men's 200m",
      "Men's Discus Throw",
      "Men's 400m",
      "Men's 1500m",
      "Men's Marathon",
      "Men's 400m Hurdles",
      "2,500 metres Steeplechase, Men",
      "Men's 5000m's Team",
      "Standing Men's Long Jump",
      "Men's 800m",
      "4,000 metres Steeplechase, Men",
      "Men's High Jump",
      "Men's Long Jump",
      "200 metres Hurdles, Men",
      "Men's Pole Vault",
      "Men's 110m Hurdles",
      "Standing Men's High Jump",
      "Men's Triple Jump",
      "Standing Men's Triple Jump",
      "Men's Shot Put",
      "Men's Hammer Throw"
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
      "Free Pistol, 50 metres, Men's Team",
      "Free Rifle, Three Positions, 300 metres, Men's Team"
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
      "Men's All-Around (Individual)"
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
      "Men's High Jump",
      "2,590 metres Steeplechase, Men",
      "All-Around Championship, Men",
      "Men's Discus Throw",
      "60 metres, Men",
      "Men's 100m",
      "Men's 200m",
      "Men's 400m",
      "Men's 800m",
      "Men's 1500m",
      "Men's Marathon",
      "Men's 110m Hurdles",
      "200 metres Hurdles, Men",
      "Men's 400m Hurdles",
      "4 miles, Men's Team",
      "Standing Men's High Jump",
      "Men's Pole Vault",
      "Men's Long Jump",
      "Standing Men's Long Jump",
      "Men's Triple Jump",
      "Standing Men's Triple Jump",
      "Men's Shot Put",
      "Men's Hammer Throw"
    ],
    "Football": [
      "Football, Men"
    ],
    "Golf": [
      "Individual, Men",
      "Men's Team"
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Single Sticks, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Individual)",
      "Individual All-Around, Apparatus Work, Men",
      "Individual All-Around, Field Sports, Men",
      "Individual All-Around, 4 Events, Men",
      "Men's All-Around (Team)",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings",
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
      "Men's 100m",
      "Men's 200m",
      "Men's Pole Vault",
      "Men's Long Jump",
      "Men's Triple Jump",
      "Men's Hammer Throw",
      "Discus Throw, Greek Style, Men",
      "3 miles, Men's Team",
      "Men's High Jump",
      "Men's 800m",
      "1,600 metres Medley Relay, Men",
      "Men's 400m",
      "Men's 1500m",
      "5 miles, Men",
      "Men's 400m Hurdles",
      "3,200 metres Steeplechase, Men",
      "10 miles Race Walk, Men",
      "Men's Shot Put",
      "Standing Men's High Jump",
      "Standing Men's Long Jump",
      "Javelin Throw, Freestyle, Men",
      "Men's Javelin Throw",
      "Men's Marathon",
      "Men's 110m Hurdles",
      "Men's Discus Throw"
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
      "Men's 5000m",
      "100 kilometres, Men"
    ],
    "Fencing": [
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
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
      "Free Pistol, 50 yards, Men's Team",
      "Military Rifle, 200/500/600/800/900/1,000 yards, Men's Team",
      "Trap, Men",
      "Trap, Men's Team",
      "Free Rifle, Three Positions, 300 metres, Men's Team",
      "Small-Bore Rifle, 50 and 100 yards, Men's Team",
      "Free Rifle, 1,000 yards, Men",
      "Small-Bore Rifle, Prone, 50 and 100 yards, Men",
      "Small-Bore Rifle, Disappearing Target, 25 yards, Men",
      "Small-Bore Rifle, Moving Target, 25 yards, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Single Shot, Men's Team",
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
      "Men's All-Around (Team)",
      "Men's All-Around (Individual)"
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
      "Sabre, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Men's Team"
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
      "Men's 10km Race Walk",
      "Men's Pole Vault",
      "Men's Long Jump",
      "Men's Hammer Throw",
      "Pentathlon, Men",
      "Men's 5000m",
      "Men's 10,000m",
      "Cross-Country, Individual, Men",
      "Cross-Country, Men's Team",
      "Shot Put, Both Hands, Men",
      "Men's Discus Throw",
      "Discus Throw, Both Hands, Men",
      "Men's Javelin Throw",
      "Javelin Throw, Both Hands, Men",
      "Men's 4 x 400m Relay",
      "Men's 400m",
      "Men's High Jump",
      "Men's 200m",
      "Men's 1500m",
      "Men's 4 x 100m Relay",
      "Men's 3000m's Team",
      "Standing Men's High Jump",
      "Standing Men's Long Jump",
      "Men's Marathon",
      "Men's Triple Jump",
      "Men's Decathlon",
      "Men's 100m",
      "Men's 800m",
      "Men's 110m Hurdles",
      "Men's Shot Put"
    ],
    "Artistic Gymnastics": [
      "Team All-Around, Free System, Men",
      "Team All-Around, Swedish System, Men",
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)"
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
      "Free Rifle, Three Positions, 300 metres, Men's Team",
      "Running Target, Single Shot, Men",
      "Running Target, Single Shot, Men's Team",
      "Military Rifle, Any Position, 600 metres, Men",
      "Trap, Men",
      "Trap, Men's Team",
      "Free Pistol, 50 metres, Men",
      "Free Pistol, 50 metres, Men's Team",
      "Dueling Pistol, 30 metres, Men's Team",
      "Military Rifle, 200, 400, 500 and 600 metres, Men's Team",
      "Small-Bore Rifle, Any Position, 50 metres, Men",
      "Small-Bore Rifle, Prone, 50 metres, Men's Team",
      "Small-Bore Rifle, Disappearing Target, 25 metres, Men's Team",
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
      "Men's Team"
    ],
    "Diving": [
      "Springboard, Men",
      "Platform, Men",
      "Plain High, Women",
      "Plain High, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Men's Team"
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
      "Men's 110m Hurdles",
      "Men's Pole Vault",
      "Men's Marathon",
      "Men's 5000m",
      "Men's 10,000m",
      "Cross-Country, Individual, Men",
      "Cross-Country, Men's Team",
      "Men's Triple Jump",
      "Men's Shot Put",
      "Men's Discus Throw",
      "Men's Javelin Throw",
      "Pentathlon, Men",
      "Men's 4 x 100m Relay",
      "Men's 4 x 400m Relay",
      "Men's 100m",
      "Men's 200m",
      "Men's 400m",
      "Men's 800m",
      "Men's 1500m",
      "Men's 3000m Steeplechase",
      "Men's 3000m's Team",
      "Men's 10km Race Walk",
      "Men's Decathlon",
      "Men's High Jump",
      "Men's Long Jump",
      "56-pound Weight Throw, Men",
      "Men's Hammer Throw",
      "Men's 400m Hurdles"
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
      "Target Archery, 28 metres, Men's Team",
      "Target Archery, 33 metres, Men's Team",
      "Target Archery, 50 metres, Men's Team",
      "Pole Archery, Small Birds, Individual, Men",
      "Pole Archery, Large Birds, Individual, Men",
      "Pole Archery, Small Birds, Men's Team",
      "Pole Archery, Large Birds, Men's Team"
    ],
    "Art Competitions": [
      "Literature, Open",
      "Music, Open",
      "Painting, Open",
      "Sculpturing, Open",
      "Architecture, Open"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Team)",
      "Team All-Around, Swedish System, Men",
      "Team All-Around, Free System, Men",
      "Men's All-Around (Individual)"
    ],
    "Cycling Road": [
      "Road Race, Men's Team",
      "Road Race, Individual, Men"
    ],
    "Cycling Track": [
      "50 kilometres, Men",
      "Sprint, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Team Pursuit, 4,000 metres, Men"
    ],
    "Equestrian Eventing": [
      "Men's Team",
      "Individual, Men"
    ],
    "Equestrian Jumping": [
      "Men's Team",
      "Individual, Men"
    ],
    "Equestrian Vaulting": [
      "Individual, Men",
      "Men's Team"
    ],
    "Fencing": [
      "Épée, Men's Team",
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Sabre, Men's Team",
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
      "Trap, Men's Team",
      "Free Pistol, 50 metres, Men",
      "Free Pistol, 50 metres, Men's Team",
      "Military Pistol, 30 metres, Men",
      "Free Rifle, Three Positions, 300 metres, Men",
      "Military Rifle, Standing, 300 metres, Men",
      "Military Rifle, Standing, 300 metres, Men's Team",
      "Military Rifle, Prone, 300 metres, Men's Team",
      "Running Target, Single Shot, Men's Team",
      "Running Target, Double Shot, Men's Team",
      "Military Rifle, Prone, 300 metres, Men",
      "Military Pistol, Men's Team",
      "Free Rifle, Three Positions, 300 metres, Men's Team",
      "Military Rifle, Prone, 300 and 600 metres, Men's Team",
      "Smal-Bore Rifle, Standing, 50 metres, Men's Team",
      "Running Target, Single Shot, Men",
      "Running Target, Double Shot, Men",
      "Military Rifle, Prone, 600 metres, Men's Team",
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
      "Men's Triple Jump",
      "Men's Decathlon",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's Marathon",
      "Men's 400m Hurdles",
      "Men's 3000m Steeplechase",
      "Men's 3000m's Team",
      "Cross-Country, Individual, Men",
      "Cross-Country, Men's Team",
      "Men's Discus Throw",
      "Men's Javelin Throw",
      "Pentathlon, Men",
      "Men's High Jump",
      "Men's 100m",
      "Men's 200m",
      "Men's 400m",
      "Men's 800m",
      "Men's 4 x 100m Relay",
      "Men's 4 x 400m Relay",
      "Men's 10km Race Walk",
      "Men's Hammer Throw",
      "Men's Long Jump",
      "Men's 110m Hurdles",
      "Men's Pole Vault",
      "Men's Shot Put"
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
      "Road Race, Men's Team"
    ],
    "Cycling Track": [
      "Team Pursuit, 4,000 metres, Men",
      "Tandem Sprint, 2,000 metres, Men",
      "Sprint, Men",
      "50 kilometres, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Men's Team"
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
      "Trap, Men's Team",
      "Free Rifle, Prone, 600 metres, Men",
      "Rapid-Fire Pistol, 25 metres, Men",
      "Trap, Men",
      "Free Rifle, 400, 600 and Men's 800m's Team",
      "Small-Bore Rifle, Prone, 50 metres, Men",
      "Running Target, Single Shot, Men",
      "Running Target, Double Shot, Men",
      "Running Target, Double Shot, Men's Team",
      "Running Target, Single Shot, Men's Team"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Individual)",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Rings",
      "Rope Climbing, Men",
      "Men's All-Around (Team)",
      "Men's Horizontal Bar",
      "Side Horse, Men",
      "Men's Pommel Horse"
    ],
    "Art Competitions": [
      "Literature, Open",
      "Sculpturing, Open",
      "Architecture, Open",
      "Painting, Open"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Men's Team"
    ],
    "Cross Country Skiing": [
      "18 kilometres, Men",
      "50 kilometres, Men"
    ],
    "Military Ski Patrol": [
      "Military Ski Patrol, Men"
    ],
    "Speed Skating": [
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
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
      "Men's Team"
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
      "Foil, Men's Team",
      "Foil, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Men's Team"
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
      "Men's 100m",
      "Men's 200m",
      "Men's 400m",
      "Men's 4 x 400m Relay",
      "Women's 100m",
      "Women's 4 x 100m Relay",
      "Women's High Jump",
      "Men's Marathon",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Men's Triple Jump",
      "Men's Discus Throw",
      "Men's Decathlon",
      "Men's High Jump",
      "Men's 800m",
      "Men's 4 x 100m Relay",
      "Men's Shot Put",
      "Women's 800m",
      "Men's 400m Hurdles",
      "Men's Long Jump",
      "Men's Javelin Throw",
      "Men's Hammer Throw",
      "Women's Discus Throw",
      "Men's 110m Hurdles",
      "Men's Pole Vault"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Team)",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's All-Around (Team)",
      "Men's Horizontal Bar",
      "Men's All-Around (Individual)"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Men's Team"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Men's Team"
    ],
    "Sailing": [
      "6 metres, Open",
      "One Person Dinghy, Open",
      "8 metres, Open"
    ],
    "Speed Skating": [
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Men's Team"
    ],
    "Water Polo": [
      "Water Polo, Men"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Men's Team"
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
      "Men's Marathon",
      "Men's 400m",
      "Men's 800m",
      "Men's 1500m",
      "Men's 4 x 400m Relay",
      "Men's High Jump",
      "Women's 100m",
      "Women's 4 x 100m Relay",
      "Women's High Jump",
      "Men's Shot Put",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Men's Hammer Throw",
      "Men's Javelin Throw",
      "Men's Decathlon",
      "Men's Discus Throw",
      "Men's 100m",
      "Men's 4 x 100m Relay",
      "Women's Javelin Throw",
      "Men's 110m Hurdles",
      "Men's 50km Race Walk",
      "Men's 400m Hurdles",
      "Men's Pole Vault",
      "Men's Long Jump",
      "Men's Triple Jump",
      "Women's Discus Throw",
      "80 metres Hurdles, Women",
      "Men's 200m"
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
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
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m"
    ],
    "Cycling Road": [
      "Road Race, Men's Team",
      "Road Race, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Floor Exercise",
      "Men's Pommel Horse",
      "Men's Vault",
      "Men's Rings",
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
      "Men's Team"
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
      "Men's Team"
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
      "Men's Triple Jump",
      "Men's 800m",
      "Men's 400m Hurdles",
      "80 metres Hurdles, Women",
      "Women's 4 x 100m Relay",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Men's Shot Put",
      "Men's Javelin Throw",
      "Men's 4 x 100m Relay",
      "Men's 4 x 400m Relay",
      "Men's Long Jump",
      "Men's Hammer Throw",
      "Women's 100m",
      "Women's High Jump",
      "Women's Discus Throw",
      "Women's Javelin Throw",
      "Men's 400m",
      "Men's Marathon",
      "Men's 110m Hurdles",
      "Men's 50km Race Walk",
      "Men's 1500m",
      "Men's Discus Throw",
      "Men's Pole Vault",
      "Men's 100m",
      "Men's 200m",
      "Men's High Jump",
      "Men's Decathlon"
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
      "Kayak Singles, Men's 10,000m",
      "Kayak Doubles, Men's 10,000m",
      "Canadian Doubles, Men's 10,000m",
      "Folding Kayak Singles, Men's 10,000m",
      "Folding Kayak Doubles, Men's 10,000m"
    ],
    "Canoe Sprint": [
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Canadian Singles, Men's 1000m"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Men's Team"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Men's Team",
      "Sabre, Men's Team",
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
      "Men's 10,000m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 500m"
    ],
    "Cycling Road": [
      "Road Race, Men's Team",
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
      "Men's Rings",
      "Women's All-Around (Team)",
      "Men's All-Around (Team)",
      "Men's Horizontal Bar",
      "Men's All-Around (Individual)",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Pommel Horse"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Men's Team"
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
      "Men's Team"
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
      "Men's Marathon",
      "Women's Long Jump",
      "Men's High Jump",
      "Men's Long Jump",
      "Men's Triple Jump",
      "Women's 100m",
      "80 metres Hurdles, Women",
      "Women's 4 x 100m Relay",
      "Women's Shot Put",
      "Women's Javelin Throw",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's Pole Vault",
      "Men's Javelin Throw",
      "Men's 800m",
      "Men's 4 x 400m Relay",
      "Men's Decathlon",
      "Women's High Jump",
      "Women's Discus Throw",
      "Men's 4 x 100m Relay",
      "Men's 50km Race Walk",
      "Women's 200m",
      "Men's Hammer Throw",
      "Men's Discus Throw",
      "Men's 400m",
      "Men's 1500m",
      "Men's 100m",
      "Men's 200m",
      "Men's 400m Hurdles",
      "Men's 3000m Steeplechase",
      "Men's 10km Race Walk",
      "Men's 110m Hurdles",
      "Men's Shot Put"
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
      "Kayak Singles, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 1000m"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Men's Team",
      "Foil, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
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
      "Road Race, Men's Team"
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
      "Canadian Singles, Men's 10,000m",
      "Canadian Doubles, Men's 10,000m",
      "Kayak Singles, Men's 10,000m",
      "Kayak Doubles, Men's 10,000m"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Artistic Gymnastics": [
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's Rings",
      "Women's All-Around (Team)",
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Pommel Horse"
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
      "Men's 10,000m",
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m"
    ],
    "Equestrian Dressage": [
      "Individual, Men",
      "Men's Team"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Men's Team"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Men's Team"
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
      "Men's Marathon",
      "Women's 100m",
      "Women's 200m",
      "80 metres Hurdles, Women",
      "Men's High Jump",
      "Men's Triple Jump",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 50km Race Walk",
      "Women's Javelin Throw",
      "Men's Javelin Throw",
      "Men's 800m",
      "Men's 1500m",
      "Men's 4 x 400m Relay",
      "Men's Hammer Throw",
      "Women's 4 x 100m Relay",
      "Women's Shot Put",
      "Men's 100m",
      "Men's 3000m Steeplechase",
      "Women's High Jump",
      "Women's Long Jump",
      "Men's 4 x 100m Relay",
      "Men's Long Jump",
      "Men's Discus Throw",
      "Men's 400m",
      "Men's 400m Hurdles",
      "Men's 10km Race Walk",
      "Women's Discus Throw",
      "Men's Pole Vault",
      "Men's 200m",
      "Men's 110m Hurdles",
      "Men's Shot Put",
      "Men's Decathlon"
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
      "Kayak Doubles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Men's 1000m"
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
      "Road Race, Men's Team"
    ],
    "Canoe Marathon": [
      "Canadian Doubles, Men's 10,000m",
      "Canadian Singles, Men's 10,000m",
      "Kayak Singles, Men's 10,000m",
      "Kayak Doubles, Men's 10,000m"
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
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m"
    ],
    "Equestrian Jumping": [
      "Individual, Men",
      "Men's Team"
    ],
    "Artistic Gymnastics": [
      "Women's All-Around (Team)",
      "Men's All-Around (Team)",
      "Men's Horizontal Bar",
      "Women's All-Around (Individual)",
      "Team Portable Apparatus, Women",
      "Women's Floor Exercise",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's All-Around (Individual)",
      "Men's Parallel Bars",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's Vault"
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
      "Foil, Men's Team",
      "Sabre, Men's Team",
      "Sabre, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Men's Team"
    ],
    "Sailing": [
      "One Person Dinghy, Open",
      "6 metres, Open",
      "Three Person Keelboat, Open",
      "Two Person Keelboat, Open",
      "5.5 metres, Open"
    ],
    "Modern Pentathlon": [
      "Men's Team",
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
      "Men's Team"
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
      "Men's 100m",
      "Men's 1500m",
      "Men's 10,000m",
      "Men's 4 x 400m Relay",
      "Men's High Jump",
      "Women's 100m",
      "Women's 200m",
      "80 metres Hurdles, Women",
      "Women's 4 x 100m Relay",
      "Men's Triple Jump",
      "Women's Javelin Throw",
      "Men's Shot Put",
      "Women's Discus Throw",
      "Men's 400m",
      "Men's Marathon",
      "Men's Long Jump",
      "Men's 4 x 100m Relay",
      "Women's Shot Put",
      "Men's 800m",
      "Men's 5000m",
      "Men's 3000m Steeplechase",
      "Women's High Jump",
      "Men's Pole Vault",
      "Men's 50km Race Walk",
      "Men's Javelin Throw",
      "Women's Long Jump",
      "Men's 20km Race Walk",
      "Men's Hammer Throw",
      "Men's Decathlon",
      "Men's 200m",
      "Men's 110m Hurdles",
      "Men's 400m Hurdles",
      "Men's Discus Throw"
    ],
    "Canoe Marathon": [
      "Kayak Doubles, Men's 10,000m",
      "Canadian Doubles, Men's 10,000m",
      "Kayak Singles, Men's 10,000m",
      "Canadian Singles, Men's 10,000m"
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
      "Kayak Doubles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Singles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m"
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
      "Women's Balance Beam",
      "Men's All-Around (Team)",
      "Men's Vault",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Team Portable Apparatus, Women",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Uneven Bars",
      "Men's All-Around (Individual)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Men's Pommel Horse"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Men's Team"
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
      "Men's 1500m",
      "Men's 500m",
      "Men's 10,000m",
      "Men's 5000m"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "Road Race, Men's Team"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Men's Team",
      "Foil, Individual, Women",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
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
      "Men's 1500m",
      "Men's 10,000m",
      "Men's 20km Race Walk",
      "Women's 800m",
      "Men's 800m",
      "Men's Decathlon",
      "Women's Javelin Throw",
      "Men's Marathon",
      "Men's Pole Vault",
      "Men's 200m",
      "Men's 100m",
      "Men's 400m",
      "Men's 5000m",
      "Men's 4 x 100m Relay",
      "Men's 4 x 400m Relay",
      "Men's Javelin Throw",
      "Women's 200m",
      "80 metres Hurdles, Women",
      "Women's 4 x 100m Relay",
      "Women's Long Jump",
      "Women's Shot Put",
      "Men's 50km Race Walk",
      "Women's 100m",
      "Women's High Jump",
      "Men's Hammer Throw",
      "Men's 3000m Steeplechase",
      "Men's Triple Jump",
      "Women's Discus Throw",
      "Men's High Jump",
      "Men's Long Jump",
      "Men's 110m Hurdles",
      "Men's 400m Hurdles",
      "Men's Shot Put",
      "Men's Discus Throw"
    ],
    "Equestrian Eventing": [
      "Individual, Men",
      "Men's Team"
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
      "Men's Rings",
      "Women's All-Around (Team)",
      "Women's Balance Beam",
      "Men's Pommel Horse",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's All-Around (Individual)",
      "Men's Vault",
      "Men's Horizontal Bar",
      "Women's All-Around (Individual)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Uneven Bars"
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
      "Kayak Singles, Men's 1000m",
      "Kayak Relay, 4 × Men's 500m",
      "Kayak Singles, Women's 500m",
      "Kayak Doubles, Women's 500m",
      "Kayak Doubles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m"
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
      "Women's 3000m",
      "Women's 500m",
      "Women's 1000m",
      "Men's 5000m",
      "Men's 1500m",
      "Men's 10,000m",
      "Women's 1500m",
      "Men's 500m"
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
      "Foil, Men's Team",
      "Foil, Individual, Women",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Foil, Women's Team",
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
      "Men's Team"
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
      "Men's 10,000m",
      "Women's 200m",
      "Women's 400m",
      "80 metres Hurdles, Women",
      "Women's High Jump",
      "Men's 3000m Steeplechase",
      "Men's 100m",
      "Men's 800m",
      "Men's 1500m",
      "Men's Discus Throw",
      "Men's Marathon",
      "Men's Javelin Throw",
      "Men's 4 x 100m Relay",
      "Women's 800m",
      "Men's 5000m",
      "Men's 20km Race Walk",
      "Men's Pole Vault",
      "Men's Hammer Throw",
      "Men's Decathlon",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Men's 400m Hurdles",
      "Men's 4 x 400m Relay",
      "Men's 50km Race Walk",
      "Men's Long Jump",
      "Women's 4 x 100m Relay",
      "Women's Long Jump",
      "Pentathlon, Women",
      "Men's Shot Put",
      "Women's Javelin Throw",
      "Men's 400m",
      "Men's Triple Jump",
      "Women's 100m",
      "Men's 110m Hurdles",
      "Men's High Jump",
      "Men's 200m"
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
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Vault",
      "Women's Balance Beam",
      "Men's Vault",
      "Men's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Uneven Bars",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Rings",
      "Men's All-Around (Individual)",
      "Men's Pommel Horse",
      "Men's Horizontal Bar"
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
      "Canadian Doubles, Men's 1000m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Singles, Women's 500m"
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
      "Women's 1000m",
      "Women's 1500m",
      "Men's 1500m",
      "Women's 3000m",
      "Men's 500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Women's 500m"
    ],
    "Equestrian Jumping": [
      "Individual, Open",
      "Team, Open"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Foil, Individual, Women",
      "Foil, Women's Team",
      "Épée, Individual, Men",
      "Sabre, Men's Team"
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
      "Men's Team"
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
      "Men's 200m",
      "Men's 800m",
      "Women's 200m",
      "80 metres Hurdles, Women",
      "Women's Javelin Throw",
      "Pentathlon, Women",
      "Men's Triple Jump",
      "Men's 4 x 100m Relay",
      "Women's 4 x 100m Relay",
      "Men's Discus Throw",
      "Women's High Jump",
      "Men's 50km Race Walk",
      "Men's Pole Vault",
      "Men's Long Jump",
      "Women's Shot Put",
      "Men's 10,000m",
      "Men's Marathon",
      "Men's Javelin Throw",
      "Women's 400m",
      "Men's 400m Hurdles",
      "Women's Long Jump",
      "Men's Hammer Throw",
      "Women's Discus Throw",
      "Men's 110m Hurdles",
      "Men's 100m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 3000m Steeplechase",
      "Men's 4 x 400m Relay",
      "Men's 20km Race Walk",
      "Women's 800m",
      "Women's 100m",
      "Men's High Jump",
      "Men's Shot Put",
      "Men's 400m",
      "Men's Decathlon"
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
      "Kayak Doubles, Men's 1000m",
      "Kayak Singles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Singles, Women's 500m"
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
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's All-Around (Team)",
      "Men's Pommel Horse",
      "Men's All-Around (Individual)",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings"
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
      "Women's 1500m",
      "Women's 3000m",
      "Men's 1500m",
      "Men's 5000m",
      "Women's 1000m",
      "Men's 500m",
      "Men's 10,000m",
      "Women's 500m"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Foil, Individual, Women",
      "Foil, Women's Team"
    ],
    "Modern Pentathlon": [
      "Men's Team",
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
      "Women's 100m",
      "Women's 200m",
      "Women's High Jump",
      "Men's 10,000m",
      "Men's Marathon",
      "Men's Triple Jump",
      "Women's Long Jump",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Women's 4 x 100m Relay",
      "Men's Discus Throw",
      "Men's 20km Race Walk",
      "Men's High Jump",
      "Men's Pole Vault",
      "Men's Shot Put",
      "Men's Hammer Throw",
      "Women's 400m",
      "Women's 800m",
      "Women's 1500m",
      "Women's 100m Hurdles",
      "Women's 4 x 400m Relay",
      "Women's Javelin Throw",
      "Pentathlon, Women",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 3000m Steeplechase",
      "Men's 110m Hurdles",
      "Men's 4 x 400m Relay",
      "Men's 400m Hurdles",
      "Men's 200m",
      "Men's 100m",
      "Men's 400m",
      "Men's 800m",
      "Men's Decathlon",
      "Men's 4 x 100m Relay",
      "Men's 50km Race Walk",
      "Men's Javelin Throw",
      "Men's Long Jump"
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
      "Canadian Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Fours, Men's 1000m"
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
      "Men's All-Around (Team)",
      "Men's Vault",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Vault",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's All-Around (Individual)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's Floor Exercise"
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
      "Men's Team",
      "Individual, Men"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Foil, Individual, Women",
      "Foil, Women's Team"
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
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Men's 500m",
      "Women's 500m"
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
      "Men's 800m",
      "Men's 1500m",
      "Men's Marathon",
      "Men's Triple Jump",
      "Women's 800m",
      "Women's High Jump",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Men's High Jump",
      "Men's 400m",
      "Men's 110m Hurdles",
      "Men's 3000m Steeplechase",
      "Men's 4 x 100m Relay",
      "Men's 20km Race Walk",
      "Men's Long Jump",
      "Men's Shot Put",
      "Men's Discus Throw",
      "Women's 100m",
      "Women's 200m",
      "Women's 400m",
      "Women's 1500m",
      "Women's 100m Hurdles",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Women's Long Jump",
      "Women's Javelin Throw",
      "Pentathlon, Women",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's Pole Vault",
      "Men's Javelin Throw",
      "Men's 100m",
      "Men's 200m",
      "Men's 4 x 400m Relay",
      "Men's 400m Hurdles",
      "Men's Hammer Throw",
      "Men's Decathlon"
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
      "Canadian Singles, Men's 500m",
      "Kayak Singles, Men's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 500m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Doubles, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 500m",
      "Canadian Doubles, Men's 1000m"
    ],
    "Figure Skating": [
      "Singles, Men",
      "Singles, Women",
      "Pairs, Mixed",
      "Ice Dancing, Mixed"
    ],
    "Speed Skating": [
      "Women's 500m",
      "Women's 3000m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 1000m",
      "Men's 500m",
      "Women's 1000m",
      "Women's 1500m"
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
      "Men's Team"
    ],
    "Ice Hockey": [
      "Ice Hockey, Men"
    ],
    "Cycling Road": [
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Team)",
      "Men's Pommel Horse",
      "Women's All-Around (Team)",
      "Women's Vault",
      "Men's Horizontal Bar",
      "Women's Uneven Bars",
      "Men's All-Around (Individual)",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Rings",
      "Women's All-Around (Individual)",
      "Women's Floor Exercise",
      "Women's Balance Beam",
      "Men's Floor Exercise"
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
      "Foil, Men's Team",
      "Foil, Women's Team",
      "Épée, Individual, Men",
      "Foil, Individual, Women",
      "Sabre, Men's Team",
      "Sabre, Individual, Men",
      "Épée, Men's Team"
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
      "Men's 400m",
      "Men's Triple Jump",
      "Men's 100m",
      "Women's Discus Throw",
      "Men's 110m Hurdles",
      "Men's Discus Throw",
      "Women's Javelin Throw",
      "Women's 400m",
      "Men's 1500m",
      "Men's Marathon",
      "Men's 400m Hurdles",
      "Men's 4 x 400m Relay",
      "Men's 20km Race Walk",
      "Men's 50km Race Walk",
      "Men's High Jump",
      "Men's Long Jump",
      "Men's Shot Put",
      "Men's Javelin Throw",
      "Women's 100m",
      "Women's 200m",
      "Women's 1500m",
      "Women's 100m Hurdles",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Women's High Jump",
      "Women's Long Jump",
      "Women's Shot Put",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Men's 4 x 100m Relay",
      "Men's 200m",
      "Men's 800m",
      "Men's Decathlon",
      "Men's Pole Vault",
      "Men's Hammer Throw",
      "Women's 800m",
      "Pentathlon, Women"
    ],
    "Canoe Sprint": [
      "Kayak Singles, Men's 500m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 500m",
      "Kayak Singles, Women's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 500m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Doubles, Men's 1000m"
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
      "Men's All-Around (Individual)",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Pommel Horse",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Uneven Bars",
      "Women's Balance Beam"
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
      "Men's 1000m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Men's 500m",
      "Men's 10,000m",
      "Men's 1500m",
      "Men's 5000m"
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Foil, Individual, Women",
      "Foil, Women's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team"
    ],
    "Modern Pentathlon": [
      "Individual, Men",
      "Men's Team"
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
      "Men's Long Jump",
      "Women's Shot Put",
      "Women's Heptathlon",
      "Men's 800m",
      "Men's 100m",
      "Men's 4 x 100m Relay",
      "Women's 3000m",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Men's High Jump",
      "Men's 400m",
      "Men's 110m Hurdles",
      "Men's Hammer Throw",
      "Men's Javelin Throw",
      "Women's Javelin Throw",
      "Men's 3000m Steeplechase",
      "Men's Pole Vault",
      "Women's 100m Hurdles",
      "Men's 1500m",
      "Men's 10,000m",
      "Men's Marathon",
      "Men's 4 x 400m Relay",
      "Men's Triple Jump",
      "Men's Decathlon",
      "Women's 400m",
      "Women's Long Jump",
      "Men's 20km Race Walk",
      "Men's 50km Race Walk",
      "Men's Shot Put",
      "Women's 1500m",
      "Women's High Jump",
      "Women's 100m",
      "Women's 200m",
      "Men's 5000m",
      "Women's 400m Hurdles",
      "Women's Discus Throw",
      "Women's Marathon",
      "Women's 800m",
      "Men's 200m",
      "Men's 400m Hurdles",
      "Men's Discus Throw"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, Men's 1000m",
      "Kayak Doubles, Men's 500m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Fours, Women's 500m",
      "Kayak Singles, Men's 500m",
      "Kayak Fours, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Singles, Men's 1000m",
      "Canadian Doubles, Men's 500m"
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
      "Men's 500m",
      "Men's 1000m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m"
    ],
    "Archery": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's All-Around (Team)",
      "Women's Uneven Bars",
      "Men's Parallel Bars",
      "Women's All-Around (Individual)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Balance Beam"
    ],
    "Basketball": [
      "Basketball, Women",
      "Basketball, Men"
    ],
    "Fencing": [
      "Foil, Individual, Women",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Foil, Women's Team",
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
      "Men's Team",
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
      "Women's Marathon",
      "Women's 400m Hurdles",
      "Men's 200m",
      "Men's 800m",
      "Men's Triple Jump",
      "Women's 100m Hurdles",
      "Women's High Jump",
      "Women's Discus Throw",
      "Men's Decathlon",
      "Women's Shot Put",
      "Men's 20km Race Walk",
      "Men's Javelin Throw",
      "Men's Marathon",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 50km Race Walk",
      "Men's Shot Put",
      "Men's Discus Throw",
      "Women's 100m",
      "Women's 200m",
      "Women's 400m",
      "Women's 800m",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Women's Long Jump",
      "Women's Javelin Throw",
      "Women's Heptathlon",
      "Men's 4 x 100m Relay",
      "Men's 100m",
      "Men's 110m Hurdles",
      "Men's 3000m Steeplechase",
      "Women's 3000m",
      "Women's 10,000m",
      "Men's 10,000m",
      "Men's 4 x 400m Relay",
      "Women's 1500m",
      "Men's 400m Hurdles",
      "Men's High Jump",
      "Men's Pole Vault",
      "Men's Hammer Throw",
      "Men's 400m",
      "Men's Long Jump"
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
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 1000m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Doubles, Women's 500m",
      "Kayak Fours, Women's 500m",
      "Kayak Singles, Men's 500m",
      "Kayak Fours, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Canadian Doubles, Men's 500m",
      "Kayak Doubles, Men's 500m"
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
      "Men's Team",
      "Individual, Men"
    ],
    "Speed Skating": [
      "Men's 1500m",
      "Men's 10,000m",
      "Men's 500m",
      "Men's 1000m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Women's 5000m",
      "Men's 5000m"
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
      "Men's Pommel Horse",
      "Women's Floor Exercise",
      "Men's Floor Exercise",
      "Men's Vault",
      "Men's All-Around (Team)",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Women's All-Around (Team)",
      "Women's Uneven Bars",
      "Women's All-Around (Individual)",
      "Women's Vault",
      "Women's Balance Beam",
      "Men's All-Around (Individual)"
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
      "Large Hill, Men's Team"
    ],
    "Cycling Road": [
      "Road Race, Individual, Men",
      "100 kilometres Team Time Trial, Men",
      "Road Race, Individual, Women"
    ],
    "Fencing": [
      "Foil, Individual, Men",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Foil, Men's Team",
      "Sabre, Men's Team",
      "Foil, Women's Team",
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
      "Men's Team",
      "Women's Team",
      "Individual, Men",
      "Individual, Women"
    ],
    "Equestrian Eventing": [
      "Individual, Open",
      "Team, Open"
    ],
    "Modern Pentathlon": [
      "Men's Team",
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
      "Women's 1500m",
      "Men's High Jump",
      "Women's Discus Throw",
      "Women's 100m Hurdles",
      "Men's 110m Hurdles",
      "Men's 20km Race Walk",
      "Women's 3000m",
      "Women's 10km Race Walk",
      "Women's Shot Put",
      "Women's 400m",
      "Men's 4 x 100m Relay",
      "Men's 4 x 400m Relay",
      "Men's Discus Throw",
      "Women's 800m",
      "Women's High Jump",
      "Men's Javelin Throw",
      "Men's Decathlon",
      "Men's 5000m",
      "Men's 10,000m",
      "Women's 10,000m",
      "Men's Marathon",
      "Men's 50km Race Walk",
      "Women's Long Jump",
      "Women's Javelin Throw",
      "Women's Heptathlon",
      "Men's 100m",
      "Men's 400m Hurdles",
      "Women's 400m Hurdles",
      "Women's 4 x 400m Relay",
      "Women's 100m",
      "Women's 200m",
      "Women's Marathon",
      "Men's 400m",
      "Men's 800m",
      "Men's 3000m Steeplechase",
      "Men's 1500m",
      "Men's 200m",
      "Women's 4 x 100m Relay",
      "Men's Pole Vault",
      "Men's Triple Jump",
      "Men's Long Jump",
      "Men's Shot Put"
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
      "Kayak Singles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 500m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Men's 500m",
      "Kayak Doubles, Men's 500m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Doubles, Women's 500m",
      "Kayak Fours, Women's 500m"
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
      "Men's Team",
      "Individual, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Men's Team"
    ],
    "Speed Skating": [
      "Women's 3000m",
      "Women's 500m",
      "Women's 1000m",
      "Men's 500m",
      "Men's 1000m",
      "Women's 1500m",
      "Women's 5000m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m"
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
      "Men's 1000m",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "Women's 500m"
    ],
    "Archery": [
      "Women's Team",
      "Men's Team",
      "Individual, Men",
      "Individual, Women"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Rings",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's Horizontal Bar",
      "Men's Pommel Horse",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Men's Vault"
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Épée, Men's Team",
      "Foil, Women's Team"
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
      "Men's Team"
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
      "Men's 1000m",
      "Women's 1000m",
      "3,000 metres Relay, Women",
      "Women's 500m",
      "Men's 500m"
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
      "Large Hill, Men's Team",
      "Normal Hill, Individual, Men"
    ],
    "Speed Skating": [
      "Women's 1500m",
      "Women's 3000m",
      "Men's 1000m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 5000m",
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m"
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
      "Men's Team",
      "Individual, Men"
    ]
  },
  "1996": {
    "Athletics": [
      "Men's 1500m",
      "Women's 400m",
      "Women's Javelin Throw",
      "Women's 1500m",
      "Men's Discus Throw",
      "Women's Discus Throw",
      "Women's Heptathlon",
      "Men's 4 x 100m Relay",
      "Women's High Jump",
      "Men's 5000m",
      "Men's 100m",
      "Women's 5000m",
      "Women's 10,000m",
      "Women's 10km Race Walk",
      "Women's Shot Put",
      "Men's Triple Jump",
      "Women's 800m",
      "Men's Javelin Throw",
      "Men's Decathlon",
      "Women's Triple Jump",
      "Men's 20km Race Walk",
      "Men's 10,000m",
      "Women's Marathon",
      "Men's Pole Vault",
      "Women's 200m",
      "Women's 100m Hurdles",
      "Men's 110m Hurdles",
      "Women's 4 x 400m Relay",
      "Men's 400m",
      "Men's 4 x 400m Relay",
      "Men's High Jump",
      "Men's Hammer Throw",
      "Men's 3000m Steeplechase",
      "Women's Long Jump",
      "Men's Long Jump",
      "Women's 100m",
      "Women's 400m Hurdles",
      "Women's 4 x 100m Relay",
      "Men's 800m",
      "Men's Marathon",
      "Men's 200m",
      "Men's 50km Race Walk",
      "Men's Shot Put",
      "Men's 400m Hurdles"
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
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Men's 500m",
      "Kayak Doubles, Women's 500m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Fours, Women's 500m",
      "Canadian Doubles, Men's 500m",
      "Kayak Singles, Men's 500m"
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
      "Men's All-Around (Individual)",
      "Men's Vault",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Women's Vault",
      "Women's Uneven Bars",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Balance Beam"
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
      "Women's Team"
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
      "Women's Team",
      "Men's Team",
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Foil, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Épée, Individual, Women",
      "Épée, Women's Team",
      "Foil, Women's Team",
      "Sabre, Men's Team",
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
      "Large Hill, Men's Team",
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
      "Men's 5000m",
      "Men's 500m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Women's 5000m",
      "Men's 1000m",
      "Men's 1500m",
      "Men's 10,000m"
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
      "Men's 1000m",
      "5,000 metres Relay, Men",
      "Women's 500m",
      "3,000 metres Relay, Women",
      "Men's 500m",
      "Women's 1000m"
    ],
    "Nordic Combined": [
      "Men's Team",
      "Individual, Men"
    ]
  },
  "2000": {
    "Athletics": [
      "Men's 800m",
      "Men's 5000m",
      "Men's High Jump",
      "Women's 1500m",
      "Men's Long Jump",
      "Women's 400m",
      "Women's Pole Vault",
      "Women's 800m",
      "Men's 100m",
      "Men's Hammer Throw",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Women's Heptathlon",
      "Men's 4 x 100m Relay",
      "Women's Triple Jump",
      "Women's 20km Race Walk",
      "Men's 110m Hurdles",
      "Men's Triple Jump",
      "Women's Javelin Throw",
      "Men's Javelin Throw",
      "Men's Decathlon",
      "Men's 10,000m",
      "Men's Marathon",
      "Women's 5000m",
      "Women's 10,000m",
      "Men's Shot Put",
      "Men's Discus Throw",
      "Women's Long Jump",
      "Women's Hammer Throw",
      "Men's 200m",
      "Women's 100m",
      "Men's 400m",
      "Men's 4 x 400m Relay",
      "Women's 200m",
      "Women's 400m Hurdles",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Women's Marathon",
      "Women's 100m Hurdles",
      "Men's 1500m",
      "Men's 3000m Steeplechase",
      "Men's 400m Hurdles",
      "Men's 50km Race Walk",
      "Men's 20km Race Walk",
      "Women's High Jump",
      "Men's Pole Vault"
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
      "Women's Team",
      "Men's Team",
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
      "Kayak Doubles, Men's 500m",
      "Kayak Singles, Women's 500m",
      "Kayak Singles, Men's 500m",
      "Kayak Singles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 500m",
      "Kayak Doubles, Women's 500m",
      "Kayak Fours, Women's 500m",
      "Kayak Doubles, Men's 1000m",
      "Canadian Doubles, Men's 500m"
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
    "Trampoline": [
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
      "Men's Floor Exercise",
      "Men's Rings",
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Parallel Bars",
      "Women's All-Around (Individual)",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's Horizontal Bar",
      "Men's Pommel Horse",
      "Men's Vault",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Vault"
    ],
    "Football": [
      "Football, Men",
      "Football, Women"
    ],
    "Artistic Swimming": [
      "Women's Team",
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
      "Foil, Men's Team",
      "Épée, Women's Team",
      "Épée, Men's Team",
      "Épée, Individual, Men",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Épée, Individual, Women",
      "Foil, Individual, Men",
      "Foil, Individual, Women",
      "Foil, Women's Team"
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
      "Men's 1000m",
      "Women's 500m",
      "Women's 1500m",
      "Men's 500m",
      "Men's 1500m",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "Women's 1000m"
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
      "Men's Team",
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
      "Women's 500m",
      "Women's 3000m",
      "Women's 5000m",
      "Men's 5000m",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 500m",
      "Men's 1000m",
      "Men's 1500m",
      "Men's 10,000m"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Large Hill, Men's Team",
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
      "Women's Team",
      "Men's Team",
      "Individual, Women"
    ],
    "Athletics": [
      "Men's 4 x 400m Relay",
      "Men's 20km Race Walk",
      "Women's 20km Race Walk",
      "Women's 100m",
      "Men's Marathon",
      "Women's Triple Jump",
      "Men's 110m Hurdles",
      "Women's 10,000m",
      "Women's Shot Put",
      "Women's Hammer Throw",
      "Women's Javelin Throw",
      "Men's High Jump",
      "Men's Decathlon",
      "Women's Discus Throw",
      "Men's 800m",
      "Men's Shot Put",
      "Men's 400m Hurdles",
      "Men's 10,000m",
      "Men's Discus Throw",
      "Men's 5000m",
      "Women's 5000m",
      "Women's 4 x 100m Relay",
      "Men's 4 x 100m Relay",
      "Women's 800m",
      "Women's 1500m",
      "Women's Heptathlon",
      "Women's 400m Hurdles",
      "Men's Pole Vault",
      "Women's 200m",
      "Women's 4 x 400m Relay",
      "Men's Hammer Throw",
      "Women's Marathon",
      "Men's 1500m",
      "Men's 3000m Steeplechase",
      "Men's Javelin Throw",
      "Women's 400m",
      "Men's 50km Race Walk",
      "Women's Pole Vault",
      "Men's 100m",
      "Men's Triple Jump",
      "Women's High Jump",
      "Women's Long Jump",
      "Men's Long Jump",
      "Women's 100m Hurdles",
      "Men's 200m",
      "Men's 400m"
    ],
    "Baseball": [
      "Baseball, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, Men's 500m",
      "Kayak Doubles, Men's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Canadian Doubles, Men's 500m",
      "Kayak Fours, Men's 1000m",
      "Canadian Singles, Men's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Fours, Women's 500m",
      "Kayak Doubles, Men's 1000m"
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
      "Men's Floor Exercise",
      "Men's Rings",
      "Men's Parallel Bars",
      "Men's Pommel Horse",
      "Women's All-Around (Individual)",
      "Women's Uneven Bars",
      "Men's Horizontal Bar",
      "Men's All-Around (Team)",
      "Men's Vault",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Women's Balance Beam",
      "Men's All-Around (Individual)"
    ],
    "Rhythmic Gymnastics": [
      "Group, Women",
      "Individual, Women"
    ],
    "Cycling Mountain Bike": [
      "Cross-Country, Women",
      "Cross-Country, Men"
    ],
    "Trampoline": [
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
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Sabre, Individual, Women",
      "Foil, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Men's Team",
      "Épée, Individual, Women",
      "Épée, Women's Team",
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
      "Women's Team"
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
      "Men's Team",
      "Individual, Men",
      "Sprint, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Individual, Men",
      "Large Hill, Men's Team",
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
      "Women's 500m",
      "Men's 500m",
      "5,000 metres Relay, Men",
      "3,000 metres Relay, Women",
      "Men's 1500m",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 1000m"
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
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Women's 5000m",
      "Team Pursuit (6 laps), Women",
      "Women's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 1000m",
      "Men's 10,000m",
      "Men's 500m"
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
      "Men's 20km Race Walk",
      "Men's 50km Race Walk",
      "Men's Pole Vault",
      "Women's 100m Hurdles",
      "Men's Hammer Throw",
      "Men's Decathlon",
      "Women's 4 x 100m Relay",
      "Women's High Jump",
      "Men's 4 x 100m Relay",
      "Women's Long Jump",
      "Women's Triple Jump",
      "Men's Shot Put",
      "Women's Marathon",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Women's Hammer Throw",
      "Men's 110m Hurdles",
      "Men's Long Jump",
      "Women's Javelin Throw",
      "Men's Discus Throw",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's Marathon",
      "Women's 5000m",
      "Women's 10,000m",
      "Men's Javelin Throw",
      "Men's 1500m",
      "Men's 3000m Steeplechase",
      "Men's 4 x 400m Relay",
      "Men's High Jump",
      "Men's Triple Jump",
      "Women's 400m",
      "Women's 400m Hurdles",
      "Women's 4 x 400m Relay",
      "Women's Heptathlon",
      "Women's 20km Race Walk",
      "Men's 100m",
      "Men's 200m",
      "Women's 100m",
      "Women's 200m",
      "Men's 800m",
      "Women's 800m",
      "Women's 1500m",
      "Women's 3000m Steeplechase",
      "Women's Pole Vault",
      "Men's 400m",
      "Men's 400m Hurdles"
    ],
    "Canoe Slalom": [
      "Canadian Singles, Slalom, Men",
      "Kayak Singles, Slalom, Women",
      "Canadian Doubles, Slalom, Men",
      "Kayak Singles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Singles, Men's 500m",
      "Kayak Singles, Men's 1000m",
      "Kayak Fours, Women's 500m",
      "Kayak Doubles, Men's 500m",
      "Kayak Fours, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 500m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Singles, Women's 500m",
      "Canadian Singles, Men's 500m"
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
    "Trampoline": [
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
      "Men's Team",
      "Individual, Women",
      "Women's Team",
      "Individual, Men"
    ],
    "Artistic Gymnastics": [
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Men's Rings",
      "Men's Pommel Horse",
      "Women's All-Around (Individual)",
      "Women's All-Around (Team)",
      "Women's Vault",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's Vault",
      "Women's Floor Exercise"
    ],
    "Artistic Swimming": [
      "Women's Team",
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
      "Sabre, Women's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Men's Team",
      "Foil, Individual, Men",
      "Épée, Individual, Women",
      "Foil, Individual, Women",
      "Foil, Women's Team",
      "Sabre, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Men's Team",
      "Singles, Women",
      "Women's Team"
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
      "Men's Team",
      "Normal Hill / 10 km, Individual, Men"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Individual, Men",
      "Large Hill, Men's Team"
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
      "Men's 500m",
      "5,000 metres Relay, Men",
      "Women's 500m",
      "3,000 metres Relay, Women",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 1000m",
      "Men's 1500m"
    ],
    "Skeleton": [
      "Skeleton, Men",
      "Skeleton, Women"
    ],
    "Speed Skating": [
      "Team Pursuit (8 laps), Men",
      "Women's 1000m",
      "Women's 1500m",
      "Women's 3000m",
      "Women's 5000m",
      "Women's 500m",
      "Team Pursuit (6 laps), Women",
      "Men's 500m",
      "Men's 1500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 1000m"
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
      "Men's 1500m",
      "Men's 50km Race Walk",
      "Men's Long Jump",
      "Women's 100m Hurdles",
      "Women's 1500m",
      "Men's 800m",
      "Men's High Jump",
      "Men's 20km Race Walk",
      "Women's 20km Race Walk",
      "Women's Shot Put",
      "Women's Discus Throw",
      "Women's Hammer Throw",
      "Women's Triple Jump",
      "Men's Decathlon",
      "Women's Pole Vault",
      "Men's Javelin Throw",
      "Women's 400m Hurdles",
      "Women's Javelin Throw",
      "Men's 400m",
      "Men's 400m Hurdles",
      "Men's Discus Throw",
      "Men's 5000m",
      "Men's 10,000m",
      "Women's 5000m",
      "Women's 10,000m",
      "Women's Marathon",
      "Women's 3000m Steeplechase",
      "Men's 3000m Steeplechase",
      "Men's 4 x 100m Relay",
      "Men's Pole Vault",
      "Men's Shot Put",
      "Women's Heptathlon",
      "Women's 400m",
      "Men's Hammer Throw",
      "Men's Triple Jump",
      "Men's 100m",
      "Men's 200m",
      "Men's 110m Hurdles",
      "Women's 100m",
      "Women's 200m",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Men's Marathon",
      "Women's 800m",
      "Women's High Jump",
      "Women's Long Jump",
      "Men's 4 x 400m Relay"
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
      "Kayak Fours, Men's 1000m",
      "Kayak Doubles, Men's 200m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Fours, Women's 500m",
      "Kayak Singles, Men's 200m",
      "Kayak Singles, Men's 1000m",
      "Canadian Singles, Men's 1000m",
      "Kayak Doubles, Men's 1000m",
      "Kayak Doubles, Women's 500m",
      "Kayak Singles, Women's 200m",
      "Kayak Singles, Women's 500m",
      "Canadian Singles, Men's 200m"
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
      "Men's Rings",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Horizontal Bar",
      "Women's Uneven Bars",
      "Women's Balance Beam",
      "Men's All-Around (Individual)",
      "Men's Pommel Horse",
      "Women's All-Around (Team)",
      "Women's Floor Exercise",
      "Women's Vault",
      "Men's Vault",
      "Women's All-Around (Individual)"
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
    "Trampoline": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Archery": [
      "Individual, Men",
      "Women's Team",
      "Men's Team",
      "Individual, Women"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Women's Team"
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
      "Épée, Women's Team",
      "Foil, Men's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Foil, Individual, Women",
      "Foil, Women's Team",
      "Épée, Individual, Men",
      "Sabre, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Men's Team",
      "Singles, Women",
      "Women's Team"
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
      "Men's Team",
      "Normal Hill / 10 km, Individual, Men",
      "Large Hill / 10 km, Individual, Men"
    ],
    "Ski Jumping": [
      "Large Hill, Men's Team",
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
      "Men's 500m",
      "Men's 1500m",
      "3,000 metres Relay, Women",
      "5,000 metres Relay, Men",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 1000m"
    ],
    "Speed Skating": [
      "Men's 1000m",
      "Men's 1500m",
      "Women's 1000m",
      "Women's 3000m",
      "Women's 5000m",
      "Men's 500m",
      "Men's 5000m",
      "Men's 10,000m",
      "Team Pursuit (8 laps), Men",
      "Women's 500m",
      "Women's 1500m",
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
      "Men's 800m",
      "Men's 1500m",
      "Men's 20km Race Walk",
      "Men's 50km Race Walk",
      "Women's Marathon",
      "Women's 3000m Steeplechase",
      "Men's Hammer Throw",
      "Women's Heptathlon",
      "Men's Pole Vault",
      "Women's High Jump",
      "Women's 800m",
      "Men's 100m",
      "Men's 200m",
      "Men's 4 x 100m Relay",
      "Men's High Jump",
      "Men's Decathlon",
      "Men's Triple Jump",
      "Women's 20km Race Walk",
      "Women's Hammer Throw",
      "Women's Triple Jump",
      "Women's Discus Throw",
      "Women's Javelin Throw",
      "Women's 400m Hurdles",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's Marathon",
      "Women's 1500m",
      "Women's 5000m",
      "Women's 10,000m",
      "Men's 110m Hurdles",
      "Men's 3000m Steeplechase",
      "Men's Discus Throw",
      "Men's Javelin Throw",
      "Men's Long Jump",
      "Women's 4 x 100m Relay",
      "Women's 4 x 400m Relay",
      "Women's Pole Vault",
      "Men's 400m",
      "Women's Shot Put",
      "Men's 4 x 400m Relay",
      "Women's 100m",
      "Women's 200m",
      "Women's 400m",
      "Men's 400m Hurdles",
      "Men's Shot Put",
      "Women's Long Jump",
      "Women's 100m Hurdles"
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
      "Men's Team",
      "Women's Team",
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
      "Kayak Doubles, Men's 1000m",
      "Canadian Singles, Men's 200m",
      "Kayak Singles, Women's 200m",
      "Kayak Fours, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Men's 1000m",
      "Kayak Fours, Men's 1000m",
      "Kayak Singles, Women's 500m",
      "Kayak Singles, Men's 200m",
      "Kayak Doubles, Women's 500m",
      "Kayak Doubles, Men's 200m"
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
    "Trampoline": [
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
      "Men's Floor Exercise",
      "Men's Rings",
      "Men's All-Around (Team)",
      "Women's All-Around (Team)",
      "Men's Horizontal Bar",
      "Women's Uneven Bars",
      "Men's All-Around (Individual)",
      "Men's Pommel Horse",
      "Women's Floor Exercise",
      "Men's Vault",
      "Women's Balance Beam",
      "Men's Parallel Bars",
      "Women's All-Around (Individual)",
      "Women's Vault"
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
      "Women's Team"
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
      "Épée, Women's Team",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Épée, Men's Team",
      "Sabre, Individual, Men",
      "Foil, Individual, Men",
      "Foil, Individual, Women",
      "Sabre, Individual, Women",
      "Sabre, Women's Team"
    ],
    "Golf": [
      "Individual, Women",
      "Individual, Men"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Men's Team",
      "Singles, Women",
      "Women's Team"
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
      "Men's Team",
      "Large Hill / 10 km, Individual, Men"
    ],
    "Speed Skating": [
      "Mass Start, Men",
      "Men's 5000m",
      "Men's 10,000m",
      "Men's 500m",
      "Women's 500m",
      "Women's 5000m",
      "Women's 1000m",
      "Women's 1500m",
      "Mass Start, Women",
      "Team Pursuit (6 laps), Women",
      "Men's 1000m",
      "Men's 1500m",
      "Team Pursuit (8 laps), Men",
      "Women's 3000m"
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
      "Men's 1000m",
      "5,000 metres Relay, Men",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 500m",
      "3,000 metres Relay, Women",
      "Men's 1500m"
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
      "Large Hill, Men's Team",
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
      "Men's Vault",
      "Women's Uneven Bars",
      "Women's All-Around (Individual)",
      "Women's Vault",
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Rings",
      "Women's Balance Beam",
      "Men's Pommel Horse",
      "Men's Horizontal Bar",
      "Women's All-Around (Team)",
      "Women's Floor Exercise"
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
      "Men's Decathlon",
      "Women's High Jump",
      "Women's Javelin Throw",
      "Men's Discus Throw",
      "Women's 10,000m",
      "Men's High Jump",
      "Men's Marathon",
      "Women's Heptathlon",
      "Men's 4 x 400m Relay",
      "Men's 400m Hurdles",
      "Men's Pole Vault",
      "Men's Triple Jump",
      "Men's 100m",
      "Men's 200m",
      "Men's 5000m",
      "Men's 4 x 100m Relay",
      "Men's 50km Race Walk",
      "Women's 20km Race Walk",
      "Women's Shot Put",
      "Women's Hammer Throw",
      "Men's 400m",
      "Men's Long Jump",
      "Women's Discus Throw",
      "Men's Javelin Throw",
      "Women's 400m",
      "4 × 400 metres Relay, Mixed",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Women's 5000m",
      "Women's Long Jump",
      "Men's 1500m",
      "Women's 800m",
      "Women's 1500m",
      "Women's 4 x 100m Relay",
      "Women's Pole Vault",
      "Men's 20km Race Walk",
      "Men's 110m Hurdles",
      "Women's 100m",
      "Women's 200m",
      "Women's 100m Hurdles",
      "Women's 4 x 400m Relay",
      "Men's 800m",
      "Women's Marathon",
      "Women's 3000m Steeplechase",
      "Women's 400m Hurdles",
      "Men's Shot Put",
      "Men's Hammer Throw",
      "Women's Triple Jump"
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
      "Kayak Doubles, Men's 1000m",
      "Kayak Fours, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Singles, Women's 200m",
      "Canadian Doubles, Women's 500m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Women's 200m",
      "Kayak Singles, Women's 500m",
      "Kayak Fours, Men's 500m",
      "Kayak Singles, Men's 200m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Women's 500m"
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
    "Trampoline": [
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
      "Women",
      "Men"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Women's Team"
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
      "Épée, Women's Team",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Foil, Women's Team",
      "Sabre, Individual, Women",
      "Sabre, Women's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Épée, Men's Team",
      "Foil, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Men's Team",
      "Singles, Women",
      "Women's Team",
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
      "Men's Team",
      "Women's Team",
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
      "Men's Team"
    ],
    "Ski Jumping": [
      "Normal Hill, Individual, Men",
      "Large Hill, Men's Team",
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
      "Women's 1000m",
      "Men's 500m",
      "Men's 1500m",
      "5,000 metres Relay, Men",
      "Women's 500m",
      "Men's 1000m",
      "3,000 metres Relay, Women",
      "2,000 metres Relay, Mixed",
      "Women's 1500m"
    ],
    "Speed Skating": [
      "Mass Start, Men",
      "Men's 1000m",
      "Women's 3000m",
      "Women's 5000m",
      "Mass Start, Women",
      "Team Pursuit (6 laps), Women",
      "Men's 500m",
      "Men's 10,000m",
      "Women's 500m",
      "Women's 1000m",
      "Women's 1500m",
      "Men's 1500m",
      "Men's 5000m",
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
"2024": {
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
      "Men's Vault",
      "Women's Uneven Bars",
      "Women's All-Around (Individual)",
      "Women's Vault",
      "Men's All-Around (Individual)",
      "Men's All-Around (Team)",
      "Men's Floor Exercise",
      "Men's Parallel Bars",
      "Men's Rings",
      "Women's Balance Beam",
      "Men's Pommel Horse",
      "Men's Horizontal Bar",
      "Women's All-Around (Team)",
      "Women's Floor Exercise"
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
      "Mixed Marathon Race Walk Relay",
      "Men's Decathlon",
      "Women's High Jump",
      "Women's Javelin Throw",
      "Men's Discus Throw",
      "Women's 10,000m",
      "Men's High Jump",
      "Men's Marathon",
      "Women's Heptathlon",
      "Men's 4 x 400m Relay",
      "Men's 400m Hurdles",
      "Men's Pole Vault",
      "Men's Triple Jump",
      "Men's 100m",
      "Men's 200m",
      "Men's 5000m",
      "Men's 4 x 100m Relay",
      "Men's 50km Race Walk",
      "Women's 20km Race Walk",
      "Women's Shot Put",
      "Women's Hammer Throw",
      "Men's 400m",
      "Men's Long Jump",
      "Women's Discus Throw",
      "Men's Javelin Throw",
      "Women's 400m",
      "Mixed 4 × 400m Relay",
      "Men's 10,000m",
      "Men's 3000m Steeplechase",
      "Women's 5000m",
      "Women's Long Jump",
      "Men's 1500m",
      "Women's 800m",
      "Women's 1500m",
      "Women's 4 x 100m Relay",
      "Women's Pole Vault",
      "Men's 20km Race Walk",
      "Men's 110m Hurdles",
      "Women's 100m",
      "Women's 200m",
      "Women's 100m Hurdles",
      "Women's 4 x 400m Relay",
      "Men's 800m",
      "Women's Marathon",
      "Women's 3000m Steeplechase",
      "Women's 400m Hurdles",
      "Men's Shot Put",
      "Men's Hammer Throw",
      "Women's Triple Jump"
    ],
    // "Basketball": [
    //   "Basketball, Men",
    //   "Basketball, Women"
    // ],
    // "Beach Volleyball": [
    //   "Beach Volleyball, Women",
    //   "Beach Volleyball, Men"
    // ],
    "Canoe Slalom": [
      "Kayak Singles, Slalom, Women",
      "Canadian Singles, Slalom, Women",
      "Kayak Singles, Slalom, Men",
      "Canadian Singles, Slalom, Men"
    ],
    "Canoe Sprint": [
      "Kayak Doubles, Men's 1000m",
      "Kayak Fours, Women's 500m",
      "Canadian Singles, Men's 1000m",
      "Canadian Singles, Women's 200m",
      "Canadian Doubles, Women's 500m",
      "Canadian Doubles, Men's 1000m",
      "Kayak Singles, Women's 200m",
      "Kayak Singles, Women's 500m",
      "Kayak Fours, Men's 500m",
      "Kayak Singles, Men's 200m",
      "Kayak Singles, Men's 1000m",
      "Kayak Doubles, Women's 500m"
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
    "Trampoline": [
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
      "Women",
      "Men"
    ],
    "Artistic Swimming": [
      "Duet, Women",
      "Women's Team"
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
      "Épée, Women's Team",
      "Foil, Men's Team",
      "Épée, Individual, Men",
      "Foil, Women's Team",
      "Sabre, Individual, Women",
      "Sabre, Women's Team",
      "Sabre, Individual, Men",
      "Sabre, Men's Team",
      "Épée, Men's Team",
      "Foil, Individual, Women"
    ],
    "Table Tennis": [
      "Singles, Men",
      "Men's Team",
      "Singles, Women",
      "Women's Team",
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
      "Men's Team",
      "Women's Team",
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
  }
}