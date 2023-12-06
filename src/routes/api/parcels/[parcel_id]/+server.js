import { sendRequest } from '$helpers';
import { error, json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ fetch, params, cookies }) => {
	const accessToken = cookies.get('access_token');

	let headers = {};
	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}
	const response = await sendRequest(fetch, 'GET', `/parcels/${params.parcel_id}`, headers);

	const resJSON = await response.json();

	if (!response.ok) {
		throw error(response.status, resJSON);
	}

	return json(resJSON);
};
