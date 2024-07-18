<script>
    export let data;
    import Map from "./Map.svelte";
    import { Container, Col, Row, Input } from "@sveltestrap/sveltestrap";
    // console.log(data);
</script>

<main>
    <Container class="mt-5">
        <Row>
            <Col md="6">
                <h1 class="display-4">Olympics Map</h1>
                <p class="lead">Medals won etc etc</p>
            </Col>
        </Row>
        <Row class='mb-3'>
            <Col>
                <Input type="select" placeholder="Select Sport">
                    <option value="alpha">All sports</option>
                    <option value="bravo">Bravo</option>
                    <option value="charlie">Charlie</option>
                </Input>
            </Col>
            <Col>
                <Input type="select" placeholder="Select Year">
                    <option value="alpha">All Years (1886-Present)</option>
                    <option value="bravo">Bravo</option>
                    <option value="charlie">Charlie</option>
                </Input>
            </Col>
        </Row>
        <Row>
            <Col>
                <Map />
            </Col>
        </Row>
        <Row>
            <footer class='footer'>
                <figure class="text-end">
                    <blockquote class="blockquote">
                      <p>I was built this way for a reason, so I'm going to use it.</p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                     <cite title="Simone Biles">Simone Biles</cite>
                    </figcaption>
                  </figure>
            </footer>
        </Row>
    </Container>
</main>
