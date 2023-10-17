import axios, { AxiosError } from 'axios';
import { getToken, setToken } from '../../services/storage/token';
import { refresh } from '../../services/api/auth';

const apiClient = axios.create({
	baseURL: 'http://localhost:3000',
	headers: {
		Authorization: getToken() ?? ''
	}
});

apiClient.interceptors.request.use(
	function (config) {
		// Add jwt key
		config.headers['Authorization'] = getToken() ?? '';
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

let isRefreshing = false;
let failedQueue: { resolve: (value: string) => void; reject: (value: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string = '') => {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(token);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.response.use(
	function onFullfilled(response) {
		// Any status code that lie within the range of 2xx cause this function to trigger

		return response;
	},
	async function onRejected(error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		const originalConfig = error.config;

		if (error instanceof AxiosError) {
			if (error.response?.status === 401 && !originalConfig._retry) {
				if (isRefreshing) {
					return new Promise(function (resolve, reject) {
						failedQueue.push({ resolve, reject });
					})
						.then(function failedRequestResolve(token) {
							originalConfig.headers['Authorization'] = token;
							return apiClient(originalConfig);
						})
						.catch(function failedRequestReject(err) {
							return Promise.reject(err);
						});
				}

				originalConfig._retry = true;
				isRefreshing = true;

				try {
					const { token } = await refresh();
					setToken(token.toString());

					apiClient.defaults.headers.common['Authorization'] = token;

					processQueue(null, token.toString());
					return apiClient(originalConfig);
				} catch (_error) {
					if (_error instanceof AxiosError) {
						if (_error.response && _error.response.data) {
							processQueue(_error, '');

							return Promise.reject(_error.response.data);
						}
					}
				} finally {
					isRefreshing = false;
				}
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
