import React, { useState, useEffect } from 'react';
import SelectImageDropdown from '../ui/SelectImageDropdown';

export default function SelectImageGrid({
	label = 'Image',
	images = [],
	onChangeImages,
	availableUploads = [],
	setAvailableUploads,
	uploadEndpoint,
	customUploadFunction,
	folderFilter = '/api/media/images/',
	toggleableActive = false,
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
		const updated = images.map((img, i) => ({
			...img,
			active: i === index,
		}));
		onChangeImages(updated);
	};

	const handleDeleteImage = async (filename) => {
		try {
			const response = await fetch(`/api/admin/media/images/${filename}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete image');
			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const path = typeof item === 'string' ? item : item.filePath;
					return path.split('/').pop() !== filename;
				})
			);
			const updated = images.map((img) => {
				const imgFilename = img?.url?.split('/').pop();
				if (imgFilename === filename) return { ...img, url: '' };
				return img;
			});
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
						toggleableActive={toggleableActive} // ✅ pass it down
						initialSelectedImage={
							image.url?.split('/').pop() ? `/api/media/images/${image.url.split('/').pop()}` : ''
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
						disableRemove={toggleableActive && images.length === 1}
						onSelectActive={toggleableActive ? () => setActiveForIndex(index) : undefined}
						folderFilter={folderFilter}
						uploadError={uploadError}
					/>
				</div>
			))}

			<button
				type='button'
				className='w-full h-full items-center'
				onClick={() => onChangeImages([...images, { url: '', active: false }])}>
				<div className='font-dm text-sm cursor-pointer hover:opacity-50'>{`Add ${label}...`}</div>
			</button>
		</div>
	);
}
