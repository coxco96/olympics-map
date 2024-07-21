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


export const baseMapYears = [1880, 1900, 1914, 1920, 1938, 1945, 1960, 1994, 2000];

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