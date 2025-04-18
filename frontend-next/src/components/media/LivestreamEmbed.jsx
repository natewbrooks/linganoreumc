import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as SiIcons from 'react-icons/si';
import Link from 'next/link';
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
}) {
	const [isLive, setIsLive] = useState(false);
	const [ytVideoID, setYTVideoID] = useState('');
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	// Fetch livestream status
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
				if (response.items && response.items.length > 0) {
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

	// Handle window resize
	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Dynamic size based on screen width
	const videoWidth = Math.min(windowWidth - 0, 640); // 0px padding buffer
	const videoHeight = videoWidth * (9 / 16);

	const opts = {
		width: videoWidth,
		height: videoHeight,
		playerVars: {
			autoplay: 0,
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
		<div className='w-full flex items-stretch justify-center min-h-[360px]'>
			<div className='flex flex-col justify-center items-center text-center h-full'>
				<div className='flex flex-col -space-y-1 leading-2 mb-2'>
					<span className='font-dm text-xl'>{isLive ? liveTitle : offlineTitle}</span>
					<h1 className='font-dm text-2xl sm:text-3xl'>{isLive ? liveSubtext : offlineSubtext}</h1>
				</div>

				<div className='flex flex-col space-y-1 h-full justify-between'>
					{/* Video + Social Icons Wrapper */}
					<div className='relative w-full sm:w-[640px] mx-auto'>
						{/* LEFT ICONS */}
						{socialLinks.length > 0 && (
							<div className='absolute -left-28 top-0 bottom-0 hidden md:flex flex-col h-full z-10 py-12 space-y-1 w-20'>
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
											href={link.url}
											target='_blank'
											rel='noopener noreferrer'
											className={`h-1/4 flex items-center justify-center bg-red ${
												i % 2 === 0 ? 'skew-r clickable-r-skew' : 'skew-l clickable-l-skew'
											} text-bkg hover:bg-red/80`}>
											<span
												className={`w-full h-full flex items-center justify-center ${
													i % 2 === 0 ? 'skew-l' : 'skew-r'
												}`}>
												{IconComponent && <IconComponent className='w-10 h-10 sm:w-12 sm:h-12' />}
											</span>
										</Link>
									);
								})}
							</div>
						)}

						{/* RIGHT ICONS */}
						{socialLinks.length > 4 && (
							<div className='absolute -right-28 top-0 bottom-0 hidden md:flex flex-col h-full z-10 py-12 space-y-1 w-20'>
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
											href={link.url}
											target='_blank'
											rel='noopener noreferrer'
											className={`h-1/4 flex items-center justify-center bg-red ${
												i % 2 === 0 ? 'skew-r clickable-r-clickable' : 'skew-l  clickable-l-skew'
											} text-bkg hover:bg-red/80`}>
											<span
												className={`w-full h-full flex items-center justify-center ${
													i % 2 === 0 ? 'skew-l' : 'skew-r'
												}`}>
												{IconComponent && <IconComponent className='w-10 h-10 sm:w-12 sm:h-12' />}
											</span>
										</Link>
									);
								})}
							</div>
						)}

						{/* YOUTUBE VIDEO */}
						<YouTube
							videoId={ytVideoID}
							opts={opts}
						/>
					</div>

					{/* Live status / Link */}
					<div
						className={`flex w-full px-2 sm:px-0 ${
							isLive ? 'justify-between' : 'sm:justify-end justify-between'
						}`}>
						{isLive && (
							<div className='hidden sm:flex items-center sm:space-x-2'>
								<div className='bg-red rounded-full p-2'>{` `}</div>
								<div className='font-dm text-xl'>LIVE NOW</div>
							</div>
						)}
						{/* MOBILE LINK ICONS */}
						<div className='flex w-full sm:hidden gap-2 px-2'>
							{socialLinks.map((link, i) => {
								const IconComponent = getIconComponent(link.reactIcon);
								if (!IconComponent) return null;
								return (
									<Link
										key={`inline-${i}`}
										href={link.url}
										target='_blank'
										rel='noopener noreferrer'
										className='skew-x-[30deg] flex-grow w-full h-8 flex items-center justify-center bg-red text-bkg hover:bg-red/80'>
										<IconComponent className='w-full h-full p-1 -skew-x-[30deg]' />
									</Link>
								);
							})}
						</div>

						{/* <Link
							to='/sermons'
							className='font-dm text-lg sm:text-xl clickable  '>
							{isLive ? liveSeeMore : offlineSeeMore}
						</Link> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LivestreamEmbed;
