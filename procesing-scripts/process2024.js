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

                // replace some things to match pre-2024 data
                country = (country == 'Hong Kong, China') ? 'Hong Kong' : country;

                // handle equestrian separately because both sport and sportEvent need adjustment
                if (sport == 'Equestrian') {
                    if (sportEvent == 'Jumping Team') {
                        sport = 'Equestrian Jumping';
                        sportEvent = 'Team, Open'
                    }

                    if (sportEvent == 'Jumping Individual') {
                        sport = 'Equestrian Jumping'
                        sportEvent = 'Individual, Open'

                    }
                }

                sportEvent = (sport == 'Archery' && sportEvent == "Men's Individual") ? 'Individual, Men' :
                    (sport == 'Archery' && sportEvent == "Women's Individual") ? 'Individual, Women' :
                    (sport == 'Archery' && sportEvent == "Mixed Team") ? 'Team, Mixed' :
                    (sport == 'Artistic Gymnastics' && sportEvent == "Women's Team") ? "Women's All-Around (Team)" :
                    (sport == 'Artistic Gymnastics' && sportEvent == "Women's All-Around") ? "Women's All-Around (Individual)" :
                    (sport == 'Artistic Gymnastics' && sportEvent == "Men's Team") ? "Men's All-Around (Team)" :
                    (sport == 'Artistic Gymnastics' && sportEvent == "Men's All-Around") ? "Men's All-Around (Individual)" :
                    // (sport == 'Boxing' && sportEvent == "Men's 51kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's 57kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's 63.5kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's 71kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's 80kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's 92kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Men's +92kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 50kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 54kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 57kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 60kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 66kg") ? '' : 
                    // (sport == 'Boxing' && sportEvent == "Women's 75kg") ? '' : 
  






                    (sportEvent == "Women's Team Pursuit") ? 'Team Pursuit, Women' :
                    (sportEvent == "Women's Synchronised 3m Springboard") ? 'Synchronized Springboard, Women' :
                    (sport == 'Golf' && sportEvent == "Men's Individual Stroke Play") ? 'Individual, Men' :
                    (sport == 'Golf' && sportEvent == "Women's Individual Stroke Play") ? 'Individual, Women' :
                    (sport == 'Rowing' && sportEvent == "Men's Four") ? 'Coxless Fours, Men' :
                    (sport == 'Rowing' && sportEvent == "Women's Four") ? 'Coxless Fours, Women' :
                    (sport == 'Rowing' && sportEvent == "Men's Eight") ? 'Eights, Men' :
                    (sport == 'Rowing' && sportEvent == "Women's Eight") ? 'Eights, Women' :
                    (sport == 'Sailing' && sportEvent == "Men's Skiff") ? 'Skiff, Men' :
                    (sport == 'Sailing' && sportEvent == "Women's Skiff") ? 'Skiff, Women' :
                    (sport == 'Badminton' && sportEvent == "Women's Doubles") ? 'Doubles, Women' :
                    (sport == 'Badminton' && sportEvent == "Men's Doubles") ? 'Doubles, Men' :
                    (sport == 'Badminton' && sportEvent == "Women's Singles") ? 'Singles, Women' :
                    (sport == 'Badminton' && sportEvent == "Men's Singles") ? 'Singles, Men' :
                    (sport == 'Badminton' && sportEvent == "Mixed Doubles") ? 'Doubles, Mixed' :
                    (sport == 'Badminton' && sportEvent == "Mixed Singles") ? 'Singles, Mixed' :
                    (sport == 'Canoe Sprint' && sportEvent == "Men's Canoe Double 500m") ? "Canadian Doubles, Men's 500m" :
                    (sport == 'Canoe Sprint' && sportEvent == "Women's Canoe Double 500m") ? "Canadian Doubles, Women's 500m" :
                    (sport == 'Canoe Sprint' && sportEvent == "Men's Canoe Single 1000m") ? "Canadian Singles, Men's 1000m" :
                    (sport == 'Canoe Sprint' && sportEvent == "Women's Canoe Single 200m") ? "Canadian Singles, Women's 200m" :
                    (sport == 'Diving' && sportEvent == "Women's 3m Springboard") ? 'Springboard, Women' :
                    (sport == 'Diving' && sportEvent == "Men's 3m Springboard") ? 'Springboard, Men' :
                    (sport == 'Diving' && sportEvent == "Women's 10m Platform") ? 'Platform, Women' :
                    (sport == 'Diving' && sportEvent == "Men's 10m Platform") ? 'Platform, Men' :
                    (sport == 'Diving' && sportEvent == "Men's Synchronised 3m Springboard") ? 'Synchronized Platform, Men' :
                    (sport == 'Diving' && sportEvent == "Women's Synchronised 3m Springboard") ? 'Synchronized Platform, Women' :
                    (sport == 'Diving' && sportEvent == "Women's Synchronised 3m Springboard") ? 'Synchronized Springboard, Women' :
                    (sport == 'Diving' && sportEvent == "Men's Synchronised 3m Springboard") ? 'Synchronized Springboard, Men' :
                    (sport == 'Shooting' && sportEvent == 'Trap Men') ? 'Trap, Men' :
                    (sport == 'Shooting' && sportEvent == 'Trap Women') ? 'Trap, Women' :
                    (sport == 'Shooting' && sportEvent == 'Air Pistol, 10 metres, Team, Mixed') ? '10m Air Pistol Mixed Team' :
                    (sport == 'Tennis' && sportEvent == "Women's Doubles") ? 'Doubles, Women' :
                    (sport == 'Tennis' && sportEvent == "Men's Doubles") ? 'Doubles, Men' :
                    (sport == 'Tennis' && sportEvent == "Women's Singles") ? 'Singles, Women' :
                    (sport == 'Tennis' && sportEvent == "Men's Singles") ? 'Singles, Men' :
                    (sport == 'Tennis' && sportEvent == "Mixed Doubles") ? 'Doubles, Mixed' :
                    (sport == 'Rhythmic Gymnastics' && sportEvent == 'Individual All-Around') ? 'Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Sabre Individual") ? 'Sabre, Individual, Men' :
                    (sport == 'Fencing' && sportEvent == "Women's Sabre Individual") ? 'Sabre, Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Foil Individual") ? 'Foil, Individual, Men' :
                    (sport == 'Fencing' && sportEvent == "Women's Foil Individual") ? 'Foil, Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Foil Team") ? 'Foil, Team, Men' :
                    (sport == 'Fencing' && sportEvent == "Women's Foil Team") ? 'Foil, Team, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Épée Individual") ? 'Épée, Individual, Men' :
                    (sport == 'Fencing' && sportEvent == "Women's Épée Individual") ? 'Épée, Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Women's Épée Team") ? 'Épée, Team, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Épée Team") ? 'Épée, Team, Men' :
                    (sport == 'Fencing' && sportEvent == "Men's Sabre Team") ? 'Sabre, Team, Men' :
                    (sport == 'Fencing' && sportEvent == "Men's Sabre Individual") ? 'Sabre, Individual, Men' :
                    (sport == 'Fencing' && sportEvent == "Women's Sabre Team") ? 'Sabre, Team, Women' :
                    (sport == 'Fencing' && sportEvent == "Women's Sabre Individual") ? 'Sabre, Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Women's Foil Individual") ? 'Foil, Individual, Women' :
                    (sport == 'Fencing' && sportEvent == "Women's Foil Team") ? 'Foil, Team, Women' :
                    (sport == 'Fencing' && sportEvent == "Men's Foil Individual") ? 'Foil, Individual, Men' :
                    (sport == 'Fencing' && sportEvent == "Men's Foil Team") ? 'Foil, Team, Women' :
                    (sport == 'Table Tennis' && sportEvent == "Men's Singles") ? 'Singles, Men' :
                    (sport == 'Table Tennis' && sportEvent == "Women's Singles") ? 'Singles, Women' :
                    (sport == 'Table Tennis' && sportEvent == "Men's Doubles") ? 'Doubles, Men' :
                    (sport == 'Table Tennis' && sportEvent == "Mixed Doubles") ? 'Doubles, Mixed' :
                    (sport == 'Table Tennis' && sportEvent == "Women's Doubles") ? 'Doubles, Women' :
                    (sport == 'Tennis' && sportEvent == "Men's Singles") ? 'Singles, Men' :
                    (sport == 'Tennis' && sportEvent == "Women's Singles") ? 'Singles, Women' :
                    (sport == 'Tennis' && sportEvent == "Men's Doubles") ? 'Doubles, Men' :
                    (sport == 'Tennis' && sportEvent == "Mixed Doubles") ? 'Doubles, Mixed' :
                    (sport == 'Tennis' && sportEvent == "Women's Doubles") ? 'Doubles, Women' :
                    ((sport == 'Trampoline' || sport == 'Trampoline Gymnastics') && sportEvent == 'Men') ? 'Individual, Men' :
                    ((sport == 'Trampoline' || sport == 'Trampoline Gymnastics') && sportEvent == 'Women') ? 'Individual, Women' :
                    (sport == 'Triathlon' && sportEvent == 'Mixed Relay') ? 'Relay, Mixed' :
                    (sport == 'Judo' && sportEvent == 'Women -48 kg') ? 'Extra-Lightweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women -52 kg') ? 'Half-Lightweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women -57 kg') ? 'Lightweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women -63 kg') ? 'Half-Middleweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women -70 kg') ? 'Middleweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women -78 kg') ? 'Half-Heavyweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Women +78 kg') ? 'Heavyweight, Women' :
                    (sport == 'Judo' && sportEvent == 'Men -60 kg') ? 'Extra-Lightweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men -66 kg') ? 'Half-Lightweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men -73 kg') ? 'Lightweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men -81 kg') ? 'Half-Middleweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men -90 kg') ? 'Middleweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men -100 kg') ? 'Half-Heavyweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Men +100 kg') ? 'Heavyweight, Men' :
                    (sport == 'Judo' && sportEvent == 'Mixed Team') ? 'Team, Mixed' :



                    (sportEvent == '4 x 400m Relay Mixed') ? 'Mixed 4 x 400m Relay Mixed' :
                    (sportEvent == "Women's Individual Time Trial") ? 'Individual Time Trial, Women' :
                    (sportEvent == "Men's Individual Time Trial") ? 'Individual Time Trial, Men' :
                    (sportEvent == "Skeet Women") ? 'Skeet, Women' :
                    (sportEvent == "Skeet Mixed Team") ? 'Skeet, Mixed' :
                    (sportEvent == "Skeet Men") ? 'Skeet, Men' :
                    sportEvent;

                    sport = (sport == 'Trampoline Gymnastics') ? 'Trampoline' : sport;








                let row = [country, medalType, "2024", sport, sportEvent, athlete];
                csvArr.push(row);
            });
        });
    }

    // Convert array to CSV format
    const csvContent = csvArr.map(row => row.map(escapeCsvField).join(',')).join('\n');

    // Write CSV to file
    writeFile('2024new.csv', csvContent, 'utf8', (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('CSV file has been saved.');
        }
    });

    writeFile('last-updated.txt', timeGenerated, 'utf8', (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('last-updated.txt has been saved');
        }
    });
});

function escapeCsvField(field) {
    if (field.includes('"')) {
        field = field.replace(/"/g, '""'); // escape double quotes
    }
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
        field = `"${field}"`; // encapsulate field in double quotes
    }
    return field;
}