<script>
    import {
        selectedYear,
        selectedSport,
        selectedEvent,
    } from "$lib/utils/stores.js";
    import { yearsArray } from "$lib/utils/exports.js";
    
    let year = "All years (1896-2024)";
    
    // Use the Svelte reactive $ store syntax for cleaner code
    $: year = $selectedYear;

    function handleChange(event) {
        selectedYear.set(event.target.value);
    }

    // Reverse only once if not already reversed
    const displayYears = [...yearsArray].reverse();
</script>

<div class="filter-wrapper">
    <label for="year-select" class="filter-label">Year</label>
    <div class="select-container">
        <select
            id="year-select" 
            bind:value={year}
            on:change={handleChange}
            class="minimal-select"
            aria-label="Select Olympic Year"
        >
            {#each displayYears as y}
                <option value={y} disabled={y.includes("(not held)")}>
                    {y}
                </option>
            {/each}
        </select>
        <span class="chevron" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </div>
</div>

<style>
    .filter-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .filter-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #86868b;
        font-weight: 600;
        margin-left: 2px;
    }

    .select-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .minimal-select {
        appearance: none; /* Removes default browser arrow */
        -webkit-appearance: none;
        width: 100%;
        background: none;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 8px 24px 8px 2px;
        font-size: 0.93rem;
        color: #1d1d1f;
        font-family: -apple-system, sans-serif;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .minimal-select:hover {
        border-bottom-color: rgba(0, 0, 0, 0.2);
    }

    .minimal-select:focus {
        outline: none;
        border-bottom-color: #0071e3;
    }

    .chevron {
        position: absolute;
        right: 4px;
        pointer-events: none;
        color: #86868b;
        display: flex;
        align-items: center;
    }

    /* Styling the dropdown menu options (limited browser support, but keeps it clean) */
    option {
        color: #1d1d1f;
        background-color: #fff;
    }
    
    option:disabled {
        color: #d2d2d7;
    }
</style>