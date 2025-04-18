/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL('https://api.linganoreumc.com/media/images/**')],
	},
};

export default nextConfig;
