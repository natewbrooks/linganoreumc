'use client';
import { EventsProvider } from '@/contexts/EventsContext';
import { SermonsProvider } from '@/contexts/SermonsContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import LayoutWrapper from '@/contexts/LayoutWrapper';

export default function ClientProviders({ settings, eventsData, sermons, footer, children }) {
	return (
		<SettingsProvider settings={settings}>
			<SermonsProvider sermons={sermons}>
				<EventsProvider {...eventsData}>
					<LayoutWrapper footer={footer}>{children}</LayoutWrapper>
				</EventsProvider>
			</SermonsProvider>
		</SettingsProvider>
	);
}
