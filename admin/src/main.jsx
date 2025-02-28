import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './global.css';
import Navigation from './components/nav/Navigation.jsx';
import Header from './components/Header.jsx';

// Essentially the layout pages
createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<div className={`flex flex-col my-4 space-y-8`}>
			<Header />

			<div className={`flex flex-row space-x-4`}>
				<Navigation />
				<div className={`mx-12 flex w-full h-full`}>
					<App />
				</div>
			</div>
		</div>
	</BrowserRouter>
);
