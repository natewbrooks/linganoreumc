'use client';

import AnnouncementBanner from '@/components/nav/AnnouncementBanner';
import { useSettings } from '@/contexts/SettingsContext';
import Navigation from '@/components/nav/Navigation';
import MobileNavigation from '@/components/nav/MobileNavigation';
import Footer from '@/components/nav/Footer';

export default function LayoutWrapper({ children }) {
	const { settings } = useSettings();

	return (
		<div className='flex flex-col'>
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
			<div className='bg-bkg overflow-hidden'>
				{children}
				<Footer />
			</div>
		</div>
	);
}
