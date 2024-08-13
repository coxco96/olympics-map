<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { makePaint } from "$lib/utils/exports.js";
    import { pointsTotalStore } from "$lib/utils/stores.js";
    let pointsTotalArr;

    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));

    // TODO: turn these into stores to avoid the repeated code from Map
    import chroma from "chroma-js";
    $: breaks = chroma.limits(pointsTotalArr, "k", 4);
    $: colorize = chroma
        .scale("Purples")
        .domain(breaks)
        .mode("lch")
        .correctLightness();

    $: gradientColors = colorize.colors();
    $: gradientStyle = `linear-gradient(to bottom, ${gradientColors.slice().reverse().join(", ")})`;
    $: console.log(gradientColors);
</script>

<Container>
    <div class="legend-container">
        <div class="first-row">
            <Row class="mb-2">
                <Col
                    ><div class="info-text">
                        <div style='text-transform: uppercase; font-weight: 500; padding-bottom: 10px;'>Legend</div>
                        <div>Medal count is weighted by medal type.</div>
                    </div></Col
                >
            </Row>
        </div>

        <div class="second-row mb-2">
            <Row>
                <Col xs={{ size: 1 }}
                    ><div class="games-marker-legend"></div></Col
                >
                <Col><span>— Host city</span></Col>
            </Row>
        </div>

        <div class="second-row">
            <Row class="g-1 mb-1">
                <Col xs={{ size: 1 }}>
                    <div class="no-medals-color"></div>
                </Col>
                <Col>
                    <div class="text no-medals-text">— No medals</div>
                </Col>
            </Row>
        </div>

        <div>
            <Row class='mt-3'>
                <Col xs={{ size: 1 }}
                    ><div
                        class="vertical-gradient"
                        style="background: {gradientStyle}"
                    ></div></Col>
                <!-- Top aligned content -->
                <Col class="d-flex flex-column">
                    <div class="mb-2">
                        <span>— Most</span>
                    </div>
                    <div class="mt-auto">
                        <!-- Bottom aligned content -->
                        <span>— Least</span>
                    </div>
                </Col>

            </Row>
        </div>
    </div>
</Container>

<style>
    .games-marker-legend {
        background-color: #fcba03;
        border-radius: 50%;
        border: 1px solid #dbd7d7;
        width: 15px;
        height: 15px;
        position: relative;
        /* box-shadow: 0 0 4px 1.5px #ccc; */
    }
    
    .legend-container {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 250px;
        height: auto;
        /* border: 1px solid gray; */
        background-color: white; /* keep legend visible when background doesn't match */
        z-index: 100;
        padding: 5px;
    }

    .vertical-gradient {
        width: 15px;
        height: 100px;
        border: 1px solid #ccc;
    }

    .text {
        white-space: nowrap;
    }

    .no-medals-color {
        width: 15px;
        height: 18px;
        background-color: #ccc;
        /* TODO update opacity */
        opacity: 0.5;
        border: 1px solid #999;
    }

    /* .gradient-rectangle {
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to right,
            #92b3d1 0%,
            #92b3d2 30%,
            #010742 100%
        );
    } */
</style>
