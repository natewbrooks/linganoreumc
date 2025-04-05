import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';
import BodyTextInput from '../ui/BodyTextInput';
import { useSermons } from '../../contexts/SermonsContext';

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

	const [content, setContent] = useState(false);

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
			setContent(true);
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

			setContent(true);
		} catch (err) {
			console.error(err);
			alert('Failed to scrape video metadata.');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !description || !body) {
			alert('Please fill in all required fields.');
			return;
		}

		const sermonData = {
			title,
			description,
			body,
			videoURL,
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
		setContent(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col space-y-4 font-dm px-6'>
			{/* Scrape Section */}
			<div>
				<div className='font-bold mb-1'>YouTube URL</div>
				<div className='flex space-x-2'>
					<input
						type='text'
						className='w-full border border-gray-300 px-2 py-1'
						value={videoURL}
						onChange={(e) => setVideoURL(e.target.value)}
					/>
					<button
						type='button'
						onClick={handleScrape}
						className='bg-blue-600 text-white px-3 py-1'>
						Scrape
					</button>
				</div>
			</div>

			{content && (
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
					<BodyTextInput
						title='Transcript'
						minHeight={300}
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
					<TextInput
						title='Publish Date'
						toggleHeader={true}
						type='date'
						value={publishDate}
						onChange={(e) => setPublishDate(e.target.value)}
					/>

					<div className='flex items-center space-x-2'>
						<input
							type='checkbox'
							checked={isArchived}
							onChange={(e) => setIsArchived(e.target.checked)}
						/>
						<label>Archived</label>
					</div>

					<div className='flex justify-end space-x-4'>
						<button
							type='button'
							onClick={handleReset}
							className='bg-gray-200 px-3 py-1'>
							Reset
						</button>
						<button
							type='submit'
							className='bg-red text-bkg px-3 py-1'>
							{mode === 'edit' ? 'Update Sermon' : 'Save Sermon'}
						</button>
					</div>
				</>
			)}
		</form>
	);
}

export default SermonForm;
