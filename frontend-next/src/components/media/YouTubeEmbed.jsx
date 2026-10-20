import React from 'react';

/** Responsive YouTube player. CSS sizing so it renders on the server with no layout shift */
function YouTubeEmbed({ videoID }) {
	return (
		<div className='w-full max-w-[640px] mx-auto aspect-video'>
			<iframe
				src={`https://www.youtube-nocookie.com/embed/${videoID}`}
				title='Sermon video'
				allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				loading='lazy'
				className='w-full h-full'
			/>
		</div>
	);
}

export default YouTubeEmbed;
