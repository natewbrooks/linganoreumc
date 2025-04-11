import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

import { FaLink, FaImage } from 'react-icons/fa';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';

const RichTextEditor = ({ value, onChange, title }) => {
	const editor = useEditor({
		extensions: [
			StarterKit, // no custom hardBreak config
			BulletList,
			OrderedList,
			ListItem,
			Underline,
			Link.configure({ openOnClick: true }),
			Image,
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
		const url = window.prompt('Enter URL');
		if (url) {
			editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		}
	};

	const addImage = () => {
		const url = window.prompt('Enter image URL');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	if (!editor) return null;

	return (
		<div className='h-full flex flex-col'>
			{/* Toolbar */}
			<div className='flex flex-wrap space-x-4 text-bkg px-4 py-0.5 bg-red items-center'>
				<div className='flex space-x-4'>
					<button
						type='button'
						onClick={() => editor.chain().toggleBold().run()}
						className={`cursor-pointer hover:opacity-50 font-bold px-2 py-1 rounded ${
							editor.isActive('bold') ? 'bg-bkg text-red' : ''
						}`}>
						B
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleItalic().run()}
						className={`cursor-pointer hover:opacity-50 italic px-2 py-1 rounded ${
							editor.isActive('italic') ? 'bg-bkg text-red' : ''
						}`}>
						I
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleUnderline().run()}
						className={`cursor-pointer hover:opacity-50 underline px-2 py-1 rounded ${
							editor.isActive('underline') ? 'bg-bkg text-red' : ''
						}`}>
						U
					</button>
				</div>
				<span className='text-darkred'>|</span>
				<div className='flex space-x-4'>
					<button
						type='button'
						onClick={() => editor.chain().toggleBulletList().run()}
						className={`cursor-pointer hover:opacity-50 px-2 py-1 rounded ${
							editor.isActive('bulletList') ? 'bg-bkg text-red' : ''
						}`}>
						<MdFormatListBulleted size={24} />
					</button>
					<button
						type='button'
						onClick={() => editor.chain().toggleOrderedList().run()}
						className={`cursor-pointer hover:opacity-50 px-2 py-1 rounded ${
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
				<button
					type='button'
					onClick={addImage}
					className='cursor-pointer hover:opacity-50'>
					<FaImage />
				</button>
			</div>

			{/* Editor content area */}
			<div
				className='border-l-4 border-red flex-grow p-4 prose list-outside list-disc marker:text-darkred h-[300px] max-w-none bg-bkg-tp cursor-text select-none overflow-auto'
				onClick={() => editor?.chain().focus().run()}>
				<EditorContent
					editor={editor}
					className='h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_li]:ml-4 [&_br]:block'
				/>
			</div>
		</div>
	);
};

export default RichTextEditor;
