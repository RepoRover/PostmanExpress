import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url, params }) => {
	const { user } = data || {};

	const isSingleParcelRoute = params.parcel_id ? true : false;

	const isOpenedForNoUser = url.pathname === '/auth/login' || url.pathname === '/auth/signup';

	if (user && isOpenedForNoUser) {
		throw redirect(307, '/');
	}

	if (!user && !isOpenedForNoUser && !isSingleParcelRoute) {
		throw redirect(307, '/auth/login');
	}

	return { user };
};
