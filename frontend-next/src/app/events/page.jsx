export const dynamic = 'force-dynamic';

import React from 'react';
import Events from '@/components/pages/Events';

export const metadata = {
	title: 'Events | Linganore United Methodist Church',
	description: 'Browse featured and recurring events hosted by Linganore United Methodist Church.',
};

export default function EventsPage() {
	return <Events />;
}
