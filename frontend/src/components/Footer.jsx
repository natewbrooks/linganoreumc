import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiZoom } from 'react-icons/si';
import logoNoBkgWhite from '../assets/logos/logo-no-bkg-white.svg';

function Footer() {
	return (
		<div className={`flex flex-col font-dm text-bkg `}>
			<div className={`flex flex-col justify-center items-center bg-red py-6 space-y-8`}>
				<img
					src={logoNoBkgWhite}
					width={250}
				/>

				<div
					className={`sm:flex grid grid-cols-2 items-center text-center space-y-2 space-x-0 sm:space-y-0 sm:space-x-10 sm:flex-row text-xl`}>
					<Link
						to={`/`}
						className={`text-bkg`}>
						H<span className={`text-lg`}>OME</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						C<span className={`text-lg`}>ALENDAR</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						S<span className={`text-lg`}>ERMONS</span>
					</Link>
					<Link
						to={`/events`}
						className={`text-bkg`}>
						E<span className={`text-lg`}>VENTS</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						G<span className={`text-lg`}>IVE</span>
					</Link>
				</div>
			</div>
			<div className={`bg-darkred flex space-x-4 py-1 justify-center items-center`}>
				<Link>
					<FaFacebook size={24} />
				</Link>
				<Link>
					<FaInstagram size={24} />
				</Link>
				<Link>
					<FaYoutube size={28} />
				</Link>
				<Link>
					<SiZoom size={32} />
				</Link>
			</div>
			<div className={`bg-black flex justify-between py-2 px-4`}>
				<div className={`flex flex-col text-sm sm:text-xl`}>
					<span>Pastor Rev. William Carpenter</span>
					<span>443-937-5353</span>
				</div>
				<div className={`flex flex-col text-end text-sm sm:text-xl`}>
					<span>Linganore United Methodist Church</span>
					<span>8921 Clemsonville Road Union Bridge, Maryland 2179</span>
				</div>
			</div>
		</div>
	);
}

export default Footer;
