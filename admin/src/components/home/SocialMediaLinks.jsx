import React from 'react';
import TextInput from '../../components/ui/TextInput';

export default function SocialMediaLinks({ socialLinks, onAddLink, onRemoveLink, onChangeLink }) {
	return (
		<div>
			<h3 className='font-dm'>Social Links</h3>
			{socialLinks.map((link, index) => (
				<div
					key={index}
					className='flex items-center space-x-2 border p-2'>
					<TextInput
						title='Platform'
						value={link.platform}
						onChange={(e) => onChangeLink(index, 'platform', e.target.value)}
					/>
					<TextInput
						title='URL'
						value={link.url}
						onChange={(e) => onChangeLink(index, 'url', e.target.value)}
					/>
					<button
						className='text-red-600'
						onClick={() => onRemoveLink(index)}>
						✕
					</button>
				</div>
			))}
			<button
				className='bg-gray-200 px-2 py-1 mt-2'
				onClick={() => onAddLink({ platform: '', url: '' })}>
				Add Social Link
			</button>
		</div>
	);
}
