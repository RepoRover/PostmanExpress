import { fail } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const userEmail = form.get('user_email');
		const password = form.get('password');
		if (!userEmail || !password) return fail(400, { message: 'Required fields missing' });

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(fail(400, { status: 'fail', message: 'Bad request' }));
			}, 2000); // Adjust the delay as needed
		});
		// return fail(400, { status: 'fail', message: 'Bad request' });
		// return { status: 'success' };
	}
};
