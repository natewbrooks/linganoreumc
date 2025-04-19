import './globals.css';
import ClientProviders from '@/contexts/ClientProviders';
import Head from 'next/head';

export default async function RootLayout({ children }) {
	return (
		<html lang='en'>
			<Head>
				<link
					rel='dns-prefetch'
					href='https://fonts.googleapis.com'
				/>
				<link
					rel='dns-prefetch'
					href='https://fonts.gstatic.com'
				/>
				<link
					rel='dns-prefetch'
					href='https://api.linganoreumc.com'
				/>
				<link
					rel='preconnect'
					href='https://fonts.googleapis.com'
					crossOrigin='true'
				/>
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='true'
				/>
				<link
					rel='preconnect'
					href='https://api.linganoreumc.com'
					crossOrigin='true'
				/>
			</Head>
			<body>
				<ClientProviders>{children}</ClientProviders>
			</body>
		</html>
	);
}
