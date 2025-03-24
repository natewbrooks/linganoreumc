import React from 'react';

function TextInput({ title, maxLength, value, type, onChange }) {
	return (
		<div className='relative flex flex-col font-dm group'>
			<span className='group-hover:visible invisible text-xs text-end absolute top-0 right-0 px-1 text-bkg outline-4 outline-bkg bg-red'>
				{title}
			</span>
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
