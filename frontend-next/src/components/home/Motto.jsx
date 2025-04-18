import React from 'react';

function Motto({ title, subtext }) {
	return (
		<div className='relative w-full flex flex-col items-center space-y-2 text-center font-dm mt-24'>
			<img
				src='/assets/decals/decal-top-red.svg'
				alt=''
				width={380}
				className='absolute -top-18 z-10 select-none'
			/>
			<div className='flex flex-col space-y-2'>
				<div className='text-3xl xs:text-4xl px-4 md:px-0 mx-auto mb-4'>{title}</div>
				<div className='text-lg sm:p-0 lg:text-xl px-4 max-w-[500px] lg:max-w-[700px] mx-auto'>
					{subtext}
				</div>
			</div>
			<img
				src='/assets/decals/decal-bottom-red.svg'
				alt=''
				className='absolute -bottom-12 sm:-bottom-14 z-10 select-none'
			/>
		</div>
	);
}

export default Motto;
