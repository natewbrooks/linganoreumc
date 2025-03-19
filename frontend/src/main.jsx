import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { EventsProvider } from './contexts/EventsContext';
import './global.css';
import App from './App.jsx';
import Footer from './components/Footer.jsx';
import Navigation from './components/Navigation.jsx';
import AnnouncementBanner from './components/AnnouncementBanner';

const Layout = () => {
	const { settings } = useSettings();

	return (
		<div className='relative flex flex-col'>
			<div className={`sticky top-0 z-20 flex flex-col`}>
				{settings.general?.announcementBanner?.enabled ? (
					<>
						<AnnouncementBanner
							title={settings.general.announcementBanner.title}
							subtext={settings.general.announcementBanner.subtext}
						/>
						<div className={`-translate-y-2`}>
							<Navigation />
						</div>
					</>
				) : (
					<div className={`sticky top-0 z-30`}>
						<>
							<Navigation />
						</>
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
