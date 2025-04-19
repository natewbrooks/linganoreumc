'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SermonForm from '@/components/sermons/SermonForm';
import { FaArrowLeft } from 'react-icons/fa';

function EditSermon({ id }) {
	const [editData, setEditData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sermons/${id}`)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch sermon');
				return res.json();
			})
			.then((data) => {
				setEditData({
					id: data.id,
					title: data.title,
					description: data.description,
					body: data.body,
					videoURL: data.videoURL,
					publishDate: data.publishDate,
					lastEditDate: data.lastEditDate,
					isArchived: data.isArchived,
				});
			})
			.catch((err) => {
				console.error('Error fetching sermon:', err);
				setError(err.message);
			});
	}, [id]);

	if (error) return <div>Error: {error}</div>;
	if (!editData)
		return (
			<div className={`italic text-center text-sm font-dm text-darkred`}>
				Loading sermon details...
			</div>
		);

	return (
		<div className='flex flex-col w-full min-h-[800px]'>
			<div className='flex space-x-1 items-center justify-between'>
				<h1 className='text-2xl font-dm mb-4'>Edit Sermon</h1>
				<Link
					href={`/sermons/`}
					className='font-dm text-bkg text-md text-end w-fit bg-red px-3 py-1 -skew-x-[30deg]'>
					<div className='flex space-x-1 skew-x-[30deg] items-center hover:opacity-50 hover:scale-[1.02] active:scale-[1]'>
						<FaArrowLeft size={16} />
						<div>Return</div>
					</div>
				</Link>
			</div>
			<SermonForm
				mode='edit'
				initialData={editData}
			/>
		</div>
	);
}

export default EditSermon;
