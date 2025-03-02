import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './global.css';
import Navigation from './components/nav/Navigation.jsx';
import Header from './components/Header.jsx';

// Essentially the layout pages
createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<div className={`flex flex-col my-8`}>
			<Header />

			<div className={`flex flex-row `}>
				<Navigation />
				<div className={`justify-center flex w-full h-full`}>
					<div className={`min-w-[500px] w-[700px]`}>
						<App />
					</div>
				</div>
				{/* used just for spacing, same width as navigation component */}
				<div className={`w-[400px]`}></div>
			</div>
		</div>
	</BrowserRouter>
);
