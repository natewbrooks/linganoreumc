import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
	const token = req.header('Authorization');
	if (!token) return res.status(403).json({ error: 'No token provided' });

	try {
		const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
		if (!decoded.isAdmin) return res.status(403).json({ error: 'Admins only' });

		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

export default verifyAdmin;
