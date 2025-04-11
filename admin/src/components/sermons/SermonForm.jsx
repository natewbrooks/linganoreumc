import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';
import BodyTextInput from '../ui/BodyTextInput';
import { useSermons } from '../../contexts/SermonsContext';
import RichTextEditor from '../ui/RichTextEditor';

function SermonForm({ mode = 'create', initialData = null }) {
	const navigate = useNavigate();
	const { createSermon, updateSermon, scrapeSermonDataFromURL } = useSermons();

	const [videoURL, setVideoURL] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [body, setBody] = useState('');
	const [lastEditDate, setLastEditDate] = useState('');
	const [publishDate, setPublishDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	});
	const [isArchived, setIsArchived] = useState(false);
	const [sermonID, setSermonID] = useState(null);

	useEffect(() => {
		if (mode === 'edit' && initialData) {
			setTitle(initialData.title || '');
			setDescription(initialData.description || '');
			setBody(initialData.body || '');
			setVideoURL(initialData.videoURL || '');
			setPublishDate(initialData.publishDate || '');
			setLastEditDate(initialData.lastEditDate || '');
			setIsArchived(initialData.isArchived || false);
			setSermonID(initialData.id || null);
		}
	}, [mode, initialData]);

	const handleScrape = async () => {
		if (!videoURL) {
			alert('Please enter a YouTube URL');
			return;
		}

		try {
			const data = await scrapeSermonDataFromURL(videoURL);

			setTitle(data.title || '');
			setDescription(data.description || '');
			setBody(data.body || '');
			if (data.publishDate) {
				const formattedDate = new Date(data.publishDate).toISOString().split('T')[0];
				setPublishDate(formattedDate);
				console.log('Scraped publish date:', data.publishDate);
				console.log('Formatted for input:', formattedDate);
			}
		} catch (err) {
			console.error(err);
			alert('Failed to scrape video metadata.');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !description || !body) {
			alert('Please fill in the title, description, and transcript.');
			return;
		}

		const sermonData = {
			title,
			description,
			body,
			videoURL: videoURL || null,
			publishDate,
			lastEditDate,
			isArchived,
		};

		try {
			if (mode === 'edit' && sermonID) {
				await updateSermon(sermonID, sermonData);
			} else {
				const result = await createSermon(sermonData);
				setSermonID(result.sermonID || null);
			}

			alert('Sermon saved successfully');
			navigate('/sermons/');
			window.location.reload();
		} catch (err) {
			console.error(err);
			alert('Failed to save sermon');
		}
	};

	const handleReset = () => {
		setTitle('');
		setDescription('');
		setBody('');
		setPublishDate('');
		setVideoURL('');
		setIsArchived(false);
		setSermonID(null);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col space-y-4 font-dm px-6 h-full  pb-12'>
			{/* Scrape Section */}
			<div className={`mb-10`}>
				<div className='font-dm mb-1'>YouTube URL</div>
				<div className='flex space-x-1'>
					<div className={`flex space-x-1 items-center w-full bg-bkg-tp skew-r`}>
						<input
							value={videoURL}
							onChange={(e) => setVideoURL(e.target.value)}
							className={`font-dm px-4 h-[32px] outline-0 text-black text-md w-full skew-l`}
							placeholder='YouTube Video URL'
						/>
					</div>
					{videoURL && (
						<button
							type='button'
							onClick={handleScrape}
							className='bg-darkred skew-l clickable-r-skew    text-white px-3'>
							<div className={`skew-l`}>Scrape</div>
						</button>
					)}
				</div>
				<div className={`font-dm pl-4 text-sm text-darkred`}>
					Scrape information from a YouTube video, or manually input sermon information.
				</div>
			</div>

			<>
				<TextInput
					title='Title'
					toggleHeader={true}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<BodyTextInput
					title='Description'
					minHeight={100}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				{/* <BodyTextInput
					title='Transcript'
					minHeight={300}
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/> */}
				<RichTextEditor
					value={body}
					onChange={setBody}
					title={'Transcript'}
				/>
				<TextInput
					title='Publish Date'
					toggleHeader={true}
					type='date'
					value={publishDate}
					onChange={(e) => setPublishDate(e.target.value)}
				/>

				<div className='flex justify-end space-x-4'>
					<button
						type='button'
						onClick={handleReset}
						className='bg-gray-200 px-3 py-1 clickable  '>
						Reset
					</button>
					<button
						type='submit'
						className='bg-red text-bkg px-3 py-1 clickable-r-skew'>
						<div className={`skew-l`}>{mode === 'edit' ? 'Update Sermon' : 'Save Sermon'}</div>
					</button>
				</div>
			</>
		</form>
	);
}

export default SermonForm;
