'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RequireAuth({ children }) {
	const { isAuthenticated, loading } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			const onLoginPage = pathname === '/login';

			if (!isAuthenticated && !onLoginPage) {
				router.replace('/login');
			}

			if (isAuthenticated && onLoginPage) {
				router.replace('/settings/general/');
			}
		}
	}, [isAuthenticated, loading, pathname, router]);

	if (loading) return null; // or a loading spinner

	return children;
}
