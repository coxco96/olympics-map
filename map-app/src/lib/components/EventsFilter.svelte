<script>
    import {
        selectedSport,
        selectedYear,
        selectedEvent,
    } from "$lib/utils/stores.js";
    import { eventsByYear } from "$lib/utils/exports.js";

    let sport, year, sportEvent;
    $: selectedEvent.subscribe((value) => (sportEvent = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedYear.subscribe((value) => (year = value));

    function handleChange(event) {
        selectedEvent.set(event.target.value);
    }

    let relevantEvents;

    $: {
        let eventsSet = new Set();

        if (year === 'All years (1896-2024)') {
            if (sport === 'All sports') {
                // Show 'All events' if no sport is selected
                relevantEvents = ['All events'];
            } else {
                // Show all events for the selected sport
                Object.values(eventsByYear).forEach(yearData => {
                    if (yearData[sport]) {
                        yearData[sport].forEach(event => eventsSet.add(event));
                    }
                });
                relevantEvents = ['All events', ...Array.from(eventsSet).sort()];
            }
        } else {
            if (sport === 'All sports') {
                // Show 'All events' if sport is 'All sports'
                relevantEvents = ['All events'];
            } else {
                // Show events for the selected sport and year
                (eventsByYear[year]?.[sport] || []).forEach(event => eventsSet.add(event));
                relevantEvents = ['All events', ...Array.from(eventsSet).sort()];
            }
        }
    }

    // Ensure sportEvent is 'All events' if no events are available or sport changes
    $: {
        if (sportEvent !== 'All events' && !relevantEvents.includes(sportEvent)) {
            selectedEvent.set('All events');
        }
    }
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
