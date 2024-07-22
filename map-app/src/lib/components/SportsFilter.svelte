<script>
    import {sportsArray} from '$lib/utils/exports.js';
    export let selectedSport, selectedYear;
</script>

<!-- TODO: show only sports relevant to selectedYear -->
<select bind:value={selectedSport} class="form-select" name="Sport">
    {#each sportsArray as sport}
            <option value={sport}
                >{sport}</option
            >
    {/each}
</select>