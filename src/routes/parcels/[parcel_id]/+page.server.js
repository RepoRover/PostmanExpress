import { redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').ServerLoad} */
export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
};
