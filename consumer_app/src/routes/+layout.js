/**@type {import('@sveltejs/kit').Load} */
export const load = async ({ data, url }) => {
	if (url.pathname === 'login' && data.user) return {};
};
