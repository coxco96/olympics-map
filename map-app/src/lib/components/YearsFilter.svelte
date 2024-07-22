<script>
    import {selectedYear, selectedSport, selectedEvent} from '$lib/stores/filters.js';
    import {yearsArray} from '$lib/utils/exports.js';

    let sport, year, sportEvent;
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value)
    $: selectedEvent.subscribe(value => sportEvent = value)

    function handleChange(event) {
        selectedYear.set(event.target.value);
    }

    $: console.log(`year from YearsFilter: ${year}`)
    $: console.log(`sport from YearsFilter: ${sport}`)

</script>

<select bind:value={year} on:change={handleChange} class="form-select" name="Year">
    {#each yearsArray.reverse() as year}
        {#if year == "1906 (intercalary games)" || year == "1916 (not held)" || year == "1940 (not held)" || year == "1944 (not held)"}
            <option
                class="s-y_bCXRrkrYfP"
                disabled="True"
                value={year}>{year}</option
            >
        {:else}
            <option value={year}
                >
            <!-- TODO: add sun or snow icon here based on whether summer or winter -->
                {year}
                </option
            >
        {/if}
    {/each}
</select>