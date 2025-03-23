import React, { useState, useEffect } from 'react';
import TextInput from '../components/ui/TextInput';

function GeneralSettingsAdmin() {
	const [settings, setSettings] = useState({
		announcementBanner: { enabled: false, title: '', subtext: '' },
		contactInformation: { name: '', phoneNumber: '', email: '', address: '' },
		socialMediaLinks: [],
	});
	const [loading, setLoading] = useState(true);

	// Fetch existing settings on component mount
	useEffect(() => {
		fetch('/api/settings/general/')
			.then((res) => res.json())
			.then((data) => {
				setSettings(data);
				setLoading(false);
			})
			.catch((err) => console.error(err));
	}, []);

	// Handle form changes
	const handleChange = (section, field, value) => {
		setSettings((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	// Save settings to the backend
	const saveSettings = () => {
		fetch('/api/admin/settings/general', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(settings),
		})
			.then((res) => res.json())
			.then((response) => {
				alert(response.message || 'Settings updated');
			})
			.catch((err) => console.error(err));
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className='flex flex-col'>
			<h2 className='font-dm text-2xl'>General Settings</h2>

			<div className={`flex flex-col space-y-8 pt-4`}>
				<div className={`flex flex-col space-y-2`}>
					<div className='font-dm flex space-x-2 items-center accent-red'>
						<input
							type='checkbox'
							checked={settings.announcementBanner.enabled}
							onChange={(e) => handleChange('announcementBanner', 'enabled', e.target.checked)}
						/>
						<label>Enable Announcement Banner</label>
					</div>
					<div className={`flex flex-col pl-8`}>
						<TextInput
							title='Banner Title'
							type='text'
							maxLength={100}
							value={settings.announcementBanner.title}
							onChange={(e) => handleChange('announcementBanner', 'title', e.target.value)}
						/>
						<TextInput
							title='Banner Subtext'
							type='text'
							maxLength={200}
							value={settings.announcementBanner.subtext}
							onChange={(e) => handleChange('announcementBanner', 'subtext', e.target.value)}
						/>
					</div>
				</div>

				{/* Contact Information */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>Contact Information</h3>
					<div className={`flex flex-col pl-8`}>
						<TextInput
							title='Name'
							type='text'
							maxLength={100}
							value={settings.contactInformation.name}
							onChange={(e) => handleChange('contactInformation', 'name', e.target.value)}
						/>
						<TextInput
							title='Phone'
							type='text'
							maxLength={20}
							value={settings.contactInformation.phoneNumber}
							onChange={(e) => handleChange('contactInformation', 'phoneNumber', e.target.value)}
						/>
						<TextInput
							title='Email'
							type='text'
							maxLength={100}
							value={settings.contactInformation.email}
							onChange={(e) => handleChange('contactInformation', 'email', e.target.value)}
						/>
						<TextInput
							title='Address'
							type='text'
							maxLength={200}
							value={settings.contactInformation.address}
							onChange={(e) => handleChange('contactInformation', 'address', e.target.value)}
						/>
					</div>
				</div>
			</div>

			<div className={`w-full flex justify-end my-4`}>
				<button
					className={`bg-red w-fit px-2 font-dm text-bkg`}
					onClick={saveSettings}>
					Save Settings
				</button>
			</div>
		</div>
	);
}

export default GeneralSettingsAdmin;
