import React, { useEffect, useState } from 'react';
import { useHomePageSettings } from '../../contexts/HomepageSettingsContext';
import SelectImageSingle from '../ui/SelectImageSingle';

export default function SelectJoinUsImage({ joinUsSermonImageURL = '', onChangeImage = () => {} }) {
	const [availableUploads, setAvailableUploads] = useState([]);
	const { uploadHeaderImage } = useHomePageSettings();

	const folderFilter = '/api/media/images/';
	const mediaBasePath = '/api/media/images/';

	useEffect(() => {
		fetch(folderFilter)
			.then((res) => res.json())
			.then((data) => setAvailableUploads(data || []))
			.catch((err) => console.error('Error fetching Join Us image uploads:', err));
	}, []);

	const uploadHandler = async (file) => {
		const uploadedPath = await uploadHeaderImage(file);
		if (uploadedPath) {
			setAvailableUploads((prev) => [...prev, { filePath: uploadedPath }]);
			return uploadedPath;
		}
		return null;
	};

	return (
		<div className={`w-[300px]`}>
			<SelectImageSingle
				label='Join Us Image'
				image={{ url: joinUsSermonImageURL }}
				onChangeImage={(img) => onChangeImage(img.url)}
				availableUploads={availableUploads}
				setAvailableUploads={setAvailableUploads}
				customUploadFunction={uploadHandler}
				folderFilter={folderFilter}
			/>
		</div>
	);
}
