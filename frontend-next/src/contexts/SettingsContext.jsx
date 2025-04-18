'use client';

import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ initialSettings, children }) => {
	const [settings] = useState(
		initialSettings || {
			general: { announcementBanner: { enabled: false, title: '', subtext: '' } },
			home: {},
		}
	);

	return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};
