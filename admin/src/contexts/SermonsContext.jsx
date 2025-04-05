import React, { createContext, useState, useEffect, useContext } from 'react';

const SermonsContext = createContext();

export const SermonsProvider = ({ children }) => {
	const [sermons, setSermons] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch all sermons on mount
	useEffect(() => {
		getAllSermons();
	}, []);

	const getAllSermons = async () => {
		try {
			const res = await fetch('/api/sermons/all/');
			const data = await res.json();
			setSermons(data);
			setLoading(false);
		} catch (err) {
			console.error('Error fetching sermons:', err);
		}
	};

	const getSermonById = async (id) => {
		try {
			const res = await fetch(`/api/sermons/${id}`);
			if (!res.ok) throw new Error('Sermon not found');
			return await res.json();
		} catch (err) {
			console.error(`Error fetching sermon ID ${id}:`, err);
			return null;
		}
	};

	const getArchivedSermons = async () => {
		try {
			const res = await fetch('/api/admin/sermons/archived/');
			if (!res.ok) throw new Error('Failed to fetch archived sermons');
			return await res.json();
		} catch (err) {
			console.error('Error fetching archived sermons:', err);
			return [];
		}
	};

	const scrapeSermonDataFromURL = async (videoURL) => {
		console.log('SCRAPE IN OCNTEXT: ' + videoURL);
		try {
			const res = await fetch(`/api/media/scrape-youtube/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ videoURL }),
			});
			if (!res.ok) throw new Error('Failed to scrape YouTube data');
			const data = await res.json();
			return data; // contains { title, description, body, videoURL, publishDate }
		} catch (err) {
			console.error('Error scraping YouTube video data:', err);
			throw err;
		}
	};

	const createSermon = async (sermonData) => {
		try {
			const res = await fetch(`/api/admin/sermons/new/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sermonData),
			});
			const data = await res.json();
			await getAllSermons();
			return data;
		} catch (err) {
			console.error('Error creating sermon:', err);
			throw err;
		}
	};

	const updateSermon = async (id, sermonData) => {
		try {
			const res = await fetch(`/api/admin/sermons/update/${id}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sermonData),
			});
			const data = await res.json();
			await getAllSermons();
			return data;
		} catch (err) {
			console.error('Error updating sermon:', err);
			throw err;
		}
	};

	const deleteSermon = async (id) => {
		try {
			const res = await fetch(`/api/sermons/delete/${id}/`, {
				method: 'DELETE',
			});
			const data = await res.json();
			await getAllSermons();
			return data;
		} catch (err) {
			console.error('Error deleting sermon:', err);
			throw err;
		}
	};

	return (
		<SermonsContext.Provider
			value={{
				sermons,
				loading,
				getAllSermons,
				getSermonById,
				getArchivedSermons,
				scrapeSermonDataFromURL,
				createSermon,
				updateSermon,
				deleteSermon,
			}}>
			{children}
		</SermonsContext.Provider>
	);
};

export const useSermons = () => useContext(SermonsContext);
