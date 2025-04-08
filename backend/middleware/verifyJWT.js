import { expressjwt } from 'express-jwt';

const verifyJWT = expressjwt({
	secret: process.env.JWT_SECRET || 'secret',
	algorithms: ['HS256'],
	requestProperty: 'user',
	getToken: (req) => {
		if (req.cookies && req.cookies.token) return req.cookies.token;
		if (req.headers.authorization?.startsWith('Bearer ')) {
			return req.headers.authorization.split(' ')[1];
		}
		return null;
	},
});

export default verifyJWT;
