import { validateEmail } from '$helpers';
import { fail } from '@sveltejs/kit';
/** @type {import('./$types').Actions} */
export const actions = {
	validateEmail: async ({ request }) => {
		const form = await request.formData();
		const user_email = form.get('recipient_email');

		if (!validateEmail(user_email)) return fail(400, { message: 'Invalid email' });

		return { status: 'success' };
	},
	postNewParcel: async ({ request, fetch }) => {}
};
