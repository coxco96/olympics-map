<script>
    export let selectedYear;
    export let dataObj;
    import { geojsons } from "$lib/geojsons/basemaps.js";
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import { baseMapYears } from "$lib/utils/arrays.js";

   console.log(dataObj);

    // return the most recent basemap year
    const getBaseMapYear = (selection) => {
        for (let i = baseMapYears.length - 1; i >= 0; i--) {
            if (selection >= baseMapYears[i]) {
                return baseMapYears[i].toString();
            }
        }
        return baseMapYears[0].toString(); // return the first year if selection is less than the smallest year
    };
    // get numeric form of selectedYear
    $: numericSelectedYear = Number(selectedYear.substring(0, 4));

    $: console.log("selectedYear: ", selectedYear);
    $: console.log("numericSelectedYear: ", numericSelectedYear);
    $: baseMapYear = isNaN(numericSelectedYear)
        ? 2000
        : getBaseMapYear(numericSelectedYear);
    $: console.log("baseMapYear: ", baseMapYear);

    let container; // to bind to
    let map; // initialize so can be used in or out of onMount
    let geojsonLayerId = "geojson-layer";
    onMount(async () => {
        map = new maplibregl.Map({
            container: container,
            // style: "https://demotiles.maplibre.org/style.json", // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1, // starting zoom
        });

        // add initial geojson layer (should be year 2000)
        addGeoJsonLayer(baseMapYear);

        // add hover effect layer
        map.addLayer({
            id: "hover-layer",
            type: "fill",
            source: geojsonLayerId,
            layout: {},
            paint: {
                "fill-color": "#627BC1",
                "fill-opacity": 0.75,
            },
            filter: ["==", "NAME", ""], // initially set to no country
        });

        // add tooltip
        const tooltip = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
        });
        map.on("mousemove", geojsonLayerId, (e) => {
            // ui indicator
            map.getCanvas().style.cursor = "pointer";

            let coords = e.features[0].geometry.coordinates.slice();
            let country = e.features[0].properties.NAME;

            // if map is zoomed out so multiple copies of feature are visible, tooltip
            // only will appear over the one being hovered over
            while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
                coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
            }

            // add tooltip
            if (country) {
                tooltip
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(country)
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
        });
    });

    // if map already is all initialized etc, and baseMapYear updates,
    // update the map to that basemap
    $: if (map && map.isStyleLoaded() && geojsons[baseMapYear]) {
        updateGeoJsonLayer(baseMapYear);
    }

    function addGeoJsonLayer(year) {
        if (geojsons[year]) {
            map.addSource(geojsonLayerId, {
                type: "geojson",
                data: geojsons[year],
            });
            map.addLayer({
                id: geojsonLayerId,
                type: "fill",
                source: geojsonLayerId,
                paint: {
                    "fill-color": "#888888",
                    "fill-opacity": 0.4,
                },
            });
        }
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

<p>Basemap year (most recent): {baseMapYear}</p>
<div bind:this={container} id="map" />

<style>
    #map {
        height: 600px;
        width: 100%;
    }
</style>
