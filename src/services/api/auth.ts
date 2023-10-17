import { API_URL_LOGIN, API_URL_REFRESH_TOKEN } from '../../common/constants';
import apiClient from '../../libs/axios';

export const login = async () => {
	const res = await apiClient.post<{ token: number }>(API_URL_LOGIN);
	return res.data;
};

export const refresh = async () => {
	const res = await apiClient.post<{ token: number }>(API_URL_REFRESH_TOKEN);
	return res.data;
};
