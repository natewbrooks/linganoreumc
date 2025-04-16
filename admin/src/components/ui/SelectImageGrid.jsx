import React, { useState, useEffect } from 'react';
import SelectImageDropdown from '../ui/SelectImageDropdown';
import { FaPlus } from 'react-icons/fa6';

export default function SelectImageGrid({
	label = 'Image',
	images = [],
	onChangeImages,
	availableUploads = [],
	setAvailableUploads,
	uploadEndpoint,
	customUploadFunction,
	folderFilter = `${import.meta.env.VITE_API_BASE_URL}/media/images/`,
	toggleableActive = false,
	showDeleteButton = true,
	onToggleActive,
}) {
	const [imageFile, setImageFile] = useState(null);
	const [uploadError, setUploadError] = useState('');

	useEffect(() => {
		if (imageFile) handleUpload();
	}, [imageFile]);

	const handleFileSelect = (file) => {
		if (file) {
			setUploadError('');
			setImageFile(file);
		}
	};

	const handleUpload = async () => {
		if (!imageFile) return;

		try {
			let uploadedPath = null;

			if (customUploadFunction) {
				uploadedPath = await customUploadFunction(imageFile);
			} else if (uploadEndpoint) {
				const formData = new FormData();
				formData.append('image', imageFile);
				const res = await fetch(uploadEndpoint, {
					method: 'POST',
					body: formData,
				});
				const data = await res.json();
				if (res.ok && data?.filePath) uploadedPath = data.filePath;
			}

			if (uploadedPath) {
				setAvailableUploads((prev) => {
					const exists = prev.some(
						(item) => (typeof item === 'string' ? item : item.filePath) === uploadedPath
					);
					return exists ? prev : [...prev, { filePath: uploadedPath }];
				});

				const updated = [...images];
				const alreadyExists = updated.some((img) => img.url === uploadedPath);

				if (!alreadyExists) {
					const emptyIndex = updated.findIndex((img) => !img.url);
					if (emptyIndex !== -1) {
						updated[emptyIndex] = {
							...updated[emptyIndex],
							url: uploadedPath,
						};
					} else {
						updated.push({ url: uploadedPath, active: false });
					}
					onChangeImages(updated);
				}

				setImageFile(null);
			}
		} catch (error) {
			console.error(`Error uploading ${label.toLowerCase()}:`, error);
			setUploadError(error.message); // show user-friendly error
		}
	};

	const removeImage = (index) => {
		// Only protect removal if toggleableActive is true (i.e., headers)
		if (toggleableActive && images.length <= 1) return;
		const updated = images.filter((_, i) => i !== index);
		onChangeImages(updated);
	};

	const setActiveForIndex = (index) => {
		if (onToggleActive) {
			onToggleActive(index);
		} else {
			const updated = images.map((img, i) => ({
				...img,
				active: i === index,
			}));
			onChangeImages(updated);
		}
	};

	const handleDeleteImage = async (filename) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/admin/media/images/${filename}`,
				{
					method: 'DELETE',
				}
			);
			if (!response.ok) throw new Error('Failed to delete image');

			const cleanName = filename.split('/').pop();

			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const path = typeof item === 'string' ? item : item.filePath;
					return path.split('/').pop() !== cleanName;
				})
			);

			const updated = images.filter((img) => img?.url?.split('/').pop() !== cleanName);
			onChangeImages(updated);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='grid grid-cols-3 gap-2 w-full'>
			{images.map((image, index) => (
				<div
					key={index}
					className='flex items-center w-full'>
					<SelectImageDropdown
						label={label}
						availableUploads={availableUploads}
						images={images}
						toggleableActive={toggleableActive}
						initialSelectedImage={
							image.url?.split('/').pop()
								? `${import.meta.env.VITE_API_BASE_URL}/media/images/${image.url.split('/').pop()}`
								: ''
						}
						onSelectedImageChange={(selectedUrl) => {
							const updated = [...images];
							updated[index] = { ...updated[index], url: selectedUrl };
							onChangeImages(updated);
						}}
						onRemoveImage={() => removeImage(index)}
						onFileSelect={handleFileSelect}
						handleDeleteImage={handleDeleteImage}
						active={!!image.active}
						disableRemove={(toggleableActive && images.length === 1) || !showDeleteButton}
						onSelectActive={toggleableActive ? () => setActiveForIndex(index) : undefined}
						folderFilter={folderFilter}
						uploadError={uploadError}
					/>
				</div>
			))}

			<button
				type='button'
				className='w-full h-full min-h-[100px] clickable flex items-center justify-center border-2 border-dashed border-darkred transition-all'
				onClick={() => onChangeImages([...images, { url: '', active: false }])}>
				<div className='font-dm text-sm flex flex-row space-x-2 items-center justify-center w-full'>
					<span>{`Add ${label}...`}</span>
				</div>
			</button>
		</div>
	);
}
