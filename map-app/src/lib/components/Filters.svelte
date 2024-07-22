<script>
    // layout
    import { Col } from "@sveltestrap/sveltestrap";

    // each filter
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    // import EventsFilter from "$lib/components/EventsFilter.svelte";

    // use stores for filters
    import {selectedYear, selectedSport} from '$lib/stores/filters.js';
    // subscribe to the stores
    let year, sport;
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
</script>

<Col>
    <YearsFilter {selectedYear}/>
</Col>
<Col>
    <SportsFilter {selectedYear} {selectedSport}/>
</Col>
<!-- <Col>
    <EventsFilter {selectedYear} {selectedSport} {selectedEvent}/>
</Col> -->
