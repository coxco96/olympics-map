<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
</script>

<!-- 
Structure is like this:

Container holds three Rows.
First Row is information.
Second Row is No medals.
Third Row is the Gradient.

Second Row contains two columns.
One is the color block; the other is the "No medals" text.

Third Row contains Two columns.
One is the vertical gradient rectangle; the other contains the "Less" and "Most" text.


-->

<Container>
    <div class="legend-container">

        <div class='first-row'>
            <Row class='mb-2'>
                <Col><div class='info-text'>Medal count is weighted by medal type.</div></Col>
            </Row>
        </div>

        <div class="second-row">
            <Row class='g-1 mb-1'>
                <Col xs={{ size: 3 }}>
                    <div class="no-medals-color"></div>
                </Col>
                <Col xs={{ size: 9 }} class="justify-content-start">
                    <div class="text no-medals-text">No medals</div>
                </Col>
            </Row>
        </div>
        <div class='third-row'>
            <Row class='g-1'>
                <Col xs={{size: 2}}><div class='text gradient-text'>Least</div></Col>
                <Col xs={{size: 8}}><div class='gradient-rectangle'></div></Col>
                <Col xs={{size: 2}}><div class='text gradient-text'>Most</div></Col>
            </Row>
        </div>
    </div>
</Container>

<style>
    .legend-container {
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 250px;
        height: auto;
        border: 1px solid red;
        background-color: white; /* keep legend visible when background doesn't match */
        z-index: 100;
        padding: 5px;
    }

    .text {
        white-space: nowrap;
    }

    .no-medals-color {
        width: 100%;
        height: 100%;
        background-color: #ccc;
        /* TODO update opacity */
        opacity: .5; 
        border: 1px solid #999;
    }

    .gradient-rectangle {
        width: 100%;
        height: 100%;
        background: linear-gradient(to right,#92b3d1 0%, #92b3d2 30%, #010742 100%); 
    }
</style>
