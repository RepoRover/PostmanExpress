import { fail, redirect } from '@sveltejs/kit';
import { validateEmail } from '$helpers';
import bcrypt from 'bcrypt';

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
	signup: async ({ request, fetch }) => {
		const form = await request.formData();

		let username = form.get('username');
		const user_email = form.get('user_email');
		const user_password = form.get('password');
		const location = form.get('location');

		if (!username || !user_email || !user_password || !location)
			return fail(400, { message: 'Required fields missing' });

		// @ts-ignore
		username = username.trim();
		// @ts-ignore
		const password = await bcrypt.hash(user_password, 10);

		// Everything is correct, send user data and log him in
		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ username, user_email, password, location })
		});

		const resJSON = await response.json();

		if (!response.ok) {
			return fail(response.status, resJSON);
		}

		throw redirect(303, '/');
	},
	validateUser: async ({ request }) => {
		const form = await request.formData();
		const user_email = form.get('user_email');
		const username = form.get('username');

		// @ts-ignore
		if (username.split(/\s+/).length < 2)
			return fail(400, { message: 'Full name must contain at least two names' });

		if (!validateEmail(user_email)) return fail(400, { message: 'Invalid email' });

		return { status: 'success' };
	}
};
