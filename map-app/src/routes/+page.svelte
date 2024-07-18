<script>
    export let data;
    import Map from "./Map.svelte";
    import Map2 from '$lib/Map2.svelte';
    import {yearsArray} from '../lib/utils/arrays.js';
    import { Container, Col, Row, InputGroup, Input} from "@sveltestrap/sveltestrap";
    // console.log(data);
    $: selectedYear = "All years (1896-2024)";

    
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
            <InputGroup>
                <Col>
                    <!-- TODO: check form accessibility here -->

                    <!-- include size="2" in select node for scroll box instead of dropdown -->
                    <select bind:value={selectedYear} class="form-select" name="Year">
                        {#each yearsArray.reverse() as year}
                            {#if year == "1906 (intercalary games)" || year == "1916 (not held)" || year == "1940 (not held)" || year == "1944 (not held)"}
                                <option
                                    class="s-y_bCXRrkrYfP"
                                    disabled="True"
                                    value={year}>{year}</option
                                >
                            {:else}
                                <option value={year}
                                    >{year}</option
                                >
                            {/if}
                        {/each}
                    </select>
                </Col>
                <Col>
                    <select class="form-select" name="Sport">
                        {#each yearsArray.reverse() as year}
                            <option
                                disabled="True"
                                value={year}>{year}</option
                            >
                        {/each}
                    </select>
                </Col>
            </InputGroup>
        </Row>
        <Row>
            <Col>
                <!-- <Map {selectedYear}/> -->
                <Map2 {selectedYear}/>
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
