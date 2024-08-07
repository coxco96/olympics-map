// NOTE to update data2024.json, copy/paste what's in script id="__NO_DATA__" from:https://olympics.com/en/paris-2024/medals 

import {
    readFile,
    writeFile
} from 'fs';


// Read JSON file
readFile('data2024.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    
    // Parse JSON data
    let jsonData = JSON.parse(data);
    let pageProps = jsonData.props.pageProps;
    let csvArr = [];
    let timeGenerated = pageProps.generatedAt;
    let medalsTable = pageProps.initialMedals.medalStandings.medalsTable;

    // Process data
    for (let each of medalsTable) {
        let country = each.description;
        let disciplines = each.disciplines;

        disciplines.forEach(discipline => {
            let sport = discipline.name;
            discipline.medalWinners.forEach(obj => {
                let athlete = obj.competitorDisplayName;
                let sportEvent = obj.eventDescription;
                let medalType = obj.medalType == 'ME_BRONZE' ? 'Bronze' : obj.medalType == 'ME_SILVER' ? 'Silver' : obj.medalType == 'ME_GOLD' ? 'Gold' : 'error?';
                let row = [country, medalType, "2024", sport, sportEvent, athlete];
                csvArr.push(row);
            });
        });
    }

    // Convert array to CSV format
    const csvContent = csvArr.map(row => row.join(',')).join('\n');
    
    // Write CSV to file
    writeFile('2024new.csv', csvContent, 'utf8', (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('CSV file has been saved.');
        }
    });
});
