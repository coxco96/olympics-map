import {writable} from 'svelte/store';

export const selectedYear = writable('All years (1896-2024)');
export const selectedSport = writable('All sports');
export const selectedEvent = writable('All events');
export const filteredDataStore = writable([]);
// export const minPointsTotal = writable(0);
// export const maxPointsTotal = writable(0);

// make an array of all current pointsTotal values shown so we can 
// use natural breaks to find breaks
export const pointsTotalStore = writable([]);