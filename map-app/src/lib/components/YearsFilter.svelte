<script>
    export let selectedYear;
    import {yearsArray} from '$lib/utils/exports.js';
</script>

<select bind:value={selectedYear} class="form-select" name="Year">
    {#each yearsArray.reverse() as year}
        {#if year == "1906 (intercalary games)" || year == "1916 (not held)" || year == "1940 (not held)" || year == "1944 (not held)"}
            <option
                class="s-y_bCXRrkrYfP"
                disabled="True"
                value={year}>{year}</option
            >
        {:else}
            <option value={year}
                >{year}</option
            >
        {/if}
    {/each}
</select>