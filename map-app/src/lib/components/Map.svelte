<script>
    /* IMPORTS AND EXPORT */

    // dev stuff
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import chroma from "chroma-js";

    // map legend
    import Legend from '$lib/components/Legend.svelte';
    

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
    // olympicIconSvg is used for host city marker

    import {
        getBaseMapYear,
        makeTooltipString,
        gameLocations,
        olympicIconSvg
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

    // TODO / question: why did I not make these not reactive here?
    selectedYear.subscribe(
        (value) => (year = value || "All years (1896-2024)"),
    );
    selectedSport.subscribe((value) => (sport = value || "All sports"));
    selectedEvent.subscribe((value) => (sportEvent = value || "All events"));
    filteredDataStore.subscribe((value) => (filteredData = value));

    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));
    $: console.log(pointsTotalArr)
    // just k-means clustering to get breaks for colors
    $: breaks = chroma.limits(pointsTotalArr, 'k', 4);
    $: colorize = chroma
        .scale('OrRd')
        .domain(breaks)
        .mode('lch')
        .correctLightness();

    // $: console.log(colorize(5))


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
                background-color: red;
                border-radius: 50%;
                width: 10px;
                height: 10px;
                box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.8)
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
            container: container, // binded
            dragRotate: false,
            renderWorldCopies: false,
        });

        // console.log(gameLocations[Number(year)].latlon);

        map.getCanvas().style.cursor = "auto";

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
            paint: {
                "line-color": "white",
                "line-width": 2,
            },
            filter: ["==", "NAME", ""], // initially set to no country
        });

        // once source and layer have been added:
        map.on("load", () => {
            // add marker after map is loaded

            // set bounds of map after it's been loaded
            const bounds = [
                [-180, -79],
                [180, 85],
            ]; // exclude antarctica
            map.fitBounds(bounds);

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

        map.on("mouseenter", geojsonLayerId, () => {
            isZoomable = true;
        });

        // on mousemove, display tooltip
        map.on("mousemove", geojsonLayerId, (e) => {
            // if the mouse is on the marker, do not show the feature tooltip
            if (isMarkerHovered) return;

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
                map.setFilter("hover-layer", ["==", "NAME", country]);
            } else {
                tooltip.remove();
                map.setFilter("hover-layer", ["==", "NAME", ""]);
            }
        });

        map.on("mouseleave", geojsonLayerId, () => {
            isZoomable = false;
            map.getCanvas().style.cursor = "auto";
            tooltip.remove();
            map.setFilter("hover-layer", ["==", "NAME", ""]);
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

function makePaint() {
  console.log(breaks);


  const fillColorString = () => {
    let rgbBreaks = [];
    breaks.forEach(colorStop => {
        let thisColor = colorize(colorStop)
        // make obj with maplibre-ready rgb string
        let obj = {[colorStop]: `rgb(${thisColor['_rgb'][0].toString()}, ${thisColor['_rgb'][1].toString()}, ${thisColor['_rgb'][2].toString()})`};
        rgbBreaks.push(obj)
    })
    return rgbBreaks;
  }

  let colors2 = fillColorString();

  colors2.forEach(color => {
            const key = Object.keys(color)[0]; // this is the break number
            const rgbString = color[key];
            console.log(key, rgbString)
        })

    // initialize the fill-color array
    let fillColorArray = [];

// add gradient color stops based on colors2
colors2.forEach(color => {
    const key = parseInt(Object.keys(color)[0], 10); // Ensure key is an integer
    const rgbString = color[key];
    fillColorArray.push(key, rgbString);
});

console.log(fillColorArray);

const style = {
    "fill-color": [
      "case",
      ["==", ["feature-state", "pointsTotal"], null],
      "black", // black for undefined pointsTotal (debugging purposes)
      ["==", ["feature-state", "pointsTotal"], 0],
      "#ccc", // gray for pointsTotal = 0
        [
        "interpolate",
        ["linear"],
        ["feature-state", "pointsTotal"],
        ...fillColorArray
        ] 
    ],
    "fill-opacity": [
      "case",
      ["==", ["feature-state", "pointsTotal"], null],
      0,
      ["==", ["feature-state", "pointsTotal"], 0],
      0.5,
      1,
    ]
};

console.log(style);
return style;

  let colors = ['#710025', '#8b0038', '#a20f4a', '#b52759', '#c83c68', '#db4e78', '#ee6088', '#fe749b', '#ff91b6', '#ffabd0', '#ffc4e8']
//   return {

//     "fill-color": [
//       "case",
//       ["==", ["feature-state", "pointsTotal"], null],
//       "black", // black for undefined pointsTotal (debugging purposes)
//       ["==", ["feature-state", "pointsTotal"], 0],
//       "#ccc", // gray for pointsTotal = 0
  
//       // apply gradient based on pointsTotal
//       [
//         "interpolate",
//         ["linear"],
//         ["feature-state", "pointsTotal"],


//         1,
//         colors[9],
//         maxPoints*.2,
//         colors[8], 
//         maxPoints*.3,
//         colors[7], 
//         maxPoints*.4,
//         colors[6],
//         maxPoints*.5,
//         colors[5],
//         maxPoints*.6,
//         colors[4],
//         maxPoints*.7,
//         colors[3],
//         maxPoints*.8,
//         colors[2],
//         maxPoints*.9,
//         colors[1],
//         maxPoints, 
//         colors[0], // darkest color for max value
//       ],
//     ],
//     "fill-opacity": [
//       "case",
//       ["==", ["feature-state", "pointsTotal"], null],
//       0,
//       ["==", ["feature-state", "pointsTotal"], 0],
//       0.5,
//       1,
//     ],
//   };
}



    function addGeojsonLayer() {
        if (geojsons[baseMapYear]) {
            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: makePaint(maxPoints, breaks),
            });
        } else {
            console.log("error. no geojsons[year]");
        }
    }

    // create yellow circle marker to mark games location
    function createMarker() {
        const markerElement = document.createElement("div");
        markerElement.className = "games-marker";
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
            let paintObj = makePaint(maxPoints, breaks);
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

<div class='map-container'>
    <div bind:this={container} id="map" />
    <Legend />
</div>


<style>

    #map {
        height: 100%;
        width: 100%;
        /* background: linear-gradient(to right, #1d2671, #c33764); */
    }

    .map-container {
        position: relative;
        height: 600px;
        width: 100%;
    }
</style>
