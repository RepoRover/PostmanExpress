import { json } from '@sveltejs/kit';
import { ORG_API_URL } from '$env/static/private';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const GET = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({
			user: null
		});
	}

	const response = await fetch(`${ORG_API_URL}/me`);

	return json({ user: { username: 'Yuriy Gaitrov' } });
};
