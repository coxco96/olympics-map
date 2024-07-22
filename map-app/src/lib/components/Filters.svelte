<script>
    // layout
    import { Col } from "@sveltestrap/sveltestrap";

    // each filter
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    import EventsFilter from "$lib/components/EventsFilter.svelte";

    // use stores for filters
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
    } from "$lib/stores/filters.js";

    // subscribe to the stores
    let year, sport, sportEvent;
    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));
</script>

<Col>
    <YearsFilter />
</Col>
<Col>
    <SportsFilter />
</Col>
<Col>
    <EventsFilter />
</Col>
