import { EventsProvider } from '@/contexts/EventsContext';
import { SermonsProvider } from '@/contexts/SermonsContext';
import LayoutWrapper from '@/contexts/LayoutWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { GeneralSettingsProvider } from '@/contexts/GeneralSettingsContext';
import { HomePageSettingsProvider } from '@/contexts/HomepageSettingsContext';
import RequireAuth from '@/contexts/RequireAuth';

export default function ClientProviders({ children }) {
	return (
		<AuthProvider>
			<GeneralSettingsProvider>
				<HomePageSettingsProvider>
					<SermonsProvider>
						<EventsProvider>
							<RequireAuth>
								<LayoutWrapper>{children}</LayoutWrapper>
							</RequireAuth>
						</EventsProvider>
					</SermonsProvider>
				</HomePageSettingsProvider>
			</GeneralSettingsProvider>
		</AuthProvider>
	);
}
