import React from 'react';
import Link from 'next/link';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as SiIcons from 'react-icons/si';
import * as BiIcons from 'react-icons/bi';

/** Server component: receives `settings` from `layout.js`. */
function Footer({ settings }) {
	const generalSettings = settings.general || {};
	const contactInfo = generalSettings.contactInformation || {};
	const socialLinks = generalSettings.socialMediaLinks || [];

	const whiteLogoNoBKG = '/assets/logos/logo-no-bkg-white.svg';

	// Combine all possible icon sets
	const iconSets = { ...FaIcons, ...Fa6Icons, ...SiIcons, ...BiIcons };
	// Swap Zoom icons for Font Awesome's camera so every glyph shares one family and height
	const iconAliases = { SiZoom: 'FaVideo', BiLogoZoom: 'FaVideo' };

	return (
		<div className={`flex flex-col font-dm text-bkg`}>
			{/* Header Section */}
			<div className={`flex flex-col justify-center items-center bg-red py-6 space-y-8`}>
				<img
					src={whiteLogoNoBKG}
					width={250}
					height={61}
					className='w-[200px] sm:w-[250px] h-auto'
					alt='Church Logo'
				/>

				<div
					className={`sm:flex grid grid-cols-2 gap-x-10 gap-y-3 w-fit items-center text-center space-x-0 sm:space-y-0 sm:space-x-10 sm:flex-row text-xl`}>
					<Link
						href={``}
						className={`text-bkg`}>
						H<span className={`text-lg`}>OME</span>
					</Link>
					<Link
						href={`/calendar`}
						className={`text-bkg`}>
						C<span className={`text-lg`}>ALENDAR</span>
					</Link>
					<Link
						href={`/events`}
						className={`text-bkg`}>
						E<span className={`text-lg`}>VENTS</span>
					</Link>
					<Link
						href={`/sermons`}
						className={`text-bkg`}>
						S<span className={`text-lg`}>ERMONS</span>
					</Link>
					<Link
						href={`/give`}
						className={`text-bkg`}>
						G<span className={`text-lg`}>IVE</span>
					</Link>
				</div>
			</div>

			{/* Social Media Links */}
			<div className={`bg-darkred flex space-x-3 py-2 justify-center items-center`}>
				{socialLinks.map((link, index) => {
					const IconComponent = iconSets[iconAliases[link.reactIcon] || link.reactIcon] || null;
					return (
						<Link
							key={index}
							href={link.url}
							target='_blank'
							title={link.platform}
							className={`flex justify-center items-center w-8 h-8 rounded-full bg-bkg text-darkred hover:opacity-70 transition`}
							rel='noopener noreferrer'>
							{IconComponent ? (
								<IconComponent size={16} />
							) : (
								<span className='text-xs'>{link.platform}</span>
							)}
						</Link>
					);
				})}
			</div>

			{/* Contact Information */}
			<div
				className={`bg-black flex flex-col sm:flex-row items-center sm:items-stretch text-center sm:text-left justify-between gap-4 py-4 sm:py-2 px-4`}>
				<div className={`flex flex-col space-y-1 sm:space-y-0 text-sm sm:text-base`}>
					<span>{contactInfo.name || 'Pastor Name'}</span>
					<div className={`flex flex-col sm:flex-row sm:space-x-2`}>
						<span>{contactInfo.phoneNumber || 'Phone Number'}</span>
						<span className={`hidden sm:block`}>|</span>
						<span>{contactInfo.email || 'Email'}</span>
					</div>
				</div>
				<div
					className={`flex flex-col justify-between items-center sm:items-end sm:text-end text-sm sm:text-base`}>
					<span className={``}>{contactInfo.locationName || 'Church Name'}</span>
					<span>{contactInfo.address || 'Church Address'}</span>
				</div>
			</div>
		</div>
	);
}

export default Footer;
