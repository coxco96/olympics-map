<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";

    // historic base maps
    import { geojsons } from "$lib/geojsons/basemaps.js";

    // array of basemap years included in geojsons
    // TODO: get rid of this and just make a list of geojsons keys
    import { baseMapYears } from "$lib/utils/exports.js";

    // full dataset by country
    export let dataObj;

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
    } from "$lib/stores/filters.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year, sport, sportEvent, container, map, tooltipContent;
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    let featureStateId = "feature-state-layer";

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));

    /* DISPLAY CORRECT HISTORIC BASE MAP BASED ON YEAR */

    // return the most recent basemap year
    const getBaseMapYear = (selection) => {
        for (let i = baseMapYears.length - 1; i >= 0; i--) {
            if (selection >= baseMapYears[i]) {
                return baseMapYears[i].toString();
            }
        }
        return baseMapYears[0].toString(); // return the first year if selection is less than the smallest year
    };
    // get numeric form of year
    $: numericyear = Number(year.substring(0, 4));

    // if all years are selected, use basemap from year 2000
    // otherwise, get the right baseMapYear
    $: baseMapYear = isNaN(numericyear) ? 2000 : getBaseMapYear(numericyear);

    onMount(async () => {
        /* INITIALIZE MAP */
        map = new maplibregl.Map({
            container: container,
            center: [0, 0],
            zoom: 1,
        });

        /* ADD INITIAL GEOJSON LAYER */
        addGeoJsonLayer(baseMapYear);

        // setPaint();

        // let featureStateId = null;

        map.setFeatureState({
            source: geojsonLayerId,
            id: featureStateId,
        });

        /* HOVER EFFECT LAYER */
        // map.addLayer({
        //     id: hoverLayerId,
        //     type: "fill",
        //     source: geojsonLayerId,
        //     layout: {},
        //     paint: {
        //         "fill-color": "#627BC1",
        //         "fill-opacity": 0.75,
        //     },
        //     filter: ["==", "NAME", ""], // initially set to no country
        // });

        /* TOOLTIP */

        // initialize
        // const tooltip = new maplibregl.Popup({
        //     closeButton: false,
        //     closeOnClick: false,
        // });

        // on mousemove, display tooltip
        map.on("mousemove", geojsonLayerId, (e) => {
            // change cursor type as ui indicator
            map.getCanvas().style.cursor = "pointer";

            // if mouse is on a feature, get & display its data
            if (e.features && e.features[0]) {
                let country = e.features[0].properties.NAME;
                // get filtered data only
                // let countryData = getRelevantCountryData(dataObj[country]);

                // if map is zoomed out so multiple copies of feature are visible, only show tooltip once
                let coords = e.features[0].geometry.coordinates.slice();
                while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
                    coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
                }

                // if (country) {
                //     // only show data for currently selected year
                //     let filteredData = countryData.filter(
                //         (d) => d.year === year,
                //     );
                //     if (filteredData.length > 0) {
                //         tooltipContent = `<strong>${country}</strong>`;
                //         filteredData.forEach((d) => {
                //             tooltipContent += `
                //     <p>
                //                 Medal: ${d.medal}<br>
                //                 Year: ${d.year}<br>
                //                 Sport: ${d.sport}<br>
                //                 Event: ${d.sportEvent}<br>
                //                 Athlete: ${d.athlete}<br>
                //     </p>
                //     `;
                //         });
                //         tooltip
                //             .setLngLat([e.lngLat.lng, e.lngLat.lat])
                //             .setHTML(tooltipContent)
                //             .addTo(map);
                //     } else {
                //         tooltip.remove();
                //     }
                // } else {
                //     tooltip.remove();
                // }

                // map.setFilter("hover-layer", ["==", "NAME", country]);
            } else {
                // tooltip.remove();
                // map.setFilter("hover-layer", ["==", "NAME", ""]);
            }
        });

        map.on("mouseleave", geojsonLayerId, () => {
            map.getCanvas().style.cursor = "";
            // tooltip.remove();
            // map.setFilter("hover-layer", ["==", "NAME", ""]);
        });
    });

    // if map already is all initialized etc, and baseMapYear updates,
    // update the map to that basemap
    $: if (
        map &&
        map.isStyleLoaded() &&
        geojsons[baseMapYear] &&
        ((year && sport && sportEvent) || (year && sport) || year)
    ) {
        updateGeoJsonLayer(baseMapYear);
        // updatePaint();
        updateFeatureStates(map);
    }

    // $: if (map && map.isStyleLoaded() && year && dataObj) {
    //     // updateDataLayer(relevantData);
    //     map.triggerRepaint();
    //     console.log(year);
    // }

    /* FUNCTIONS */

    function getRelevantCountryData(data) {
        // filter data by year, sport and event
        let filteredData = data.filter((row) => {
            let matchesYear = year ? row["year"] === year : true;
            let matchesSport = sport ? row["sport"] === sport : true;
            let matchestEvent = sportEvent
                ? row["sportEvent"] === sportEvent
                : true;
            return matchesYear && matchesSport && matchestEvent;
        });
        return filteredData;
    }

    function addGeoJsonLayer(year) {
        if (geojsons[year]) {
            map.addSource(geojsonLayerId, {
                type: "geojson",
                data: geojsons[year],
                generateId: true, // in order to use feature states
            });

            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: {
                    "fill-color": [
                        "case",
                        ["==", ["feature-state", "color"], "high"],
                        "#00f", // blue for high
                        ["==", ["feature-state", "color"], "low"],
                        "#ccc", // gray for low 
                        "#000", // default black
                    ],
                    "fill-opacity": 0.8,
                },
            });
        }
    }

    function updateFeatureStates(map) {
        let features = map.querySourceFeatures(geojsonLayerId);
        features.forEach((feature) => {
            let pointsTotal = 0; // to get points totals based on medal type and count
            let medalType;
            let featureId = feature.id;
            let opacityLevel;
            let country;
            if (feature.properties.NAME) {
                country = feature.properties.NAME;
            }

            // if the country exists in the data, filter it to what's relevant to the year, sport and event
            let relevant;
            if (dataObj[country]) {
                relevant = getRelevantCountryData(dataObj[country]);
                if (relevant.length > 0) {
                    relevant.forEach((win) => {
                        // console.log(win.medal);
                        medalType = win.medal;

                        // assign points total based on medals
                        pointsTotal +=
                            medalType === "Bronze"
                                ? 1
                                : medalType === "Silver"
                                  ? 2
                                  : medalType === "Gold"
                                    ? 3
                                    : 0;
                    });
                    console.log(country, pointsTotal)
                }
            }
            if (pointsTotal == 0) {
                opacityLevel = "low";
            } else {
                opacityLevel = "high";
            }

            map.setFeatureState(
                { source: geojsonLayerId, id: featureId },
                { color: opacityLevel },
            );
        });
    }

    // update to different basemap if different year is selected
    function updateGeoJsonLayer(year) {
        if (map.getSource(geojsonLayerId)) {
            map.getSource(geojsonLayerId).setData(geojsons[year]);
        } else {
            addGeoJsonLayer(year);
        }
    }
</script>

<div bind:this={container} id="map" />

<style>
    /* TODO: make pointer just regular unless over a country */
    #map {
        height: 600px;
        width: 100%;
    }
</style>
