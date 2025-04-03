import React, { useState, useEffect } from 'react';
import SelectImageDropdown from '../ui/SelectImageDropdown';

export default function SelectEventImages({
	eventID,
	eventImages = [],
	onChangeEventImages = () => {},
}) {
	const [availableUploads, setAvailableUploads] = useState([]);
	const [imageFile, setImageFile] = useState(null);

	// Fetch from DB (via API) — returns [{ id, photoURL, isThumbnail }]
	useEffect(() => {
		if (!eventID) return;

		fetch(`/api/media/images/events/${eventID}`)
			.then((res) => res.json())
			.then((data) => {
				const formatted = data.map((img) => ({
					filePath: img.photoURL,
					isThumbnail: img.isThumbnail,
				}));
				setAvailableUploads(formatted);
			})
			.catch((err) => console.error(`Error fetching event images for ${eventID}:`, err));
	}, [eventID]);

	useEffect(() => {
		if (imageFile) handleUpload();
	}, [imageFile]);

	const handleFileSelect = (file) => {
		if (file) setImageFile(file);
	};

	const handleUpload = async () => {
		if (!imageFile || !eventID) return;

		const formData = new FormData();
		formData.append('image', imageFile);

		try {
			const response = await fetch(`/api/admin/media/images/events/${eventID}`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Upload failed: ${response.status} ${errorText}`);
			}

			const data = await response.json();
			if (!data?.filePath) return;

			// Update local image state
			const updatedUploads = [...availableUploads, { filePath: data.filePath, isThumbnail: false }];
			setAvailableUploads(updatedUploads);

			// Update eventImages state passed to form
			const updated = [...eventImages];
			if (updated.length === 0) {
				updated.push({ url: data.filePath, active: false });
			} else {
				updated[updated.length - 1] = {
					...updated[updated.length - 1],
					url: data.filePath,
				};
			}
			onChangeEventImages(updated);
			setImageFile(null);
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const removeImage = (index) => {
		if (eventImages.length <= 1) return;
		const updated = eventImages.filter((_, i) => i !== index);
		onChangeEventImages(updated);
	};

	const setActiveForIndex = (index) => {
		const updated = eventImages.map((img, i) => ({
			...img,
			active: i === index,
		}));
		onChangeEventImages(updated);
	};

	const handleDeleteImage = async (filename) => {
		try {
			const response = await fetch(`/api/admin/media/images/${filename}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete image');

			// Update uploaded list
			setAvailableUploads((prev) =>
				prev.filter((item) => {
					const filePath = item?.filePath || '';
					return filePath.split('/').pop() !== filename;
				})
			);

			// Clear any selected image that matched the deleted one
			const updated = eventImages.map((img) => {
				const imgFilename = img?.url?.split('/').pop();
				if (imgFilename === filename) return { ...img, url: '' };
				return img;
			});
			onChangeEventImages(updated);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	return (
		<div className='grid grid-cols-3 gap-2 w-full'>
			{eventImages.map((image, index) => (
				<div
					key={index}
					className='flex items-center w-full'>
					<SelectImageDropdown
						availableUploads={availableUploads}
						initialSelectedImage={image.url || ''}
						onSelectedImageChange={(selectedUrl) => {
							const updated = [...eventImages];
							updated[index] = { ...updated[index], url: selectedUrl };
							onChangeEventImages(updated);
						}}
						onRemoveImage={() => removeImage(index)}
						onFileSelect={handleFileSelect}
						handleDeleteImage={handleDeleteImage}
						active={!!image.active}
						disableRemove={eventImages.length === 1}
						onSelectActive={() => setActiveForIndex(index)}
						folderFilter={`/api/media/images/events/${eventID}/`}
					/>
				</div>
			))}

			<button
				type='button'
				className='w-full h-full items-center'
				onClick={() => onChangeEventImages([...eventImages, { url: '', active: false }])}>
				<div className='font-dm text-sm cursor-pointer hover:opacity-50'>Add Event Image...</div>
			</button>
		</div>
	);
}
