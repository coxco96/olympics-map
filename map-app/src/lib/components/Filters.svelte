<script>
    // layout
    import { Col } from "@sveltestrap/sveltestrap";

    // each filter
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    import EventsFilter from "$lib/components/EventsFilter.svelte";

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
