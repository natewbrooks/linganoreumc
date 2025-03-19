import React from 'react';

function Motto({ title, subtext }) {
	return (
		<div className={`w-full flex flex-col items-center text-center font-dm mt-10`}>
			<span className={`text-3xl `}>{title}</span>
			<span className={`text-xl w-[800px]`}>{subtext}</span>
		</div>
	);
}

export default Motto;
