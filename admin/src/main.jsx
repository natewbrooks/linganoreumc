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

function Layout() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return null; // or a loading spinner

	return (
		<div className={`flex flex-col overflow-hidden`}>
			<div className={`bg-darkred pt-12 h-fit sticky top-0 z-50`}>
				<Navigation />
			</div>
			<div className={`flex flex-row mt-20`}>
				<div className={`justify-center flex w-full h-full`}>
					<div className={`min-w-[500px] min-h-[800px] w-[800px]`}>
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
