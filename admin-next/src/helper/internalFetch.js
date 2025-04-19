// lib/internalFetch.js

import { headers } from 'next/headers';

function headersToObject(headersInstance) {
	const headerObj = {};
	for (const [key, value] of headersInstance.entries()) {
		headerObj[key] = value;
	}
	return headerObj;
}

const internalFetch = async (url, options = {}) => {
	const incomingHeaders = headersToObject(headers());

	return fetch(url, {
		...options,
		headers: {
			...incomingHeaders,
			...(options.headers || {}),
		},
	});
};

export default internalFetch;
