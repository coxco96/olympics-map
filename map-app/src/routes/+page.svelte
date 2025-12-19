<script>
    // initial data pulled in from google sheet (see +page.server.js)
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    injectAnalytics();

    export let data;

    // components
    import Map from "$lib/components/Map.svelte";
    import Table from "$lib/components/Table.svelte";
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    import EventsFilter from "$lib/components/EventsFilter.svelte";
    import { Container, Col, Row } from "@sveltestrap/sveltestrap";
    import { fade } from 'svelte/transition';

    // functions and data structures to process data
    import {
        convertData,
        filterData,
        eventsByYear,
    } from "$lib/utils/exports.js";

    // stores, context and lifecycle
    import {
        filteredDataStore,
        selectedYear,
        selectedSport,
        selectedEvent,
        pointsTotalStore,
        maxPointsStore,
    } from "$lib/utils/stores.js";
    import { initialDataContext } from "$lib/utils/context.js";
    import { setContext } from "svelte";

    // reactive declarations to update local variables from stores using $ syntax
    $: year = $selectedYear;
    $: sport = $selectedSport;
    $: sportEvent = $selectedEvent;

    let initialData;

    /* SET CONTEXT WITH INITIAL DATA */
    $: {
        if (data) {
            initialData = convertData(data);
            setContext(initialDataContext, initialData);
        }
    }

    // Filter the data and write it to the store
    $: {
        if (initialData) {
            const filteredData = filterData(year, sport, sportEvent, initialData);
            filteredDataStore.set(filteredData);
            processMedalStats(filteredData);
        }
    }

    function processMedalStats(filteredData) {
        let arr = [];
        let mostPoints = 1;

        for (let country in filteredData) {
            let pointsTotal = 0;
            let countryData = filteredData[country];
            
            countryData.forEach((row) => {
                if (row.medal === "Gold") pointsTotal += 4;
                else if (row.medal === "Silver") pointsTotal += 3;
                else if (row.medal === "Bronze") pointsTotal += 2;
            });

            if (pointsTotal !== 0) {
                arr.push(pointsTotal);
            }
            if (pointsTotal > mostPoints) {
                mostPoints = pointsTotal;
            }
        }

        if (mostPoints < 2) mostPoints = 2;
        
        pointsTotalStore.set(arr.sort((a, b) => a - b));
        
        if (isFinite(mostPoints)) {
            maxPointsStore.set(mostPoints);
        }
    }

    let tableView = false; 

    function toggleView() {
        tableView = !tableView;
    }
</script>

<main>
    <Container class="mt-2 pb-5">
        <Row>
            <Col md="8">
                <span class="visually-hidden">
                    Note for users of assistive technology: This page contains a world map visually showing medal counts with color. 
                    Darker colors mean more medals. A popup displays specific data on hover. 
                    Use the "Table" tab to explore the same data in a screen-reader friendly format.
                </span>
            </Col>
        </Row>

        <Col class="mb-3">
            <div class="toggle-container" role="tablist" aria-label="View selection">
                <button
                    type="button"
                    role="tab"
                    aria-selected={!tableView}
                    aria-controls="view-content"
                    class="toggle-btn"
                    on:click={() => tableView && toggleView()}
                >
                    Map
                    {#if !tableView}
                        <span class="underline" aria-hidden="true"></span>
                    {/if}
                </button>

                <span class="separator" aria-hidden="true">|</span>

                <button
                    type="button"
                    role="tab"
                    aria-selected={tableView}
                    aria-controls="view-content"
                    class="toggle-btn"
                    on:click={() => !tableView && toggleView()}
                >
                    Table
                    {#if tableView}
                        <span class="underline" aria-hidden="true"></span>
                    {/if}
                </button>
            </div>
        </Col>

        <Row class="g-4 mb-4">
            <Col xs="12" md="4"><YearsFilter /></Col>
            <Col xs="12" md="4"><SportsFilter /></Col>
            <Col xs="12" md="4"><EventsFilter /></Col>
        </Row>

        <Row>
            <Col id="view-content">
                {#if tableView}
                    <div transition:fade={{ duration: 200 }}>
                        <Table />
                    </div>
                {:else}
                    <div transition:fade={{ duration: 200 }}>
                        <Map />
                    </div>
                {/if}
            </Col>
        </Row>
    </Container>
</main>

<style>
    .toggle-container {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
    }

    .toggle-btn {
        background: none;
        border: none;
        padding: 4px 0;
        margin: 0;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        color: #86868b;
        transition: color 0.2s ease;
    }

    .toggle-btn[aria-selected="true"] {
        color: #000;
        font-weight: 500;
    }

    .underline {
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: currentColor;
        border-radius: 2px;
    }

    .separator {
        color: #d2d2d7;
        font-size: 12px;
        user-select: none;
    }

    .toggle-btn:focus-visible {
        outline: 2px solid #0071e3;
        outline-offset: 4px;
        border-radius: 2px;
    }

    /* Mobile responsiveness for filters */
    @media (max-width: 768px) {
        :global(.col-12) {
            margin-bottom: 1rem;
        }

        :global(.minimal-select) {
            font-size: 16px !important;
        }
    }
</style>