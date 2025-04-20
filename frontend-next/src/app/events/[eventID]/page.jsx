export const dynamic = 'force-dynamic';

import React from 'react';
import Event from '@/components/pages/Event';

export async function generateMetadata({ params }) {
	const { eventID } = await params;

	// Replace with your actual fetch logic
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventID}`);
	const event = await res.json();

	return {
		title: (event?.title || 'Event') + ' | Linganore United Methodist Church',
		robots: {
			index: false,
			follow: true,
		},
	};
}

export default async function EventPage({ params }) {
	const { eventID } = await params;
	return <Event eventID={eventID} />;
}
