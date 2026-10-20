'use client';
import { useEffect } from 'react';

const RELOAD_KEY = 'lumc-error-reload';

/**
 * Replaces Next's raw "Application error" screen. Most failures are a flaky network
 * load, so reload once automatically, then fall back to a friendly retry button.
 */
export default function GlobalError({ error }) {
	useEffect(() => {
		console.error(error);
		try {
			const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
			// Only auto-reload once per minute so a persistent error can't loop
			if (Date.now() - last > 60_000) {
				sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
				window.location.reload();
			}
		} catch {
			// Storage unavailable, leave the retry button
		}
	}, [error]);

	return (
		<html lang='en'>
			<body
				style={{
					margin: 0,
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '24px',
					padding: '24px',
					background: '#FFF8EF',
					color: '#47121A',
					fontFamily: 'Georgia, serif',
					textAlign: 'center',
				}}>
				<div style={{ fontSize: '28px' }}>Linganore United Methodist Church</div>
				<div style={{ fontSize: '20px' }}>The page didn&apos;t finish loading.</div>
				<button
					onClick={() => window.location.reload()}
					style={{
						fontSize: '22px',
						padding: '14px 36px',
						background: '#AD2C3F',
						color: '#FFF8EF',
						border: 'none',
						cursor: 'pointer',
					}}>
					Tap here to try again
				</button>
			</body>
		</html>
	);
}
