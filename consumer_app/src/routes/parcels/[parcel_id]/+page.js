/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ fetch, params }) => {
	const response = await fetch(`/api/parcels/${params.parcel_id}`);

	const resJSON = await response.json();

	return {
		parcel_info: resJSON.data.parcel_info,
		authorized: resJSON.data.authorized,
		title: resJSON.data.parcel_info.parcel_name,
		description: 'Get detailed data aboout your parcels.'
	};
};