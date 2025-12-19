<script>
    import { selectedSport, selectedYear, selectedEvent } from '$lib/utils/stores.js';
    import { eventsByYear, sportsArray } from '$lib/utils/exports.js';

    // Using $ syntax to automatically subscribe/unsubscribe to stores
    $: year = $selectedYear;
    $: sport = $selectedSport;

    function handleChange(event) {
        selectedSport.set(event.target.value);
    }

    let relevantSports = [];

    $: {
        if (year === "All years (1896-2024)") {
            relevantSports = ["All sports", ...Array.from(new Set(sportsArray)).sort()];
        } else {
            relevantSports = ["All sports", ...Object.keys(eventsByYear[year] || {}).sort()];
        }
    }

    // Reset logic if current sport isn't in the newly selected year
    $: if (year != 'All years (1896-2024)' && eventsByYear[year] && !Object.keys(eventsByYear[year]).includes(sport)) {
        selectedSport.set('All sports');
    }
</script>

<div class="filter-wrapper">
    <label for="sport-select" class="filter-label">Sport</label>
    <div class="select-container">
        <select 
            id="sport-select"
            bind:value={sport} 
            on:change={handleChange} 
            class="minimal-select"
            aria-label="Filter by Sport"
        >
            {#each relevantSports as s}
                <option value={s}>{s}</option>
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
    /* Shared logic with YearsFilter for perfect consistency */
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
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        background: none;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 8px 24px 8px 2px;
        font-size: 0.93rem;
        color: #1d1d1f;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
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

    option {
        color: #1d1d1f;
        background-color: #fff;
    }
</style>