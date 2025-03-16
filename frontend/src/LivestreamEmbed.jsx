import React, { useState, useEffect } from 'react';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { SiZoom } from 'react-icons/si';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

function LivestreamEmbed({ ytChannelID, ytAPIKey, size }) {
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
		width: size,
		playerVars: {
			autoplay: 1,
			allowFullscreen: 1,
		},
	};

	return (
		<div className={`w-full flex items-center justify-center space-x-10`}>
			{/* ICONS/LINKS */}
			<div className={`grid-cols-1 space-y-2`}>
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
			</div>
			{isLive ? (
				// The current livestream
				<div className={`flex flex-col justify-center items-center text-center`}>
					<div className={`flex flex-col leading-2 mb-2`}>
						<span className={`font-dm text-lg`}>WE'RE IN SESSION</span>
						<h1 className={`font-dm text-xl`}>Watch our live broadcast!</h1>
					</div>
					<div className={`flex flex-col space-y-1`}>
						<YouTube
							className={`aspect-video`}
							videoId={ytVideoID}
							opts={opts}
						/>
						<div className={`flex justify-between`}>
							<div className={`flex items-center space-x-2`}>
								<div className={`bg-red rounded-full p-2`}>{` `}</div>
								<div className={`font-dm`}>LIVE NOW</div>
							</div>
							<Link
								to={'/'}
								className={`font-dm`}>
								VIEW PREVIOUS SERMONS
							</Link>
						</div>
					</div>
				</div>
			) : (
				// A previous video
				<div className={`flex flex-col justify-center items-center text-center`}>
					<div className={`flex flex-col leading-2 mb-2`}>
						<span className={`font-dm text-md`}>WE'RE NOT IN SESSION...</span>
						<h1 className={`font-dm text-2xl`}>Enjoy our previous broadcast!</h1>
					</div>
					<div className={`flex flex-col space-y-1`}>
						<YouTube
							className={`aspect-video`}
							videoId={'XU_Gj9NbNd0'} // temporary for testing
							opts={opts}></YouTube>
						<div className={`flex justify-between`}>
							<div className={`flex items-center space-x-2`}>
								<div className={`font-dm`}>{` `}</div>
							</div>
							<Link
								to={'/'}
								className={`font-dm`}>
								VIEW PREVIOUS SERMONS
							</Link>
						</div>
					</div>
				</div>
			)}
			<div className={`grid-cols-1 space-y-2 invisible`}>
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
			</div>
		</div>
	);
}

export default LivestreamEmbed;
