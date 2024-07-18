<script>
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import { baseMapYears } from "../lib/utils/arrays.js";
    import "maplibre-gl/dist/maplibre-gl.css";
    import geoData from "$lib/geojsons/world_1880.json";
    export let selectedYear;

    // return the most recent basemap year
    const getBaseMapYear = (selection) => {
        for (let i = baseMapYears.length - 1; i >= 0; i--) {
            if (selection >= baseMapYears[i]) {
                return baseMapYears[i].toString();
            }
        }
        return baseMapYears[0].toString(); // Return the first year if selection is less than the smallest year
    };
    // get numeric form of selectedYear
    $: numericSelectedYear = Number(selectedYear.substring(0, 4));

    $: console.log("selectedYear: ", selectedYear);
    $: console.log("numericSelectedYear: ", numericSelectedYear);
    $: baseMapYear = isNaN(numericSelectedYear)
        ? 2000
        : getBaseMapYear(numericSelectedYear);
    $: console.log("baseMapYear: ", baseMapYear);

    onMount(() => {
        const map = new maplibregl.Map({
            container: "map", // container id
            // style: "https://demotiles.maplibre.org/style.json", // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1, // starting zoom
        });

        map.addSource("1880", {
            type: "geojson",
            data: geoData,
        });

        map.addLayer({
            id: "1880",
            type: "fill",
            source: "1880",
            paint: {
                "fill-color": "#888888",
                "fill-opacity": 0.4,
            },
        });
    });
</script>

<div id="map"></div>

<style>
    #map {
        height: 600px;
        width: 100%;
    }
</style>
