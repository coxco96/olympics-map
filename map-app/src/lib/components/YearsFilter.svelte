<script>
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
    } from "$lib/utils/stores.js";
    import { yearsArray } from "$lib/utils/exports.js";
    let year = "All years (1896-2024)";
    let sport = "All sports";
    let sportEvent = "All events";

    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));

    function handleChange(event) {
        selectedYear.set(event.target.value);
    }

    yearsArray.reverse();
</script>

<select
    bind:value={year}
    on:change={handleChange}
    class="form-select"
    name="Year"
>
    {#each yearsArray as year}
        {#if year == "1916 (not held)" || year == "1940 (not held)" || year == "1944 (not held)"}
            <option value={year} disabled>{year}</option>
        {:else}
            <option value={year}>{year}</option>
        {/if}
    {/each}
</select>
