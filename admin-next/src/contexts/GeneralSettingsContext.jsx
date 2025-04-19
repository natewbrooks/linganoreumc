'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const GeneralSettingsContext = createContext();

export const GeneralSettingsProvider = ({ children }) => {
	const [generalSettings, setGeneralSettings] = useState(null);
	const [loading, setLoading] = useState(true);
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;

	// Fetch settings on mount
	useEffect(() => {
		axios
			.get(`${base}/settings/general`)
			.then((res) => {
				setGeneralSettings(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching general settings:', err);
				setLoading(false);
			});
	}, [base]);

	// Update settings API
	const updateGeneralSettings = (newSettings) => {
		setGeneralSettings(newSettings);

		axios
			.put(`${base}/admin/settings/general`, newSettings, { withCredentials: true })
			.then((res) => res.data)
			.catch((err) => console.error('Error updating general settings:', err));
	};

	return (
		<GeneralSettingsContext.Provider
			value={{
				generalSettings,
				loading,
				updateGeneralSettings,
			}}>
			{children}
		</GeneralSettingsContext.Provider>
	);
};

export const useGeneralSettings = () => useContext(GeneralSettingsContext);
