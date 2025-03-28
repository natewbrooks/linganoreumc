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
		<div className={`w-full flex items-stretch justify-center space-x-10 min-h-[360px]`}>
			{/* LIVESTREAM OR OFFLINE BLOCK */}
			<div className='flex flex-col justify-center items-center text-center h-full'>
				<div className='flex flex-col -space-y-1 leading-2 mb-2'>
					<span className='font-dm text-xl'>{isLive ? liveTitle : offlineTitle}</span>
					<h1 className='font-dm text-2xl sm:text-4xl'>{isLive ? liveSubtext : offlineSubtext}</h1>
				</div>
				<div className='flex flex-col space-y-1 h-full justify-between'>
					<div className='relative w-full sm:w-[640px] aspect-video'>
						{/* LEFT SIDE ICONS */}
						{socialLinks.length > 0 && (
							<div className='absolute -left-28 top-0 bottom-0 flex flex-col h-full max-h-full z-10 py-12 space-y-1 w-20'>
								{[...Array(4)].map((_, i) => {
									const link = socialLinks[i];
									if (!link)
										return (
											<div
												key={`left-empty-${i}`}
												className='h-1/4'
											/>
										);
									const IconComponent = getIconComponent(link.reactIcon);
									return (
										<Link
											key={`left-${i}`}
											to={link.url}
											target='_blank'
											rel='noopener noreferrer'
											className={`h-1/4 flex items-center justify-center bg-red ${
												i % 2 === 0 ? '-skew-x-[30deg]' : 'skew-x-[30deg]'
											} text-bkg transition hover:bg-red/80`}>
											<span
												className={`w-full h-full flex items-center justify-center ${
													i % 2 === 0 ? 'skew-x-[30deg]' : '-skew-x-[30deg]'
												}`}>
												{IconComponent && <IconComponent className='w-10 h-10 sm:w-12 sm:h-12' />}
											</span>
										</Link>
									);
								})}
							</div>
						)}

						{/* RIGHT SIDE ICONS */}
						{socialLinks.length > 4 && (
							<div className='absolute -right-28 top-0 bottom-0 flex flex-col h-full max-h-full z-10 py-12 space-y-1 w-20'>
								{[...Array(4)].map((_, i) => {
									const link = socialLinks[i + 4];
									if (!link)
										return (
											<div
												key={`right-empty-${i}`}
												className='h-1/4'
											/>
										);
									const IconComponent = getIconComponent(link.reactIcon);
									return (
										<Link
											key={`right-${i}`}
											to={link.url}
											target='_blank'
											rel='noopener noreferrer'
											className={`h-1/4 flex items-center justify-center bg-red ${
												i % 2 === 0 ? 'skew-x-[30deg]' : '-skew-x-[30deg]'
											} text-bkg transition hover:bg-red/80`}>
											<span
												className={`w-full h-full flex items-center justify-center ${
													i % 2 === 0 ? '-skew-x-[30deg]' : 'skew-x-[30deg]'
												}`}>
												{IconComponent && <IconComponent className='w-10 h-10 sm:w-12 sm:h-12' />}
											</span>
										</Link>
									);
								})}
							</div>
						)}

						{/* VIDEO PLAYER */}
						<YouTube
							className='w-full h-full'
							videoId={ytVideoID}
							opts={opts}
						/>
					</div>

					<div
						className={`flex ${
							isLive ? 'justify-between' : 'justify-end'
						}  -translate-y-6 sm:translate-y-0`}>
						{isLive && (
							<div className='flex items-center space-x-2'>
								<div className='bg-red rounded-full p-2'>{` `}</div>
								<div className='font-dm text-xl'>LIVE NOW</div>
							</div>
						)}
						<Link
							to='/sermons'
							className='font-dm text-xl hover:opacity-50 hover:scale-[102%] active:scale-[99%]'>
							{isLive ? liveSeeMore : offlineSeeMore}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LivestreamEmbed;
