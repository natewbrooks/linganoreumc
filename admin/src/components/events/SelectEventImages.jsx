import React, { useEffect, useState } from 'react';
import { useEvents } from '../../contexts/EventsContext';
import SelectImageGrid from '../ui/SelectImageGrid';

export default function SelectEventImages({
	eventID,
	eventImages = [],
	onChangeEventImages = () => {},
}) {
	const { fetchEventImages, uploadEventImage } = useEvents();
	const [availableUploads, setAvailableUploads] = useState([]);

	const folderFilter = `/api/media/images/events/${eventID}/`;
	const mediaBasePath = `/api/media/images/events/${eventID}/`;

	useEffect(() => {
		if (!eventID) return;
		fetchEventImages(eventID).then((result) => {
			const formatted = result.map((url) => ({ filePath: url }));
			setAvailableUploads(formatted);
		});
	}, [eventID]);

	const handleEventImagesChange = (updatedImages) => {
		const normalized = updatedImages.map((img) => {
			const filename = img?.url?.split('/').pop();
			return {
				...img,
				url: filename ? `${mediaBasePath}${filename}` : '',
			};
		});
		onChangeEventImages(normalized);
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
			images={eventImages}
			onChangeImages={handleEventImagesChange}
			availableUploads={availableUploads}
			setAvailableUploads={setAvailableUploads}
			folderFilter={folderFilter}
			customUploadFunction={uploadHandler}
		/>
	);
}
