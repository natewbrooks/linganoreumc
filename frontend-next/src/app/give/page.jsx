export const dynamic = 'force-dynamic';

import React from 'react';
import Give from '@/components/pages/Give';

const title = 'Online Giving | Linganore United Methodist Church';
const description =
	'Give online to Linganore United Methodist Church. Make a secure one-time or recurring gift, tithe, or offering to support our community.';

export const metadata = {
	title,
	description,
	keywords: ['online giving', 'donate', 'tithe', 'offering', 'church donation', 'Linganore United Methodist Church'],
	alternates: { canonical: 'https://linganoreumc.com/give' },
	openGraph: {
		title,
		description,
		url: 'https://linganoreumc.com/give',
		siteName: 'Linganore United Methodist Church',
		type: 'website',
		images: [{ url: 'https://linganoreumc.com/assets/linganore-bright-pic-upscale.webp' }],
	},
	twitter: { card: 'summary_large_image', title, description },
};

export default function GivePage() {
	return <Give />;
}
