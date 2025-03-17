import React, { createContext, useState, useEffect, useContext } from 'react';

const HomePageSettingsContext = createContext();

export const HomePageSettingsProvider = ({ children }) => {
	const [homepageSettings, setHomepageSettings] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch homepage settings
	useEffect(() => {
		fetch('/api/settings/pages/home')
			.then((res) => res.json())
			.then((data) => {
				setHomepageSettings(data);
				setLoading(false);
			})
			.catch((err) => console.error('Error fetching homepage settings:', err));
	}, []);

	// Update settings
	const updateHomepageSettings = (newSettings) => {
		setHomepageSettings(newSettings);
		fetch('/api/admin/settings/pages/home', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newSettings),
		})
			.then((res) => res.json())
			.catch((err) => console.error('Error updating homepage settings:', err));
	};

	return (
		<HomePageSettingsContext.Provider value={{ homepageSettings, loading, updateHomepageSettings }}>
			{children}
		</HomePageSettingsContext.Provider>
	);
};

export const useHomePageSettings = () => useContext(HomePageSettingsContext);
