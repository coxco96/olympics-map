<script>
    import {getContext} from 'svelte';
    import {selectedYear, selectedSport, selectedEvent, filteredDataStore} from '$lib/utils/stores.js';
    import {yearsArray} from '$lib/utils/exports.js';
    import {initialDataContext} from '$lib/utils/context.js';

    // access unfiltered data
    const initialData = getContext(initialDataContext);



    let sport, year, sportEvent, filteredData;
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
    $: selectedEvent.subscribe(value => sportEvent = value);

    $: console.log(`${year} from YearsFilter`)

    // Convert yearsArray to numbers and find the minimum
    // let minYear = 1896;
    // let maxYear = 2024;


    // let steps = yearsArray
    //     .map(y => +y) // convert to numbers
    //     .filter(y => !isNaN(y)) // remove any non-numeric values
    //     .sort((a, b) => a - b); // sort in ascending order



    function handleChange(event) {
        selectedYear.set(event.target.value);
    }

</script>



<!-- <div class="slider-container">
    <label for="year-slider">Selected Year: {year}</label>
    <input
        type="range"
        min={minYear}
        max={maxYear}
        step={1}
        value={year}
        on:input={handleChange}
        class="form-range"
        list="tickmarks"
    />

    <datalist id="tickmarks">
        {#each steps as step}
            <option value={step}>{step}</option>
        {/each}
    </datalist>
</div> -->

<select bind:value={year} on:change={handleChange} class="form-select" name="Year">
    {#each yearsArray.reverse() as year}
            <option value={year}
                >{year}</option
            >
    {/each}
</select>

