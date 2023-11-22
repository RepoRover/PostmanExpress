const sendRequest = async (
	/** @type {(arg0: string, arg1: { method: any; headers: {}; }) => any} */ fetch,
	/** @type {string} */ method,
	/** @type {string} */ url,
	headers = {},
	body = {}
) => {
	headers = {
		...headers,
		'x-api-key': process.env.API_KEY,
		'x-application-type': process.env.APP_HEADER,
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

	return fetch(`${process.env.ORGANIZATION_API_URL}${url}`, options);
};

export default sendRequest;
