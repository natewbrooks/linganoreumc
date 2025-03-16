import fs from 'fs';

export const getGeneralSettings = async (req, res) => {
	fs.readFile('./settings/general.json', 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Unable to load general settings.' });
		}
		try {
			return res.json(JSON.parse(data));
		} catch (parseErr) {
			return res.status(500).json({ error: 'Error parsing general settings.' });
		}
	});
};

export const updateGeneralSettings = async (req, res) => {
	try {
		const newSettings = req.body;
		// Overwrite the existing file with the new settings
		fs.writeFile('./settings/general.json', JSON.stringify(newSettings, null, 2), 'utf8', (err) => {
			if (err) {
				return res.status(500).json({ error: 'Unable to save general settings.' });
			}
			return res.json({ message: 'General settings updated successfully.' });
		});
	} catch (error) {
		return res.status(500).json({ error: 'Failed to update general settings.' });
	}
};

export const getHomepageSettings = async (req, res) => {
	fs.readFile('./settings/pages/home.json', 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Unable to load homepage settings.' });
		}
		try {
			return res.json(JSON.parse(data));
		} catch (parseErr) {
			return res.status(500).json({ error: 'Error parsing homepage settings.' });
		}
	});
};

export const updateHomepageSettings = async (req, res) => {
	try {
		const newSettings = req.body;
		fs.writeFile(
			'./settings/pages/home.json',
			JSON.stringify(newSettings, null, 2),
			'utf8',
			(err) => {
				if (err) {
					return res.status(500).json({ error: 'Unable to save homepage settings.' });
				}
				return res.json({ message: 'Homepage settings updated successfully.' });
			}
		);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to update homepage settings.' });
	}
};
