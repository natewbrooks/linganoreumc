import React, { useEffect, useState } from 'react';
import SelectImageGrid from '../ui/SelectImageGrid';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';

export default function SelectStainedGlassImages({
	stainedGlassImages = [],
	onChangeStainedGlassImages = () => {},
}) {
	const [availableUploads, setAvailableUploads] = useState([]);
	const { uploadStainedGlassImage } = useHomePageSettings();

	const folderFilter = `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/stained-glass/`;
	const mediaBasePath = `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/images/`;

	useEffect(() => {
		fetch(folderFilter)
			.then((res) => res.json())
			.then((data) => setAvailableUploads(data || []))
			.catch((err) => console.error('Error fetching stained glass uploads:', err));
	}, []);

	const handleStainedGlassImagesChange = (updatedImages) => {
		const normalized = updatedImages.map((img) => {
			const filename = img?.url?.split('/').pop();
			return {
				...img,
				url: filename ? `${mediaBasePath}${filename}` : '',
			};
		});
		onChangeStainedGlassImages(normalized);
	};

	const uploadHandler = async (file) => {
		const uploadedPath = await uploadStainedGlassImage(file);
		if (uploadedPath) {
			const newEntry = { filePath: uploadedPath };
			setAvailableUploads((prev) => [...prev, newEntry]);
			return uploadedPath;
		}
		return null;
	};

	return (
		<SelectImageGrid
			label='Stained Glass Images'
			description={`Selected image determines the active stained glass background.`}
			images={stainedGlassImages}
			onChangeImages={handleStainedGlassImagesChange}
			availableUploads={availableUploads}
			setAvailableUploads={setAvailableUploads}
			customUploadFunction={uploadHandler}
			folderFilter={folderFilter}
			toggleableActive={false}
		/>
	);
}
