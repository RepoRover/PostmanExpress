import { authUser } from '$helpers';
import { protectedRoutes } from '$helpers/const';
import { redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const user = await authUser(event);

	if (event.url.pathname.startsWith('/auth') && user) {
		throw redirect(303, '/');
	}

	if (protectedRoutes.includes(event.url.pathname) && !user) {
		throw redirect(303, '/auth/login');
	}

	event.locals.user = user;

	const response = await resolve(event);
	return response;
};
