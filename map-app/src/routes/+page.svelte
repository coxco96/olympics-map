<script>
    // initial data pulled in from google sheet
    export let data;

    // components
    import Map from "$lib/components/Map.svelte";
    import Table from "$lib/components/Table.svelte";
    import Filters from "$lib/components/Filters.svelte";
    import { Container, Col, Row, InputGroup, Input } from "@sveltestrap/sveltestrap";

    // function to convert data into object
    import { convertData, filterData } from "../lib/utils/exports.js";
    
    // stores, context and lifecycle
    import { filteredDataStore, selectedYear, selectedSport, selectedEvent } from "$lib/utils/stores.js";
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
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
    $: selectedEvent.subscribe(value => sportEvent = value);

    // reactive declarations to update local variables from stores
    $: year = $selectedYear;
    $: sport = $selectedSport;
    $: sportEvent = $selectedEvent;

    // filter the data and write it to the store
    let filteredData;
    $: {
        filteredData = filterData(year, sport, sportEvent, initialData);
        filteredDataStore.set(filteredData);
    }



   

    // const dataObj = convertData(data);

    let tableView = false; // default to map instead of table

    function toggleView() {
        tableView = !tableView;
    }
</script>

<main>
    <Container class="mt-5">
        <Row>
            <Col md="6">
                <h1 class="display-4">Olympics Map</h1>
                <p class="lead">Medals won etc etc</p>
            </Col>
        </Row>
        <Row class="mb-3">
            <!-- TODO: check form accessibility here -->
            <InputGroup>
                <Col>
                    <Filters />
                </Col>
            </InputGroup>
            <Col>
                <button on:click={toggleView}>
                    {tableView ? "Switch to Map View" : "Switch to Table View"}
                </button>
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
        <!-- <Row>
            <footer class="footer">
                <figure class="text-end">
                    <blockquote class="blockquote">
                        <p>
                            I was built this way for a reason, so I'm going to
                            use it.
                        </p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                        <cite title="Simone Biles">Simone Biles</cite>
                    </figcaption>
                </figure>
            </footer>
        </Row> -->
    </Container>
</main>

<style>
</style>
