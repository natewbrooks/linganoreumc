import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/edit/Home.jsx';
import General from './pages/General.jsx';
import Events from './pages/Events.jsx';
import EditEvent from './components/events/EditEvent.jsx';
import CreateEvent from './components/events/CreateEvent.jsx';

// Handles routing
function App() {
	return (
		<Routes>
			{/* Admin Landing Page */}
			{/* website.com/admin/ */}
			<Route
				path='/'
				element={<General />}
			/>

			{/* Edit Home Page */}
			<Route
				path='/edit/home-page/'
				element={<Home />}
			/>

			{/* Edit Events Page */}
			<Route
				path='/events/'
				element={<Events />}
			/>

			{/* Edit a specific event */}
			<Route
				path='/edit/event/:id/'
				element={<EditEvent />}
			/>

			<Route
				path='/new/event/'
				element={<CreateEvent />}
			/>
		</Routes>
	);
}

export default App;
