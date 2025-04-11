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
			<div className={`flex flex-col space-y-8`}>
				<div className={`text-3xl xs:text-4xl px-4 md:px-0 mx-auto mb-4`}>{title}</div>
				<div className={`text-lg sm:p-0 lg:text-xl px-4 max-w-[500px] lg:max-w-[700px] mx-auto`}>
					{subtext}
				</div>
			</div>
			<Bottom className={`absolute -bottom-12 sm:-bottom-14 z-10`} />
		</div>
	);
}

export default Motto;
