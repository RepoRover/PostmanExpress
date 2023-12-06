import { sendRequest } from '$helpers';
import { json } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({
			user: null
		});
	}

	const headers = {
		Authorization: `Bearer ${accessToken}`
	};

	const response = await sendRequest(fetch, 'GET', '/consumer/me', headers);

	const resJSON = await response.json();

	if (!response.ok) {
		return json({
			user: null
		});
	}

	return json(resJSON);
};

/**@type {import('@sveltejs/kit').RequestHandler} */
export const DELETE = async ({ fetch, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json(
			{ status: 'fail', message: 'Please log in to delete your account.' },
			{ status: 400 }
		);
	}

	const headers = {
		Authorization: `Bearer ${accessToken}`
	};

	const response = await sendRequest(fetch, 'DELETE', '/consumer/me', headers);

	const resJSON = await response.json();

	if (!response.ok) {
		return json(resJSON, { status: response.status });
	}

	cookies.delete('access_token', { path: '/' });

	return json(resJSON);
};
