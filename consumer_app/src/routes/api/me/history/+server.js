import { sendRequest } from '$helpers';
import { error, json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ fetch, cookies }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return json({ status: 'unauthorized', message: 'Log in to access your active parcels' });
	}

	let headers = {
		Authorization: `Bearer ${accessToken}`
	};

	const response = await sendRequest(fetch, 'GET', '/consumer/me/history', headers);

	const resJSON = await response.json();

	if (!response.ok) {
		throw error(response.status, resJSON);
	}

	return json(resJSON);
};
