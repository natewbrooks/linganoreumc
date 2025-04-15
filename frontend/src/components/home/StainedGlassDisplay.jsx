import React, { useEffect } from 'react';

function StainedGlassDisplay({ stainedGlassImages = [] }) {
	useEffect(() => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = stainedGlassImages[0]?.url || '/stained-glass/stained-glass-1.png';
		document.head.appendChild(link);

		return () => {
			document.head.removeChild(link);
		};
	}, [stainedGlassImages]);

	return (
		<div className='w-full flex h-fit '>
			<div className='flex flex-row w-full justify-evenly flex-wrap gap-4'>
				{stainedGlassImages.length > 0
					? stainedGlassImages.map((img, idx) => (
							<img
								key={idx}
								src={img.url}
								alt={`Stained Glass ${idx + 1}`}
								className='h-[180px] md:h-[300px] object-cover rounded-md shadow-md'
							/>
					  ))
					: [1, 2, 3, 4, 5, 6].map((num) => (
							<img
								key={num}
								src={`/stained-glass/stained-glass-${num}.png`}
								alt={`Stained Glass ${num}`}
								className='h-[180px] md:h-[300px] object-cover rounded-md shadow-md'
							/>
					  ))}
			</div>
		</div>
	);
}

export default StainedGlassDisplay;
