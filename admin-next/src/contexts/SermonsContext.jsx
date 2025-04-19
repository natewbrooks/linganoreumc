'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SermonsContext = createContext();

export const SermonsProvider = ({ children }) => {
	const [sermons, setSermons] = useState([]);
	const [loading, setLoading] = useState(true);
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	useEffect(() => {
		getAllSermons();
	}, []);

	const getAllSermons = async () => {
		try {
			const res = await axios.get(`${base}/sermons/all`);
			setSermons(res.data);
			setLoading(false);
		} catch (err) {
			console.error('Error fetching sermons:', err);
			setLoading(false);
		}
	};

	const getSermonById = async (id) => {
		try {
			const res = await axios.get(`${base}/sermons/${id}`);
			return res.data;
		} catch (err) {
			console.error(`Error fetching sermon ID ${id}:`, err);
			return null;
		}
	};

	const getArchivedSermons = async () => {
		try {
			const res = await axios.get(`${base}/admin/sermons/archived`, { withCredentials: true });
			return res.data;
		} catch (err) {
			console.error('Error fetching archived sermons:', err);
			return [];
		}
	};

	const scrapeSermonDataFromURL = async (videoURL) => {
		try {
			const res = await axios.post(
				'/media/scrape-youtube',
				{ videoURL },
				{ withCredentials: true }
			);
			return res.data;
		} catch (err) {
			console.error('Error scraping YouTube video data:', err);
			throw err;
		}
	};

	const createSermon = async (sermonData) => {
		try {
			const res = await axios.post(`${base}/admin/sermons/new`, sermonData, {
				withCredentials: true,
			});
			await getAllSermons();
			return res.data;
		} catch (err) {
			console.error('Error creating sermon:', err);
			throw err;
		}
	};

	const updateSermon = async (id, updatedData) => {
		try {
			const res = await axios.put(`${base}/admin/sermons/update/${id}`, updatedData, {
				withCredentials: true,
			});

			const updatedSermon = { ...res.data, ...updatedData };

			setSermons((prev) =>
				prev.map((sermon) => (sermon.id === id ? { ...sermon, ...updatedSermon } : sermon))
			);
		} catch (err) {
			console.error('updateSermon error:', err);
		}
	};

	const deleteSermon = async (id) => {
		try {
			await axios.delete(`${base}/admin/sermons/delete/${id}`, { withCredentials: true });

			setSermons((prev) => prev.filter((sermon) => sermon.id !== id));
		} catch (err) {
			console.error(err);
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
