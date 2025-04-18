export async function getSettings() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;
	const [generalRes, homeRes] = await Promise.all([
		fetch(`${base}/settings/general`, { cache: 'force-cache' }),
		fetch(`${base}/settings/home`, { cache: 'force-cache' }),
	]);

	const general = generalRes.ok ? await generalRes.json() : null;
	const home = homeRes.ok ? await homeRes.json() : null;

	return {
		general,
		home,
	};
}
