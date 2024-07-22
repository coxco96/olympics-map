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

</script>

<div>
    <label for="year-slider">Select Year: {year}</label>
    <input
        id="year-slider"
        type="range"
        min={1896}
        max={2024}
        step="1"
        value={year}
        on:input={handleChange}
        class="form-range"
    />
</div>