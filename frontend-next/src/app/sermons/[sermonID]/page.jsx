import React from 'react';
import Sermon from '@/components/pages/Sermon';

export const metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default async function SermonPage({ params }) {
	const { sermonID } = await params;
	return <Sermon sermonID={sermonID} />;
}
