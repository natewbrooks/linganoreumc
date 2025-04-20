export const dynamic = 'force-dynamic';

import React from 'react';
import Sermons from '@/components/pages/Sermons';

export const metadata = {
	title: 'Sermons | Linganore United Methodist Church',
	description: 'Watch or listen to past sermons and messages from Linganore.',
};

export default function SermonsPage() {
	return <Sermons />;
}
