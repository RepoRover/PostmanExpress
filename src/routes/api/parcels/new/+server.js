import { sendRequest } from '$helpers';
import { json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ fetch, cookies, request }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return json(
			{ status: 'fail', message: 'Log in to access your active parcels' },
			{ status: 401 }
		);
	}

	const reqJSON = await request.json();

	const headers = {
		Authorization: `Bearer ${accessToken}`
	};

	const response = await sendRequest(fetch, 'POST', '/parcels/new', headers, reqJSON);

	const resJSON = await response.json();

	if (!response.ok) {
		return json(resJSON, { status: response.status });
	}

	return json(resJSON);
};
