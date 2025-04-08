import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/edit/Home.jsx';
import General from './pages/General.jsx';
import Events from './pages/Events.jsx';
import EditEvent from './components/events/EditEvent.jsx';
import CreateEvent from './components/events/CreateEvent.jsx';
import Sermons from './pages/Sermons.jsx';
import CreateSermon from './components/sermons/CreateSermon.jsx';
import EditSermon from './components/sermons/EditSermon.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Users from './pages/manage/Users.jsx';
import Account from './pages/manage/Account.jsx';

// Handles routing
function App() {
	return (
		<Routes>
			<Route
				path='/login/'
				element={<Login />}
			/>

			{/* All of these routes are protected */}

			{/* website.com/admin/ */}
			<Route
				path='/'
				element={<General />}
			/>

			{/* Edit Home Page */}
			<Route
				path='/edit/pages/home/'
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

			{/* Sermons Page */}
			<Route
				path='/sermons/'
				element={<Sermons />}
			/>

			<Route
				path='/new/sermon/'
				element={<CreateSermon />}
			/>

			<Route
				path='/edit/sermon/:id/'
				element={<EditSermon />}
			/>

			<Route
				path='/manage/users'
				element={<Users />}
			/>

			<Route
				path='/manage/account'
				element={<Account />}
			/>

			<Route
				path='*'
				element={<NotFound />}
			/>
		</Routes>
	);
}

export default App;
