/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ fetch, params }) => {
	const response = await fetch(`/api/parcels/${params.parcel_id}`);

	const resJSON = await response.json();

	let returnObj = {
		description: 'Get detailed data aboout your parcels.'
	};

	if (!response.ok) {
		returnObj.message = resJSON.message;
		return returnObj;
	}

	returnObj.parcel_info = resJSON.data.parcel_info;
	returnObj.authorized = resJSON.data.authorized;
	returnObj.title = resJSON.data.parcel_name;

	return returnObj;
};
