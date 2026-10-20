/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL('https://api.linganoreumc.com/media/images/**')],
	},
	// Logos and icons: cache for a day so a refresh reuses them instead of flashing while revalidating
	async headers() {
		return [
			{
				source: '/assets/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
			},
		];
	},
	// Add these optimizations to prevent stale page issues
	onDemandEntries: {
		// Keep the pages in memory longer
		maxInactiveAge: 60 * 60 * 1000, // 1 hour
		pagesBufferLength: 5,
	},
};

export default nextConfig;
