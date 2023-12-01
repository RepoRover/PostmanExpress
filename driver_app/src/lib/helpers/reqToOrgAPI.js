import { API_KEY, APP_HEADER, ORG_API_URL } from '$env/static/private';

const sendRequest = async (
	// @ts-ignore
	fetch,
	/** @type {string} */ method,
	/** @type {string} */ url,
	headers = {},
	body = {}
) => {
	headers = {
		...headers,
		'x-api-key': API_KEY,
		'x-application-type': APP_HEADER,
		'Content-Type': 'application/json'
	};

	const options = {
		method,
		headers
	};

	if (method !== 'GET') {
		// @ts-ignore
		options.body = JSON.stringify(body);
	}

	return fetch(`${ORG_API_URL}${url}`, options);
};

export default sendRequest;
