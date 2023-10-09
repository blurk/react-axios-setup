import axios, { AxiosError } from 'axios';
import { getToken, setToken } from '../../services/storage/token';
import { refresh } from '../../services/api/auth';

const apiClient = axios.create({
	baseURL: 'http://localhost:5173',
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

apiClient.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger

		return response;
	},
	async function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		const originalConfig = error.config;

		if (error instanceof AxiosError) {
			if (error.response?.status === 401 && !originalConfig._retry) {
				originalConfig._retry = true;

				try {
					const { token } = await refresh();
					setToken(token.toString());

					apiClient.defaults.headers.common['Authorization'] = token;

					return apiClient(originalConfig);
				} catch (_error) {
					if (_error instanceof AxiosError) {
						if (_error.response && _error.response.data) {
							return Promise.reject(_error.response.data);
						}
					}
				}
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
