import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/edit/Home.jsx';
import General from './pages/General.jsx';
import Events from './pages/edit/Events.jsx';

function App() {
	return (
		<div>
			<nav>
				{/* Navigation links */}
				<Link to='/'>General</Link> | <Link to='/edit/home'>Home</Link> |{' '}
				<Link to='/edit/events'>Events</Link>
			</nav>

			<Routes>
				{/* Admin Landing Page */}
				<Route
					path='/'
					element={<General />}
				/>

				{/* Edit Home Page */}
				<Route
					path='/edit/home'
					element={<Home />}
				/>

				{/* Edit Events Page */}
				<Route
					path='/edit/events'
					element={<Events />}
				/>
			</Routes>
		</div>
	);
}

export default App;
