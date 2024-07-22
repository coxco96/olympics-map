<script>
    import {selectedSport, selectedYear, selectedEvent} from '$lib/stores/filters.js';
    import {eventsByYear} from '$lib/utils/exports.js';


    let sport, year, sportEvent;
    $: selectedSport.subscribe(value => sport = value);
    $: selectedYear.subscribe(value => year = value)
    $: selectedEvent.subscribe(value => sportEvent = value)

    function handleChange(event) {
        selectedSport.set(event.target.value);
    }
    
    let relevantSports;

    $: {
        if (year) {
            relevantSports = Object.keys(eventsByYear[year] || {}).sort();
        
        } else {
            relevantSports = [];
        }
    }

</script>

<!-- TODO: show only sports relevant to selectedYear -->
<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each relevantSports as sport}
            <option value={sport}
                >{sport}</option
            >
    {/each}
</select>
