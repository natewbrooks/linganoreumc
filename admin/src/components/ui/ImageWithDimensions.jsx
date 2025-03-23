import React, { useState } from 'react';

export default function ImageWithDimensions({ src, alt, imgClassName }) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	const handleImageLoad = (e) => {
		setDimensions({
			width: e.target.naturalWidth,
			height: e.target.naturalHeight,
		});
	};

	// Extract the filename from the source URL.
	const filename = src ? src.split('/').pop() : '';

	return (
		<>
			<img
				src={src}
				alt={alt}
				className={imgClassName}
				onLoad={handleImageLoad}
			/>
			<div className='absolute bottom-0 right-0 bg-darkred bg-opacity-50 text-bkg font-dm text-xs px-1'>
				{/* <div>{filename}</div> */}
				<div>
					{dimensions.width}px * {dimensions.height}px
				</div>
			</div>
		</>
	);
}
