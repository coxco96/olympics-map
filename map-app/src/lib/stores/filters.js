import {writable} from 'svelte/store';

export const selectedYear = writable('');
export const selectedSport = writable('');
export const selectedEvent = writable('');

// export const selectedYear = writable('All years (1896-2024)');
// export const selectedSport = writable('All sports');
// export const selectedEvent = writable('All events');