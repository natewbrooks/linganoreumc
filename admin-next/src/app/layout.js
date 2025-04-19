import './globals.css';
import ClientProviders from '@/contexts/ClientProviders';

export const metadata = {
	title: 'Admin | Linganore United Methodist Church',
	description: 'Linganore United Methodist Church Admin',
};

export default async function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				<ClientProviders>{children}</ClientProviders>
			</body>
		</html>
	);
}
