import { API_URL_USER } from '../../common/constants';
import { User } from '../../common/types';
import apiClient from '../../libs/axios';

export const fetchUserProfile = async (): Promise<User> => {
	const res = await apiClient.get(API_URL_USER);
	return res.data;
};
