<script>
    import {
        selectedSport,
        selectedYear,
        selectedEvent,
    } from "$lib/utils/stores.js";
    import { eventsByYear } from "$lib/utils/exports.js";

    // Simplified reactive store access
    $: sport = $selectedSport;
    $: year = $selectedYear;
    $: sportEvent = $selectedEvent;

    function handleChange(event) {
        selectedEvent.set(event.target.value);
    }

    let relevantEvents;

    $: {
        let eventsSet = new Set();

        if (year === 'All years (1896-2024)') {
            if (sport === 'All sports') {
                relevantEvents = ['All events'];
            } else {
                Object.values(eventsByYear).forEach(yearData => {
                    if (yearData[sport]) {
                        yearData[sport].forEach(e => eventsSet.add(e));
                    }
                });
                relevantEvents = ['All events', ...Array.from(eventsSet).sort()];
            }
        } else {
            if (sport === 'All sports') {
                relevantEvents = ['All events'];
            } else {
                (eventsByYear[year]?.[sport] || []).forEach(e => eventsSet.add(e));
                relevantEvents = ['All events', ...Array.from(eventsSet).sort()];
            }
        }
    }

    $: if (sportEvent !== 'All events' && !relevantEvents.includes(sportEvent)) {
        selectedEvent.set('All events');
    }
</script>

<div class="filter-wrapper">
    <label for="event-select" class="filter-label">Event</label>
    <div class="select-container">
        <select
            id="event-select"
            bind:value={sportEvent}
            on:change={handleChange}
            class="minimal-select"
            aria-label="Filter by Event"
        >
            {#each relevantEvents as e}
                <option value={e}>{e}</option>
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
    /* Identical to Years and Sports for a seamless row */
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
        text-overflow: ellipsis; /* Handles long event names gracefully */
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