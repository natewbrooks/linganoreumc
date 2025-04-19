import React from 'react';

function BodyTextInput({ title, maxLength, value, onChange, minHeight = 100 }) {
	return (
		<label className='flex flex-col'>
			<span className='text-sm'>{title}</span>
			<textarea
				className={`bg-tp px-2 py-1 outline-none border-l-4 flex-wrap flex border-red`}
				style={{ minHeight: minHeight }}
				placeholder={title}
				maxLength={maxLength}
				value={value}
				onChange={onChange}
			/>
		</label>
	);
}

export default BodyTextInput;
