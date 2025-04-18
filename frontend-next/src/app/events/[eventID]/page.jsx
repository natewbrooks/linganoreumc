import React from 'react';
import Event from '@/components/pages/Event';

export const metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default async function EventPage({ params }) {
	const { eventID } = await params;
	return <Event eventID={eventID} />;
}
