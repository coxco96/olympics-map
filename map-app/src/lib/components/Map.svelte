<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    // import {geojsons} from '$lib/geojsons/basemaps.js';

    // historic base maps
    // import {world1880} from '$lib/geojsons/world-1880.js';
    import {world1880} from '$lib/geojsons/world-1880.js';
    import {world1900} from '$lib/geojsons/world-1900.js';
    import {world1914} from '$lib/geojsons/world-1914.js';
    import {world1920} from '$lib/geojsons/world-1920.js';
    import {world1930} from '$lib/geojsons/world-1930.js';
    import {world1938} from '$lib/geojsons/world-1938.js';
    import {world1945} from '$lib/geojsons/world-1945.js';
    import {world1960} from '$lib/geojsons/world-1960.js';
    import {world1994} from '$lib/geojsons/world-1994.js';
    // import {world2000} from '$lib/geojsons/world-2000.js';

    // store in object for easy access to historic basemaps
    const geojsons = {
        1880: world1880,
        1900: world1900,
        1914: world1914,
        1920: world1920,
        1930: world1930,
        1938: world1938,
        1945: world1945,
        1960: world1960,
        1994: world1994,
        2000: world1880
    }
    

    // function to get baseMapYear and paint obj for data styling
    import {
        getBaseMapYear,
        makePaint,
        makeTooltipString,
    } from "$lib/utils/exports.js";

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
        filteredDataStore,
        pointsTotalStore,
    } from "$lib/utils/stores.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year, sport, sportEvent, container, map, tooltipContent, filteredData;
    let sourceIsLoaded = false;
    // to avoid running reactive statements on initial load
    let isFeatureStateFirstRun = true;
    let isBaseMapFirstRun = true;
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    let pointsTotalArr;
    // let featureStateId = "feature-state-layer";

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    // TODO / question: why are these not reactive?
    selectedYear.subscribe(
        (value) => (year = value || "All years (1896-2024)"),
    );
    selectedSport.subscribe((value) => (sport = value || "All sports"));
    selectedEvent.subscribe((value) => (sportEvent = value || "All events"));
    filteredDataStore.subscribe((value) => (filteredData = value));

    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));
    $: console.log(pointsTotalArr);

    let isFirstPaint = true;
    $: if (pointsTotalArr && map) {
        // if not first load, repaint the map.
        if (!isFirstPaint) {
            setFeatureStates();
        }
        isFirstPaint = false;
    }

    /* DISPLAY CORRECT HISTORIC BASE MAP BASED ON YEAR */

    // get numeric form of year
    $: numericyear = Number(year.substring(0, 4));

    // if all years are selected, use basemap from year 2000
    // otherwise, get the right baseMapYear
    $: baseMapYear = isNaN(numericyear) ? "2000" : getBaseMapYear(numericyear);

    // update baseMap after initial load if year if changed
    // TODO: make this only run if the baseMapYear changes in a way that
    // will actually change the base map
    $: if (map && geojsons[baseMapYear]) {
        if (!isBaseMapFirstRun) {
            updateGeojsonSource();
        }
        isBaseMapFirstRun = false;
    }

    // if map exists and filteredData changes, update feature states
    // except for the first time the trigger is fired (to avoid unnecessarily running)
    // if filteredData changes AFTER mount
    $: if (map && filteredData) {
        if (!isFeatureStateFirstRun) {
            setFeatureStates();
        }
        isFeatureStateFirstRun = false;
    }

    /* INITIALIZE MAP, SOURCE, LAYER AND FEATURE-STATES ON INITIAL COMPONENT MOUNT */

    onMount(async () => {
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

        // add hover effect layer
        map.addLayer({
            id: hoverLayerId,
            type: "line",
            source: geojsonLayerId,
            layout: {},
            paint: {
                "line-color": "white",
                "line-width": 2,
            },
            filter: ["==", "NAME", ""], // initially set to no country
        });

        // once source and layer have been added:
        map.on("load", () => {
            // if source is loaded, loop through each feature to setFeatureStates
            sourceIsLoaded = isSourceLoaded() ? true : false;
            if (sourceIsLoaded) {
                setFeatureStates(); // set feature states for styling
            } else {
                console.log("error. source is not loaded.");
            }
        }); // end of map.on("load" ... )

        // initialize tooltip
        const tooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        // on mousemove, display tooltip
        map.on("mousemove", geojsonLayerId, (e) => {
            // if map is zoomed out so multiple copies of feature are visible, only show tooltip once
            let coords = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
                coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
            }

            // change cursor type as ui indicator
            map.getCanvas().style.cursor = "pointer";

            // if mouse is on a named feature, get & display its data
            if (e.features && e.features[0].properties.NAME) {
                let country = e.features[0].properties.NAME;
                let olympicTeam = e.features[0].properties["OLYMPIC_TEAM"]
                    ? e.features[0].properties["OLYMPIC_TEAM"]
                    : "";
                if (filteredData[country]) {
                    tooltipContent = makeTooltipString(
                        country,
                        filteredData[country],
                        olympicTeam,
                    );
                } else if (filteredData[olympicTeam]) {
                    tooltipContent = makeTooltipString(country, filteredData[olympicTeam], olympicTeam)
                } else {
                    tooltipContent = `${country}<br>${olympicTeam}`;
                }

                tooltip
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(tooltipContent)
                    .addTo(map);
                map.setFilter("hover-layer", ["==", "NAME", country]);
            } else {
                tooltip.remove();
                map.setFilter("hover-layer", ["==", "NAME", ""]);
            }
        });

        map.on("mouseleave", geojsonLayerId, () => {
            map.getCanvas().style.cursor = "";
            tooltip.remove();
            map.setFilter("hover-layer", ["==", "NAME", ""]);
        });
    }); // end onMOunt

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
    }

    function updateGeojsonSource() {
        // if source already exists, set with correct basemap
        if (map.getSource(geojsonLayerId)) {
            map.getSource(geojsonLayerId).setData(geojsons[baseMapYear]);
        } else {
            addGeojsonSource();
        }
    }

    function addGeojsonLayer() {
        if (geojsons[baseMapYear]) {
            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: makePaint(pointsTotalArr),
            });
        } else {
            console.log("error. no geojsons[year]");
        }
    }

    function setFeatureStates() {
        // intialize for features iteration
        let pointsTotal, featureId, countryName, olympicTeam;

        // access geojson data with id generated on addSource
        let features = map.querySourceFeatures(geojsonLayerId);

        // initialize to get min and max pointsTotal for paint (so darkest blue is max and lighest is min)
        let min = 0;
        let max = 0;

        // set feature state for each feature based on pointsTotal
        features.forEach((feature) => {
            featureId = feature.id;
            countryName = feature.properties.NAME;
            olympicTeam = feature.properties["OLYMPIC_TEAM"]
                ? feature.properties["OLYMPIC_TEAM"]
                : undefined;
            pointsTotal = getPointsTotal(countryName, olympicTeam);
            // get min and max pointTotals (excluding 0)
            max = pointsTotal > max ? pointsTotal : max;
            if (min == 0) {
                min = pointsTotal;
            } else if (pointsTotal != 0) {
                min = pointsTotal < min ? pointsTotal : min;
            }
            map.setFeatureState(
                { source: geojsonLayerId, id: featureId },
                { pointsTotal: pointsTotal },
            );
        });
        // need to somehow pass these values to addGeoJsonLayer
        // OR actually... better to save these as a store so
        // can be used to color Table, too?
        console.log(`min: ${min}, max: ${max}`);
    }

    // get points totals for color weighting
    function getPointsTotal(countryName, olympicTeam) {
        let countryData;

        let pointsTotal = 0;

        // if olympicTeam is defined, then the team name 
        // doesn't match the country name
        if (olympicTeam) {
            countryData = filteredData[olympicTeam];
        } else {
            countryData = filteredData[countryName]
        }

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
