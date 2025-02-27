import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRoute from './routes/events.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRoute);

app.get('/', (req, res) => {
	res.send('hello');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
