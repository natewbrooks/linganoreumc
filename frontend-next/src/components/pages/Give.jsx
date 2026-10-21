'use client';
import React, { useEffect, useRef, useState } from 'react';
import Loader from '@/components/ui/Loader';

const VANCO_ORIGIN = 'https://secure.myvanco.com';

export default function Give() {
	const frameRef = useRef(null);
	const [loading, setLoading] = useState(true);

	// Vanco posts its content height so the iframe can grow instead of scrolling
	useEffect(() => {
		const onMessage = (e) => {
			if (e.origin !== VANCO_ORIGIN || !e.data?.height || !frameRef.current) return;
			frameRef.current.height = e.data.height;
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, []);

	return (
		<div className='flex flex-col space-y-4 items-center w-full page-wrapper px-4 py-4 md:py-10 pb-8'>
			{/* Flares stay full size and clip at the edges on narrow screens. Right one mirrored */}
			<div className='flex items-center justify-center gap-2 -mx-4 w-[calc(100%+2rem)] overflow-hidden font-dm text-3xl sm:text-4xl'>
				<img
					src='/assets/decals/flare-vine.svg'
					alt=''
					className='w-[240px] shrink-0 select-none opacity-20'
				/>
				<h1 className='whitespace-nowrap shrink-0'>ONLINE GIVING</h1>
				<img
					src='/assets/decals/flare-vine.svg'
					alt=''
					className='w-[240px] shrink-0 select-none opacity-20 -scale-x-100'
				/>
			</div>
			{loading && <Loader label='Loading giving form…' />}
			{/* Stays mounted while hidden so the form loads behind the loader */}
			<iframe
				ref={frameRef}
				onLoad={() => setLoading(false)}
				title='Online giving'
				width='100%'
				frameBorder='0'
				allow='clipboard-write'
				scrolling='no'
				src={`${VANCO_ORIGIN}/L-ZZGZ`}
				className={loading ? 'hidden' : 'max-w-[640px] min-h-[600px] outline-none'}
			/>
		</div>
	);
}
