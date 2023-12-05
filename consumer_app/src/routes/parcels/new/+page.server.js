import { validateEmail } from '$helpers';
import { fail, redirect } from '@sveltejs/kit';

/**@type {import('@sveltejs/kit').ServerLoad} */
export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth/login');
};

/** @type {import('./$types').Actions} */
export const actions = {
	validateEmail: async ({ request }) => {
		const form = await request.formData();
		const user_email = form.get('recipient_email');

		if (!validateEmail(user_email)) return fail(400, { message: 'Invalid email' });

		return { status: 'success' };
	},
	postNewParcel: async ({ request, fetch }) => {
		const form = await request.formData();

		const ship_to = form.get('ship_to');
		const ship_from = form.get('ship_from');
		const recipient_email = form.get('recipient_email');
		const weight = form.get('weight');
		const height = form.get('height');
		const length = form.get('length');
		const width = form.get('width');
		const parcel_name = form.get('parcel_name');

		if (!ship_from || !ship_to || !recipient_email || !weight || !height || !length || !width) {
			return fail(400, { message: 'Some required fields missing' });
		}

		// @ts-ignore
		parcel_name.trim();

		const response = await fetch('/api/parcels/new', {
			method: 'POST',
			body: JSON.stringify({
				ship_to,
				ship_from,
				recipient_email,
				weight,
				height,
				length,
				width,
				parcel_name
			})
		});

		const resJSON = await response.json();

		if (!response.ok) {
			return fail(response.status, resJSON);
		}

		return resJSON;
	}
};
