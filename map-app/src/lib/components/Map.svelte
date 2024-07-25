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
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    // let featureStateId = "feature-state-layer";

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    $: filteredDataStore.subscribe((value) => (filteredData = value));

    // $: sourceIsLoaded = isSourceLoaded();
    // $: console.log(`source loaded? ${sourceIsLoaded}`);

    // $: if (sourceIsLoaded) {
    //     console.log('reactive sourceIsLoaded')
    //     addGeojsonLayer();
    // }

    /* DISPLAY CORRECT HISTORIC BASE MAP BASED ON YEAR */

    // get numeric form of year
    $: numericyear = Number(year.substring(0, 4));

    // if all years are selected, use basemap from year 2000
    // otherwise, get the right baseMapYear
    $: baseMapYear = isNaN(numericyear) ? "2000" : getBaseMapYear(numericyear);

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
            // if source is loaded, loop through each feature to setFeatureState
            sourceIsLoaded = isSourceLoaded() ? true : false;
            if (sourceIsLoaded) {
                // must use querySourceFeatures to access generated id,
                // NOT map.getSource(sourceId).getData()

                let features = map.querySourceFeatures(geojsonLayerId);

                features.forEach((feature) => {
                    let countryName = feature.properties.NAME;
                    let featureId = feature.id;

                    // TODO: just get rid of undefined features in the geojsons via preprocessing
                    if (countryName) {
                        let pointsTotal = getPointsTotal(countryName);
                        map.setFeatureState(
                            { source: geojsonLayerId, id: featureId },
                            { pointsTotal: pointsTotal },
                        );
                    }
                });
            } else {
                console.log("error. source is not loaded.");
            }
        });

        // addgeojsonLayer();

        // map.on("style.load", () => {
        //     if (filteredData) {
        //         // updateFeatureStates(map); // ensure data is updated after style loads
        //         addgeojsonLayer(baseMapYear);
        //     }
        // });

        // Handle initial map style load if it has already occurred
        // if (map.isStyleLoaded()) {
        //     map.fire("style.load"); // Manually trigger the style load event
        // }

        // ensure pointsTotal is updated on initial load
        // if (map.isStyleLoaded()) {
        //     updateFeatureStates(map);
        // } else {
        //     map.on("style.load", () => {
        //         updateFeatureStates(map);
        //     });
        // }

        /* ADD INITIAL geojson LAYER */
        // addgeojsonLayer(baseMapYear);

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

    function addGeojsonLayer() {
        if (geojsons[baseMapYear]) {
            // map.setFeatureState({
            //     source: geojsonLayerId,
            //     id: featureStateId,
            // });
            // updateFeatureStates(map);

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

    // change map colors based on data
    // function updateFeatureStates(map) {
    //     // it's undefined here
    //     map.getSource(geojsonLayerId)
    //         .getData()
    //         .then((data) => {
    //             console.log(data.features);
    //         });

    //     let features = map.querySourceFeatures(geojsonLayerId);

    //     features.forEach((feature) => {
    //         let pointsTotal = 0; // to get points totals based on medal type and count
    //         let featureId = feature.id;
    //         let country;
    //         if (feature.properties.NAME) {
    //             country = feature.properties.NAME;
    //         }

    //         if (filteredData[country]) {
    //             filteredData[country].forEach((row) => {
    //                 // destructure row object to access medal
    //                 const { medal } = row;

    //                 // count medals
    //                 if (medal === "Gold") {
    //                     pointsTotal += 3;
    //                 } else if (medal === "Silver") {
    //                     pointsTotal += 2;
    //                 } else if (medal === "Bronze") {
    //                     pointsTotal += 1;
    //                 }
    //             });
    //         }

    //         map.setFeatureState(
    //             { source: geojsonLayerId, id: featureId },
    //             { pointsTotal: pointsTotal },
    //         );
    //     });
    // }

    // get points totals for color weighting
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

    // update to different basemap if different year is selected
    function updategeojsonLayer(year) {
        if (map.getSource(geojsonLayerId)) {
            map.getSource(geojsonLayerId).setData(geojsons[year]);
        } else {
            addGeojsonLayer();
        }
        updateFeatureStates(map);
    }

    // check if geojson source is loaded
    function isSourceLoaded() {
        if (map && map.isStyleLoaded() && map.getSource(geojsonLayerId)) {
            return true;
        } else {
            return false;
        }
    }

    /* DEV NOTE */
    // must use map.querySourceFeatures(geojsonLayerId)

    // the following let's you access the geojson data, but does not give access to the id generated
    // map.getSource(geojsonLayerId)
    //     .getData()
    //     .then((data) => {
    //         let getDataFeatures = data.features;
    //         getDataFeatures.forEach((feature) => {
    //             console.log(feature.id);
    //         });
    //     });
</script>

<div bind:this={container} id="map" />

<style>
    /* TODO: make pointer just regular unless over a country */
    #map {
        height: 600px;
        width: 100%;
    }
</style>
