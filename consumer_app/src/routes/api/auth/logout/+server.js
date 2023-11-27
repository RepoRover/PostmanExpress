import { json, redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ cookies, request }) => {
	cookies.delete('access_token', { path: '/' });

	if (request.headers.get('accept') === 'application/json') {
		return json({ status: 'success' });
	}
	throw redirect(303, '/auth/login');
};
