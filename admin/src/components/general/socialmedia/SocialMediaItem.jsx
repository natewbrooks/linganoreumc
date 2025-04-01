import React from 'react';
import TextInput from '../../ui/TextInput';
import SelectIconDropdown from '../../ui/SelectIconDropdown';
import { FaTrash } from 'react-icons/fa6';

function SocialMediaItem({ index, platform, url, icon, onChange, onRemove }) {
	return (
		<div className='flex items-center w-full'>
			<div className={`flex flex-col w-full`}>
				<TextInput
					title='Platform'
					type='text'
					maxLength={50}
					value={platform}
					onChange={(e) => onChange(index, 'platform', e.target.value)}
				/>
				<TextInput
					title='URL'
					type='text'
					maxLength={300}
					value={url}
					onChange={(e) => onChange(index, 'url', e.target.value)}
				/>
			</div>
			<SelectIconDropdown
				initialSelectedIcon={icon}
				onIconChange={(selectedIcon) => onChange(index, 'reactIcon', selectedIcon)}
				onXClick={() => onRemove(index)}
			/>
			{/* <button
				className='text-red cursor-pointer hover:opacity-50 hover:scale-[102%] active:scale-[100%]'
				onClick={() => onRemove(index)}>
				<FaTrash />
			</button> */}
		</div>
	);
}

export default SocialMediaItem;
