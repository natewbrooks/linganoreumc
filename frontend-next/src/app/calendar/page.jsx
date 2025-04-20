export const dynamic = 'force-dynamic';

import React from 'react';
import Calendar from '@/components/pages/Calendar';

export const metadata = {
	title: 'Calendar | Linganore United Methodist Church',
	description: 'View our upcoming worship services, community events, and weekly ministries.',
};

export default function CalendarPage() {
	return <Calendar />;
}
