# The Olympics Map
This interactive map of Olympic medals — filterable by sport, event and year since 1896 — is currently a passion project. <3
I plan to improve it and build it out over time.

## URL
- Check it out at [olympicsmap.com](https://olympicsmap.com)!

## Data Sources
- Historic boundary maps are sourced from [@aourednik on Github](https://github.com/aourednik/historical-basemaps/tree/master).
- I created the dataset that powers this map by web scraping from Olympedia (1896-2022 games) and using data from the Olympic Games site (2024 games only).
- The underlying dataset is in a private Google Sheet, which the app connects to on initial load.

## To-Dos
- Set up 2026 data slots
- Figure out how to keep data updated during 2026 winter Olympics (API endpoints too expensive; see if possible to discern patterns to write a web scraper prior to start of events)
- Add winter Olympics host location
- Fix legend gradient
- Add country name to host city tooltip
- Work through data caveats (listed on info page)
- Debug the Switzerland issue
- Add icons for winter vs. summer in the year filter dropdown
- Add a loading bar
- Add some sort of animation when you hover over Map/Table (whichever is not already selected)
- Display table if JavaScript is disabled
- Switch to Map View if navbar title is selected while in Table View
- Declutter mobile interface (maybe move legend above or below map)
- More screen reader testing
- Possibly map *all* host cities when all years are displayed
- Possibly replace pink dot following title with trophy icon
- Double check h1/navbar accessibility issue
- Update social preview image
- Look further into search optimization and use Google Trends to identify strong metadata keywords
- Change 'no medals' color to something easier to differentiate when some countries are light gray
- Change 'no medals' icon so it has more contrast against white background box + so it doesn't look like a marker symbol
- Fiddle with hover glow effect. (Not yet sure what I want it to be, but it doesn't yet feel quite right.)
- Consider using hover effect in the color of that year's Olympics color theme (for filtered years)
- Consider higher contrast host city marker
- Redesign legend so it is more immediately clear that medal count is being mapped
- Test various gold/silver/bronze weights (current weights: gold=4, silver=3, bronze=2)
- Add an intro/about/guide on the info page
- Change info page routing from 'notes' to 'info'
- Reset filters if navbar title is clicked from Map View
- Darken Github & Info icons just a bit
- Address package vulnerabilities
- Improve tooltip design (especially G/S/B)
- Shift center so Russia does not show on lefthand side of map
- Adjust top/bottom margin/padding around "Medal type is weighted by type."
- If you filter by sport, then event, then change the sport, Event box shows no text but should revert to 'All Events'
- Disable EventsFilter dropdown is no sport is selected
- Add country flags in tooltips and table
- Add ko-fi link in navbar
- Adjust bounding box so not as much up/down drag is allowed
- Redesign map tooltip so that when country name and team name differ, it is clearer what is meant (example: compare Russia's tooltip between 2006 > Alpine Skiing and 2006 > Bobsleigh
- When a specific year, sport and event have all been selected, it should be easier to see the ranking among the max 3 countries
- Look into keeping the data local to the repo rather than connecting to a Google Sheet (to save time on initial load)

## Eventual Goals
- Migrate to Svelte 5
- Set up dependabot 
- Migrate from JavaScript to Typescript
- Migrate from Maplibre to d3 (for a non-mercator projection)
- Create dropdowns in Table View with athlete info, year, sport & event (for non-filtered metrics)
- Create dynamic page for each country with historic overview
- A/B test Map View vs. Table View on initial load
- Add URL params for filters (e.g. olympicsmap.com?/year=2004&sport=artisticgymnastics&event=mensvault)
- Add icons for each sport in Sports filter


