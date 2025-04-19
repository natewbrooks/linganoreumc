'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const HomePageSettingsContext = createContext();

export const HomePageSettingsProvider = ({ children }) => {
	const [homepageSettings, setHomepageSettings] = useState(null);
	const [loading, setLoading] = useState(true);
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	useEffect(() => {
		axios
			.get(`${base}/settings/home`)
			.then((res) => {
				const data = res.data;
				setHomepageSettings({
					header: data.header || { images: [] },
					mottoBanner: data.mottoBanner || { text: { title: '', subtext: '' } },
					joinUs: data.joinUs || {
						text: { title: '', subtext: '', address: '' },
						sermonImageURL: '',
						events: [],
					},
					livestream: data.livestream || {
						youtubeAPIKey: '',
						youtubeChannelID: '',
						overrideOfflineVideoURL: '',
						text: {
							live: { title: '', subtext: '' },
							offline: { title: '', subtext: '' },
							seeMore: '',
						},
						socialLinks: [],
					},
					upcomingEvents: data.upcomingEvents || {
						text: { title: '', subtext: '', seeMore: '' },
					},
					stainedGlassDisplay: data.stainedGlassDisplay || { images: [] },
				});
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching homepage settings:', err);
				setLoading(false);
			});
	}, [base]);

	const updateHomepageSettings = (newSettings) => {
		setHomepageSettings(newSettings);

		axios
			.put(`${base}/admin/settings/home`, newSettings, { withCredentials: true })
			.then((res) => {
				console.log('Homepage settings updated:', res.data);
			})
			.catch((err) => console.error('Error updating homepage settings:', err));
	};

	const uploadHeaderImage = async (file) => {
		if (!file) return null;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await axios.post(`${base}/admin/media/images/header`, formData, {
				withCredentials: true,
			});

			if (res.data?.filePath) {
				return res.data.filePath;
			}
			throw new Error('Upload failed');
		} catch (err) {
			console.error('Error uploading header image:', err);
			return null;
		}
	};

	const uploadStainedGlassImage = async (file) => {
		if (!file) return null;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await axios.post(`${base}/admin/media/images/stained-glass`, formData, {
				withCredentials: true,
			});

			if (res.data?.filePath) {
				return res.data.filePath;
			}
			throw new Error('Upload failed');
		} catch (err) {
			console.error('Error uploading stained glass image:', err);
			return null;
		}
	};

	return (
		<HomePageSettingsContext.Provider
			value={{
				homepageSettings,
				loading,
				updateHomepageSettings,
				uploadHeaderImage,
				uploadStainedGlassImage,
			}}>
			{children}
		</HomePageSettingsContext.Provider>
	);
};

export const useHomePageSettings = () => useContext(HomePageSettingsContext);
