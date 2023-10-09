import { rest } from 'msw';

const ONE_MINUTE = 60 * 1000;

export const handlers = [
	rest.post('/login', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				token: Date.now() + ONE_MINUTE * 2
			})
		);
	}),

	rest.get('/user', (req, res, ctx) => {
		const expired = req.headers.get('authorization');

		let isAuthenticated = false;

		if (expired) {
			isAuthenticated = Number(expired) > Date.now();
		}

		if (!isAuthenticated) {
			return res(
				ctx.status(401),
				ctx.json({
					errorMessage: 'Not authorized'
				})
			);
		}

		return res(
			ctx.status(200),
			ctx.json({
				user_name: 'V'
			})
		);
	})
];
