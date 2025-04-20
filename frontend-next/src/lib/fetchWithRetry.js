export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
	let lastError;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const response = await fetch(url, {
				...options,
				// Add a signal with timeout to prevent hanging requests
				signal: options.signal || AbortSignal.timeout(15000), // 15 second timeout
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(`Request failed with status ${response.status}: ${text}`);
			}

			return await response.json();
		} catch (error) {
			lastError = error;

			// Don't retry if it's an abort error (timeout or user-initiated)
			if (error.name === 'AbortError') break;

			// Don't retry on the last attempt
			if (attempt === maxRetries - 1) break;

			// Exponential backoff
			const delay = Math.min(1000 * 2 ** attempt, 5000);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
