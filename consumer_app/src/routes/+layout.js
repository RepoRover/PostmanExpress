import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url }) => {
	const { user } = data || {};

	const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';

	if (user && isAuthPage) {
		throw redirect(307, '/');
	}

	if (!user && !isAuthPage) {
		throw redirect(307, '/login');
	}

	return { user };
};
