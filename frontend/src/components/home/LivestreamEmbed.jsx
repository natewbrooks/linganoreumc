import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as SiIcons from 'react-icons/si';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

function LivestreamEmbed({
	liveTitle,
	liveSubtext,
	liveSeeMore,
	offlineTitle,
	offlineSubtext,
	offlineSeeMore,
	ytChannelID,
	ytAPIKey,
	socialLinks,
	size,
}) {
	const [isLive, setIsLive] = useState(false);
	const [ytVideoID, setYTVideoID] = useState('');

	function fetchYoutubeData() {
		fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ytChannelID}&eventType=live&type=video&key=${ytAPIKey}`,
			{
				headers: {
					Accept: 'application/json',
				},
			}
		)
			.then(async (res) => {
				const response = await res.json();

				if (response.items && response.items.length > 1) {
					const streamInfo = response.items[0];
					setIsLive(true);
					setYTVideoID(streamInfo.id.videoId);
				}
			})
			.catch((err) => {
				console.log('Error fetching data from YouTube API: ', err);
			});
	}

	useEffect(() => {
		fetchYoutubeData();
	}, []);

	const opts = {
		playerVars: {
			allowFullscreen: 1,
		},
	};

	const getIconComponent = (iconName) => {
		if (FaIcons[iconName]) return FaIcons[iconName];
		if (Fa6Icons[iconName]) return Fa6Icons[iconName];
		if (SiIcons[iconName]) return SiIcons[iconName];
		return null;
	};

	return (
		<div className={`w-full flex items-center justify-center space-x-10`}>
			{/* ICONS/LINKS */}
			<div className={`grid-cols-1 space-y-2`}>
				{socialLinks.map((link, index) => {
					const IconComponent = getIconComponent(link.reactIcon);
					return (
						<a
							key={index}
							href={link.url}
							target='_blank'
							rel='noopener noreferrer'
							className={`flex items-center justify-center bg-red ${
								index % 2 == 0 ? 'skew-x-[30deg]' : '-skew-x-[30deg]'
							} text-bkg px-3 py-2 transition hover:bg-red/80`}>
							<span className={`${index % 2 == 0 ? '-skew-x-[30deg]' : 'skew-x-[30deg]'}`}>
								{IconComponent && <IconComponent size={42} />}
							</span>
						</a>
					);
				})}
			</div>
			{isLive ? (
				// The current livestream
				<div className={`flex flex-col justify-center items-center text-center`}>
					<div className={`flex flex-col -space-y-1 leading-2 mb-2`}>
						<span className={`font-dm text-xl`}>{liveTitle}</span>
						<h1 className={`font-dm text-2xl sm:text-4xl`}>{liveSubtext}</h1>
					</div>
					<div className={`flex flex-col space-y-1`}>
						<YouTube
							style={{ width: `100vw` }}
							className={`aspect-square justify-center items-center`}
							videoId={ytVideoID}
							opts={opts}
						/>
						<div className={`flex justify-between px-2 -translate-y-6 sm:translate-y-0`}>
							<div className={`flex items-center space-x-2`}>
								<div className={`bg-red rounded-full p-2`}>{` `}</div>
								<div className={`font-dm text-xl`}>LIVE NOW</div>
							</div>
							<Link
								to={'/'}
								className={`font-dm text-xl`}>
								{liveSeeMore}
							</Link>
						</div>
					</div>
				</div>
			) : (
				// A previous video
				<div className={`flex flex-col justify-center items-center text-center`}>
					<div className={`flex flex-col -space-y-1 leading-2 mb-2`}>
						<span className={`font-dm text-xl`}>{offlineTitle}</span>
						<h1 className={`font-dm text-2xl sm:text-4xl`}>{offlineSubtext}</h1>
					</div>
					<div className={`flex flex-col space-y-1`}>
						<YouTube
							className={`w-screen sm:w-full justify-center items-center`}
							videoId={ytVideoID}
							opts={opts}
						/>
						<div className={`flex justify-between px-2 -translate-y-6 xs:translate-y-0`}>
							<div className={`flex items-center space-x-2`}>
								<div className={`font-dm text-xl`}>{` `}</div>
							</div>
							<Link
								to={'/'}
								className={`font-dm text-xl `}>
								{offlineSeeMore}
							</Link>
						</div>
					</div>
				</div>
			)}
			{/* <div className={`grid-cols-1 space-y-2 `}>
				<div className={`bg-red -skew-x-[30deg] px-3 py-2`}>
					<FaFacebook
						className={`skew-x-[30deg] text-bkg`}
						size={50}
					/>
				</div>
				<div className={`bg-red skew-x-[30deg] px-3 py-2`}>
					<FaYoutube
						className={`-skew-x-[30deg] text-bkg`}
						size={50}
					/>
				</div>
				<div className={`bg-red -skew-x-[30deg] px-3 py-2`}>
					<SiZoom
						className={`skew-x-[30deg] text-bkg`}
						size={50}
					/>
				</div>
				<div className={`bg-red skew-x-[30deg] px-3 py-2`}>
					<FaYoutube
						className={`-skew-x-[30deg] text-bkg`}
						size={50}
					/>
				</div>
			</div> */}
		</div>
	);
}

export default LivestreamEmbed;
