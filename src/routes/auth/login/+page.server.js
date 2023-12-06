import { validateEmail } from '$helpers';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();

		const user_email = form.get('user_email');
		const password = form.get('password');
		if (!user_email || !password) return fail(400, { message: 'Required fields missing' });
		if (!validateEmail(user_email)) return fail(400, { message: 'Invalid email' });
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ user_email, password })
		});

		const resJSON = await response.json();

		if (!response.ok) {
			return fail(response.status, resJSON);
		}

		throw redirect(303, '/');
	}
};
