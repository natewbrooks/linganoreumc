import React, { useState, useEffect } from 'react';
import SelectImageDropdown from '../ui/SelectImageDropdown';

export default function SelectHeaderImages({
	headerImages,
	onChangeHeaderImages,
	availableUploads,
	setAvailableUploads,
	uploadEndpoint = '/api/admin/media/images/header/',
}) {
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		if (imageFile) handleUpload();
	}, [imageFile]);

	const handleFileSelect = (file) => {
		if (file) setImageFile(file);
	};

	const handleUpload = async () => {
		if (!imageFile) return;
		const formData = new FormData();
		formData.append('image', imageFile);
		try {
			const response = await fetch(uploadEndpoint, {
				method: 'POST',
				body: formData,
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Server error: ${response.status} ${errorText}`);
			}
			const data = await response.json();
			if (data.filePath) {
				setAvailableUploads((prev) => [...prev, { filePath: data.filePath }]);
				const updated = [...headerImages];
				if (updated.length === 0) {
					updated.push({ url: data.filePath, active: false });
				} else {
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

	const removeHeaderImage = (index) => {
		if (headerImages.length === 1) return;
		const updated = headerImages.filter((_, i) => i !== index);
		onChangeHeaderImages(updated);
	};

	const setActiveForIndex = (index) => {
		const updated = headerImages.map((img, i) =>
			i === index ? { ...img, active: true } : { ...img, active: false }
		);
		onChangeHeaderImages(updated);
	};

	const handleDeleteImage = async (filename) => {
		try {
			const response = await fetch(`/api/admin/media/images/${filename}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete image');
			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const filePath = typeof item === 'string' ? item : item.filePath;
					return filePath.split('/').pop() !== filename;
				})
			);
			onChangeHeaderImages(
				headerImages.map((img) => {
					const imgFilename = img?.url?.split('/').pop();
					if (imgFilename === filename) return { ...img, url: '' };
					return img;
				})
			);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='grid grid-cols-3 gap-2 w-full'>
			{headerImages.map((image, index) => (
				<div
					key={index}
					className='flex items-center w-full'>
					<SelectImageDropdown
						availableUploads={availableUploads}
						initialSelectedImage={`/api/media/images/${image.url?.split('/').pop()}`}
						onSelectedImageChange={(selectedUrl) => {
							const updated = [...headerImages];
							updated[index] = { ...updated[index], url: selectedUrl };
							onChangeHeaderImages(updated);
						}}
						onRemoveImage={() => removeHeaderImage(index)}
						onFileSelect={handleFileSelect}
						handleDeleteImage={handleDeleteImage}
						active={!!image.active}
						disableRemove={headerImages.length === 1}
						onSelectActive={() => setActiveForIndex(index)}
						folderFilter='/api/media/images/' // still filtered
					/>
				</div>
			))}

			<button
				className='w-full h-full items-center'
				onClick={() => onChangeHeaderImages([...headerImages, { url: '', active: false }])}>
				<div className='font-dm text-sm cursor-pointer hover:opacity-50'>Add Header Image...</div>
			</button>
		</div>
	);
}
