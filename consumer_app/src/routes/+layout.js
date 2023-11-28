import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url }) => {
	const { user } = data || {};

	// const parcelRoutePattern = /^\/parcel\/[a-zA-Z0-9]+$/;
	const isOpenedForNoUser = url.pathname === '/auth/login' || url.pathname === '/auth/signup';
	// const isParcelRoute = parcelRoutePattern.test(url.pathname);

	// console.log(url.pathname);
	// console.log(isParcelRoute);

	if (user && isOpenedForNoUser) {
		throw redirect(307, '/');
	}

	if (!user && !isOpenedForNoUser) {
		throw redirect(307, '/auth/login');
	}

	return { user };
};
