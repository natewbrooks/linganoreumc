import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/edit/Home.jsx';
import General from './pages/General.jsx';
import Events from './pages/edit/Events.jsx';
import EditEvent from './components/events/EditEvent.jsx';

// Handles routing
function App() {
	return (
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

			{/* Edit a specific event */}
			<Route
				path='/edit/event/:id'
				element={<EditEvent />}
			/>
		</Routes>
	);
}

export default App;
