<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";

    // historic base maps
    // TODO: get rid of this and just make a list of geojsons keys
    import { geojsons } from "$lib/geojsons/basemaps.js";

    // function to get baseMapYear and paint obj for data styling
    import { getBaseMapYear, paint } from "$lib/utils/exports.js";

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
        filteredDataStore,
    } from "$lib/utils/stores.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year, sport, sportEvent, container, map, tooltipContent, filteredData;
    let sourceIsLoaded = false;
    // to avoid running reactive statements on initial load
    let isFeatureStateFirstRun = true;
    let isBaseMapFirstRun = true; 
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    // let featureStateId = "feature-state-layer";

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    $: filteredDataStore.subscribe((value) => (filteredData = value));

    /* DISPLAY CORRECT HISTORIC BASE MAP BASED ON YEAR */

    // get numeric form of year
    $: numericyear = Number(year.substring(0, 4));

    // if all years are selected, use basemap from year 2000
    // otherwise, get the right baseMapYear
    $: baseMapYear = isNaN(numericyear) ? "2000" : getBaseMapYear(numericyear);
    $: mapExists = map ? true : false;
    $: console.log(`does the map exist? ${mapExists}`);

    // update baseMap after initial load if year if changed
    // TODO: make this only run if the baseMapYear changes in a way that 
    // will actually change the base map
    $: if (mapExists && geojsons[baseMapYear]) {
        if (!isBaseMapFirstRun) {
            updateGeojsonSource();
        }
        isBaseMapFirstRun = false;
    }

    // if map exists and filteredData changes, update feature states
    // except for the first time the trigger is fired (to avoid unnecessarily running)
    // if filteredData changes AFTER mount
    $: if (mapExists && filteredData) {
        if (!isFeatureStateFirstRun) {
            setFeatureStates();
        }
        isFeatureStateFirstRun = false;
    }

    /* INITIALIZE MAP, SOURCE, LAYER AND FEATURE-STATES ON INITIAL COMPONENT MOUNT */

    onMount(async () => {
        console.log("in onMount");

        /* INITIALIZE MAP */
        map = new maplibregl.Map({
            container: container,
            center: [0, 0],
            zoom: 1,
        });

        // add source and layer
        if (filteredData) {
            addGeojsonSource();
            addGeojsonLayer();
        } else {
            console.log("error. no filteredData");
        }

        // once source and layer have been added:
        map.on("load", () => {
            console.log("map loaded");
            // if source is loaded, loop through each feature to setFeatureStates
            sourceIsLoaded = isSourceLoaded() ? true : false;
            if (sourceIsLoaded) {
                console.log("source is loaded");
                setFeatureStates(); // set feature states for styling
            } else {
                console.log("error. source is not loaded.");
            }
        }); // end of map.on("load" ... )

        /* HOVER EFFECT LAYER */
        // map.addLayer({
        //     id: hoverLayerId,
        //     type: "line",
        //     source: geojsonLayerId,
        //     layout: {},
        //     paint: {
        //         "line-color": "white",
        //         "line-width": 2,
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
        // map.on("mousemove", geojsonLayerId, (e) => {
        //     // change cursor type as ui indicator
        //     map.getCanvas().style.cursor = "pointer";

        //     // if mouse is on a feature, get & display its data
        //     if (e.features && e.features[0].properties.NAME) {
        //         let country = e.features[0].properties.NAME;
        //         // get filtered data only
        //         // let countryData
        //         // if (dataObj[country]) {
        //         //     countryData = getRelevantCountryData(dataObj[country]);
        //         // }

        //         // if map is zoomed out so multiple copies of feature are visible, only show tooltip once
        //         // let coords = e.features[0].geometry.coordinates.slice();
        //         // while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
        //         //     coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
        //         // }

        //         // if (country) {
        //         //     // only show data for currently selected year
        //         //     let filteredData = countryData.filter(
        //         //         (d) => d.year === year,
        //         //     );
        //         //     if (filteredData.length > 0) {
        //         //         tooltipContent = `<strong>${country}</strong>`;
        //         //         filteredData.forEach((d) => {
        //         //             tooltipContent += `
        //         //     <p>
        //         //                 Medal: ${d.medal}<br>
        //         //                 Year: ${d.year}<br>
        //         //                 Sport: ${d.sport}<br>
        //         //                 Event: ${d.sportEvent}<br>
        //         //                 Athlete: ${d.athlete}<br>
        //         //     </p>
        //         //     `;
        //         //         });
        //         //         tooltip
        //         //             .setLngLat([e.lngLat.lng, e.lngLat.lat])
        //         //             .setHTML(tooltipContent)
        //         //             .addTo(map);
        //         //     } else {
        //         //         tooltip.remove();
        //         //     }
        //         // } else {
        //         //     tooltip.remove();
        //         // }

        //         // map.setFilter("hover-layer", ["==", "NAME", country]);
        //     } else {
        //         // tooltip.remove();
        //         // map.setFilter("hover-layer", ["==", "NAME", ""]);
        //     }
        // });

        // map.on("mouseleave", geojsonLayerId, () => {
        //     map.getCanvas().style.cursor = "";
        //     // tooltip.remove();
        //     map.setFilter("hover-layer", ["==", "NAME", ""]);
        // });
        console.log("end of onMount");
    }); // end onMOunt

    // if map already is all initialized etc, and baseMapYear updates,
    // update the map to that basemap
    // $: if (
    //     map &&
    //     map.isStyleLoaded() &&
    //     geojsons[baseMapYear] &&
    //     ((year && sport && sportEvent) || (year && sport) || year)
    // ) {
    //     updategeojsonLayer(baseMapYear);
    //     // updateFeatureStates(map);
    // }

    /* FUNCTIONS */

    function addGeojsonSource() {
        if (geojsons[baseMapYear]) {
            map.addSource(geojsonLayerId, {
                type: "geojson",
                data: geojsons[baseMapYear],
                generateId: true, // in order to use feature states
            });
        } else {
            console.log("error. no geojsons[baseMapYear]");
        }
        console.log("end of addGeojsonSource()");
    }

    function updateGeojsonSource() {
        // if source already exists, set with correct basemap
        if (map.getSource(geojsonLayerId)) {
            console.log(
                "source already exists. resetting data with new baseMapYear.",
            );
            map.getSource(geojsonLayerId).setData(geojsons[baseMapYear]);
        } else {
            console.log("source did not exist. adding now. (line 219)");
            addGeojsonSource();
        }
    }

    function addGeojsonLayer() {
        if (geojsons[baseMapYear]) {
            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: paint,
            });
        } else {
            console.log("error. no geojsons[year]");
        }
        console.log("end of addGeojsonLayer");
    }

    function setFeatureStates() {
        // intialize for features iteration
        let pointsTotal, featureId, countryName;

        // access geojson data with id generated on addSource
        let features = map.querySourceFeatures(geojsonLayerId);

        // set feature state for each feature based on pointsTotal
        features.forEach((feature) => {
            featureId = feature.id;
            countryName = feature.properties.NAME;
            pointsTotal = getPointsTotal(countryName);
            map.setFeatureState(
                { source: geojsonLayerId, id: featureId },
                { pointsTotal: pointsTotal },
            );
        });
    }

    // get points totals for color weighting
    function getPointsTotal(countryName) {
        let pointsTotal = 0;
        let countryData = filteredData[countryName];
        if (countryData) {
            countryData.forEach((row) => {
                // destructure row object to access medal
                const { medal } = row;
                // count medals
                if (medal === "Gold") {
                    pointsTotal += 3;
                } else if (medal === "Silver") {
                    pointsTotal += 2;
                } else if (medal === "Bronze") {
                    pointsTotal += 1;
                }
            });
        }
        return pointsTotal;
    }

    // check if geojson source is loaded
    function isSourceLoaded() {
        if (map && map.isStyleLoaded() && map.getSource(geojsonLayerId)) {
            return true;
        } else {
            return false;
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
