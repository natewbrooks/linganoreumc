import React, { useEffect, useState } from 'react';
import SelectImageGrid from '../ui/SelectImageGrid';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';

export default function SelectHeaderImages({ headerImages = [], onChangeHeaderImages = () => {} }) {
	const [availableUploads, setAvailableUploads] = useState([]);
	const { uploadHeaderImage } = useHomePageSettings();

	const folderFilter = '/api/media/images/header/';
	const mediaBasePath = '/api/media/images/';

	useEffect(() => {
		fetch(folderFilter)
			.then((res) => res.json())
			.then((data) => setAvailableUploads(data || []))
			.catch((err) => console.error('Error fetching header image uploads:', err));
	}, []);

	const handleHeaderImagesChange = (updatedImages) => {
		const normalized = updatedImages.map((img) => {
			const filename = img?.url?.split('/').pop();
			return {
				...img,
				url: filename ? `${mediaBasePath}${filename}` : '',
			};
		});
		onChangeHeaderImages(normalized);
	};

	const uploadHandler = async (file) => {
		const uploadedPath = await uploadHeaderImage(file);
		if (uploadedPath) {
			const newEntry = { filePath: uploadedPath };
			setAvailableUploads((prev) => [...prev, newEntry]);
			return uploadedPath;
		}
		return null;
	};

	return (
		<SelectImageGrid
			label='Header Images'
			description={`Selected image determines the active header.`}
			images={headerImages}
			onChangeImages={handleHeaderImagesChange}
			availableUploads={availableUploads}
			setAvailableUploads={setAvailableUploads}
			customUploadFunction={uploadHandler}
			folderFilter={folderFilter}
			toggleableActive={true}
		/>
	);
}
