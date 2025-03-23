import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaMinus, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import ImageWithDimensions from './ImageWithDimensions';

export default function SelectImageDropdown({
	availableUploads, // either array of strings or objects
	initialSelectedImage = '',
	onSelectedImageChange, // callback with new selected image URL
	onRemoveImage, // callback when an image is removed (for deletion)
	onFileSelect, // callback when a file is selected (to upload)
	handleDeleteImage, // function passed from parent to delete an image by filename
	active, // boolean flag indicating if this header image is active
	disableRemove, // boolean; true if this is the only header image
	onSelectActive, // callback to set this header image as active
}) {
	const [enabled, setEnabled] = useState(false);
	const [selectedImage, setSelectedImage] = useState(initialSelectedImage);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef(null);
	const fileInputRef = useRef(null);

	// Update selected image when prop changes.
	useEffect(() => {
		setSelectedImage(initialSelectedImage);
	}, [initialSelectedImage]);

	// Close dropdown on outside click.
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setEnabled(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Handle file selection from the hidden input.
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			onFileSelect && onFileSelect(e.target.files[0]);
		}
	};

	// Helper: get file path whether availableUploads is an array of strings or objects.
	const getFilePath = (item) => (typeof item === 'string' ? item : item.filePath);

	// Filter available uploads based on search term.
	const filteredUploads =
		Array.isArray(availableUploads) &&
		availableUploads.filter((item) => {
			const filePath = getFilePath(item);
			const parts = filePath.split('/');
			const filename = parts[parts.length - 1];
			return filename.toLowerCase().includes(searchTerm.toLowerCase());
		});

	return (
		<div
			ref={dropdownRef}
			className='relative flex flex-col w-full items-center justify-center text-center'>
			{/* Clickable field */}
			<div
				className='font-dm relative border-l-4 border-red bg-tp cursor-pointer h-[100px] w-full items-center justify-center flex'
				onClick={() => setEnabled(true)}>
				{selectedImage ? (
					<ImageWithDimensions
						src={selectedImage}
						alt='Selected'
						imgClassName='w-full h-full object-contain'
					/>
				) : (
					<div className='ml-2 w-full items-center text-black/50'>Select image...</div>
				)}
			</div>

			{/* Icon controls */}
			<div className='flex flex-row absolute -top-0 -right-0 space-x-1 outline-4 bg-bkg outline-bkg'>
				{active ? (
					<>
						{/* Active icon: FaCheck does nothing */}
						<div className='bg-green-500 p-1 cursor-default'>
							<FaCheck
								size={12}
								className='text-bkg'
							/>
						</div>
						{/* Delete only allowed if more than one exists */}
						{!disableRemove && (
							<div className='bg-red p-1 cursor-pointer hover:opacity-50'>
								<FaTrash
									size={12}
									onClick={(e) => {
										e.stopPropagation();
										onRemoveImage();
									}}
									className='text-bkg'
								/>
							</div>
						)}
					</>
				) : (
					<>
						{/* Inactive: FaMinus sets this image to active */}
						<div className='bg-gray-500 p-1 cursor-pointer hover:opacity-50'>
							<FaMinus
								size={12}
								onClick={(e) => {
									e.stopPropagation();
									onSelectActive && onSelectActive();
								}}
								className='text-bkg'
							/>
						</div>
						{!disableRemove && (
							<div className='bg-red p-1 cursor-pointer hover:opacity-50'>
								<FaTrash
									size={12}
									onClick={(e) => {
										e.stopPropagation();
										onRemoveImage();
									}}
									className='text-bkg'
								/>
							</div>
						)}
					</>
				)}
			</div>

			{/* Hidden file input for uploading a new image */}
			<input
				type='file'
				accept='image/*'
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>

			{/* Dropdown list */}
			{enabled && (
				<div className='absolute w-[360px] max-h-[200px] translate-y-[100px] z-30 overflow-y-auto flex flex-col space-y-1 bg-bkg border-l-4 border-red pb-2 px-4'>
					<div className='flex flex-col items-center space-y-2 py-2'>
						<div className='flex flex-row w-full justify-between'>
							<span className='font-dm text-sm text-black'>Uploaded Images</span>
							<button
								className='font-dm cursor-pointer'
								onClick={() => {
									fileInputRef.current && fileInputRef.current.click();
								}}>
								<p className='text-sm text-red'>Add Image</p>
							</button>
						</div>
						<div className='flex space-x-2 w-full items-center'>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='font-dm border-l-4 w-full text-black/50 border-red px-2 outline-none bg-transparent'
								placeholder='Search...'
							/>
							<FaSearch
								size={14}
								className='text-black/50'
							/>
						</div>
					</div>
					{filteredUploads && filteredUploads.length > 0 ? (
						<div className='grid grid-cols-3 gap-1'>
							{filteredUploads.map((item, idx) => {
								const filePath = getFilePath(item);
								return (
									<div
										key={idx}
										className='border-2 border-red p-1 cursor-pointer hover:opacity-75'
										onClick={() => {
											setSelectedImage(filePath);
											onSelectedImageChange && onSelectedImageChange(filePath);
											setEnabled(false);
										}}>
										<div className='relative'>
											<img
												src={filePath}
												alt={`upload-${idx}`}
												className='object-contain h-24 w-full'
											/>
											{/* Delete icon for uploads */}
											<FaPlus
												className='absolute top-0 right-0 rotate-45 text-red'
												onClick={(e) => {
													e.stopPropagation();
													const filename = filePath.split('/').pop();
													handleDeleteImage && handleDeleteImage(filename);
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className='text-center text-xs text-darkred font-dm italic'>No images found.</div>
					)}
				</div>
			)}
		</div>
	);
}
