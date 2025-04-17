import React, { useState, useEffect } from 'react';
import SelectImageDropdown from './SelectImageDropdown';

export default function SelectImageSingle({
	label = 'Image',
	image = { url: '', active: false },
	onChangeImage,
	availableUploads = [],
	setAvailableUploads,
	uploadEndpoint,
	customUploadFunction,
	folderFilter = `${import.meta.env.VITE_API_BASE_URL}/media/images`,
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

				onChangeImage({ url: uploadedPath, active: false });
				setImageFile(null);
			}
		} catch (err) {
			console.error(`Error uploading ${label.toLowerCase()}:`, err);
			setUploadError(err.message);
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
			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const path = typeof item === 'string' ? item : item.filePath;
					return path.split('/').pop() !== filename;
				})
			);
			if (image.url.includes(filename)) onChangeImage({ url: '', active: false });
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='w-full'>
			<SelectImageDropdown
				label={label}
				availableUploads={availableUploads}
				images={[image]}
				initialSelectedImage={
					image.url?.split('/').pop()
						? `${import.meta.env.VITE_API_BASE_URL}/media/images/${image.url.split('/').pop()}`
						: ''
				}
				onSelectedImageChange={(selectedUrl) => onChangeImage({ ...image, url: selectedUrl })}
				onRemoveImage={() => onChangeImage({ url: '', active: false })}
				onFileSelect={handleFileSelect}
				handleDeleteImage={handleDeleteImage}
				folderFilter={folderFilter}
				uploadError={uploadError}
			/>
		</div>
	);
}
