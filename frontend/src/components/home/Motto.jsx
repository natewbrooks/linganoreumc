import React from 'react';
import Top from '../../assets/decals/decal-top-red.svg?react';
import Bottom from '../../assets/decals/decal-bottom-red.svg?react';

function Motto({ title, subtext }) {
	return (
		<div
			className={`relative w-full flex flex-col items-center space-y-2 text-center font-dm mt-24`}>
			<Top
				width={380}
				className={`absolute -top-18 z-10`}
			/>
			<span className={`text-2xl xs:text-4xl px-4 md:px-0`}>{title}</span>
			<span className={`text-md p-4 sm:p-0 sm:text-xl sm:w-[800px] px-12`}>{subtext}</span>
			<Bottom className={`absolute -bottom-12 sm:-bottom-14 z-10`} />
		</div>
	);
}

export default Motto;
