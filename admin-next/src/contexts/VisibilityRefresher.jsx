'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VisibilityRefresher() {
	const router = useRouter();

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				router.refresh();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, []);

	return null;
}
