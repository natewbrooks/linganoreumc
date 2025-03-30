import React, { useState, useEffect } from 'react';
import { useGeneralSettings } from '../contexts/GeneralSettingsContext';
import TextInput from '../components/ui/TextInput';
import SocialMediaLinks from '../components/general/socialmedia/SocialMediaLinks';

function GeneralSettingsAdmin() {
	const { generalSettings, loading, updateGeneralSettings } = useGeneralSettings();
	const [settings, setSettings] = useState(null);

	// Load settings from context into local state
	useEffect(() => {
		if (generalSettings) {
			setSettings({
				announcementBanner: {
					enabled: generalSettings.announcementBanner?.enabled || false,
					title: generalSettings.announcementBanner?.title || '',
					subtext: generalSettings.announcementBanner?.subtext || '',
				},
				contactInformation: {
					name: generalSettings.contactInformation?.name || '',
					phoneNumber: generalSettings.contactInformation?.phoneNumber || '',
					email: generalSettings.contactInformation?.email || '',
					locationName: generalSettings.contactInformation?.locationName || '',
					address: generalSettings.contactInformation?.address || '',
				},
				socialMediaLinks: generalSettings.socialMediaLinks || [],
			});
		}
	}, [generalSettings]);

	// Handle social media changes
	const handleReorderSocialLinks = (newOrder) => {
		setSettings((prev) => ({ ...prev, socialMediaLinks: newOrder }));
	};

	const handleSocialMediaChange = (index, field, value) => {
		const updatedLinks = [...settings.socialMediaLinks];
		updatedLinks[index] = { ...updatedLinks[index], [field]: value };
		setSettings((prev) => ({ ...prev, socialMediaLinks: updatedLinks }));
	};

	const addSocialMediaLink = () => {
		setSettings((prev) => ({
			...prev,
			socialMediaLinks: [...prev.socialMediaLinks, { platform: '', url: '', reactIcon: '' }],
		}));
	};

	const removeSocialMediaLink = (index) => {
		setSettings((prev) => ({
			...prev,
			socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index),
		}));
	};

	const handleChange = (section, field, value) => {
		setSettings((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	// Save settings
	const saveSettings = () => {
		if (!settings) return;
		updateGeneralSettings(settings);
		alert('Settings saved successfully.');
	};

	if (loading || !settings) {
		return <div>Loading general settings...</div>;
	}

	return (
		<div className='flex flex-col'>
			<h2 className='font-dm text-2xl'>General Settings</h2>

			<div className='flex flex-col space-y-8 pt-4'>
				{/* Announcement Banner */}
				<div className='flex flex-col space-y-2'>
					<div className='font-dm flex space-x-2 items-center accent-red'>
						<input
							type='checkbox'
							checked={settings.announcementBanner.enabled}
							onChange={(e) => handleChange('announcementBanner', 'enabled', e.target.checked)}
						/>
						<label>Enable Announcement Banner</label>
					</div>
					<div className='flex flex-col pl-8'>
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
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Contact Information</h3>
					<div className='flex flex-col pl-8'>
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
					</div>
				</div>

				{/* Location Information */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Location Information</h3>
					<div className='flex flex-col pl-8'>
						<TextInput
							title='Location Name'
							type='text'
							maxLength={100}
							value={settings.contactInformation.locationName}
							onChange={(e) => handleChange('contactInformation', 'locationName', e.target.value)}
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

				{/* Social Media Links */}
				<SocialMediaLinks
					socialLinks={settings.socialMediaLinks}
					onReorder={handleReorderSocialLinks}
					onChange={handleSocialMediaChange}
					onRemove={removeSocialMediaLink}
					onAdd={addSocialMediaLink}
				/>
			</div>

			{/* Save Button */}
			<button
				className='bg-red w-fit px-2 font-dm text-bkg'
				onClick={saveSettings}>
				Save Settings
			</button>
		</div>
	);
}

export default GeneralSettingsAdmin;
