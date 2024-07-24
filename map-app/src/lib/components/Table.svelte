<script>
    import {Table} from '@sveltestrap/sveltestrap'
    import { filteredDataStore } from '$lib/utils/stores.js';
    // import { onDestroy, onMount } from 'svelte';

    // subscribe to filterDataStore
    let filteredData;
    $: filteredDataStore.subscribe(value => filteredData = value);
    $: console.log(filteredData);


    function makeTableArr (filteredData) {
        let tableArr = [];
        let countryData;
        for (let country in filteredData) {
            let goldCount = 0;
            let silverCount = 0;
            let bronzeCount = 0;
            let pointsTotal = 0;
            // let medalCounts = {gold: 0, silver: 0, bronze: 0};
            countryData = filteredData[country];
            let countryArr = [];
            countryData.forEach(row => {
                // destructure row object to access medal
                const { medal } = row;
                
                // count medals
                if (medal === 'Gold') {
                    goldCount++
                    pointsTotal += 3;
                } else if (medal === 'Silver') {
                    silverCount++
                    pointsTotal += 2;
                } else if (medal ==='Bronze') {
                    bronzeCount++
                    pointsTotal += 1;
                }

            })
            tableArr.push([country, goldCount, silverCount, bronzeCount, pointsTotal])
        }
            return tableArr;
    }

    $: tableData = makeTableArr(filteredData);
    $: console.log(tableData);

</script>

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
        {#each tableData as arr}
        <tr>
            {#each arr as x}
            <td>{x}</td>
            {/each}
        </tr>
        {/each}
        
    </tbody>
</Table>

