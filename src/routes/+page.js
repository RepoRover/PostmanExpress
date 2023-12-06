/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ fetch }) => {
	const response = await fetch('/api/me/parcels');
	const resJSON = await response.json();
	return {
		title: 'Active Parcels',
		description:
			'Find your active parcels here, track them while they are on their ways to destination.',
		status: resJSON.status,
		data: resJSON.data
	};
};
