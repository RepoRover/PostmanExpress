import { sendRequest } from '$helpers';
import { error, json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ fetch, request, cookies }) => {
	const requestBody = await request.json();

	const response = await sendRequest(fetch, 'POST', '/consumer/signup', {}, requestBody);

	const resJSON = await response.json();
	if (!response.ok) {
		throw error(response.status, resJSON);
	}

	cookies.set('access_token', resJSON.access_token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true
	});
	return json({ status: 'success' });
};
