import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Home from './pages/Home';
import Calendar from './pages/Calendar';

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

			{/* Calendar Page */}
			<Route
				path='/calendar/'
				element={<Calendar />}
			/>
		</Routes>
	);
}

export default App;
