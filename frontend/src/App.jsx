import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
	const [message, setMessage] = useState('');

	useEffect(() => {
		axios
			.get('/api')
			.then((res) => setMessage(res.data))
			.catch((err) => console.error(err));
	}, []);

	return <h1>{message}</h1>;
}

export default App;
