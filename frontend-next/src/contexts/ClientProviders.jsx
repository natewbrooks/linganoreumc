'use client';
import { EventsProvider } from '@/contexts/EventsContext';
import { SermonsProvider } from '@/contexts/SermonsContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import LayoutWrapper from '@/contexts/LayoutWrapper';

export default function ClientProviders({ children }) {
	return (
		<SettingsProvider>
			<SermonsProvider>
				<EventsProvider>
					<LayoutWrapper>{children}</LayoutWrapper>
				</EventsProvider>
			</SermonsProvider>
		</SettingsProvider>
	);
}
