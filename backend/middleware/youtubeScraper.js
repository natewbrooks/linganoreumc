import { YoutubeTranscript } from 'youtube-transcript';
import he from 'he';

function getYouTubeVideoID(url) {
	const regex = /(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

export async function fetchTranscript(videoURL) {
	const videoID = getYouTubeVideoID(videoURL);
	if (!videoID) return '';

	try {
		const transcriptArray = await YoutubeTranscript.fetchTranscript(videoID);
		const rawText = transcriptArray.map((item) => item.text).join(' ');
		const decodedText = he.decode(he.decode(rawText));
		return decodedText;
	} catch (err) {
		console.warn('Transcript fetch failed:', err.message);
		return '';
	}
}

export async function fetchVideoMetadata(videoURL) {
	const res = await fetch(videoURL);
	const html = await res.text();

	const titleMatch = html.match(/<title>(.*?)<\/title>/);
	const descMatch = html.match(/"shortDescription":"(.*?)"/);
	const dateMatch = html.match(/"publishDate":"(.*?)"/);

	const titleRaw = titleMatch ? titleMatch[1].replace(' - YouTube', '') : '';
	const descriptionRaw = descMatch ? JSON.parse(`"${descMatch[1]}"`) : '';
	const publishDate = dateMatch ? dateMatch[1] : null;

	// Decode title and description
	const title = he.decode(he.decode(titleRaw));
	const description = he.decode(he.decode(descriptionRaw));

	return { title, description, publishDate };
}
