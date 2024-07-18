<script>
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import geoData from '$lib/geojsons/world_1880.json';


    onMount(() => {
        const map = new maplibregl.Map({
            container: "map", // container id
            // style: "https://demotiles.maplibre.org/style.json", // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1, // starting zoom
        });


        map.addSource('1880', {
            'type': 'geojson',
            'data': geoData
        });

        map.addLayer({
            'id': '1880',
            'type': 'fill',
            'source': '1880',
            'paint': {
                'fill-color': '#888888',
                'fill-opacity': 0.4
            }
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
