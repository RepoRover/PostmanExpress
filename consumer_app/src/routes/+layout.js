import { redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url }) => {
	// @ts-ignore
	if (url.pathname === '/login' && data.user) {
		throw redirect(307, '/');
	}
	// @ts-ignore
	if (url.pathname === '/' && !data.user) {
		throw redirect(307, '/login');
	}

	// @ts-ignore
	return { user: data.user };
};
