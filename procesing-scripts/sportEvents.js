// was used to generate object where each sport is key and its values are objects
// of relevant events, containing relevant years

// object now found in $lib/utils/exports.js exported as sportEvents

export function makeSportEventObj(data) {
    data = data.post;
    
    let sportObj = {};

    data.forEach(([country,medal,year,sport,sportEvent,athlete,source]) => {
        
        // initialize sport if not present in newObj
        if (!sportObj[sport]) {
            sportObj[sport] = {};
        }

        // initialize even if not present for current sport
        if (!sportObj[sport][sportEvent]) {
            sportObj[sport][sportEvent] = []
        }

        // if year is not present under this sportEvent, add it
        if (!sportObj[sport][sportEvent].includes(year)) {
            sportObj[sport][sportEvent].push(year)
        }
    })
    console.log(sportObj);
    return sportObj;

}