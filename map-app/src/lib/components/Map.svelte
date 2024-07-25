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
    import { getBaseMapYear, paint, makeTooltipString } from "$lib/utils/exports.js";

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
                if (filteredData[country]) {
                    tooltipContent = makeTooltipString(
                        country,
                        filteredData[country],
                    );
                } else {
                    tooltipContent = country;
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
                paint: paint,
            });
        } else {
            console.log("error. no geojsons[year]");
        }
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
