<script>
    import {eventsArray} from '$lib/utils/exports.js';
    export let selectedEvent, selectedSport, selectedYear;
</script>

<!-- TODO: show only sports relevant to selectedYear and selectedSport -->
<select bind:value={selectedEvent} class="form-select" name="Event">
    {#each eventsArray as sportEvent}
            <option value={sportEvent}
                >{sportEvent}</option
            >
    {/each}
</select>