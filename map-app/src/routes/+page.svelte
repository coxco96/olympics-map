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
    import { filteredDataStore, selectedYear, selectedSport, selectedEvent } from "$lib/utils/stores.js";
    import { initialDataContext } from "$lib/utils/context.js";
    import { onDestroy, setContext } from "svelte";

    // predeclared vars
    let initialData;
    let filtered = [];


   /* SET CONTEXT WITH INITIAL DATA AND ALSO AS THE INITIAL STORE */
    $: {
        if (data) {
            initialData = convertData(data); // convert to object by country
            setContext(initialDataContext, initialData);
        }
    }


    /* SUBSCRIBE TO THE FILTER STORES */
    // const unsubscribeYear = selectedYear.subscribe(() => filterData());
    // const unsubscribeSport = selectedSport.subscribe(() => filterData());
    // const unsubscribeEvent = selectedEvent.subscribe(() => filterData());

    let sport, year, sportEvent, filteredData;
    $: selectedYear.subscribe(value => year = value);
    $: selectedSport.subscribe(value => sport = value);
    $: selectedEvent.subscribe(value => sportEvent = value);
    $: filteredDataStore.subscribe(value => {
        let filtered = filterData(year, sport, sportEvent);
        filtered = value;
    });



    let filteredArr = [];
    let filteredObj = {}
    function filterData(year, sport, sportEvent) {
        for (let country in initialData) {
            let countryData = initialData[country];
            let filteredCountryData = countryData.filter(x => {
                return (
                    x['year'] === year || x['year'] === ''
                    && x['sport'] === sport || x['sport'] === ''
                    && x['sportEvent'] == sportEvent || x['sportEvent'] === ''
                );
            })
            if (filteredCountryData.length > 0) {
                filteredArr.push(filteredCountryData)
            }
            filteredObj[country] = filteredArr;
        }
        console.log(filteredObj);
        return filteredObj;
    }
    
    


  
    // /* CLEAN UP SUBSCRIPTIONS ON DESTROY */
    // onDestroy(() => {
    //     unsubscribeYear();
    //     unsubscribeSport();
    //     unsubscribeEvent();
    // });
    // function filterData(d) {
    //     if (initialData) {
    //         return initialData;
    //     }
    // }

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
