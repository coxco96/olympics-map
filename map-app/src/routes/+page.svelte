<script>
    export let data;
    import Map from '$lib/components/Map.svelte';
    import {sportsArray, eventsArray, convertData} from '../lib/utils/exports.js';
    import { Container, Col, Row, InputGroup, Input} from "@sveltestrap/sveltestrap";
    import YearsFilter from '$lib/components/YearsFilter.svelte';
    import SportsFilter from '$lib/components/SportsFilter.svelte';
    $: selectedYear = "All years (1896-2024)";
    $: selectedSport = 'All sports';
    $: selectedEvent = 'All events';

    import {makeSportEventObj} from '$lib/utils/sportEvents.js';

    makeSportEventObj(data);

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
                    <!-- TODO: make this a scroll bar instead of dropdown -->
                    <YearsFilter {selectedYear}/>
                </Col>
                <Col>
                    <SportsFilter {selectedSport} {selectedYear}/>
                    
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
