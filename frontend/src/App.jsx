import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Event from './pages/Event';
import Sermons from './pages/Sermons';
import Sermon from './pages/Sermon';

function App() {
	return (
		<Routes>
			{/* Landing Page */}
			<Route
				path={`${import.meta.env.VITE_BASE_URL}/`}
				element={<Home />}
			/>

			{/* Events Page */}
			<Route
				path={`${import.meta.env.VITE_BASE_URL}/events/`}
				element={<Events />}
			/>

			<Route
				path={`${import.meta.env.VITE_BASE_URL}/events/:eventID`}
				element={<Event />}
			/>

			<Route
				path={`${import.meta.env.VITE_BASE_URL}/sermons/`}
				element={<Sermons />}
			/>

			<Route
				path={`${import.meta.env.VITE_BASE_URL}/sermons/:sermonID`}
				element={<Sermon />}
			/>

			{/* Calendar Page */}
			<Route
				path={`${import.meta.env.VITE_BASE_URL}/calendar/`}
				element={<Calendar />}
			/>
		</Routes>
	);
}

export default App;
