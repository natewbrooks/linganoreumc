import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { EventsProvider } from './contexts/EventsContext';
import './global.css';
import App from './App.jsx';
import Footer from './components/Footer.jsx';
import Navigation from './components/Navigation.jsx';
import MobileNavigation from './components/MobileNavigation.jsx';
import AnnouncementBanner from './components/home/AnnouncementBanner.jsx';

const Layout = () => {
	const { settings } = useSettings();

	return (
		<div className='relative flex flex-col overflow-hidden'>
			<div className={`sticky top-0 z-20 flex flex-col transform-3d`}>
				{settings.general?.announcementBanner?.enabled ? (
					<>
						<AnnouncementBanner
							title={settings.general.announcementBanner.title}
							subtext={settings.general.announcementBanner.subtext}
						/>
						<div className={``}>
							<div className={`hidden md:block`}>
								<Navigation />
							</div>
							<div className={`block md:hidden`}>
								<MobileNavigation />
							</div>
						</div>
					</>
				) : (
					<div className={`sticky top-0 z-30`}>
						<div>
							<div className={`hidden md:block`}>
								<Navigation />
							</div>
							<div className={`block md:hidden`}>
								<MobileNavigation />
							</div>
						</div>
					</div>
				)}
			</div>

			<App />
			<Footer />
		</div>
	);
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<SettingsProvider>
			<EventsProvider>
				<BrowserRouter basename='/'>
					<Layout />
				</BrowserRouter>
			</EventsProvider>
		</SettingsProvider>
	</StrictMode>
);
