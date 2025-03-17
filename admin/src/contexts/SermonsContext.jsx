import React, { createContext, useState, useEffect, useContext } from 'react';

const SermonsContext = createContext();

export const SermonsProvider = ({ children }) => {
	const [sermons, setSermons] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch sermons on mount
	useEffect(() => {
		fetch('/api/sermons/all')
			.then((res) => res.json())
			.then((data) => {
				setSermons(data);
				setLoading(false);
			})
			.catch((err) => console.error('Error fetching sermons:', err));
	}, []);

	// Function to add/update sermons
	const updateSermons = (newSermons) => {
		setSermons(newSermons);
		// Future-proofed for API integration
	};

	return (
		<SermonsContext.Provider value={{ sermons, loading, updateSermons }}>
			{children}
		</SermonsContext.Provider>
	);
};

export const useSermons = () => useContext(SermonsContext);
