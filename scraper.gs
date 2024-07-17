/* 
This script runs in Google Apps Script, attached to a specific spreadsheet I used to store data. it does rely on manually changing country codes for each rerun (to avoid timing out).
It could have been further automated but got the job I needed done. 
*/

function loopPages() {
  let countries = {
    'ROU': [1, 62] // note: I manually changed the country codes as I went.
  }

  for (country in countries) {
    // NOTE: no error is thrown for skipped years. just won't show up if the page exists. if page does not exist, error will throw.
    let startPage = countries[country][0] // first page to scrape
    let lastPage = countries[country][1] // last page number to scrape

    let excludedPages = [4, 27, 28, 48, 50]
    /*
    reasons for exclusions:
    editions/4: intercalated games of 1906
    editions/27 and editions/28 seem not to exist
    editions/48 was equestrian
    editions/50 was 1916 olympics which were never held
    */

    // loop through each page. for example, pages 1 through 62 for USA
    for (let i = startPage; i <= lastPage; i++) {
      // if i is not included in excludedPages, scrape its associated link
      if (!excludedPages.includes(i)) {
      let link = `https://www.olympedia.org/countries/${country}/editions/${i}`
      scrape(link);
      }
      

    }
  }
}

function scrape(link) {
  // connect to sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('scrape');

  // use cheerio library to extract table from link
  var xml = UrlFetchApp.fetch(link).getContentText();
  var $ = Cheerio.load(xml);

  // get header to extract country and year
  let h1 = $('h1').text();
  let country = '';
  let year = '';
  const regex = /^(.+) at the (\d{4}) (Summer|Winter) Olympics$/;
  const match = h1.match(regex);
  if (match) {
    country = match[1];
    year = match[2];
  } else {
    Logger.log(`No match found on ${link}.`);
  }

  // extract table data into array
  let data = [];
  $("table > tbody > tr").each((index, element) => {
    var row = [];

    // check if the row contains <h2> element
    if ($(element).find("h2").length > 0) {
      // if so, make current category (which is the sport)
      currentCategory = $(element).find("h2").text().trim();
    } else {
      // extract row data
      $(element).find("td").each((index, child) => {
        row.push($(child).text().trim());
      });

      // if first cell is not empty, update currentEvent
      if (row[0] !== "") {
        currentEvent = row[0];
      } else {
        // otherwise use the currentEvent
        row[0] = currentEvent;
      }

      // check if row contains 'Bronze', 'Silver', or 'Gold'
      // NOTE this also will include rows where athlete's last name includes this, such as Goldman. filter out in sheet.
      if (row.some(cell => cell.includes('Bronze') || cell.includes('Silver') || cell.includes('Gold'))) {
        if (row.length > 0) {
          // Add the category, country, and year to the row
          row.unshift(currentCategory);
          row.unshift(country);
          row.unshift(year);
          row.unshift(link);
          data.push(row);
        }
      }
    }
  });

  for (var i = 0; i < data.length; i++) {
    sheet.appendRow(data[i]);
  }
}
