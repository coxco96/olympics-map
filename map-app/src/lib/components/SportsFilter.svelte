<script>
    import { selectedSport, selectedYear, selectedEvent } from '$lib/utils/stores.js';
    import { eventsByYear, sportsArray } from '$lib/utils/exports.js';

    let sport = "All sports";
    let year = "All years (1896-2024)";
    let sportEvent = "All events";

    // subscribe to store values
    // $: {
    //     // update local variables from stores
    //     selectedSport.subscribe(value => {
    //         sport = value // || "All sports"; // default to "All sports" if value is empty
    //     });
    //     selectedYear.subscribe(value => {
    //         year = value || "All years (1896-2024)"; // Default to "All years" if value is empty
    //         // automatically reset sport if it's not available for the new year
    //         if (year !== "All years (1896-2024)" && !isSportAvailableForYear(sport, year)) {
    //             sport = "All sports"; // reset to "All sports" if the current sport is not available for the selected year
    //             selectedSport.set(sport); // update the store
    //         }
    //     });
    //     selectedEvent.subscribe(value => {
    //         sportEvent = value // || "All events"; // default to "All events" if value is empty
    //     });
    // }

    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
    $: selectedEvent.subscribe(value => sportEvent = value);

    function handleChange(event) {
        selectedSport.set(event.target.value); // update the store on change
    }

    function isSportAvailableForYear(sport, year) {
        // check if the sport is available for the selected year
        return eventsByYear[year] && eventsByYear[year][sport];
    }

    let relevantSports = [];

    $: {
        if (year === "All years (1896-2024)") {
            // show all sports, with 'All sports' at the top
            relevantSports = ["All sports", ...Array.from(new Set(sportsArray)).sort()];
        } else {
            // show sports relevant to the selected year
            relevantSports = ["All sports", ...Object.keys(eventsByYear[year] || {}).sort()];
        }
    }
</script>

{sport}

<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each relevantSports as sport}
        <option value={sport}>{sport}</option>
    {/each}

</select>
