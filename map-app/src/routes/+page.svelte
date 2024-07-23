<script>
    export let data;
    import Map from '$lib/components/Map.svelte';
    import Table from '$lib/components/Table.svelte';
    import {convertData} from '../lib/utils/exports.js';
    import { Container, Col, Row, InputGroup, Input} from "@sveltestrap/sveltestrap";
    import Filters from '$lib/components/Filters.svelte';

    const dataObj = convertData(data);

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
                <Filters/>
                </Col>
                
            </InputGroup>
            <Col>
            <button on:click={toggleView}>
            {tableView ? 'Switch to Map View' : 'Switch to Table View'}
            </button>
            </Col>
        </Row>

        <Row>
            <Col>
                {#if tableView}
                <Table {dataObj}/>
                {:else}
                <Map {dataObj}/>
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
