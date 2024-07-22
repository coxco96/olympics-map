<script>
    export let data;
    import Map from '$lib/components/Map.svelte';
    import {convertData} from '../lib/utils/exports.js';
    import { Container, Col, Row, InputGroup, Input} from "@sveltestrap/sveltestrap";
    import Filters from '$lib/components/Filters.svelte';
    $: selectedYear = "All years (1896-2024)";
    $: selectedSport = 'All sports';
    $: selectedEvent = 'All events';


    const dataObj = convertData(data);
    
    // need to convert this data into something that can filter only to the year
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
        </Row>
        <Row>
            <Col>
                <Map {selectedYear} {dataObj}/>
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
