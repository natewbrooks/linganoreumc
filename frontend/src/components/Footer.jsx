import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiZoom } from 'react-icons/si';
import logoNoBkgWhite from '../assets/logos/logo-no-bkg-white.svg';

function Footer() {
	return (
		<div className={`flex flex-col font-dm text-bkg `}>
			<div className={`flex flex-col justify-center items-center bg-red py-10 space-y-8`}>
				<img
					src={logoNoBkgWhite}
					width={300}
				/>

				<div className={`flex space-x-10 text-2xl`}>
					<Link
						to={`/`}
						className={`text-bkg`}>
						H<span className={`text-xl`}>OME</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						C<span className={`text-xl`}>ALENDAR</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						S<span className={`text-xl`}>ERMONS</span>
					</Link>
					<Link
						to={`/events`}
						className={`text-bkg`}>
						E<span className={`text-xl`}>VENTS</span>
					</Link>
					<Link
						to={`/`}
						className={`text-bkg`}>
						G<span className={`text-xl`}>IVE</span>
					</Link>
				</div>
			</div>
			<div className={`bg-darkred flex space-x-4 py-2 justify-center items-center`}>
				<Link>
					<FaFacebook size={30} />
				</Link>
				<Link>
					<FaInstagram size={30} />
				</Link>
				<Link>
					<FaYoutube size={32} />
				</Link>
				<Link>
					<SiZoom size={40} />
				</Link>
			</div>
			<div className={`bg-black flex justify-between py-2 px-4`}>
				<div className={`flex flex-col`}>
					<span>Pastor Rev. William Carpenter</span>
					<span>443-937-5353</span>
				</div>
				<div className={`flex flex-col text-end`}>
					<span>Linganore United Methodist Church</span>
					<span>8921 Clemsonville Road Union Bridge, Maryland 2179</span>
				</div>
			</div>
		</div>
	);
}

export default Footer;
