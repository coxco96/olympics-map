<script>
    // initial data pulled in from google sheet
    export let data;

    // components
    import Map from "$lib/components/Map.svelte";
    import Table from "$lib/components/Table.svelte";
    import YearsFilter from "$lib/components/YearsFilter.svelte";
    import SportsFilter from "$lib/components/SportsFilter.svelte";
    import EventsFilter from "$lib/components/EventsFilter.svelte";
    import { Container, Col, Row, InputGroup } from "@sveltestrap/sveltestrap";

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
        pointsTotalArr = arr.sort((a,b)=> a-b); // sort lowest to highest
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
    <Container class="mt-5">
        <Row>
            <Col md="8">
                <h1 class="display-4">Olympic Medal Counts</h1>
                <p class='lead' style='font-weight: 450; font-size:1rem; margin-bottom: .6rem;'>Designed and developed by Courtney Cox | <a href='https://www.mapcourt.com' target='_blank'>mapcourt.com</a></p>
                <p class="lead" >Hover over the map for detailed information, and use filters to customize your view.</p>
            </Col>


        </Row>
        <Row class="mb-3">
            <!-- TODO: check form accessibility here -->

            <Col>
                    <InputGroup>
                        <Col>
                            <YearsFilter />
                        </Col>
                    
                        <Col style='margin-right: 5px; margin-left: 5px;'>
                            <SportsFilter />
                        </Col>
                        <Col>
                            <EventsFilter />
                        </Col>
                    </InputGroup>

                    <Row class="mt-3">
                        <Col>
                            <button class="map-table-toggle" on:click={toggleView}>
                                {tableView ? "View as map" : "View as table"}
                            </button>
                        </Col>
                    </Row>
                
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


        <Row class='d-flex justify-content-end'>
            <div class="mt-3 right-align-container">
                <p>Sources: Olympedia (1896-2023 Games); Olympic Games (2024 Games); @aourednik via Github (historic basemaps).</p>
            </div>
        </Row>
    </Container>
</main>

<style>

.right-align-container {
        display: flex;
        justify-content: flex-end;
    }

    h1, p {
        color: rgb(250, 250, 250);
    }

    a {
        color:rgb(138, 247, 255);
    }

    /* .map-table-toggle {
        border-left: solid 1px black;
        margin-left: 20px;
    } */
</style>
