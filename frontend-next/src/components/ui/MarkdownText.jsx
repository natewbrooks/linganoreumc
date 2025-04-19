import React from 'react';

function MarkdownText({ html }) {
	return (
		<div
			className='flex flex-col space-y-4 font-dm leading-relaxed whitespace-pre-wrap 
		[&_.ProseMirror]:outline-none
		[&_.ProseMirror]:focus:outline-none
		[&_.ProseMirror_ul]:list-disc
		[&_.ProseMirror_ol]:list-decimal
		[&_.ProseMirror_li]:ml-4
		[&_br]:block
		[&_a]:text-blue-600
		[&_a]:underline
		[&_a]:cursor-pointer
		[&_a]:hover:opacity-80
		[&_a]:transition-opacity
		[&_a]:clickable
		[&_li]:pl-2
		[&_ol]:list-decimal
		[&_ul]:list-disc
		[&_blockquote]:border-l-4
		[&_blockquote]:border-darkred
		[&_blockquote]:pl-4
		[&_blockquote]:italic
		[&_blockquote]:text-darkred
		[&_blockquote]:bg-tp'
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

export default MarkdownText;
