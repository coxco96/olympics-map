<script>
    import { selectedSport, selectedYear, selectedEvent } from '$lib/utils/stores.js';
    import { eventsByYear, sportsArray } from '$lib/utils/exports.js';

    let sport = "All sports";
    let year = "All years (1896-2024)";
    let sportEvent = "All events";

    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
    $: selectedEvent.subscribe(value => sportEvent = value);

    function handleChange(event) {
        selectedSport.set(event.target.value); // update the store on change
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

<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each relevantSports as sport}
        <option value={sport}>{sport}</option>
    {/each}

</select>
