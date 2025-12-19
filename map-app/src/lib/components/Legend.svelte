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
            <div class="signature">
                <span class="prefix">Built by</span>
                <a
                    href="https://www.mapcourt.com"
                    target="_blank"
                    class="brand-name"
                >
                    mapcourt<span class="dot-link">.com</span>
                </a>
            </div>
            <a href="mailto:courtneygcox96@gmail.com" class="contact-button">
                <span>Contact</span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 9L9 1M9 1H3M9 1V7"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
        </div>
    </div>
</div>

<style>
    .legend-card {
        position: absolute;
        /* Nudge this up from the bottom edge */
        bottom: 40px;
        left: 20px;
        z-index: 1000;

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
        margin-top: 20px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .brand-line {
        display: flex;
        justify-content: space-between;
        /* Aligns the contact button to the baseline of "mapcourt" */
        align-items: flex-end;
    }

    .signature {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .prefix {
        font-size: 0.55rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #86868b;
        font-weight: 600;
    }

    .brand-name {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            sans-serif;
        font-weight: 700;
        font-size: 1rem; /* Slightly larger for presence */
        color: #1d1d1f;
        letter-spacing: -0.02em;
        text-decoration: none;
        position: relative;
        display: inline-block;
    }

    /* Custom underline to show it's a link */
    .brand-name::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1.5px;
        background-color: #ff0090; /* Using your Pink as the "interactive" signal */
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
    }

    .brand-name:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }

    .dot-link {
        color: #86868b;
        font-weight: 400;
        font-size: 0.9rem;
    }

    .contact-button {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 6px;
        font-size: 0.65rem;
        color: #1d1d1f;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        /* Ensures the button sits tight to the bottom line */
        margin-bottom: 1px;
        transition: all 0.2s ease;
    }

    .contact-button:hover {
        background: rgba(255, 0, 85, 0.05); /* Very light pink tint */
        color: #ff0055; /* Signature Pink */
        border-color: rgba(255, 0, 85, 0.2);
        box-shadow: 0 2px 8px rgba(255, 0, 85, 0.1);
        transform: translateY(-1px);
    }

    .contact-button:hover svg {
        stroke: #ff0055;
    }

    @media (max-width: 768px) {
        .legend-card {
            /* Keep it floating instead of pushing it below the map */
            position: absolute;
            bottom: 30px; /* Pin it just above the MapLibre/i logo */
            left: 10px;

            /* Scale down the footprint */
            width: calc(100% - 20px);
            max-width: 240px;
            padding: 12px;

            /* Maintain the premium glass look */
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        /* Shrink vertical spacing to keep it compact */
        .legend-row {
            margin-bottom: 8px;
        }
        .credit-section {
            margin-top: 12px;
            padding-top: 8px;
        }

        /* Make the brand name a bit smaller for mobile screens */
        .brand-name {
            font-size: 0.85rem;
        }
        .dot-link {
            font-size: 0.75rem;
        }
    }
</style>
