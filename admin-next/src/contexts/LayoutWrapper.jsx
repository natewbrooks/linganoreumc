'use client';

import Navigation from '@/components/nav/Navigation';
import MobileNavigation from '@/components/nav/MobileNavigation';

export default function LayoutWrapper({ children }) {
	return (
		<div className='flex flex-col'>
			{/* Sticky nav + banner */}
			<div className={`bg-darkred sticky top-0 z-30 mb-4 md:mb-20 `}>
				<div className={`pt-12 hidden md:block`}>
					<Navigation />
				</div>
				<div className={`block md:hidden`}>
					<MobileNavigation />
				</div>
			</div>

			<div className={`flex flex-row overflow-hidden px-2`}>
				<div className={`justify-center flex w-full h-full`}>
					<div className={`  w-full h-full max-w-[800px] 2xl:max-w-[1000px] px-4 mx-auto`}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
