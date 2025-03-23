import React from 'react';
import TextInput from '../../components/ui/TextInput';

export default function Livestream({
	youtubeAPIKey,
	youtubeChannelID,
	overrideOfflineVideoURL,
	liveTitle,
	liveSubtext,
	offlineTitle,
	offlineSubtext,
	seeMoreText,
	onChange,
}) {
	return (
		<div className='flex flex-col space-y-1 pl-8'>
			<div className={`flex flex-col`}>
				<TextInput
					title='YouTube API Key'
					value={youtubeAPIKey}
					onChange={(e) => onChange('youtubeAPIKey', e.target.value)}
				/>
				<TextInput
					title='YouTube Channel ID'
					value={youtubeChannelID}
					onChange={(e) => onChange('youtubeChannelID', e.target.value)}
				/>

				<TextInput
					title='Override Offline Video URL'
					value={overrideOfflineVideoURL}
					onChange={(e) => onChange('overrideOfflineVideoURL', e.target.value)}
				/>
			</div>

			<div className={`flex flex-col space-y-2`}>
				<div className={`flex flex-col`}>
					<div className={`font-dm text-sm`}>Live</div>
					<div className={``}>
						<TextInput
							title='Live Title'
							value={liveTitle}
							onChange={(e) => onChange('liveTitle', e.target.value)}
						/>
						<TextInput
							title='Live Subtext'
							value={liveSubtext}
							onChange={(e) => onChange('liveSubtext', e.target.value)}
						/>
					</div>
				</div>
				<div className={`flex flex-col`}>
					<div className={`font-dm text-sm`}>Offline</div>
					<div className={``}>
						<TextInput
							title='Offline Title'
							value={offlineTitle}
							onChange={(e) => onChange('offlineTitle', e.target.value)}
						/>
						<TextInput
							title='Offline Subtext'
							value={offlineSubtext}
							onChange={(e) => onChange('offlineSubtext', e.target.value)}
						/>
					</div>
				</div>
				<TextInput
					title='See More Text'
					value={seeMoreText}
					onChange={(e) => onChange('seeMoreText', e.target.value)}
				/>
			</div>
		</div>
	);
}
