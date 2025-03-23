import React from 'react';
import TextInput from '../../components/ui/TextInput';

export default function MottoBanner({ mottoTitle, mottoSubtext, onChange }) {
	return (
		<div className='flex flex-col pl-8'>
			<TextInput
				title='Title'
				value={mottoTitle}
				onChange={(e) => onChange('mottoTitle', e.target.value)}
			/>
			<TextInput
				title='Subtext'
				value={mottoSubtext}
				onChange={(e) => onChange('mottoSubtext', e.target.value)}
			/>
		</div>
	);
}
