<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { makePaint } from "$lib/utils/exports.js";
    import { pointsTotalStore } from "$lib/utils/stores.js";
    let pointsTotalArr;

    $: pointsTotalStore.subscribe((value) => (pointsTotalArr = value));

    // TODO: turn these into stores to avoid the repeated code from Map
    import chroma from "chroma-js";
    $: breaks = chroma.limits(pointsTotalArr, "k", 4);
    $: originalColors = chroma.scale("Purples").colors(breaks.length);
    $: darkenedColors = originalColors.map((color, index) =>
        index === 0 ? chroma(color).darken(1.6).hex() : color,
    );
    $: filteredColors = darkenedColors.filter((color, index) => {
    return index !== 0;
    });


    $: colorize = chroma
        .scale(filteredColors)
        .domain(breaks)
        .mode("lch")
        .correctLightness();

    $: gradientColors = colorize.colors();
    $: gradientStyle = `linear-gradient(to right, ${gradientColors.join(", ")})`;

</script>

<div class="legend-container">
    <Container>
        <Row noGutters>
            <Col xs="6">
                <Row noGutters>
                    <Col xs="auto">
                        <div class="games-marker-legend"></div>
                    </Col>
                    <Col xs="auto">
                        <span class="label-text">Host city</span>
                    </Col>
                </Row>
            </Col>
            <Col xs="6">
                <Row noGutters>
                    <Col xs="auto">
                        <div class="no-medals-color"></div>
                    </Col>
                    <Col xs="auto">
                        <span class="label-text">No medals</span>
                    </Col>
                </Row>
            </Col>
        </Row>
    

        <Row noGutters class='mt-3'>
            <Col><span class='label-text'>Least</span></Col>
            <Col xs={{size: 8}}><div class='gradient-box' style='background: {gradientStyle}'></div></Col>
            <Col><span style='padding-left: 5px' class='label-text'>Most</span></Col>

        </Row>
        <Row><p style='font-size: 13px;'>Medal count is weighted by type.</p></Row>
    </Container>
</div>

<style>
    .legend-container {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 300px;
        background-color: white;
        z-index: 100;
        padding: 5px;
    }

    .games-marker-legend {
        background-color: #fcba03;
        border-radius: 50%;
        border: 1px solid #dbd7d7;
        width: 15px;
        height: 15px;
        bottom: -4.5px;
        position: relative;
        margin-right: 5px;
    }

    .label-text {
        white-space: nowrap;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 12px;
    }

    .no-medals-color {
        width: 16px;
        height: 18px;
        background-color: #ccc;
        position: relative;
        opacity: 0.5; /* TODO: update opacity here */
        border: 1px solid #999;
        margin-right: 5px;
        bottom: -3.5px;
    }

    .gradient-box {
        height: 20px;
        width: 100%;
        border: 1px solid #ccc;
    }


    .vertical-gradient {
        width: 15px;
        height: 100px;
        border: 1px solid #ccc;
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
