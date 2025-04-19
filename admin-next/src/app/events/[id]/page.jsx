import EditEvent from '@/components/pages/maintenance/events/EditEvent';

export default async function EditEventPage({ params }) {
	const { id } = await params;
	return <EditEvent id={id} />;
}
