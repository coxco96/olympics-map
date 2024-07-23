<script>
    import {
        selectedSport,
        selectedYear,
        selectedEvent,
    } from "$lib/stores/filters.js";
    import { eventsByYear } from "$lib/utils/exports.js";

    let sport, year, sportEvent;
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedYear.subscribe((value) => (year = value));

    function handleChange(event) {
        selectedEvent.set(event.target.value);
    }

    let relevantSports, relevantEvents;

    $: {
        
        if (year) {
            relevantSports = Object.keys(eventsByYear[year] || {}).sort();
        }
        if (year && sport) {
            relevantEvents = (eventsByYear[year][sport] || []).sort();
        } else {
            relevantSports = [];
            relevantEvents = [];
        }
    }

    $: relevantSports;
    $: relevantEvents;
</script>

<select
    bind:value={sportEvent}
    on:change={handleChange}
    class="form-select"
    name="Event"
>

        {#each relevantEvents as event}
            <option value={event}>{event}</option>
        {/each}

</select>
