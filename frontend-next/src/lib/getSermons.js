export async function getSermons() {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	const res = await fetch(`${baseUrl}/sermons/all`);
	if (!res.ok) {
		console.error(await res.text());
		throw new Error('Failed to fetch sermons');
	}

	const sermons = await res.json();
	return sermons.filter((s) => !s.isArchived);
}
