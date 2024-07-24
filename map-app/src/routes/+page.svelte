<script>
    // initial data pulled in from google sheet
    export let data;

    // components
    import Map from "$lib/components/Map.svelte";
    import Table from "$lib/components/Table.svelte";
    import Filters from "$lib/components/Filters.svelte";
    import { Container, Col, Row, InputGroup, Input } from "@sveltestrap/sveltestrap";

    // function to convert data into object
    import { convertData } from "../lib/utils/exports.js";
    
    // stores, context and lifecycle
    import { onDestroy, setContext } from "svelte";
    import { filteredDataStore, selectedYear, selectedSport, selectedEvent } from "$lib/utils/stores.js";
    import { initialDataContext } from "$lib/utils/context.js";

    // predeclared vars
    let initialData;
    let filtered = [];


    // once data is imported, convert it to object by country, then 
    // set intialDataContext with that object
    $: {
        if (data) {
            initialData = convertData(data);
            setContext(initialDataContext, initialData);
        }
    }




    // $: {
    //     if (initialData) {
    //         filtered = filterData(initialData)
    //         filteredDataStore.set(filtered)
    //     }
    // }

    // $: {
    //     if (initialData) {
    //         filtered = initialData.filter((item) => {
    //             return item;
    //         });
    //         filteredDataStore.set(filtered);
    //     }
    // }

    function filterData(d) {
        if (initialData) {
            return initialData;
        }
    }

    // subscribe to initialDataContext
    // const unsubscribeContext = initialDataContext.subscribe((value) => {
    //     console.log(value);
    //     initialData = convertData(value);
    // });

    // // subscribe to filter stores
    // const unsubscribeYear = selectedYear.subscribe(() => filterData());
    // const unsubscribeSport = selectedSport.subscribe(() => filterData());
    // const unsubscribeEvent = selectedEvent.subscribe(() => filterData());

  

    // clean up subscriptions on destroy
    // onDestroy(() => {
    //     unsubscribeContext();
    //     unsubscribeYear();
    //     unsubscribeSport();
    //     unsubscribeEvent();
    // });

    //     onMount(() => {
    //         // convert the data to an object by country
    //         const convertedData = convertData(data)
    //         // set the context with this converted data so it is always accessible
    //         initialDataContext.set(convertedData);

    // ;
    //     });

    const dataObj = convertData(data);
    // console.log(dataObj);

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
                    <Map {dataObj} />
                {/if}
            </Col>
        </Row>
        <Row>
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
        </Row>
    </Container>
</main>

<style>
</style>
