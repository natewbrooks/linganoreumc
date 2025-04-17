import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/settings/Home.jsx';
import General from './pages/settings/General.jsx';

import Events from './pages/maintenance/Events.jsx';
import CreateEvent from './components/events/CreateEvent.jsx';
import EditEvent from './components/events/EditEvent.jsx';
import Sermons from './pages/maintenance/Sermons.jsx';
import CreateSermon from './components/sermons/CreateSermon.jsx';
import EditSermon from './components/sermons/EditSermon.jsx';

import Users from './pages/manage/Users.jsx';
import Account from './pages/manage/Account.jsx';

import Login from './pages/misc/Login.jsx';
import NotFound from './pages/misc/NotFound.jsx';

// Handles routing
function App() {
	return (
		<Routes>
			<Route
				path={`/login`}
				element={<Login />}
			/>

			{/* All of these routes are protected */}

			{/* website.com/admin/ */}
			<Route
				path={`/settings/general`}
				element={<General />}
			/>

			{/* Edit Home Page */}
			<Route
				path={`/settings/home`}
				element={<Home />}
			/>

			{/* Edit Events Page */}
			<Route
				path={`/events`}
				element={<Events />}
			/>

			{/* Edit a specific event */}
			<Route
				path={`/events/:id`}
				element={<EditEvent />}
			/>

			<Route
				path={`/events/new`}
				element={<CreateEvent />}
			/>

			{/* Sermons Page */}
			<Route
				path={`/sermons`}
				element={<Sermons />}
			/>

			<Route
				path={`/sermons/new`}
				element={<CreateSermon />}
			/>

			<Route
				path={`/sermons/:id`}
				element={<EditSermon />}
			/>

			<Route
				path={`/manage/users`}
				element={<Users />}
			/>

			<Route
				path={`/manage/account`}
				element={<Account />}
			/>

			<Route
				path={`/*`}
				element={<NotFound />}
			/>
		</Routes>
	);
}

export default App;
