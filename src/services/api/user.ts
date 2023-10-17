import { API_URL_USER, API_URL_USERS } from '../../common/constants';
import { User } from '../../common/types';
import apiClient from '../../libs/axios';

export const fetchUserProfile = async (): Promise<User> => {
	const res = await apiClient.get(API_URL_USER);
	return res.data;
};

export const fetchUsers = async (): Promise<User[]> => {
	const res = await apiClient.get(API_URL_USERS);
	return res.data;
};
