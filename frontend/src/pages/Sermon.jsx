import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import YouTubeEmbed from '../components/media/YouTubeEmbed';
import { useSettings } from '../contexts/SettingsContext';
import MarkdownText from '../components/ui/MarkdownText';

const Sermon = () => {
	const { sermonID } = useParams();
	const { formatLongDate } = useSettings();

	const [sermon, setSermon] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSermon = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sermons/${sermonID}`);
				if (!res.ok) throw new Error('Sermon not found');
				const data = await res.json();
				setSermon(data);
			} catch (err) {
				console.error('Error loading sermon:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchSermon();
	}, [sermonID]);

	const extractYouTubeId = (url) => {
		if (url) {
			const match = url.match(/(?:youtu\.be\/|youtube\.com.*v=)([a-zA-Z0-9_-]+)/);
			return match ? match[1] : null;
		}

		return null;
	};

	if (loading) return <div className='p-8 font-dm'>Loading sermon...</div>;
	if (!sermon) return <div className='p-8 font-dm text-darkred'>Sermon not found.</div>;

	const videoId = extractYouTubeId(sermon.videoURL);

	return (
		<div className='flex flex-col items-center w-full py-8 mb-12 max-w-[1000px] mx-auto space-y-4'>
			<div className={`flex flex-col w-full space-y-4 text-center px-4 `}>
				<div className={`flex flex-col items-center space-y-1`}>
					<h1 className='text-3xl font-dm'>{sermon.title}</h1>
					<div className={`w-fit bg px-4 -skew-x-[30deg]`}>
						<div className='text-lg font-dm skew-x-[30deg]'>
							{formatLongDate(sermon.publishDate)}
						</div>
					</div>
				</div>

				{sermon.description && (
					<div className='w-full font-dm bg-red px-8 py-1 -skew-x-[30deg] text-bkg text-lg leading-relaxed'>
						<div className={`skew-x-[30deg]`}>{sermon.description}</div>
					</div>
				)}
			</div>

			{videoId && <YouTubeEmbed videoID={videoId} />}

			{sermon.body && (
				<div className={`flex flex-col space-y-4 font-dm w-full px-4 `}>
					<div className={`flex w-full justify-between py-1 bg-red px-4 text-bkg skew-x-[30deg]`}>
						<div className={`text-lg -skew-x-[30deg]`}>Transcript</div>
						<div className={`text-lg -skew-x-[30deg]`}>
							Last edited: {formatLongDate(sermon.lastEditDate)}
						</div>
					</div>
					{/* <pre className='whitespace-pre-wrap font-dm text-lg '>{sermon.body}</pre> */}
					<div className={`text-md md:text-lg `}>
						<MarkdownText html={sermon.body} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Sermon;
