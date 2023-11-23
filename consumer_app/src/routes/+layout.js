import { redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url }) => {
	const { user } = data || {};
	if (url.pathname === '/login' && user) {
		throw redirect(307, '/');
	}
	if (url.pathname !== '/login' && !user) {
		throw redirect(307, '/login');
	}

	return { user };
};
