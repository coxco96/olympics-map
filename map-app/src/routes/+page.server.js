import * as db from '$lib/api/sheet.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getSheetData(params.slug) // pulls data from google sheet
	};
}