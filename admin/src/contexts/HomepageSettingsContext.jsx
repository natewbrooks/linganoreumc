import React, { createContext, useState, useEffect, useContext } from 'react';

const HomePageSettingsContext = createContext();

export const HomePageSettingsProvider = ({ children }) => {
	const [homepageSettings, setHomepageSettings] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/settings/pages/home')
			.then((res) => res.json())
			.then((data) => {
				setHomepageSettings({
					header: data.header || { images: [] },
					mottoBanner: data.mottoBanner || { text: { title: '', subtext: '' } },
					displayedSermons: data.displayedSermons || {
						text: { title: '', subtext: '' },
						sermonImageURL: '',
						associatedRecurringEvents: [],
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
						events: [],
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
		setHomepageSettings(newSettings);

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
