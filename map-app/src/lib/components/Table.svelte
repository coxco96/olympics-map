<script>
    import { Table, Button } from "@sveltestrap/sveltestrap";
    import { filteredDataStore, pointsTotalStore } from "$lib/utils/stores.js";

    // button toggle state
    let sortBy = "pointsTotal"; // default sorting option

    // subscribe to filterDataStore
    let filteredData;
    let pointsTotalArr;
    $: filteredDataStore.subscribe((value) => (filteredData = value));
    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));

    function makeTableArr(filteredData, sortBy) {
        let tableArr = [];
        let countryData;
        for (let country in filteredData) {
            let goldCount = 0;
            let silverCount = 0;
            let bronzeCount = 0;
            let pointsTotal = 0;
            countryData = filteredData[country];
            countryData.forEach((row) => {
                // destructure row object to access medal
                const { medal } = row;

                // count medals
                if (medal === "Gold") {
                    goldCount++;
                    pointsTotal += 3;
                } else if (medal === "Silver") {
                    silverCount++;
                    pointsTotal += 2;
                } else if (medal === "Bronze") {
                    bronzeCount++;
                    pointsTotal += 1;
                }
            });
            tableArr.push([
                country,
                goldCount,
                silverCount,
                bronzeCount,
                pointsTotal,
            ]);
        }
        // determine how to sort
        if (sortBy === "pointsTotal") {
            tableArr.sort((a, b) => b[4] - a[4]); // sort by points
        } else if (sortBy === "country") {
            tableArr.sort((a, b) => a[0].localeCompare(b[0])); // sort alphabetically by country
        }
        return tableArr;
    }

    function toggleSort() {
        sortBy = sortBy === "pointsTotal" ? "country" : "pointsTotal";
    }

    $: buttonText =
        sortBy === "pointsTotal" ? "<span style='font-size: .875rem;'>Sorted by rank</span>" : "<span style='font-size: .875rem;'>Sorted alphabetically</span>";

    $: buttonHoverText = sortBy === 'pointsTotal' ? 'Sort alphabetically' : 'Sort by rank';
    $: tableData = makeTableArr(filteredData, sortBy);
</script>

<div>
    <Button class="mt-2" color={"dark"} on:click={toggleSort} title={buttonHoverText}>
        {@html buttonText}
    </Button>
</div>

<!-- this is the sveltestrap Table component, not a self-reference -->
<Table>
    <thead>
        <tr>
            <th class="th">Country</th>
            <th class="th">Gold</th>
            <th class="th">Silver</th>
            <th class="th">Bronze</th>
        </tr>
    </thead>
    <tbody>
        {#each tableData as arr, i}
            <tr>
                {#each arr.slice(0, 4) as x}
                    <td>{x}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</Table>

<style>
    tbody {
        font-size: 0.9rem;
    }

    .th {
        text-transform: uppercase;
        font-size: 0.85rem;
    }
</style>
