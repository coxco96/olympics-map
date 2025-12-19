<script>
    import { Table } from "@sveltestrap/sveltestrap";
    import { filteredDataStore } from "$lib/utils/stores.js";

    let sortBy = "pointsTotal";
    let filteredData = {};

    $: filteredDataStore.subscribe((value) => (filteredData = value));

    function makeTableData(data, sortType) {
        if (!data) return [];
        let tableArr = Object.entries(data).map(([country, rows]) => {
            let gold = 0, silver = 0, bronze = 0, total = 0;
            rows.forEach((row) => {
                if (row.medal === "Gold") { gold++; total += 3; } 
                else if (row.medal === "Silver") { silver++; total += 2; } 
                else if (row.medal === "Bronze") { bronze++; total += 1; }
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
    $: nextAction = sortBy === "pointsTotal" ? "Sort alphabetically" : "Sort by rank";
</script>

<div class="olympic-table-root">
    <div class="sort-action-row">
        <button
            type="button"
            class="sort-btn"
            on:click={toggleSort}
            aria-label={nextAction}
            title={nextAction}
        >
            <span class="sort-icon" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
            <span class="sort-text">
                Sorted by <span class="active-val">{sortBy === "pointsTotal" ? "rank" : "alphabet"}</span>
            </span>
        </button>
    </div>

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
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        margin-top: 1rem;
    }

    .sort-action-row {
        margin-bottom: 1.25rem;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1001; /* Must be higher than the sticky TH */
    }

    .sort-btn {
        background: none;
        border: none;
        padding: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        color: #86868b;
        font-size: 0.875rem;
    }

    .active-val {
        color: #1d1d1f;
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-color: rgba(0, 0, 0, 0.1);
    }

    /* THE STICKY CORE */
    .table-scroll-container {
        overflow: visible !important;
    }

    /* Sveltestrap responsive wrapper often has overflow-x: auto, which kills sticky */
    .table-scroll-container :global(.table-responsive) {
        overflow: visible !important;
    }

    .table-scroll-container :global(table) {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    .table-scroll-container :global(th) {
        position: sticky !important;
        top: 56px; /* Match Navbar Height */
        z-index: 1000;
        background-color: rgba(255, 255, 255, 0.9);
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

    /* The "Glass Bridge" - fills the gap between Navbar and Table Header */
    .table-scroll-container :global(th::before) {
        content: "";
        position: absolute;
        top: -56px;
        left: 0;
        right: 0;
        height: 56px;
        background: inherit;
        backdrop-filter: inherit;
        pointer-events: none;
    }

    .table-scroll-container :global(td) {
        padding: 16px 16px 16px 0;
        font-size: 0.93rem;
        color: #1d1d1f;
        border-bottom: 1px solid #f2f2f7 !important;
    }

    .modern-row:nth-child(even) td { background-color: #fbfbfc; }
    .modern-row:hover td { background-color: #f2f2f7 !important; }
    .country-name { font-weight: 500; }
    .w-country { width: 45%; }
    .w-medal { width: 18%; }
</style>