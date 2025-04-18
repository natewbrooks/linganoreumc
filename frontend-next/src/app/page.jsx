import Home from '@/components/pages/Home';

export const metadata = {
	title: 'Home | Linganore United Methodist Church',
	description:
		'One of the oldest congregation in the Baltimore-Washington Conference of the United Methodist Church with a tradition going back to the 1790s.',
};

export default async function HomePage() {
	return <Home />;
}
