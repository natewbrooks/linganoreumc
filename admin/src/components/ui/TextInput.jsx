import React from 'react';

function TextInput({ title, maxLength, value, type, onChange }) {
	return (
		<div className='flex flex-col font-dm'>
			<span className='text-sm'>{title}</span>
			<input
				className='bg-tp px-2 py-1 outline-none border-l-4 border-red'
				placeholder={title}
				type={type}
				maxLength={maxLength}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}

export default TextInput;
