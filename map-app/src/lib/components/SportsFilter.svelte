<script>
    import { selectedSport, selectedYear, selectedEvent } from '$lib/utils/stores.js';
    import { eventsByYear, sportsArray } from '$lib/utils/exports.js';

    let sport = "All sports";
    let year = "All years (1896-2024)";
    let sportEvent;

    // Subscribe to store values
    $: selectedSport.subscribe(value => sport = value || "All sports");
    $: selectedYear.subscribe(value => {
        year = value || "All years (1896-2024)";
        // Automatically reset sport if it's not available for the new year
        if (year !== "All years (1896-2024)" && !isSportAvailableForYear(sport, year)) {
            selectedSport.set("All sports");
            sport = "All sports";
        }
    });
    $: selectedEvent.subscribe(value => sportEvent = value || "All events");

    function handleChange(event) {
        selectedSport.set(event.target.value);
    }

    function isSportAvailableForYear(sport, year) {
        // Check if the sport is available for the selected year
        return eventsByYear[year] && eventsByYear[year][sport];
    }

    let relevantSports = [];

    $: {
        if (year === "All years (1896-2024)") {
            // Show all sports, with 'All sports' at the top
            relevantSports = ["All sports", ...Array.from(new Set(sportsArray)).sort()];
        } else {
            // Show sports relevant to the selected year
            relevantSports = ["All sports", ...Object.keys(eventsByYear[year] || {}).sort()];
        }
    }
</script>

<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each relevantSports as s}
        <option value={s}>{s}</option>
    {/each}
</select>
