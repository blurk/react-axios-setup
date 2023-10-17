import { PathParams, RestRequest, rest } from 'msw';

const ONE_SECOND = 1000;
const EXPIRED_TIME = ONE_SECOND;

function userAuthenticate(req: RestRequest<never, PathParams<string>>): boolean {
	const expired = req.headers.get('authorization');

	let isAuthenticated = false;

	if (expired) {
		isAuthenticated = Number(expired) > Date.now();
	}

	return isAuthenticated;
}

export const handlers = [
	rest.post('/login', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				token: Date.now() + EXPIRED_TIME
			})
		);
	}),

	rest.post('/refresh', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				token: Date.now() + EXPIRED_TIME
			})
		);
	}),

	rest.get('/user', (req, res, ctx) => {
		const isAuthenticated = userAuthenticate(req);

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
	}),

	rest.get('/users', (req, res, ctx) => {
		const isAuthenticated = userAuthenticate(req);

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
			ctx.json([
				{
					user_name: 'V'
				},
				{
					user_name: 'I'
				},
				{
					user_name: 'S'
				}
			])
		);
	})
];
