<script>
    // export let dataObj;
    import {Table} from '@sveltestrap/sveltestrap'
    import {getRelevantCountryData} from '$lib/utils/exports.js';
    // console.log(dataObj);
    // console.log(getRelevantCountryData(dataObj));
    import { dataStore } from '$lib/stores/filters.js';
    import { onDestroy, onMount } from 'svelte';

    let data = [];
    let columns = [];
    const unsubscribe = dataStore.subscribe(value => {
        data = value
        if (data.length > 0) {
            columns = Object.keys(data[0]);
        }
    });
    onDestroy(() => {
        // clean up the subscription when Table is destroyed
        unsubscribe()
    })

    onMount(() => {
        console.log(data);
    })

</script>

{JSON.stringify(data, null, 2)}
<!-- this is the sveltestrap Table component, not a self-reference -->
<Table>
    <thead>
        <tr>
            <th>Country</th>
            <th>Gold Medals</th>
            <th>Silver Medals</th>
            <th>Bronze Medals</th>
        </tr>
    </thead>
    <tbody>
        <!-- {#each data as row, i}
        <tr>
            {row}
            {#each columns as column}
            <td>{row[column]}</td>
            {/each}
        </tr>
        
        {/each} -->
        
    </tbody>
</Table>

