<script>
    export let data;
    import Map from './Map.svelte';
    import { Container, Col, Row } from "@sveltestrap/sveltestrap";
    console.log(data);
</script>

<main>
    
   <Container class='mt-5'>
        <Row>
            <Col md='6'>
                <h1 class="display-4">Olympics Map</h1>
                <p class="lead">
                    Medals won etc etc
                </p>
            </Col>
        </Row>
        <Row>
            <Col>
            <Map/>
            </Col>
        </Row>
    </Container>
</main>
