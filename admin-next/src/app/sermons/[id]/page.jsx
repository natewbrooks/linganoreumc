import EditSermon from '@/components/pages/maintenance/sermons/EditSermon';

export default async function EditSermonPage({ params }) {
	const { id } = await params;
	return <EditSermon id={id} />;
}
