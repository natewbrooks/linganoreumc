export const dynamic = 'force-dynamic';

import './globals.css';
import ClientProviders from '@/contexts/ClientProviders';
import Footer from '@/components/nav/Footer';
import VisibilityRefresher from '@/contexts/VisibilityRefresher';
import { preconnect, preload } from 'react-dom';
import { DM_Serif_Text } from 'next/font/google';
import { getSettings } from '@/lib/getSettings';
import { getEvents } from '@/lib/getEvents';
import { getSermons } from '@/lib/getSermons';

// Self-hosted and preloaded with a metric-matched fallback so text doesn't shift on load
const dmSerif = DM_Serif_Text({
	weight: '400',
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: '--font-dm-serif',
});

export default async function RootLayout({ children }) {
	// Prefetched server-side so content is in the first paint with no layout shift
	const [settings, eventsData, sermons] = await Promise.all([
		getSettings(),
		getEvents().catch(() => ({ events: [], eventDates: [], eventTimes: [], eventImages: {} })),
		getSermons().catch(() => []),
	]);

	// Opens the API connection early so data-driven images start downloading sooner
	preconnect(process.env.NEXT_PUBLIC_API_BASE_URL);
	// Nav logo is above the fold on every page. Fetch it first so it paints with the page
	preload('/assets/logos/logo-no-bkg-white.svg', { as: 'image', fetchPriority: 'high' });

	return (
		<html
			lang='en'
			className={dmSerif.variable}>
			<body>
				<VisibilityRefresher />
				<ClientProviders
					settings={settings}
					eventsData={eventsData}
					sermons={sermons}
					// Rendered server-side so the full react-icons sets never ship to the client
					footer={<Footer settings={settings} />}>
					{children}
				</ClientProviders>
			</body>
		</html>
	);
}
