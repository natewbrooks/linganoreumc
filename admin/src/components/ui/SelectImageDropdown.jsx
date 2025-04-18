import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaMinus, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import ImageWithDimensions from './ImageWithDimensions';

export default function SelectImageDropdown({
	label,
	availableUploads,
	initialSelectedImage = '',
	onSelectedImageChange,
	onRemoveImage,
	onFileSelect,
	handleDeleteImage,
	active,
	disableRemove,
	onSelectActive,
	folderFilter,
	toggleableActive = false,
	uploadError,
}) {
	const [enabled, setEnabled] = useState(false);
	const [selectedImage, setSelectedImage] = useState(initialSelectedImage);
	const [searchTerm, setSearchTerm] = useState('');
	const [imageLoadFailed, setImageLoadFailed] = useState(false); // ✅
	const dropdownRef = useRef(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		setSelectedImage(initialSelectedImage);
	}, [initialSelectedImage]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setEnabled(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			onFileSelect && onFileSelect(e.target.files[0]);
		}
	};

	const getFilename = (item) => {
		const fullPath = typeof item === 'string' ? item : item.filePath;
		return fullPath.split('/').pop();
	};
	const filteredUploads = Array.isArray(availableUploads)
		? availableUploads.filter((item) => {
				const originalPath = typeof item === 'string' ? item : item.filePath;
				const filename = getFilename(item);
				const matchesFolder = folderFilter ? originalPath.startsWith(folderFilter) : true;
				const matchesSearch = filename.toLowerCase().includes(searchTerm.toLowerCase());
				return matchesFolder && matchesSearch;
		  })
		: [];

	return (
		<>
			<div
				ref={dropdownRef}
				className={`${
					enabled ? '' : 'relative'
				} flex flex-col w-full items-center justify-center text-center`}>
				{/* Clickable image preview */}
				<div
					className='font-dm relative border-l-4 border-red bg-tp clickable h-[100px] w-full items-center justify-center flex'
					onClick={() => setEnabled(true)}>
					{selectedImage ? (
						<ImageWithDimensions
							src={selectedImage}
							alt='Selected'
							imgClassName='w-full h-full object-cover'
							onError={() => setImageLoadFailed(true)}
							onLoad={() => setImageLoadFailed(false)}
						/>
					) : (
						<div className='ml-2 w-full items-center text-black/50'>Select image...</div>
					)}
				</div>

				{/* Control icons */}
				<div className='flex flex-row absolute -top-0 -right-0 space-x-1 outline-4 bg-bkg outline-bkg'>
					{toggleableActive && active ? (
						<>
							<div className='bg-green-500 p-1 cursor-default'>
								<FaCheck
									size={12}
									className='text-bkg'
								/>
							</div>
							{(!selectedImage || imageLoadFailed || !disableRemove) && (
								<div className='bg-red p-1 clickable '>
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
							{toggleableActive && selectedImage && (
								<div className='bg-gray-500 p-1 clickable '>
									<FaMinus
										size={12}
										onClick={(e) => {
											e.stopPropagation();
											onSelectActive && onSelectActive();
										}}
										className='text-bkg'
									/>
								</div>
							)}
							{(!selectedImage || imageLoadFailed || !disableRemove) && (
								<div className='bg-red p-1 clickable '>
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

				{/* File input */}
				<input
					type='file'
					accept='image/*'
					ref={fileInputRef}
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				{/* Dropdown list */}
				{enabled && (
					<div className='absolute w-[360px] max-h-[200px] left-1/2 -translate-x-1/2 md:left-auto translate-y-[100px] z-30 overflow-hidden flex flex-col space-y-2 bg-bkg border-l-4 border-red pb-2  px-4'>
						<div className='sticky top-0 z-10 border-b-4 border-darkred/10 flex-col items-center space-y-2 py-2  bg-bkg'>
							<div className='flex flex-row w-full justify-between'>
								<span className='font-dm text-sm text-black'>{label}</span>

								<button
									type='button'
									className='font-dm clickable'
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
									className='font-dm border-l-4 w-full placeholder:text-black/50 border-red px-2 outline-none bg-transparent'
									placeholder='Search...'
								/>
								<FaSearch
									size={14}
									className='text-black/50'
								/>
							</div>

							{uploadError && (
								<div className='text-xs text-start text-red font-dm italic'>
									ERROR: {uploadError}
								</div>
							)}
						</div>

						{filteredUploads.length > 0 ? (
							<div className='grid grid-cols-3 gap-1 overflow-y-auto '>
								{filteredUploads.map((item, idx) => {
									const filename = getFilename(item);
									const filePath = `/api/media/images/${filename}`;

									return (
										<div
											key={idx}
											className='border-2 border-red p-1 '>
											<div className='relative'>
												<img
													src={filePath}
													alt={`upload-${idx}`}
													className='object-cover h-24 w-full clickable hover:opacity-75'
													onClick={() => {
														setSelectedImage(filePath);
														onSelectedImageChange && onSelectedImageChange(filePath);
														setEnabled(false);
													}}
												/>
												<FaPlus
													className='absolute top-0 right-0 rotate-45 text-bkg outline-2 outline-red bg-red clickable hover:opacity-75  '
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteImage && handleDeleteImage(filename);
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className='text-center text-xs text-darkred font-dm italic'>
								No images found.
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
