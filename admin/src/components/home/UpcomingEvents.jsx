// UpcomingEventsSection.jsx
import React from 'react';
import TextInput from '../../components/ui/TextInput';

export default function UpcomingEvents({
	upcomingEventsTitle,
	upcomingEventsSubtext,
	upcomingEventsSeeMore,
	onChange,
}) {
	return (
		<div className='flex flex-col pl-8'>
			<TextInput
				title='Title'
				value={upcomingEventsTitle}
				onChange={(e) => onChange('upcomingEventsTitle', e.target.value)}
			/>
			<TextInput
				title='Subtext'
				value={upcomingEventsSubtext}
				onChange={(e) => onChange('upcomingEventsSubtext', e.target.value)}
			/>
			<TextInput
				title='See More Text'
				value={upcomingEventsSeeMore}
				onChange={(e) => onChange('upcomingEventsSeeMore', e.target.value)}
			/>
		</div>
	);
}
