import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

function YouTubeEmbed({ videoID }) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const videoWidth = Math.min(windowWidth, 640);
	const videoHeight = videoWidth * (9 / 16);

	const opts = {
		width: videoWidth,
		height: videoHeight,
		playerVars: {
			autoplay: 0,
			allowFullscreen: 1,
		},
	};

	return (
		<div className='w-full flex items-center justify-center min-h-[360px]'>
			<div className='relative w-full sm:w-[640px] mx-auto'>
				<YouTube
					videoId={videoID}
					opts={opts}
				/>
			</div>
		</div>
	);
}

export default YouTubeEmbed;
