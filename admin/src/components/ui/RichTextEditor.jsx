import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';

import { FaLink, FaImage } from 'react-icons/fa';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

const RichTextEditor = ({ value, onChange, title }) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				// Only enable align on certain nodes
				paragraph: {
					HTMLAttributes: {
						class: 'text-left',
					},
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			BulletList,
			OrderedList,
			ListItem,
			Underline,
			Link.configure({ openOnClick: true }),
			// Image,
		],
		content: '',
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	const hasSetInitialContent = useRef(false);

	useEffect(() => {
		if (editor && value && !hasSetInitialContent.current) {
			editor.commands.setContent(value);
			hasSetInitialContent.current = true;
		}
	}, [editor, value]);

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('Enter URL', previousUrl);

		if (!url) return; // cancelled or empty

		const { empty } = editor.state.selection;

		if (empty) {
			// No text selected: insert the URL as both the text and the href
			editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
		} else {
			// Text selected: apply link to the selection
			editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		}
	};

	// const addImage = () => {
	// 	const url = window.prompt('Enter image URL');
	// 	if (url) {
	// 		editor.chain().focus().setImage({ src: url }).run();
	// 	}
	// };

	if (!editor) return null;

	return (
		<div className='h-full flex flex-col '>
			{/* Toolbar */}
			<div className={`text-sm`}>{title}</div>
			<div className='flex flex-wrap space-x-4 text-bkg px-4 py-0.5 bg-red items-center'>
				<div className='flex space-x-4'>
					<button
						type='button'
						onClick={() => editor.chain().toggleBold().run()}
						className={`cursor-pointer hover:opacity-50 font-bold px-2  rounded ${
							editor.isActive('bold') ? 'bg-bkg text-red' : ''
						}`}>
						B
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleItalic().run()}
						className={`cursor-pointer hover:opacity-50 italic px-2  rounded ${
							editor.isActive('italic') ? 'bg-bkg text-red' : ''
						}`}>
						I
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleUnderline().run()}
						className={`cursor-pointer hover:opacity-50 underline px-2  rounded ${
							editor.isActive('underline') ? 'bg-bkg text-red' : ''
						}`}>
						U
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={`cursor-pointer hover:opacity-50 line-through px-2 rounded ${
							editor.isActive('strike') ? 'bg-bkg text-red' : ''
						}`}>
						S
					</button>
				</div>
				<span className='text-darkred'>|</span>
				<div className='flex space-x-4'>
					<button
						type='button'
						onClick={() => editor.chain().toggleBulletList().run()}
						className={`cursor-pointer hover:opacity-50 px-2  rounded ${
							editor.isActive('bulletList') ? 'bg-bkg text-red' : ''
						}`}>
						<MdFormatListBulleted size={24} />
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleOrderedList().run()}
						className={`cursor-pointer hover:opacity-50 px-2  rounded ${
							editor.isActive('orderedList') ? 'bg-bkg text-red' : ''
						}`}>
						<MdFormatListNumbered size={24} />
					</button>
				</div>
				<span className='text-darkred'>|</span>
				<button
					type='button'
					onClick={setLink}
					className='cursor-pointer hover:opacity-50'>
					<FaLink />
				</button>
				<span className='text-darkred'>|</span>
				<button
					type='button'
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					className={`cursor-pointer hover:opacity-50 px-2 rounded`}>
					—
				</button>
				<button
					type='button'
					onClick={() => editor.chain().toggleBlockquote().run()}
					className={`cursor-pointer hover:opacity-50 px-2 rounded ${
						editor.isActive('blockquote') ? 'bg-bkg text-red' : ''
					}`}>
					“
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					className={`cursor-pointer hover:opacity-50 px-2 rounded ${
						editor.isActive({ textAlign: 'center' }) ? 'bg-bkg text-red' : ''
					}`}>
					C
				</button>

				{/* <button
					type='button'
					onClick={addImage}
					className='cursor-pointer hover:opacity-50'>
					<FaImage />
				</button> */}
			</div>

			{/* Editor content area */}
			<div
				className='border-l-4 border-red flex-grow p-4 prose list-outside list-disc marker:text-darkred min-h-[200px] max-h-[500px] max-w-none bg-bkg-tp cursor-text select-none overflow-auto'
				onClick={() => editor?.chain().focus().run()}>
				<EditorContent
					editor={editor}
					className='h-full
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
		[&_blockquote]:bg-tp

	'
				/>
			</div>
		</div>
	);
};

export default RichTextEditor;
