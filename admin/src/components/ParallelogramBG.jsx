import React from 'react';

function ParallelogramBG({ text, textSize, flipped, bgColorClass, width }) {
	return (
		<div className='flex w-fit'>
			<div
				style={{ width: width ? width : '100%' }}
				className={`px-4 w-fit py-1 h-fit group-hover:scale-[101%] group-hover:shadow-sm ${
					!bgColorClass ? 'bg-red' : bgColorClass
				} inline-block ${flipped ? 'skew-x-[30deg]' : '-skew-x-[30deg]'}`}>
				<div
					style={{ fontSize: textSize }}
					className={`font-dm text-bkg ${flipped ? '-skew-x-[30deg]' : 'skew-x-[30deg]'}`}>
					{text}
				</div>
			</div>
		</div>
	);
}

export default ParallelogramBG;
