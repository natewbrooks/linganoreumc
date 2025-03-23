import React, { createContext, useState, useEffect, useContext } from 'react';

const HomePageSettingsContext = createContext();

export const HomePageSettingsProvider = ({ children }) => {
	const [homepageSettings, setHomepageSettings] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/settings/pages/home')
			.then((res) => res.json())
			.then((data) => {
				// Safely map server data into the new JSON structure:
				setHomepageSettings({
					// header
					header: data.header || {
						images: [],
					},
					// mottoBanner
					mottoBanner: data.mottoBanner || {
						text: { title: '', subtext: '' },
					},
					// joinUs
					joinUs: data.joinUs || {
						text: { title: '', subtext: '', address: '' },
						sermonImageURL: '',
						events: [],
					},
					// livestream
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
					// upcomingEvents
					upcomingEvents: data.upcomingEvents || {
						text: { title: '', subtext: '', seeMore: '' },
					},
				});

				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching homepage settings:', err);
				setLoading(false);
			});
	}, []);

	const updateHomepageSettings = (newSettings) => {
		// Immediately reflect changes in local state
		setHomepageSettings(newSettings);

		// Also persist to server
		fetch('/api/admin/settings/pages/home', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newSettings),
		})
			.then((res) => res.json())
			.then((response) => {
				console.log('Homepage settings updated:', response);
			})
			.catch((err) => console.error('Error updating homepage settings:', err));
	};

	return (
		<HomePageSettingsContext.Provider value={{ homepageSettings, loading, updateHomepageSettings }}>
			{children}
		</HomePageSettingsContext.Provider>
	);
};

export const useHomePageSettings = () => useContext(HomePageSettingsContext);
