/**
 * Maps row ID to URL slug. `youth-group`, then `youth-group-2`, `youth-group-3` in ID order.
 * ponytail: computed per request, not stored. Deleting an older duplicate renumbers later ones. Add a `slug` column if links must never change
 * @param {Array<{id: number, title: string}>} rows Sorted by ID
 * @returns {Object<number, string>}
 */
export default function buildSlugs(rows) {
	const used = new Set();
	const slugs = {};
	for (const e of rows) {
		const base =
			(e.title || '')
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '') || 'item';
		let slug = base;
		for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
		used.add(slug);
		slugs[e.id] = slug;
	}
	return slugs;
}
