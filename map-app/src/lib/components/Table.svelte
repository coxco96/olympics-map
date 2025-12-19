<script>
    import { Table } from "@sveltestrap/sveltestrap";
    import { filteredDataStore } from "$lib/utils/stores.js";

    let sortBy = "pointsTotal";
    let filteredData = {};

    $: filteredDataStore.subscribe((value) => (filteredData = value));

    function makeTableData(data, sortType) {
        if (!data) return [];
        let tableArr = Object.entries(data).map(([country, rows]) => {
            let gold = 0,
                silver = 0,
                bronze = 0,
                total = 0;
            rows.forEach((row) => {
                if (row.medal === "Gold") {
                    gold++;
                    total += 3;
                } else if (row.medal === "Silver") {
                    silver++;
                    total += 2;
                } else if (row.medal === "Bronze") {
                    bronze++;
                    total += 1;
                }
            });
            return { country, gold, silver, bronze, total };
        });

        return sortType === "pointsTotal"
            ? tableArr.sort((a, b) => b.total - a.total)
            : tableArr.sort((a, b) => a.country.localeCompare(b.country));
    }

    function toggleSort() {
        sortBy = sortBy === "pointsTotal" ? "country" : "pointsTotal";
    }

    $: tableData = makeTableData(filteredData, sortBy);
    $: nextAction =
        sortBy === "pointsTotal" ? "Sort alphabetically" : "Sort by rank";
</script>

<div class="olympic-table-root">
    <header class="controls">
        <button
            type="button"
            class="sort-btn"
            on:click={toggleSort}
            aria-label={nextAction}
        >
            <span class="icon" aria-hidden="true">
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                >
                    <path
                        d="m9 18 6-6-6-6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </span>
            <span class="label"
                >Sorted by <span class="current"
                    >{sortBy === "pointsTotal" ? "rank" : "alphabet"}</span
                ></span
            >
        </button>
    </header>

    <div class="table-scroll-container">
        <Table borderless={true} responsive={true}>
            <thead>
                <tr>
                    <th scope="col" class="w-country">Country</th>
                    <th scope="col" class="w-medal">Gold</th>
                    <th scope="col" class="w-medal">Silver</th>
                    <th scope="col" class="w-medal">Bronze</th>
                </tr>
            </thead>
            <tbody>
                {#each tableData as item (item.country)}
                    <tr class="modern-row">
                        <td class="country-name">{item.country}</td>
                        <td class="num-cell">{item.gold}</td>
                        <td class="num-cell">{item.silver}</td>
                        <td class="num-cell">{item.bronze}</td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    </div>
</div>

<style>
    .olympic-table-root {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            sans-serif;
        margin-top: 1.5rem;
    }

    .controls {
        margin-bottom: 1rem;
    }

    .sort-btn {
        background: none;
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #86868b;
        font-size: 0.875rem;
    }

    .sort-btn .current {
        color: #1d1d1f;
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 4px;
        text-decoration-color: rgba(0, 0, 0, 0.1);
    }


    .table-scroll-container {
        max-height: 600px; 
        overflow-y: auto;
        border-top: 1px solid #f2f2f7;
    }

    .table-scroll-container :global(table) {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    .table-scroll-container :global(thead) {
        position: sticky;
        top: 0;
        z-index: 10;
        background: white; 
    }

    .table-scroll-container :global(th) {
        text-align: left;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        color: #86868b;
        font-weight: 600;
        padding: 12px 16px 12px 0;
        border-bottom: 2px solid #1d1d1f !important; 
    }

    .table-scroll-container :global(td) {
        padding: 16px 16px 16px 0;
        font-size: 0.93rem;
        color: #1d1d1f;
        border-bottom: 1px solid #f2f2f7 !important;
    }


    .modern-row:nth-child(even) td {
        background-color: #fbfbfc; 
    }

    .modern-row:hover td {
        background-color: #f2f2f7 !important; 
        cursor: default;
    }

    .country-name {
        font-weight: 500;
    }
    .num-cell {
        color: #424245;
    } 

    .w-country {
        width: 45%;
    }
    .w-medal {
        width: 18%;
    }

    /* hide scrollbar for Chrome/Safari but keep functionality */
    .table-scroll-container::-webkit-scrollbar {
        width: 4px;
    }
    .table-scroll-container::-webkit-scrollbar-thumb {
        background: #d2d2d7;
        border-radius: 10px;
    }

    .table-scroll-container {
        overflow: visible; 
        position: relative;
        border-top: 1px solid #f2f2f7;
    }

    .table-scroll-container :global(th) {
        position: sticky;
        top: 0px; /* if I end up making the nav bar sticky, change this to its height */
        z-index: 100;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        text-align: left;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.06em;
        color: #86868b;
        font-weight: 600;
        padding: 16px 16px 16px 0;
        border-bottom: 1px solid #d2d2d7 !important;
    }

    /* ensure the table doesn't have an overflow wrapper from Sveltestrap */
    .table-scroll-container :global(.table-responsive) {
        overflow: visible !important;
    }
</style>
