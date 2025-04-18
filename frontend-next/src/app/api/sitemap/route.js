import { NextResponse } from 'next/server';

export function GET() {
	const base = 'https://linganoreumc.com';
	const urls = ['/', '/calendar', '/events', '/sermons'];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u}</loc></url>`).join('')}
</urlset>`;

	return new NextResponse(xml, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}
