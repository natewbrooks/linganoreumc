import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateEventForm from '../../components/events/EventForm';
import ListEvents from '../../components/events/ListEvents';

function Events() {
	return <ListEvents />;
}

export default Events;
