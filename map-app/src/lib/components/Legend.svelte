<script>
    import { pointsTotalStore, filteredDataStore } from "$lib/utils/stores.js";
    import chroma from "chroma-js";

    let pointsTotalArr = [];
    let filteredData = {};

    // Subscribe to both stores to replicate Map.svelte logic
    $: pointsTotalArr = $pointsTotalStore || [];
    $: filteredData = $filteredDataStore || {};
    $: lengthOfData = Object.keys(filteredData).length;

    // NOIR LOGIC: Matches Map.svelte exactly
    $: breaks =
        lengthOfData >= 4
            ? chroma.limits(pointsTotalArr, "k", 4)
            : chroma.limits(pointsTotalArr, "k", Math.max(lengthOfData, 3));

    // Sample the Noir palette
    $: originalColors = chroma
        .scale(["#f5f5f7", "#424245", "#1d1d1f"])
        .colors(breaks.length);

    // Apply the same "Darken First Bucket" logic
    $: darkenedColors = originalColors.map((color, index) =>
        index === 0 ? chroma(color).darken(1.6).hex() : color,
    );

    // Filter out the background/zero color
    $: filteredColors = darkenedColors.filter((_, index) => index !== 0);

    // Final colorize function for the gradient bar
    $: colorize = chroma
        .scale(
            filteredColors.length >= lengthOfData
                ? filteredColors
                : chroma
                      .scale(["#f5f5f7", "#424245", "#1d1d1f"])
                      .colors(lengthOfData)
                      .filter((_, index) => index !== 0),
        )
        .domain(breaks)
        .mode("lch");

    // Generate the CSS gradient string
    $: gradientColors = colorize.colors(10); // Sample 10 points for a smooth bar
    $: gradientStyle = `linear-gradient(to right, ${gradientColors.join(", ")})`;
</script>

<div class="legend-card">
    <div class="legend-row categories">
        <div class="legend-item">
            <span class="marker host"></span>
            <span class="label-text">Host city</span>
        </div>
        <div class="legend-item">
            <span class="marker no-medals"></span>
            <span class="label-text">No medals</span>
        </div>
    </div>

    <div class="gradient-section">
        <div class="gradient-labels">
            <span class="label-text">Least</span>
            <span class="label-text">Most</span>
        </div>
        <div class="gradient-bar" style="background: {gradientStyle}"></div>
        <p class="caption">Medal count is weighted by type.</p>
    </div>

    <div class="credit-section">
        <div class="brand-line">
            <span class="brand-name">mapcourt</span>
            <a
                href="mailto:contact@mapcourt.com"
                class="contact-link"
                title="Contact Courtney">Contact</a
            >
        </div>
        <p class="author-tag">Built by Courtney Cox</p>
    </div>
</div>

<style>
    .legend-card {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 1000;

        /* Glassmorphism */
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;

        padding: 16px;
        width: 260px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .legend-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .label-text {
        font-family: -apple-system, sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #86868b;
    }

    /* Markers */
    .marker {
        width: 10px;
        height: 10px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .marker.host {
        background-color: #fcba03;
        border-radius: 50%;
    }

    .marker.no-medals {
        background-color: #f5f5f7;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 2px;
    }

    /* Gradient */
    .gradient-section {
        margin-top: 12px;
    }

    .gradient-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
    }

    .gradient-bar {
        height: 8px;
        width: 100%;
        border-radius: 4px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .caption {
        font-size: 0.6rem;
        color: #86868b;
        margin: 6px 0 0 0;
        font-style: italic;
    }

    .credit-section {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .brand-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }

    .brand-name {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            sans-serif;
        font-weight: 700;
        font-size: 0.85rem;
        color: #1d1d1f;
        letter-spacing: -0.01em;
    }

    .dot-com {
        color: #86868b;
        font-weight: 400;
    }

    .author-tag {
        font-size: 0.6rem;
        margin: 0;
        color: #86868b;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .contact-link {
        font-size: 0.65rem;
        color: #0071e3;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s ease;
    }

    .contact-link:hover {
        opacity: 0.7;
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .legend-card {
            position: relative;
            bottom: 0;
            left: 0;
            width: 100%;
            background: none;
            backdrop-filter: none;
            border: none;
            box-shadow: none;
            padding: 20px 0;
            border-top: 1px solid #f2f2f7;
            margin-top: 10px;
        }
    }
</style>
