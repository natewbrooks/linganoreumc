import Loader from '@/components/ui/Loader';

/** Shown instantly on navigation while the page renders on the server */
export default function Loading() {
	return <Loader label='Loading sermon…' />;
}
