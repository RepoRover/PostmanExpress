/**@type {import('@sveltejs/kit').ServerLoad} */
export const load = async ({ fetch }) => {
	const response = await fetch('/api/me');

	const resJSON = await response.json();

	return { user: resJSON.user ? resJSON.user : null };
};
