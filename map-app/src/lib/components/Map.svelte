<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import chroma from "chroma-js";

    // map legend
    import Legend from "$lib/components/Legend.svelte";

    // historic base maps
    import { world1880 } from "$lib/geojsons/world-1880.js";
    import { world1900 } from "$lib/geojsons/world-1900.js";
    import { world1914 } from "$lib/geojsons/world-1914.js";
    import { world1920 } from "$lib/geojsons/world-1920.js";
    import { world1930 } from "$lib/geojsons/world-1930.js";
    import { world1938 } from "$lib/geojsons/world-1938.js";
    import { world1945 } from "$lib/geojsons/world-1945.js";
    import { world1960 } from "$lib/geojsons/world-1960.js";
    import { world1994 } from "$lib/geojsons/world-1994.js";
    import { world2000 } from "$lib/geojsons/world-2000.js";

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
        2000: world2000,
    };

    // getBaseMapYear, makePaint and makeTooltipString are functions
    // gameLocations is an object of host city locations by year

    import {
        getBaseMapYear,
        makeTooltipString,
        gameLocations,
        makePaint,
    } from "$lib/utils/exports.js";

    // import stores
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
        filteredDataStore,
        pointsTotalStore,
        maxPointsStore,
    } from "$lib/utils/stores.js";

    /* PREDECLARE NECESSARY VARIABLES */

    let year,
        sport,
        sportEvent,
        container,
        map,
        tooltipContent,
        filteredData,
        gameLocationMarker;

    let sourceIsLoaded = false;
    let isFeatureStateFirstRun = true;
    let isBaseMapFirstRun = true;
    let isMarkerHovered = false; // used to keep feature tooltip from appearing if mouse is over gameLocationMarker
    let geojsonLayerId = "geojson-layer";
    let hoverLayerId = "hover-layer";
    let pointsTotalArr = [];
    let maxPoints;

    /* SUBSCRIBE TO STORES FOR DATA FILTERING */

    selectedYear.subscribe(
        (value) => (year = value || "All years (1896-2024)"),
    );
    selectedSport.subscribe((value) => (sport = value || "All sports"));
    selectedEvent.subscribe((value) => (sportEvent = value || "All events"));
    filteredDataStore.subscribe((value) => (filteredData = value));

    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));

    /* HANDLE COLORS USED FOR CURRENT FILTERED DATA */

    $: lengthOfData = Object.keys(filteredData).length;

    $: breaks =
        lengthOfData >= 4
            ? chroma.limits(pointsTotalArr, "k", 4)
            : chroma.limits(pointsTotalArr, "k", Math.max(lengthOfData, 3));

    $: originalColors = chroma
        .scale(["#f5f5f7", "#424245", "#1d1d1f"]) // Repeated dark hex
        .colors(breaks.length);

    $: darkenedColors = originalColors.map((color, index) =>
        index === 0 ? chroma(color).darken(1.6).hex() : color,
    );

    $: filteredColors = darkenedColors.filter((color, index) => index !== 0);

    $: colorize = chroma
        .scale(
            filteredColors.length >= lengthOfData
                ? filteredColors
                : chroma
                      .scale(["#f5f5f7", "#424245", "#1d1d1f"])
                      .colors(lengthOfData)
                      .filter((color, index) => index !== 0),
        )
        .domain(breaks)
        .mode("lch");

    $: maxPointsStore.subscribe((value) => (maxPoints = value));

    let isFirstPaint = true;
    $: if (maxPoints) {
        // if not first load, repaint the map.
        if (!isFirstPaint) {
            setFeatureStates();
            updatePaintProperties();
        }
        isFirstPaint = false;
    }

    $: mapExists = map ? true : false; // used below to ensure marker isn't added to non-existent map (which causes error)

    // if a game location is available for current year,
    // put a marker on the location of the games
    $: if (mapExists && gameLocations[Number(year)]) {
        if (gameLocationMarker) {
            gameLocationMarker.remove();
        }
        gameLocationMarker = new maplibregl.Marker({
            element: createMarker(),
        })
            .setLngLat([
                gameLocations[Number(year)].latlon[1],
                gameLocations[Number(year)].latlon[0],
            ])
            .addTo(map);

        // style the marker as a yellow circle (for now!)
        const style = document.createElement("style");
        style.innerHTML = `
                .games-marker {
                background-color: #fcba03;
                border-radius: 50%;
                border: 1px solid #dbd7d7;
                width: 13px;
                height: 13px;
                box-shadow: 0 0 4px 1.5px #ccc;
                }
            `;
        document.head.appendChild(style);

        // create a tooltip for the marker
        const markerTooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });
        // if mouse hovers over the marker, show the tooltip
        gameLocationMarker.getElement().addEventListener("mouseenter", () => {
            isMarkerHovered = true;
            markerTooltip
                .setLngLat([
                    gameLocations[Number(year)].latlon[1],
                    gameLocations[Number(year)].latlon[0],
                ])
                .setHTML(`Host City: ${gameLocations[Number(year)].location}`) // You can customize this
                .addTo(map);
        });

        // hide the tooltip when mouse leaves
        gameLocationMarker.getElement().addEventListener("mouseleave", () => {
            isMarkerHovered = false;
            markerTooltip.remove();
        });
    }

    // if there is a gameLocationMarker map on the map, but the year
    // changes to one that should not have a marker, remove the marker
    $: if (mapExists && gameLocationMarker && !gameLocations[Number(year)]) {
        gameLocationMarker.remove();
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

    let isZoomable = false; // keep track of zoomable parts of map (features only)

    /* INITIALIZE MAP, SOURCE, LAYER AND FEATURE-STATES ON INITIAL COMPONENT MOUNT */

    onMount(async () => {
        /* INITIALIZE MAP */

        map = new maplibregl.Map({
            container: container,
            center: [10, 20], // Centered roughly on the Atlantic to see most landmasses
            zoom: 1.5,
            dragRotate: false,
            renderWorldCopies: false,
            maplibreLogo: false,
        });

        map.getCanvas().style.cursor = "auto";

        // add source and layer
        if (filteredData) {
            addGeojsonSource();
            addGeojsonLayer();
        } else {
            console.log("error. no filteredData");
        }

        // add hover effect layer
        // map.addLayer({
        //     id: hoverLayerId,
        //     type: "line",
        //     source: geojsonLayerId,
        //     paint: {
        //         "line-color": "pink",
        //         "line-width": 10.5,
        //     },
        //     filter: ["==", "NAME", ""], // initially set to no country
        // });

        // LAYER 0: YOUR ORIGINAL (Base Neon)
        map.addLayer({
            id: hoverLayerId,
            type: "line",
            source: geojsonLayerId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
                "line-color": "#ff33aa", // Vivid Raspberry (Less "bubblegum" than #ff00ff)
                "line-width": 4,
                "line-blur": 8,
                "line-opacity": 0.8,
                "line-offset": 1,
            },
            filter: ["==", "NAME", "___NONE___"],
        });

        // LAYER 1: THE BLOOM (Atmospheric Halo)
        map.addLayer({
            id: "hover-bloom",
            type: "line",
            source: geojsonLayerId,
            paint: {
                "line-color": "#7a1b7a", // Deep Midnight Purple (Adds "weight" to the shadow)
                "line-width": 18, // Wider to catch the eye
                "line-blur": 15,
                "line-opacity": 0.5,
            },
            filter: ["==", "NAME", "___NONE___"],
        });

        // LAYER 2: THE NEON TUBE (Primary Color)
        map.addLayer({
            id: "hover-glow",
            type: "line",
            source: geojsonLayerId,
            paint: {
                "line-color": "#ff0055", // High-Chroma Fuchsia (Punchy and sophisticated)
                "line-width": 5,
                "line-blur": 1,
                "line-opacity": 0.9,
            },
            filter: ["==", "NAME", "___NONE___"],
        });

        // LAYER 3: THE SPECULAR CORE (Sharp Light)
        map.addLayer({
            id: "hover-core",
            type: "line",
            source: geojsonLayerId,
            paint: {
                "line-color": "#ffffff",
                "line-width": 1.5,
                "line-opacity": 1,
            },
            filter: ["==", "NAME", "___NONE___"],
        });
        // once source and layer have been added:
        map.on("load", () => {
            // add marker after map is loaded

            // set bounds of map after it's been loaded
            const bounds = [
                [-170, -55],
                [170, 75],
            ]; // Tighter crop on the inhabited world
            map.fitBounds(bounds, { padding: 40 });

            // if source is loaded, loop through each feature to setFeatureStates
            sourceIsLoaded = isSourceLoaded() ? true : false;
            if (sourceIsLoaded) {
                setFeatureStates(); // set feature states for styling
            } else {
                console.log("error. source is not loaded.");
            }

            /* Update your border layer in map.on("load") */
            map.addLayer({
                id: "country-borders",
                type: "line",
                source: geojsonLayerId,
                paint: {
                    "line-color": "white", // White borders pop better on dark or light colors
                    "line-width": 0.8,
                    "line-opacity": 0.9,
                },
            });
        }); // end of map.on("load" ... )

        // initialize tooltip
        const tooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        map.on("mouseenter", geojsonLayerId, () => {
            isZoomable = true;
        });

        // on mousemove, display tooltip
        // on mousemove, display tooltip and trigger the 4-layer neon hover
        map.on("mousemove", geojsonLayerId, (e) => {
            if (isMarkerHovered) return;

            map.getCanvas().style.cursor = "pointer";

            if (
                e.features &&
                e.features.length > 0 &&
                e.features[0].properties.NAME
            ) {
                const country = e.features[0].properties.NAME;
                const olympicTeam =
                    e.features[0].properties["OLYMPIC_TEAM"] || "";

                // Tooltip logic
                if (filteredData[country]) {
                    tooltipContent = makeTooltipString(
                        country,
                        filteredData[country],
                        olympicTeam,
                    );
                } else if (filteredData[olympicTeam]) {
                    tooltipContent = makeTooltipString(
                        country,
                        filteredData[olympicTeam],
                        olympicTeam,
                    );
                } else {
                    tooltipContent = `${country}<br>${olympicTeam}`;
                }

                tooltip
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(tooltipContent)
                    .addTo(map);

                // TRIGGER ALL 4 HOVER LAYERS
                const hoverLayers = [
                    hoverLayerId,
                    "hover-bloom",
                    "hover-glow",
                    "hover-core",
                ];
                hoverLayers.forEach((layerId) => {
                    if (map.getLayer(layerId)) {
                        map.setFilter(layerId, ["==", "NAME", country]);
                    }
                });
            }
        });

        map.on("mouseleave", geojsonLayerId, () => {
            isZoomable = false;
            map.getCanvas().style.cursor = "auto";
            tooltip.remove();

            // RESET ALL 4 HOVER LAYERS TO AVOID GHOSTING (Fixes Switzerland)
            const hoverLayers = [
                hoverLayerId,
                "hover-bloom",
                "hover-glow",
                "hover-core",
            ];
            hoverLayers.forEach((layerId) => {
                if (map.getLayer(layerId)) {
                    map.setFilter(layerId, ["==", "NAME", "___NONE___"]);
                }
            });
        });

        map.on("wheel", (e) => {
            if (!isZoomable) {
                e.preventDefault(); // prevent zooming except on features
            }
        });
    }); // end onMount

    /* FUNCTIONS */

    function addGeojsonSource() {
        if (geojsons[baseMapYear]) {
            map.addSource(geojsonLayerId, {
                type: "geojson",
                data: geojsons[baseMapYear],
                generateId: true, // in order to use feature states
            });

            // wait for source to be loaded
            map.on("data", (e) => {
                if (e.sourceId === geojsonLayerId && e.isSourceLoaded) {
                    setFeatureStates();
                    updatePaintProperties();
                }
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
                paint: makePaint(colorize, breaks, false),
            });
        } else {
            console.log("error. no geojsons[year]");
        }
    }

    // create yellow circle marker to mark games location
    function createMarker() {
        const markerElement = document.createElement("div");
        // Add both classes; 'ping' triggers the CSS animation immediately
        markerElement.className = "games-marker ping";
        return markerElement;
    }

    function setFeatureStates() {
        if (map) {
            // intialize for features iteration
            let pointsTotal, featureId, countryName, olympicTeam;

            // access geojson data with id generated on addSource
            let features = map.querySourceFeatures(geojsonLayerId);

            // set feature state for each feature based on pointsTotal
            features.forEach((feature) => {
                featureId = feature.id;
                countryName = feature.properties.NAME;
                olympicTeam = feature.properties["OLYMPIC_TEAM"]
                    ? feature.properties["OLYMPIC_TEAM"]
                    : undefined;
                pointsTotal = getPointsTotal(countryName, olympicTeam);
                map.setFeatureState(
                    { source: geojsonLayerId, id: featureId },
                    { pointsTotal: pointsTotal },
                );
            });
        }
    }

    function updatePaintProperties() {
        if (map) {
            let paintObj = makePaint(colorize, breaks, false);
            map.setPaintProperty(
                geojsonLayerId,
                "fill-color",
                paintObj["fill-color"],
            );
            map.setPaintProperty(
                geojsonLayerId,
                "fill-opacity",
                paintObj["fill-opacity"],
            );
        }
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
            countryData = filteredData[countryName];
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

<div class="map-container">
    <div bind:this={container} id="map" />
    <Legend />
</div>

<style>
    #map {
        height: 100%;
        width: 100%;
        background-color: #f7f7f7;
    }

    :global(.map-wrapper) {
        /* Add a slight dark border to the whole map container to frame it */
        border: 1px solid #d1d1d6;
    }

    .map-container {
        position: relative;
        height: calc(85vh - 100px); /* Adjust based on navbar + filter height */
        min-height: 500px;
        width: 100%;
        border-radius: 16px;
        overflow: hidden; /* Clips the map corners to the border-radius */
    }

    @media only screen and (max-width: 420px) {
        .map-container {
            height: 400px;
            width: 100%;
        }
    }

    :global(.maplibregl-popup-content) {
        background: rgba(255, 255, 255, 0.94) !important;
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 8px !important;
        padding: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        font-family: -apple-system, sans-serif !important;
        color: #1d1d1f !important;
    }

    :global(.maplibregl-popup-tip) {
        border-top-color: rgba(255, 255, 255, 0.8) !important;
    }

    :global(.games-marker) {
        width: 16px;
        height: 16px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 2px solid #ffd700;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* The Pulse "Ping" */
    :global(.games-marker.ping::after) {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 14px;
        height: 14px;
        margin-left: -7px; /* Half of width */
        margin-top: -7px; /* Half of height */
        border-radius: 50%;
        border: 3px solid #ffcc00;
        animation: marker-ping 0.8s ease-out forwards;
        pointer-events: none;
    }

    @keyframes marker-ping {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }



    /* 3. THE DOTS: Solid, small, and sharp */
    :global(.medal-dot) {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
    }

    :global(.gold) { background-color: #FFD700; }
    :global(.silver) { background-color: #B8B8B8; }
    :global(.bronze) { background-color: #CD7F32; }

/* 1. THE CONTAINER: Dynamic and flexible */
    :global(.maplibregl-popup-content) {
        /* Remove fixed width, use fit-content */
        width: fit-content !important; 
        min-width: 200px;
        max-width: 320px; /* Safety cap for very long country names */
        background: rgba(255, 255, 255, 0.96) !important;
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 12px !important;
        padding: 16px !important; 
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    }

    /* 2. THE STATS: Ensure items never wrap or overflow */
    :global(.tooltip-stats) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px; /* Space between G, S, and B columns */
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    :global(.medal-item) {
        display: flex;
        align-items: center;
        gap: 4px;
        /* This prevents the count from dropping below the label */
        white-space: nowrap; 
    }

    /* 3. TYPOGRAPHY REFINEMENT */
    :global(.medal-label) {
        font-size: 0.75rem;
        font-weight: 600;
        color: #86868b;
        /* Slight opacity makes the 'G' feel more secondary */
        opacity: 0.8; 
    }

    :global(.medal-count) {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1d1d1f;
        font-variant-numeric: tabular-nums;
    }
</style>
