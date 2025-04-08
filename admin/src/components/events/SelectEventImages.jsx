import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import SelectImageGrid from '../ui/SelectImageGrid';

export default function SelectEventImages({
	eventID,
	eventImages = [],
	onChangeEventImages = () => {},
}) {
	const { fetchEventImages, uploadEventImage, setThumbnailImage } = useEvents();
	const [availableUploads, setAvailableUploads] = useState([]);
	const [localImages, setLocalImages] = useState([]); // ✅ Local state

	useEffect(() => {
		if (!eventID) return;
		fetchEventImages(eventID).then((results) => {
			const formattedImages = results.map((img) => ({
				url: img.url,
				active: img.isThumbnail === true,
			}));
			setLocalImages(formattedImages); // ✅ Store locally
			onChangeEventImages(formattedImages); // Optional if needed to sync
			setAvailableUploads(results.map((img) => ({ filePath: img.url })));
		});
	}, [eventID]);

	const handleEventImagesChange = (updatedImages) => {
		setLocalImages(updatedImages); // ✅ Local update
		onChangeEventImages(updatedImages); // ✅ Propagate upward
	};

	const handleToggleActive = async (index) => {
		const updated = localImages.map((img, i) => ({
			...img,
			active: i === index,
		}));
		handleEventImagesChange(updated);

		const thumbnailUrl = updated[index]?.url;
		const filename = thumbnailUrl?.split('/').pop();
		if (filename) {
			await setThumbnailImage(eventID, filename);
		}
	};

	const uploadHandler = async (file) => {
		const uploadedPath = await uploadEventImage(file, eventID);
		if (uploadedPath) {
			setAvailableUploads((prev) => [...prev, { filePath: uploadedPath }]);
			return uploadedPath;
		}
		return null;
	};

	return (
		<SelectImageGrid
			label='Event Images'
			description='Selected image determines the event thumbnail.'
			images={localImages}
			onChangeImages={handleEventImagesChange}
			availableUploads={availableUploads}
			setAvailableUploads={setAvailableUploads}
			folderFilter={`/api/media/images/events/${eventID}/`}
			customUploadFunction={uploadHandler}
			toggleableActive={true}
			showDeleteButton={false}
			onToggleActive={handleToggleActive}
		/>
	);
}
