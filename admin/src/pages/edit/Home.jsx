import React, { useState, useEffect } from 'react';
import TextInput from '../../components/ui/TextInput';

function HomePageSettingsAdmin() {
	const [settings, setSettings] = useState({
		headerImageUrl: '',
		youtubeBroadcastUrl: '',
		mottoBanner: '',
		recurringEvents: [],
		featuredEvents: [],
		homepageSocialLinks: [],
	});
	const [loading, setLoading] = useState(true);

	// Fetch existing settings on component mount
	useEffect(() => {
		fetch('/api/settings/pages/home')
			.then((res) => res.json())
			.then((data) => {
				setSettings(data);
				setLoading(false);
			})
			.catch((err) => console.error(err));
	}, []);

	// Handle form changes for simple text inputs
	const handleChange = (field, value) => {
		setSettings((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Handle changes in array fields (Recurring Events, Featured Events, Social Links)
	const handleArrayChange = (section, index, field, value) => {
		setSettings((prev) => {
			const updatedArray = [...prev[section]];
			updatedArray[index] = { ...updatedArray[index], [field]: value };
			return { ...prev, [section]: updatedArray };
		});
	};

	// Add new items to arrays
	const addItem = (section, newItem) => {
		setSettings((prev) => ({
			...prev,
			[section]: [...prev[section], newItem],
		}));
	};

	// Remove items from arrays
	const removeItem = (section, index) => {
		setSettings((prev) => ({
			...prev,
			[section]: prev[section].filter((_, i) => i !== index),
		}));
	};

	// Save settings to the backend
	const saveSettings = () => {
		fetch('/api/admin/settings/pages/home', {
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
			<h2 className='font-dm text-2xl'>Homepage Settings</h2>

			<div className={`flex flex-col space-y-8 pt-4`}>
				{/* Header Image URL */}
				<TextInput
					title='Header Image URL'
					type='text'
					maxLength={255}
					value={settings.headerImageUrl}
					onChange={(e) => handleChange('headerImageUrl', e.target.value)}
				/>

				{/* YouTube Broadcast URL */}
				<TextInput
					title='YouTube Broadcast URL'
					type='text'
					maxLength={255}
					value={settings.youtubeBroadcastUrl}
					onChange={(e) => handleChange('youtubeBroadcastUrl', e.target.value)}
				/>

				{/* Motto Banner */}
				<TextInput
					title='Motto Banner'
					type='text'
					maxLength={255}
					value={settings.mottoBanner}
					onChange={(e) => handleChange('mottoBanner', e.target.value)}
				/>

				{/* Recurring Events */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Recurring Events</h3>
					{settings.recurringEvents.map((event, index) => (
						<div
							key={index}
							className='flex flex-col space-y-2 pl-8 border p-2'>
							<TextInput
								title='Title'
								type='text'
								maxLength={100}
								value={event.title}
								onChange={(e) =>
									handleArrayChange('recurringEvents', index, 'title', e.target.value)
								}
							/>
							<TextInput
								title='Time'
								type='text'
								maxLength={100}
								value={event.time}
								onChange={(e) =>
									handleArrayChange('recurringEvents', index, 'time', e.target.value)
								}
							/>
							<TextInput
								title='Description'
								type='text'
								maxLength={255}
								value={event.description}
								onChange={(e) =>
									handleArrayChange('recurringEvents', index, 'description', e.target.value)
								}
							/>
							<button
								className='text-red-600'
								onClick={() => removeItem('recurringEvents', index)}>
								Remove
							</button>
						</div>
					))}
					<button
						className='bg-gray-200 px-2 py-1'
						onClick={() => addItem('recurringEvents', { title: '', time: '', description: '' })}>
						Add Recurring Event
					</button>
				</div>

				{/* Featured Events */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Featured Events</h3>
					{settings.featuredEvents.map((event, index) => (
						<div
							key={index}
							className='flex flex-col space-y-2 pl-8 border p-2'>
							<TextInput
								title='Title'
								type='text'
								maxLength={100}
								value={event.title}
								onChange={(e) =>
									handleArrayChange('featuredEvents', index, 'title', e.target.value)
								}
							/>
							<TextInput
								title='Date'
								type='date'
								value={event.date}
								onChange={(e) => handleArrayChange('featuredEvents', index, 'date', e.target.value)}
							/>
							<TextInput
								title='Description'
								type='text'
								maxLength={255}
								value={event.description}
								onChange={(e) =>
									handleArrayChange('featuredEvents', index, 'description', e.target.value)
								}
							/>
							<button
								className='text-red-600'
								onClick={() => removeItem('featuredEvents', index)}>
								Remove
							</button>
						</div>
					))}
					<button
						className='bg-gray-200 px-2 py-1'
						onClick={() => addItem('featuredEvents', { title: '', date: '', description: '' })}>
						Add Featured Event
					</button>
				</div>

				{/* Social Media Links */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Homepage Social Links</h3>
					{settings.homepageSocialLinks.map((link, index) => (
						<div
							key={index}
							className='flex flex-col space-y-2 pl-8 border p-2'>
							<TextInput
								title='Platform'
								type='text'
								maxLength={50}
								value={link.platform}
								onChange={(e) =>
									handleArrayChange('homepageSocialLinks', index, 'platform', e.target.value)
								}
							/>
							<TextInput
								title='URL'
								type='text'
								maxLength={255}
								value={link.url}
								onChange={(e) =>
									handleArrayChange('homepageSocialLinks', index, 'url', e.target.value)
								}
							/>
							<button
								className='text-red-600'
								onClick={() => removeItem('homepageSocialLinks', index)}>
								Remove
							</button>
						</div>
					))}
					<button
						className='bg-gray-200 px-2 py-1'
						onClick={() => addItem('homepageSocialLinks', { platform: '', url: '' })}>
						Add Social Link
					</button>
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

export default HomePageSettingsAdmin;
