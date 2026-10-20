'use client';
import { createContext, useContext } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

/** Provides settings fetched server-side in `layout.js`. */
export const SettingsProvider = ({ settings, children }) => {
	return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};
