<script>
    import { selectedSport, selectedYear, selectedEvent } from "$lib/utils/stores.js";
    import { eventsByYear } from "$lib/utils/exports.js";

    let sport = "All sports";
    let year = "All years (1896-2024)";
    let sportEvent = "All events";

    // subscribe to store values
    $: selectedSport.subscribe(value => {
        sport = value || "All sports";
        updateRelevantEvents();
    });
    $: selectedYear.subscribe(value => {
        year = value || "All years (1896-2024)";
        updateRelevantEvents();
    });
    $: selectedEvent.subscribe(value => {
        sportEvent = value || "All events";
    });

    function handleChange(event) {
        selectedEvent.set(event.target.value);
    }

    let relevantEvents = [];

    function updateRelevantEvents() {
        if (sport === "All sports") {
            // no sport selected, show 'All events' with no other options
            relevantEvents = ["All events"];
            sportEvent = "All events"; // ensure 'All events' is selected
        } else if (year === "All years (1896-2024)") {
            // show all events for the selected sport across all years
            relevantEvents = ["All events", ...(eventsByYear.flatMap(yearData => yearData[sport] || [])).sort()];
        } else {
            // show events for the selected sport in the selected year
            relevantEvents = ["All events", ...(eventsByYear[year]?.[sport] || [])];
            if (relevantEvents.length === 1) {
                // if no events are available for the selected sport in the selected year, only show 'All events'
                relevantEvents = ["All events"];
            }
            // ensure 'All events' is selected if there are no events available for the selected sport in the new year
            if (!eventsByYear[year]?.[sport]?.includes(sportEvent)) {
                sportEvent = "All events";
            }
        }
    }

    // initial call to set up events based on default values
    updateRelevantEvents();
</script>

<select bind:value={sportEvent} on:change={handleChange} class="form-select" name="Event">
    {#each relevantEvents as event}
        <option value={event}>{event}</option>
    {/each}
</select>
