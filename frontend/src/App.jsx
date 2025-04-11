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
				path='/'
				element={<Home />}
			/>

			{/* Events Page */}
			<Route
				path='/events/'
				element={<Events />}
			/>

			<Route
				path='/events/:eventID'
				element={<Event />}
			/>

			<Route
				path='/sermons/'
				element={<Sermons />}
			/>

			<Route
				path='/sermons/:sermonID'
				element={<Sermon />}
			/>

			{/* Calendar Page */}
			<Route
				path='/calendar/'
				element={<Calendar />}
			/>
		</Routes>
	);
}

export default App;
