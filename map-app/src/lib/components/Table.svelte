<script>
    import {Table} from '@sveltestrap/sveltestrap'
    import { filteredDataStore } from '$lib/utils/stores.js';
    // import { onDestroy, onMount } from 'svelte';

    // subscribe to filterDataStore
    let filteredData;
    $: filteredDataStore.subscribe(value => filteredData = value);
    $: console.log(filteredData);

    let sortBy = 'pointsTotal'; // default sorting option

    function makeTableArr (filteredData, sortBy) {
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
        // determine how to sort
        if (sortBy === 'pointsTotal') {
            tableArr.sort((a,b) => b[4] - a[4]) // sort by points
        } else if (sortBy == 'country') {
            tableArr.sort((a,b) => a[0].localeCompare(b[0])); // sort alphabetically by country
        }
            // // sort based on pointsTotal
            // tableArr.sort((a,b) => b[4] - a[4])
            return tableArr;
    }

    function handleSortChange(event) {
        sortBy = event.target.value;
        tableData = makeTableArr(filteredData, sortBy)
    }

    $: tableData = makeTableArr(filteredData);
    $: console.log(tableData);

</script>

<!-- this is the sveltestrap Table component, not a self-reference -->
<!-- Dropdown for sorting options -->
<div>
    <label for="sortOptions">Sort by:</label>
    <select id="sortOptions" on:change={handleSortChange}>
        <option value="pointsTotal">Results</option>
        <option value="country">Country (Alphabetically)</option>
    </select>
</div>

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
            {#each arr.slice(0,4) as x}
            <td>{x}</td>
            {/each}
        </tr>
        {/each}
        
    </tbody>
</Table>

