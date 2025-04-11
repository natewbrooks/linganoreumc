import React from 'react';

function MarkdownText({ html }) {
	return (
		<div
			className='flex flex-col space-y-4 font-dm text-lg text-dark leading-relaxed whitespace-pre-wrap 
		[&>ul]:list-disc 
		[&>ol]:list-decimal 
		[&>ul>li]:ml-6 
		[&>ol>li]:ml-6 
		[&>ul>li]::marker:text-darkred 
		[&_a]:text-blue-600 
		[&_a]:underline 
		[&_a]:cursor-pointer 
		[&_a]:hover:opacity-80 
		[&_a]:clickable'
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

export default MarkdownText;
