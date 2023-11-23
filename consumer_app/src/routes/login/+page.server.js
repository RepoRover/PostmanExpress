import { fail } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const userEmail = form.get('user_email');
		const password = form.get('password');
		if (!userEmail) return fail(400, { message: 'Email required' });
	}
};
