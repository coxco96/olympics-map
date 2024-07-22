<script>
    // import {sportsArray, eventsByYear} from '$lib/utils/exports.js';
    // export let selectedSport, selectedYear;
    // // console.log(eventsByYear[selectedYear]);
    // $: selectedYear;
    // $: console.log('selectedYear from SportsFilter', selectedYear)


    import {selectedSport, selectedYear} from '$lib/stores/filters.js';
    import {sportsArray, eventsByYear} from '$lib/utils/exports.js';

    let sport, year;
    $: selectedSport.subscribe(value => sport = value);
    $: selectedYear.subscribe(value => {
        year = value;
        // update sportsArray based on selected year
        // if (year) {
        //     sportsArray = Object.keys(eventsByYear[year] || {})
        // }
    })

    function handleChange(event) {
        selectedSport.set(event.target.value);
    }

</script>

<!-- TODO: show only sports relevant to selectedYear -->
<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each sportsArray as sport}
            <option value={sport}
                >{sport}</option
            >
    {/each}
</select>

<!-- <select bind:value={selectedSport} class='form-select' name='Sport'>
    {#if eventsByYear[selectedYear][selectedSport]}
    
{/if}
</select> -->