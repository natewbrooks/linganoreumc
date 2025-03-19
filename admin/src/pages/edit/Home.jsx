import React, { useState, useEffect } from 'react';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';
import TextInput from '../../components/ui/TextInput';
import SelectEventDropdown from '../../components/ui/SelectEventDropdown';

function HomePageSettingsAdmin() {
	const { homepageSettings, loading, updateHomepageSettings } = useHomePageSettings();
	const [settings, setSettings] = useState(null);

	// Sync local state when homepage settings load
	useEffect(() => {
		if (homepageSettings) {
			setSettings({
				headerImages: homepageSettings.header?.images || [],
				mottoTitle: homepageSettings.mottoBanner?.text?.title || '',
				mottoSubtext: homepageSettings.mottoBanner?.text?.subtext || '',
				displayedSermonsTitle: homepageSettings.displayedSermons?.text?.title || '',
				displayedSermonsSubtext: homepageSettings.displayedSermons?.text?.subtext || '',
				sermonImageURL: homepageSettings.displayedSermons?.sermonImageURL || '',
				associatedRecurringEvents:
					homepageSettings.displayedSermons?.associatedRecurringEvents || [],
				youtubeAPIKey: homepageSettings.livestream?.youtubeAPIKey || '',
				youtubeChannelID: homepageSettings.livestream?.youtubeChannelID || '',
				overrideOfflineVideoURL: homepageSettings.livestream?.overrideOfflineVideoURL || '',
				liveTitle: homepageSettings.livestream?.text?.live?.title || '',
				liveSubtext: homepageSettings.livestream?.text?.live?.subtext || '',
				offlineTitle: homepageSettings.livestream?.text?.offline?.title || '',
				offlineSubtext: homepageSettings.livestream?.text?.offline?.subtext || '',
				seeMoreText: homepageSettings.livestream?.text?.seeMore || '',
				socialLinks: homepageSettings.livestream?.socialLinks || [],
				upcomingEventsTitle: homepageSettings.upcomingEvents?.text?.title || '',
				upcomingEventsSubtext: homepageSettings.upcomingEvents?.text?.subtext || '',
				upcomingEventsSeeMore: homepageSettings.upcomingEvents?.text?.seeMore || '',
			});
		}
	}, [homepageSettings]);

	// Handle input changes
	const handleChange = (field, value) => {
		setSettings((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Handle array changes
	const handleArrayChange = (section, index, field, value) => {
		setSettings((prev) => {
			const updatedArray = [...prev[section]];
			updatedArray[index] = { ...updatedArray[index], [field]: value };
			return { ...prev, [section]: updatedArray };
		});
	};

	// Add new item to an array section
	const addItem = (section, newItem) => {
		setSettings((prev) => ({
			...prev,
			[section]: [...prev[section], newItem],
		}));
	};

	// Remove an item from an array section
	const removeItem = (section, index) => {
		setSettings((prev) => ({
			...prev,
			[section]: prev[section].filter((_, i) => i !== index),
		}));
	};

	// Save settings to the backend via context
	const saveSettings = () => {
		if (settings) {
			const updatedSettings = {
				...homepageSettings,
				header: { images: settings.headerImages },
				mottoBanner: {
					text: { title: settings.mottoTitle, subtext: settings.mottoSubtext },
				},
				displayedSermons: {
					text: {
						title: settings.displayedSermonsTitle,
						subtext: settings.displayedSermonsSubtext,
					},
					sermonImageURL: settings.sermonImageURL,
					associatedRecurringEvents: settings.associatedRecurringEvents,
				},
				livestream: {
					youtubeAPIKey: settings.youtubeAPIKey,
					youtubeChannelID: settings.youtubeChannelID,
					overrideOfflineVideoURL: settings.overrideOfflineVideoURL,
					text: {
						live: { title: settings.liveTitle, subtext: settings.liveSubtext },
						offline: { title: settings.offlineTitle, subtext: settings.offlineSubtext },
						seeMore: settings.seeMoreText,
					},
					socialLinks: settings.socialLinks,
				},
				upcomingEvents: {
					text: {
						title: settings.upcomingEventsTitle,
						subtext: settings.upcomingEventsSubtext,
						seeMore: settings.upcomingEventsSeeMore,
					},
				},
			};

			updateHomepageSettings(updatedSettings);
		}
	};

	// Show loading state
	if (loading || !settings) return <div>Loading homepage settings...</div>;

	return (
		<div className='flex flex-col'>
			<h2 className='font-dm text-2xl'>Homepage Settings</h2>

			<div className='flex flex-col space-y-8 pt-4'>
				{/* Header Images */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>Headers</h3>
					<div className={`flex flex-col space-y-1 pl-8`}>
						<h3 className='font-dm'>Header Images</h3>
						{settings.headerImages.map((image, index) => (
							<div
								key={index}
								className='flex items-center space-x-2 border p-2'>
								<TextInput
									title='Image URL'
									value={image.url}
									onChange={(e) => handleArrayChange('headerImages', index, 'url', e.target.value)}
								/>
								<button
									className='text-red-600'
									onClick={() => removeItem('headerImages', index)}>
									✕
								</button>
							</div>
						))}
						<button
							className='bg-gray-200 px-2 py-1'
							onClick={() => addItem('headerImages', { url: '', active: false })}>
							Add Header Image
						</button>
					</div>
				</div>

				{/* Motto Banner */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>Motto</h3>
					<div className={`flex flex-col space-y-1 pl-8`}>
						<TextInput
							title='Motto Title'
							value={settings.mottoTitle}
							onChange={(e) => handleChange('mottoTitle', e.target.value)}
						/>
						<TextInput
							title='Motto Subtext'
							value={settings.mottoSubtext}
							onChange={(e) => handleChange('mottoSubtext', e.target.value)}
						/>
					</div>
				</div>

				{/* Displayed Sermons */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>Sermon Event Schedule</h3>
					<div className={`flex flex-col space-y-1 pl-8`}>
						<TextInput
							title='Sermon Title'
							value={settings.displayedSermonsTitle}
							onChange={(e) => handleChange('displayedSermonsTitle', e.target.value)}
						/>
						<TextInput
							title='Sermon Subtext'
							value={settings.displayedSermonsSubtext}
							onChange={(e) => handleChange('displayedSermonsSubtext', e.target.value)}
						/>

						<TextInput
							title='Sermon Image URL'
							value={settings.sermonImageURL}
							onChange={(e) => handleChange('sermonImageURL', e.target.value)}
						/>
						<div>
							<span className='text-sm font-dm'>Recurring Events Displayed</span>
							<SelectEventDropdown eventType={'recurring'} />
							<SelectEventDropdown eventType={'recurring'} />
							<SelectEventDropdown eventType={'recurring'} />
							<SelectEventDropdown eventType={'recurring'} />
						</div>
					</div>
				</div>

				{/* Livestream */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>YouTube Livestream Information</h3>
					<div className={`flex flex-col space-y-1 pl-8`}>
						<TextInput
							title='YouTube API Key'
							value={settings.youtubeAPIKey}
							onChange={(e) => handleChange('youtubeAPIKey', e.target.value)}
						/>
						<TextInput
							title='YouTube Channel ID'
							value={settings.youtubeChannelID}
							onChange={(e) => handleChange('youtubeChannelID', e.target.value)}
						/>
						<div className={``}>
							<TextInput
								title='Override Offline Video URL'
								value={settings.overrideOfflineVideoURL}
								onChange={(e) => handleChange('overrideOfflineVideoURL', e.target.value)}
							/>
							<p className={`font-dm text-xs text-end`}>(otherwise use the most recent video)</p>
						</div>
					</div>
				</div>

				{/* Upcoming Events */}
				<div className={`flex flex-col space-y-2`}>
					<h3 className={`font-dm`}>Upcoming Events</h3>
					<div className={`flex flex-col pl-8`}>
						<div>
							<span className='text-sm font-dm'>Events Displayed</span>
							<SelectEventDropdown />
							<SelectEventDropdown />
							<SelectEventDropdown />
							<SelectEventDropdown />
						</div>
					</div>
				</div>

				{/* Social Links */}
				<div>
					<h3 className='font-dm'>Social Links</h3>
					{settings.socialLinks.map((link, index) => (
						<div
							key={index}
							className='flex items-center space-x-2 border p-2'>
							<TextInput
								title='Platform'
								value={link.platform}
								onChange={(e) =>
									handleArrayChange('socialLinks', index, 'platform', e.target.value)
								}
							/>
							<TextInput
								title='URL'
								value={link.url}
								onChange={(e) => handleArrayChange('socialLinks', index, 'url', e.target.value)}
							/>
							<button
								className='text-red-600'
								onClick={() => removeItem('socialLinks', index)}>
								✕
							</button>
						</div>
					))}
					<button
						className='bg-gray-200 px-2 py-1'
						onClick={() => addItem('socialLinks', { platform: '', url: '' })}>
						Add Social Link
					</button>
				</div>

				{/* Save Button */}
				<button
					className='bg-red w-fit px-2 font-dm text-bkg'
					onClick={saveSettings}>
					Save Settings
				</button>
			</div>
		</div>
	);
}

export default HomePageSettingsAdmin;
