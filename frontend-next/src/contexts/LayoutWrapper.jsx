'use client';

import AnnouncementBanner from '@/components/nav/AnnouncementBanner';
import { useSettings } from '@/contexts/SettingsContext';
import Navigation from '@/components/nav/Navigation';
import MobileNavigation from '@/components/nav/MobileNavigation';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ footer, children }) {
	const { settings } = useSettings();
	const pathname = usePathname();

	// Next skips its scroll reset when the new page is already under the sticky header
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		// min-h-dvh + flex-1 content keeps the footer at the bottom of the screen on short pages
		<div className='flex flex-col min-h-dvh'>
			{/* Sticky Wrapper */}
			<div className='sticky top-0 z-30 bg-red'>
				{settings?.general?.announcementBanner?.enabled && (
					<AnnouncementBanner
						title={settings.general.announcementBanner.title}
						subtext={settings.general.announcementBanner.subtext}
					/>
				)}
				<div className='hidden md:block'>
					<Navigation />
				</div>
				<div className='block md:hidden'>
					<MobileNavigation
						announcementBannerEnabled={settings?.general?.announcementBanner?.enabled}
					/>
				</div>
			</div>
			{/* Main content */}
			<div className='flex flex-col flex-1 bg-bkg overflow-hidden'>
				<div className='flex-1'>{children}</div>
				{footer}
			</div>
		</div>
	);
}
