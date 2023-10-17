import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { login } from './services/api/auth';
import { fetchUserProfile, fetchUsers } from './services/api/user';
import { getToken, removeToken, setToken } from './services/storage/token';
import { User } from './common/types';

const fetchData = (
	setUserName: Dispatch<SetStateAction<string | null>>,
	setUsers: Dispatch<SetStateAction<User[] | null>>
) => {
	fetchUserProfile()
		.then((user) => {
			setUserName(user.user_name);
		})
		.catch(console.error);

	fetchUsers()
		.then((users) => {
			setUsers(users);
		})
		.catch(console.error);
};

function App() {
	const [userName, setUserName] = useState<null | string>(null);
	const [users, setUsers] = useState<null | User[]>(null);

	const [isLogin, setIsLogin] = useState(() => (getToken() ? true : false));

	const onLogin = () => {
		login()
			.then(({ token }) => {
				setToken(token.toString());
				setIsLogin(true);
			})
			.catch(console.log);
	};

	const onLogout = () => {
		removeToken();
		setIsLogin(false);
		setUserName(null);
		setUsers(null);
	};

	const onRefetch = () => {
		fetchData(setUserName, setUsers);
	};

	useEffect(() => {
		if (isLogin) {
			fetchData(setUserName, setUsers);
		}
	}, [isLogin]);

	return (
		<>
			<h1>React and axios: Refresh token</h1>

			<section>
				{isLogin ? (
					<>
						<p>
							Hello, <strong>{userName}</strong>
						</p>
						<div>
							<h3>User List</h3>
							<ul>
								{users ? (
									users.map((u, index) => {
										return <li key={index}>{u.user_name}</li>;
									})
								) : (
									<p>No user.</p>
								)}
							</ul>
						</div>
						<button onClick={onLogout}>Log out</button> <button onClick={onRefetch}>Refetch</button>
					</>
				) : (
					<button onClick={onLogin}>Login</button>
				)}
			</section>
		</>
	);
}

export default App;
