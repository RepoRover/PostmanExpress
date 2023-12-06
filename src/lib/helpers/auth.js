import sendRequest from './reqToOrgAPI';

export const authUser = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return null;
	}

	const headers = {
		Authorization: `Bearer ${accessToken}`
	};

	const response = await sendRequest(fetch, 'GET', '/consumer/me', headers);

	const resJSON = await response.json();

	if (!response.ok) {
		return null;
	}

	return { user: resJSON.data };
};
