import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './global.css';
import Navigation from './components/nav/Navigation.jsx';
import { EventsProvider } from './contexts/EventsContext.jsx';
import { HomePageSettingsProvider } from './contexts/HomepageSettingsContext.jsx';
import { GeneralSettingsProvider } from './contexts/GeneralSettingsContext.jsx';
import { SermonsProvider } from './contexts/SermonsContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import MobileNavigation from './components/nav/MobileNavigation.jsx';

function Layout() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return null; // or a loading spinner

	return (
		<div className={`flex flex-col `}>
			<div className={`bg-darkred sticky top-0 z-30 mb-10 md:mb-20 overflow-hidden `}>
				<div className={`pt-12 hidden md:block`}>
					<Navigation />
				</div>
				<div className={`block md:hidden`}>
					<MobileNavigation />
				</div>
			</div>

			<div className={`flex flex-row overflow-hidden px-2`}>
				<div className={`justify-center flex w-full h-full`}>
					<div className={` min-h-[800px] w-full h-full max-w-[800px] mx-auto`}>
						<App />
					</div>
				</div>
			</div>
		</div>
	);
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter basename='/admin/'>
		<AuthProvider>
			<EventsProvider>
				<SermonsProvider>
					<GeneralSettingsProvider>
						<HomePageSettingsProvider>
							<Layout />
						</HomePageSettingsProvider>
					</GeneralSettingsProvider>
				</SermonsProvider>
			</EventsProvider>
		</AuthProvider>
	</BrowserRouter>
);
