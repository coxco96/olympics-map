<script>
	// https://github.com/topojson/us-atlas
	// https://github.com/d3/d3-geo
	// https://observablehq.com/@mbostock/u-s-state-map

	
	import { onMount } from 'svelte';
	import * as topojson from 'topojson-client';
	import { geoPath, geoMercator } from 'd3-geo';
	import { draw } from 'svelte/transition';
	
	// https://github.com/topojson/us-atlas#us-atlas-topojson
	const projection = geoMercator().scale(1300).translate([487.5, 305])
	
	const path = geoPath().projection(null);
	
	let countries = [];
	// let counties = []
	let mesh;
	let selected;
	//$: console.log({ selected })
	
	const points = [
		{ lat: 38.421115245736, long: -82.44432596047203 },
	].map(p => projection([p.long, p.lat]))
	
	onMount(async () => {
		const world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
			.then(d => d.json())
		console.log({ world })

        // countries = topojson.feature(world).features;
        // console.log(countries);

	})
</script>

