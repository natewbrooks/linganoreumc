import React, { useState, useEffect } from 'react';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';

import SelectHeaderImages from '../../components/home/SelectHeaderImages';
import MottoBanner from '../../components/home/MottoBanner';
import JoinUs from '../../components/home/JoinUs';
import Livestream from '../../components/home/Livestream';
import UpcomingEvents from '../../components/home/UpcomingEvents';

function HomePageSettingsAdmin() {
	const { homepageSettings, loading, updateHomepageSettings } = useHomePageSettings();
	const [settings, setSettings] = useState(null);

	const [availableUploads, setAvailableUploads] = useState([]);

	useEffect(() => {
		fetch('/api/media/images/header/')
			.then((res) => res.json())
			.then((data) => setAvailableUploads(data || []))
			.catch((err) => console.error('Error fetching uploads:', err));
	}, []);

	// Load from context into local state
	useEffect(() => {
		if (homepageSettings) {
			const defaultEvents = Array(4).fill({ eventID: '' }); // Ensure 4 slots
			const overriddenEvents = homepageSettings.upcomingEvents?.events || [];
			const upcomingEvents = [...overriddenEvents, ...defaultEvents].slice(0, 4); // Always keep 4 slots

			setSettings({
				// HEADER
				headerImages: homepageSettings.header?.images || [],

				// MOTTO
				mottoTitle: homepageSettings.mottoBanner?.text?.title || '',
				mottoSubtext: homepageSettings.mottoBanner?.text?.subtext || '',

				// JOIN US
				joinUsTitle: homepageSettings.joinUs?.text?.title || '',
				joinUsSubtext: homepageSettings.joinUs?.text?.subtext || '',
				joinUsSermonImageURL: homepageSettings.joinUs?.sermonImageURL || '',
				joinUsEvents: homepageSettings.joinUs?.events || [],

				// LIVESTREAM
				youtubeAPIKey: homepageSettings.livestream?.youtubeAPIKey || '',
				youtubeChannelID: homepageSettings.livestream?.youtubeChannelID || '',
				overrideOfflineVideoURL: homepageSettings.livestream?.overrideOfflineVideoURL || '',
				liveTitle: homepageSettings.livestream?.text?.live?.title || '',
				liveSubtext: homepageSettings.livestream?.text?.live?.subtext || '',
				liveSeeMore: homepageSettings.livestream?.text?.live?.seeMore || '',
				offlineTitle: homepageSettings.livestream?.text?.offline?.title || '',
				offlineSubtext: homepageSettings.livestream?.text?.offline?.subtext || '',
				offlineSeeMore: homepageSettings.livestream?.text?.offline?.seeMore || '',

				// UPCOMING EVENTS
				upcomingEventsTitle: homepageSettings.upcomingEvents?.text?.title || '',
				upcomingEventsSubtext: homepageSettings.upcomingEvents?.text?.subtext || '',
				upcomingEventsSeeMore: homepageSettings.upcomingEvents?.text?.seeMore || '',
				upcomingEvents,
			});
		}
	}, [homepageSettings]);

	// General single-field change
	const handleChange = (field, value) => {
		setSettings((prev) => ({ ...prev, [field]: value }));
	};

	// For arrays
	const addItem = (section, newItem) => {
		setSettings((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
	};

	const removeItem = (section, index) => {
		setSettings((prev) => ({
			...prev,
			[section]: prev[section].filter((_, i) => i !== index),
		}));
	};

	const handleArrayFieldChange = (section, index, field, value) => {
		setSettings((prev) => {
			const updated = [...prev[section]];
			updated[index] = { ...updated[index], [field]: value };
			return { ...prev, [section]: updated };
		});
	};

	const handleUpcomingEventChange = (index, newID) => {
		setSettings((prev) => {
			const updatedEvents = [...prev.upcomingEvents];
			updatedEvents[index] = { eventID: newID };
			return { ...prev, upcomingEvents: updatedEvents };
		});
	};

	// Handle reordering of overridden events
	const handleReorderUpcomingEvents = (newOrder) => {
		setSettings((prev) => ({
			...prev,
			upcomingEvents: newOrder,
		}));
	};

	// Handle reordering of "Join Us" events
	const handleReorderJoinUsEvents = (newOrder) => {
		setSettings((prev) => ({
			...prev,
			joinUsEvents: newOrder,
		}));
	};

	// Save
	const saveSettings = () => {
		if (!settings) return;
		const updatedSettings = {
			header: {
				images: settings.headerImages,
			},
			mottoBanner: {
				text: {
					title: settings.mottoTitle,
					subtext: settings.mottoSubtext,
				},
			},
			joinUs: {
				text: {
					title: settings.joinUsTitle,
					subtext: settings.joinUsSubtext,
				},
				sermonImageURL: settings.joinUsSermonImageURL,
				events: settings.joinUsEvents,
			},
			livestream: {
				youtubeAPIKey: settings.youtubeAPIKey,
				youtubeChannelID: settings.youtubeChannelID,
				overrideOfflineVideoURL: settings.overrideOfflineVideoURL,
				text: {
					live: {
						title: settings.liveTitle,
						subtext: settings.liveSubtext,
						seeMore: settings.liveSeeMore,
					},
					offline: {
						title: settings.offlineTitle,
						subtext: settings.offlineSubtext,
						seeMore: settings.offlineSeeMore,
					},
				},
			},
			upcomingEvents: {
				text: {
					title: settings.upcomingEventsTitle,
					subtext: settings.upcomingEventsSubtext,
					seeMore: settings.upcomingEventsSeeMore,
				},
				events: settings.upcomingEvents,
			},
		};
		updateHomepageSettings(updatedSettings);
		alert('Settings saved');
	};

	if (loading || !settings) {
		return <div>Loading homepage settings...</div>;
	}

	return (
		<div className='flex flex-col'>
			<h2 className='font-dm text-2xl'>Homepage Settings</h2>

			<div className='flex flex-col space-y-8 pt-4'>
				{/* SELECT HEADER IMAGES */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Header</h3>
					<div className={`pl-8`}>
						<SelectHeaderImages
							headerImages={settings.headerImages}
							onChangeHeaderImages={(newArray) =>
								setSettings((prev) => ({ ...prev, headerImages: newArray }))
							}
							availableUploads={availableUploads}
							setAvailableUploads={setAvailableUploads}
							uploadEndpoint='/api/admin/media/images/header/'
						/>
					</div>
				</div>

				{/* MOTTO BANNER */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Motto Banner</h3>
					<MottoBanner
						mottoTitle={settings.mottoTitle}
						mottoSubtext={settings.mottoSubtext}
						onChange={handleChange}
					/>
				</div>

				{/* JOIN US */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Join Us</h3>
					<JoinUs
						joinUsTitle={settings.joinUsTitle}
						joinUsSubtext={settings.joinUsSubtext}
						joinUsSermonImageURL={settings.joinUsSermonImageURL}
						joinUsEvents={settings.joinUsEvents}
						onChange={handleChange}
						onAddEvent={(evt) => addItem('joinUsEvents', evt)}
						onRemoveEvent={(idx) => removeItem('joinUsEvents', idx)}
						onChangeEventID={(idx, newVal) =>
							handleArrayFieldChange('joinUsEvents', idx, 'eventID', newVal)
						}
						onReorder={handleReorderJoinUsEvents}
					/>
				</div>

				{/* LIVESTREAM */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>YouTube Livestream</h3>
					<Livestream
						youtubeAPIKey={settings.youtubeAPIKey}
						youtubeChannelID={settings.youtubeChannelID}
						overrideOfflineVideoURL={settings.overrideOfflineVideoURL}
						liveTitle={settings.liveTitle}
						liveSubtext={settings.liveSubtext}
						liveSeeMore={settings.liveSeeMore}
						offlineTitle={settings.offlineTitle}
						offlineSubtext={settings.offlineSubtext}
						offlineSeeMore={settings.offlineSeeMore}
						onChange={handleChange}
					/>
				</div>

				{/* UPCOMING EVENTS */}
				<div className='flex flex-col space-y-2'>
					<h3 className='font-dm'>Upcoming Events</h3>
					<UpcomingEvents
						upcomingEventsTitle={settings.upcomingEventsTitle}
						upcomingEventsSubtext={settings.upcomingEventsSubtext}
						upcomingEventsSeeMore={settings.upcomingEventsSeeMore}
						selectedEvents={settings.upcomingEvents}
						onChange={(field, value) => setSettings((prev) => ({ ...prev, [field]: value }))}
						onChangeEventID={handleUpcomingEventChange}
						onReorder={handleReorderUpcomingEvents}
					/>
				</div>

				{/* SAVE BUTTON */}
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
