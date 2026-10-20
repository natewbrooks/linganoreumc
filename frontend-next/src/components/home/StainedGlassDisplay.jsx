'use client';
import React from 'react';
import Image from 'next/image';

function StainedGlassDisplay({ stainedGlassImages = [] }) {
	return (
		<div className='w-full h-fit'>
			{/* Mobile: side scroller running offscreen. xs and up: single row grid */}
			<div className='flex gap-4 px-4 scroll-px-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] xs:grid xs:px-0 xs:overflow-visible xs:justify-items-center xs:grid-flow-col xs:auto-cols-fr xs:grid-rows-1'>
				{stainedGlassImages.map((img, idx) => (
					<div
						key={idx}
						className='relative shrink-0 snap-start w-[100px] xs:w-full max-w-[100px] h-full max-h-[300px] aspect-[1/3] rounded-t-full rounded-b-md overflow-hidden'>
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
