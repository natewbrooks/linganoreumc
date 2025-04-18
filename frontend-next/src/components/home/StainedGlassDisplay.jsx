'use client';
import React from 'react';
import Image from 'next/image';

function StainedGlassDisplay({ stainedGlassImages = [] }) {
	return (
		<div className='w-full h-fit'>
			<div className='grid grid-cols-3 gap-4 justify-items-center xs:grid-flow-col xs:auto-cols-fr xs:grid-rows-1'>
				{stainedGlassImages.map((img, idx) => (
					<div
						key={idx}
						className='relative w-full max-w-[100px] h-full max-h-[300px] aspect-[1/3] rounded-md shadow-md overflow-hidden'>
						<Image
							fill
							src={img.url}
							alt={`Stained Glass ${idx + 1}`}
							loading='lazy'
							priority={false}
							unoptimized={true}
							className='object-cover rounded-t-full'
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default StainedGlassDisplay;
