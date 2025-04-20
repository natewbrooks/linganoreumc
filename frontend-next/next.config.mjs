/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL('https://api.linganoreumc.com/media/images/**')],
	},
	// Add these optimizations to prevent stale page issues
	onDemandEntries: {
		// Keep the pages in memory longer
		maxInactiveAge: 60 * 60 * 1000, // 1 hour
		pagesBufferLength: 5,
	},
};

export default nextConfig;
