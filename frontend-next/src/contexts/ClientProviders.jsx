'use client';
import { EventsProvider } from '@/contexts/EventsContext';
import { SermonsProvider } from '@/contexts/SermonsContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import LayoutWrapper from '@/contexts/LayoutWrapper';

export default function ClientProviders({ settings, events, sermons, children }) {
	return (
		<SettingsProvider initialSettings={settings}>
			<SermonsProvider initialData={sermons}>
				<EventsProvider initialData={events}>
					<LayoutWrapper>{children}</LayoutWrapper>
				</EventsProvider>
			</SermonsProvider>
		</SettingsProvider>
	);
}
