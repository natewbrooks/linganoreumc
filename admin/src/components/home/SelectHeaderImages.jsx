import React, { useState, useEffect } from 'react';
import SelectImageDropdown from '../ui/SelectImageDropdown';
import { FaTrash } from 'react-icons/fa';

export default function SelectHeaderImages({
	headerImages,
	onChangeHeaderImages,
	availableUploads, // array of { filePath: "..." }
	setAvailableUploads,
	uploadEndpoint = '/api/admin/media/images/', // upload route for new images
}) {
	const [imageFile, setImageFile] = useState(null);

	// Automatically upload when a file is selected.
	useEffect(() => {
		if (imageFile) {
			handleUpload();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile]);

	// Callback passed to the dropdown when a file is selected.
	const handleFileSelect = (file) => {
		if (file) {
			setImageFile(file);
		}
	};

	// Upload the selected file.
	const handleUpload = async () => {
		if (!imageFile) return;
		const formData = new FormData();
		formData.append('image', imageFile);
		try {
			const response = await fetch(uploadEndpoint, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			if (data.filePath) {
				// Add the new upload to availableUploads.
				setAvailableUploads((prev) => [...prev, { filePath: data.filePath }]);
				// Instead of creating a new header image entry, update the current one.
				const updated = [...headerImages];
				if (updated.length === 0) {
					// If no header image exists, add one.
					updated.push({ url: data.filePath, active: false });
				} else {
					// Update the last header image entry.
					updated[updated.length - 1].url = data.filePath;
				}
				onChangeHeaderImages(updated);
				alert('Image uploaded successfully!');
				setImageFile(null);
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	// Remove a header image.
	const removeHeaderImage = (index) => {
		// Only remove if there is more than one header image.
		if (headerImages.length === 1) return;
		const updated = headerImages.filter((_, i) => i !== index);
		onChangeHeaderImages(updated);
	};

	// Set one header image as active (only one can be active).
	const setActiveForIndex = (index) => {
		const updated = headerImages.map((img, i) =>
			i === index ? { ...img, active: true } : { ...img, active: false }
		);
		onChangeHeaderImages(updated);
	};

	// Delete an image file from the server.
	const handleDeleteImage = async (filename) => {
		try {
			const response = await fetch(`/api/admin/media/images/${filename}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				throw new Error('Failed to delete image');
			}
			// Remove from availableUploads.
			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const filePath = typeof item === 'string' ? item : item.filePath;
					return filePath.split('/').pop() !== filename;
				})
			);

			// Instead of removing the header image entry completely,
			// update the matching header image to have an empty URL.
			onChangeHeaderImages(
				headerImages.map((img) => {
					if (img && img.url && img.url.includes('/api/media/images/')) {
						const parts = img.url.split('/');
						if (parts[parts.length - 1] === filename) {
							return { ...img, url: '' };
						}
					}
					return img;
				})
			);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='grid grid-cols-3 gap-2 w-full'>
			{/* List current header image entries */}
			{headerImages.map((image, index) => (
				<div
					key={index}
					className='flex items-center w-full'>
					<SelectImageDropdown
						availableUploads={availableUploads}
						initialSelectedImage={image.url || ''}
						onSelectedImageChange={(selectedUrl) => {
							const updated = [...headerImages];
							updated[index] = { ...updated[index], url: selectedUrl };
							onChangeHeaderImages(updated);
						}}
						onRemoveImage={() => {
							removeHeaderImage(index);
						}}
						onFileSelect={handleFileSelect}
						handleDeleteImage={handleDeleteImage}
						active={!!image.active} // pass the active flag
						disableRemove={headerImages.length === 1}
						onSelectActive={() => setActiveForIndex(index)}
					/>
				</div>
			))}

			<button
				className='w-full h-full items-center'
				onClick={() => {
					// Add a new header image entry with an empty URL.
					onChangeHeaderImages([...headerImages, { url: '', active: false }]);
				}}>
				<div className='font-dm text-sm cursor-pointer hover:opacity-50'>Add Header Image...</div>
			</button>
		</div>
	);
}
