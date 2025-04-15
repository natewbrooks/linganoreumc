import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { EventsProvider } from './contexts/EventsContext';
import './global.css';
import App from './App.jsx';
import Footer from './components/nav/Footer.jsx';
import Navigation from './components/nav/Navigation.jsx';
import MobileNavigation from './components/nav/MobileNavigation.jsx';
import AnnouncementBanner from './components/nav/AnnouncementBanner.jsx';
import { SermonsProvider } from './contexts/SermonsContext.jsx';

const Layout = () => {
	const { settings } = useSettings();

	return (
		<div className='flex flex-col'>
			{' '}
			{/* Sticky Wrapper */}
			<div
				id={`navigation`}
				className='sticky top-0 z-30 bg-red'>
				{settings.general?.announcementBanner?.enabled && (
					<AnnouncementBanner
						title={settings.general.announcementBanner.title}
						subtext={settings.general.announcementBanner.subtext}
					/>
				)}
				<div className={`hidden md:block`}>
					<Navigation />
				</div>
				<div className={`block md:hidden`}>
					<MobileNavigation
						announcementBannerEnabled={settings.general?.announcementBanner?.enabled}
					/>
				</div>
			</div>
			{/* Main content */}
			<div className={`bg-bkg overflow-hidden`}>
				<App />
				<Footer />
			</div>
		</div>
	);
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<SettingsProvider>
			<SermonsProvider>
				<EventsProvider>
					<BrowserRouter basename='/'>
						<Layout />
					</BrowserRouter>
				</EventsProvider>
			</SermonsProvider>
		</SettingsProvider>
	</StrictMode>
);
