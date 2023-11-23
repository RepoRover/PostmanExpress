import { sendRequest } from '$helpers';
import { error, json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ fetch, request, cookies }) => {
	const requestBody = await request.json();

	const response = await sendRequest(fetch, 'POST', '/consumer/login', {}, requestBody);

	const resJSON = await response.json();
	if (!response.ok) {
		throw error(response.status, resJSON);
	}

	cookies.set('access_token', resJSON.access_token, { path: '/' });
	return json({ status: 'success' });
};
