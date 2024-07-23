<script>
    import {selectedYear, selectedSport, selectedEvent} from '$lib/stores/filters.js';
    import {yearsArray} from '$lib/utils/exports.js';

    let sport, year, sportEvent;
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value)
    $: selectedEvent.subscribe(value => sportEvent = value)

    // Convert yearsArray to numbers and find the minimum
    let minYear = 1896;
    let maxYear = 2024;


    let steps = yearsArray
        .map(y => +y) // convert to numbers
        .filter(y => !isNaN(y)) // remove any non-numeric values
        .sort((a, b) => a - b); // sort in ascending order



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

<select bind:value={sport} on:change={handleChange} class="form-select" name="Sport">
    {#each yearsArray.reverse() as year}
            <option value={year}
                >{year}</option
            >
    {/each}
</select>

