import React from 'react';
import Sermon from '@/components/pages/Sermon';

export async function generateMetadata({ params }) {
	const { sermonID } = await params;

	// Replace with your actual fetch logic
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sermons/${sermonID}`);
	const sermon = await res.json();

	return {
		title: (sermon?.title || 'Sermon') + ' | Linganore United Methodist Church',
		robots: {
			index: false,
			follow: true,
		},
	};
}

export default async function SermonPage({ params }) {
	const { sermonID } = await params;
	return <Sermon sermonID={sermonID} />;
}
