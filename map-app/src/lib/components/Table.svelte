<script>
    import {Table} from '@sveltestrap/sveltestrap'
    import { filteredDataStore, pointsTotalStore } from '$lib/utils/stores.js';

    // button toggle state
    let sortBy = 'pointsTotal'; // default sorting option

    // subscribe to filterDataStore
    let filteredData;
    let pointsTotalArr;
    $: filteredDataStore.subscribe(value => filteredData = value);
    $: pointsTotalStore.subscribe(value => pointsTotalArr = value);

    // NOT BEHAVING AS EXPECTED
    $: console.log(pointsTotalArr);

    function makeTableArr (filteredData, sortBy) {
        let tableArr = [];
        let countryData;
        for (let country in filteredData) {
            let goldCount = 0;
            let silverCount = 0;
            let bronzeCount = 0;
            let pointsTotal = 0;
            countryData = filteredData[country];
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
        } else if (sortBy === 'country') {
            tableArr.sort((a,b) => a[0].localeCompare(b[0])); // sort alphabetically by country
        }
            return tableArr;
    }

    function toggleSort() {
        sortBy = sortBy === 'pointsTotal' ? 'country' : 'pointsTotal';
    }

    $: buttonText = sortBy === 'pointsTotal' ? 'Sort by country' : 'Sort by results';

    $: tableData = makeTableArr(filteredData, sortBy);

</script>

<div>
    <button on:click={toggleSort}>{buttonText}</button>
</div>


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
            {#each arr.slice(0,4) as x}
            <td>{x}</td>
            {/each}
        </tr>
        {/each}
        
    </tbody>
</Table>

