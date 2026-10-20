'use client';
import React, { useEffect, useState } from 'react';
import YouTubeEmbed from '@/components/media/YouTubeEmbed';
import MarkdownText from '@/components/ui/MarkdownText';
import getFormat from '@/lib/getFormat';
import { useSermons } from '@/contexts/SermonsContext';
import ShareButton from '@/components/ui/ShareButton';
import NotFound from '@/components/ui/NotFound';
import Loader from '@/components/ui/Loader';

export default function Sermon({ sermonID }) {
	const { formatLongDate } = getFormat;

	const { sermons, fetchSermonById } = useSermons();

	// `sermonID` is a slug or ID. Context holds every sermon, so it renders (or 404s) on first paint with no fetch
	const known = sermons?.find((s) => s.slug === sermonID || String(s.id) === sermonID);
	const [sermon, setSermon] = useState(known ?? null);
	const [loading, setLoading] = useState(!sermons?.length);

	useEffect(() => {
		if (sermons?.length) {
			setSermon(known ?? null);
			setLoading(false);
			return;
		}
		// Fetch fallback only when context is empty (server sermons fetch failed)
		setLoading(true);
		fetchSermonById(sermonID)
			.then((data) => setSermon(data || null))
			.finally(() => setLoading(false));
	}, [sermonID]);

	function parseDateAsLocal(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const extractYouTubeId = (url) => {
		if (url) {
			const match = url.match(/(?:youtu\.be\/|youtube\.com.*v=)([a-zA-Z0-9_-]+)/);
			return match ? match[1] : null;
		}
		return null;
	};

	if (loading) return <Loader label='Loading sermon…' />;
	if (!sermon)
		return (
			<NotFound
				title="We couldn't find this sermon"
				text='It may have been moved or removed. You can browse every sermon below.'
				links={[{ href: '/sermons/', label: 'See All Sermons' }]}
			/>
		);

	const videoId = extractYouTubeId(sermon.videoURL);

	return (
		<div className='relative flex flex-col items-center w-full pt-12 pb-8 mb-12 max-w-[1000px] mx-auto space-y-4'>
			<ShareButton
				title={sermon.title}
				label='Share Sermon'
				className='absolute top-3 right-4'
			/>
			{/* Same header layout as an event: small date above the title, plain description under it */}
			<div className='flex flex-col items-center w-full space-y-4 text-center px-4 font-dm'>
				<div className='text-sm md:text-base text-darkred'>
					{sermon.publishDate && formatLongDate(parseDateAsLocal(sermon.publishDate))}
				</div>
				<h1 className='text-3xl'>{sermon.title}</h1>
				{sermon.description && <p className='-mt-1 md:px-12 text-base md:text-lg'>{sermon.description}</p>}
			</div>

			{videoId && (
				// Lines up with the slanted corners of the Transcript bar
				<div className='w-full px-2.5'>
					<YouTubeEmbed videoID={videoId} />
				</div>
			)}

			{sermon.body && (
				<div className='flex flex-col space-y-4 font-dm w-full px-4'>
					<div className='flex w-full justify-between py-0.5 md:py-1 bg-red px-4 text-bkg skew-x-[30deg]'>
						<div className='text-base md:text-lg -skew-x-[30deg]'>Transcript</div>
						{/* <div className='text-lg -skew-x-[30deg]'>
							Last edited: {formatLongDate(parseDateAsLocal(sermon.lastEditDate))}
						</div> */}
					</div>
					<div className='text-md md:text-lg'>
						<MarkdownText html={sermon.body} />
					</div>
				</div>
			)}
		</div>
	);
}
