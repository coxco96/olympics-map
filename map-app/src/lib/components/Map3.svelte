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
    import { baseMapYears } from "$lib/utils/exports.js";

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
        filteredDataStore,
    } from "$lib/utils/stores.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year, sport, sportEvent, container, map, tooltipContent, filteredData;
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    let featureStateId = "feature-state-layer";

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    // $: filteredDataStore.subscribe((value) => (filteredData = value));
    $: filteredDataStore.subscribe((value) => {
        console.log("subscribing woo");
        filteredData = value;
        if (map && map.isStyleLoaded()) {
            console.log("updating from inside the subscribe!");
            updateFeatureStates(map); // update feature states when filteredData changes
        }
    });

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
    $: baseMapYear = isNaN(numericyear) ? "2000" : getBaseMapYear(numericyear);

    onMount(async () => {
        console.log("mounting!");

        /* INITIALIZE MAP */
        map = new maplibregl.Map({
            container: container,
            center: [0, 0],
            zoom: 1,
        });

        map.on("style.load", () => {
            console.log("on style load!");
            if (filteredData) {
                console.log("filteredData inside style.load!");
                console.log(filteredData);
                updateFeatureStates(map); // ensure data is updated after style loads
                addGeoJsonLayer(baseMapYear);
            }
        });

        // Handle initial map style load if it has already occurred
        if (map.isStyleLoaded()) {
            map.fire("style.load"); // Manually trigger the style load event
        }

        // ensure pointsTotal is updated on initial load
        // if (map.isStyleLoaded()) {
        //     console.log("style is loaded!");
        //     updateFeatureStates(map);
        // } else {
        //     map.on("style.load", () => {
        //         console.log("on style load!");
        //         updateFeatureStates(map);
        //     });
        // }

        /* ADD INITIAL GEOJSON LAYER */
        // addGeoJsonLayer(baseMapYear);

        /* HOVER EFFECT LAYER */
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

        /* TOOLTIP */

        // initialize
        const tooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        // on mousemove, display tooltip
        map.on("mousemove", geojsonLayerId, (e) => {
            // change cursor type as ui indicator
            map.getCanvas().style.cursor = "pointer";

            // if mouse is on a feature, get & display its data
            if (e.features && e.features[0].properties.NAME) {
                let country = e.features[0].properties.NAME;
                // get filtered data only
                // let countryData
                // if (dataObj[country]) {
                //     countryData = getRelevantCountryData(dataObj[country]);
                // }

                // if map is zoomed out so multiple copies of feature are visible, only show tooltip once
                // let coords = e.features[0].geometry.coordinates.slice();
                // while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
                //     coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
                // }

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

                map.setFilter("hover-layer", ["==", "NAME", country]);
            } else {
                // tooltip.remove();
                map.setFilter("hover-layer", ["==", "NAME", ""]);
            }
        });

        map.on("mouseleave", geojsonLayerId, () => {
            map.getCanvas().style.cursor = "";
            // tooltip.remove();
            map.setFilter("hover-layer", ["==", "NAME", ""]);
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
        // updateFeatureStates(map);
    }

    /* FUNCTIONS */

    function addGeoJsonLayer(year) {
        if (geojsons[year]) {
            map.addSource(geojsonLayerId, {
                type: "geojson",
                data: geojsons[year],
                generateId: true, // in order to use feature states
            });

            // map.setFeatureState({
            //     source: geojsonLayerId,
            //     id: featureStateId,
            // });
            updateFeatureStates(map);

            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: {
                    "fill-color": [
                        "case",
                        ["==", ["feature-state", "pointsTotal"], null],
                        "black", // black for undefined pointsTotal
                        ["==", ["feature-state", "pointsTotal"], 0],
                        "#ccc", // gray for pointsTotal = 0

                        // apply gradient based on pointsTotal
                        [
                            "interpolate",
                            ["linear"],
                            ["feature-state", "pointsTotal"],
                            1,
                            "#add8e6", // light blue for the minimum value
                            200, // TODO: adjust this to your actual max pointsTotal
                            "#00008b", // dark blue for the maximum value
                        ],
                    ],
                    "fill-opacity": [
                        "case",
                        ["==", ["feature-state", "pointsTotal"], null],
                        0.2,
                        ["==", ["feature-state", "pointsTotal"], 0],
                        0.9,
                        1,
                    ],
                },
            });
        }
    }

    // change map colors based on data
    function updateFeatureStates(map) {
        console.log("in updateFeatureStates!");
        console.log(filteredData);
        let features = map.querySourceFeatures(geojsonLayerId);
        console.log(features);
        features.forEach((feature) => {
            let pointsTotal = 0; // to get points totals based on medal type and count
            let featureId = feature.id;
            let country;
            if (feature.properties.NAME) {
                country = feature.properties.NAME;
            }
            console.log(country);
           

            if (filteredData[country]) {
                console.log("filteredData from Map");
                console.log(filteredData[country]);

                filteredData[country].forEach((row) => {
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
            console.log('setting feature state!')
            map.setFeatureState(
                { source: geojsonLayerId, id: featureId },
                { pointsTotal: pointsTotal },
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
        updateFeatureStates(map);
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
