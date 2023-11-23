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
