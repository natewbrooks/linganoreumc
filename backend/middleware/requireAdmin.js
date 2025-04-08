export const requireAdmin = (req, res, next) => {
	if (req.user?.role !== 'admin') {
		return res.status(404).json({ error: 'Not found' }); // returns 404 to non-admins
	}
	next();
};
