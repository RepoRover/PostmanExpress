/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ fetch }) => {
	const response = await fetch('/api/me/history');

	const resJSON = await response.json();

	return {
		title: 'Parcel History',
		description: 'Find your parcel history here.',
		status: resJSON.status,
		data: resJSON.data
	};
};
