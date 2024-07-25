<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";

    // historic base maps
    import { geojsons } from "$lib/geojsons/basemaps.js";

    // array of basemap years included in geojsons and function to filter data
    // TODO: get rid of this and just make a list of geojsons keys
    import { getBaseMapYear, paint } from "$lib/utils/exports.js";

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
        filteredDataStore,
    } from "$lib/utils/stores.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year, sport, sportEvent, container, filteredData, map;
    let geojsonLayerId = "geojson-layer";

    /* SUBSCRIBE TO STORES */

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    $: filteredDataStore.subscribe((value) => (filteredData = value));

    /* DISPLAY CORRECT HISTORIC BASE MAP BASED ON YEAR */

    // get numeric form of year
    $: numericyear = Number(year.substring(0, 4));
    $: baseMapYear = isNaN(numericyear) ? "2000" : getBaseMapYear(numericyear);

    // /* UPDATE BASEMAP IF YEAR CHANGES */
    // $: {if (map && geojsons[baseMapYear]) {
    //     updateGeoJsonLayer(baseMapYear);
    //     setFeatureState(geojsonLayerId, filteredData);
    // }}

    $: if (map) {
            map.getSource(geojsonLayerId)
                .getData()
                .then((data) => {
                    console.log(data.features);
                });
        }
    

    onMount(() => {
        console.log("in onMount");
        map = initializeMap();
        addGeoJsonSource();
        addGeoJsonLayer();

        map.on("load", () => {
            console.log("loaded");
            setFeatureState(geojsonLayerId, filteredData);
        });
    });

    /* FUNCTIONS */

    function initializeMap() {
        console.log("initializing map");
        return new maplibregl.Map({
            container: container,
            center: [0, 0],
            zoom: 1,
        });
    }

    function addGeoJsonSource() {
        console.log("addGeoJsonSource");
        // if (geojsons[baseMapYear]) {
        map.addSource(geojsonLayerId, {
            type: "geojson",
            data: geojsons[baseMapYear],
            generateId: true,
        });
        map.getSource(geojsonLayerId)
                .getData()
                .then((data) => {
                    console.log(data.features);
                });
    }

    function addGeoJsonLayer() {
        console.log("addGeoJsonLayer");
        map.addLayer({
            id: geojsonLayerId,
            type: "fill",
            source: geojsonLayerId,
            paint: paint,
        });
    }

    // update to different basemap if different year is selected
    function updateGeoJsonLayer(baseMapYear) {
        if (map.getSource(geojsonLayerId)) {
            map.getSource(geojsonLayerId).setData(geojsons[baseMapYear]);
        } else {
            addGeoJsonLayer();
        }
        setFeatureState(geojsonLayerId, filteredData);
    }

    function setFeatureState(geojsonLayerId, filteredData) {
        console.log("setFeatureState");
        let ahh;
        if (map && map.isStyleLoaded()) {
            map.getSource(geojsonLayerId)
                .getData()
                .then((data) => {
                    ahh = data.features;
                    console.log(ahh);
                });
        }

        let features = map.getSource(geojsonLayerId)["_data"].features;
        if (features) {
            features.forEach((feature) => {
                let countryName = feature.properties.NAME;
                if (countryName && filteredData[countryName]) {
                    let pointsTotal = getPointsTotal(countryName);
                    map.setFeatureState(
                        {
                            source: geojsonLayerId,
                            id: feature.properties.NAME,
                        },
                        { pointsTotal: pointsTotal },
                    );
                }
            });
        }
    }

    function getPointsTotal(countryName) {
        let countryData = filteredData[countryName];
        if (countryData) {
            let pointsTotal = 0;
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
            return pointsTotal;
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
