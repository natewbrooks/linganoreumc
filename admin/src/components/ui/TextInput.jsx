import React from 'react';

function TextInput({ title, maxLength, value, type, onChange }) {
	return (
		<div className='relative flex flex-col font-dm'>
			<span className='text-xs text-end absolute top-2 right-1 px-1 text-red'>{title}</span>
			<input
				className='bg-tp px-2 py-1 outline-none border-l-4 border-red pr-16'
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
