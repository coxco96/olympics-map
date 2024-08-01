<script>
    // initial data pulled in from google sheet
    export let data;

    // components
    import Map from "$lib/components/Map.svelte";
    import Table from "$lib/components/Table.svelte";
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    import EventsFilter from "$lib/components/EventsFilter.svelte";
    import { Container, Col, Row, Button } from "@sveltestrap/sveltestrap";

    // function to convert data into object
    import { convertData, filterData } from "../lib/utils/exports.js";

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

    // predeclared vars
    let initialData;

    /* SET CONTEXT WITH INITIAL DATA AND ALSO AS THE INITIAL STORE */
    $: {
        if (data) {
            initialData = convertData(data); // convert to object by country
            setContext(initialDataContext, initialData);
        }
    }

    let sport, year, sportEvent;
    $: selectedYear.subscribe((value) => (year = value));
    $: selectedSport.subscribe((value) => (sport = value));
    $: selectedEvent.subscribe((value) => (sportEvent = value));

    // reactive declarations to update local variables from stores
    $: year = $selectedYear;
    $: sport = $selectedSport;
    $: sportEvent = $selectedEvent;

    // TODO & question: why doesn't filteredData and pointsTotalArr need those reactive declarations, too? ^

    // filter the data and write it to the store
    let filteredData;
    $: {
        filteredData = filterData(year, sport, sportEvent, initialData);
        filteredDataStore.set(filteredData);
    }

    let pointsTotalArr = [];
    $: if (filteredData) {
        let arr = [];
        let mostPoints = 1;
        for (let country in filteredData) {
            let pointsTotal = 0; // initialize
            let countryData = filteredData[country];
            countryData.forEach((row) => {
                // destructure row object to access medal
                const { medal } = row;

                // count medals
                if (medal === "Gold") {
                    pointsTotal += 3;
                } else if (medal === "Silver") {
                    pointsTotal += 2;
                } else if (medal === "Bronze") {
                    pointsTotal += 1;
                }
            });
            // if pointsTotal is not 0, push it to pointsTotal
            if (pointsTotal != 0) {
                arr.push(pointsTotal);
            }
            if (pointsTotal > mostPoints) {
                mostPoints = pointsTotal;
            }
        }
        if (mostPoints < 2) {
            mostPoints = 2;
        }
        pointsTotalArr = arr.sort((a, b) => a - b); // sort lowest to highest
        pointsTotalStore.set(pointsTotalArr); // this is in case want to later use all  values to create statistical breaks in color gradient
        if (isFinite(mostPoints)) {
            maxPointsStore.set(mostPoints);
        } else {
            console.log("error: mostPoints was not finite...", mostPoints);
        }
    }

    // TODO: default to tableView for screen reader devices (and possibly mobile?)
    let tableView = false; // default to map instead of table

    function toggleView() {
        tableView = !tableView;
    }
</script>

<main>
    <Container class="mt-2">
        <Row>
            <Col md="8">
                <h1 class="display-4">Olympic Medal Counts</h1>
                <p
                    class="lead"
                    style="font-weight: 450; font-size:1rem; margin-bottom: .6rem;"
                >
                    Designed and developed by Courtney Lastname | <a
                        href="https://www.mapcourt.com"
                        target="_blank">mywebsite.com</a
                    >
                </p>
                <p class="lead">
                    Hover over the map for detailed information, and use filters
                    to customize your view.
                </p>
            </Col>
        </Row>
        <Row class="mb-3 g-2">
            <!-- TODO: check form accessibility here -->

            <Col xs={{ size: 6 }} lg={{ size: 3 }}>
                <YearsFilter />
            </Col>
            <Col xs={{ size: 6 }} lg={{ size: 2 }}>
                <SportsFilter />
            </Col>
            <Col xs={{ size: 6 }} lg={{ size: 2 }}>
                <EventsFilter />
            </Col>

            <Col xs={{ size: 6 }} lg={{ size: 3 }}>
                <Button color="dark" on:click={toggleView}>
                    <div class="map-table-toggle">
                        {tableView ? "View as map" : "View as table"}
                    </div>
                </Button>
            </Col>
        </Row>

        <Row>
            <Col>
                {#if tableView}
                    <Table />
                {:else}
                    <Map />
                {/if}
            </Col>
        </Row>

        <Row class="d-flex justify-content-end">
            <div class="mt-3 right-align-container">
                <p>
                    Sources: Olympedia (1896-2023 Games); Olympic Games (2024
                    Games); @aourednik via Github (historic basemaps).
                </p>
            </div>
        </Row>
    </Container>
</main>

<style>
    .right-align-container {
        display: flex;
        justify-content: flex-end;
    }

    h1,
    p {
        color: #fffafa;
    }

    @media (prefers-contrast: more) {
        h1, p {
            color: black;
        }

        a {
            color: blue;
        }
    }

    h1 {
        font-weight: 600;
    }

    a {
        color: rgb(138, 247, 255);
    }

</style>
