import { useState, useEffect } from 'react';
import { login } from './services/api/auth';
import { fetchUserProfile } from './services/api/user';
import { getToken, removeToken, setToken } from './services/storage/token';

function App() {
	const [userName, setUserName] = useState<null | string>(null);

	const [isLogin, setIsLogin] = useState(() => (getToken() ? true : false));

	const onLogin = () => {
		login()
			.then(({ token }) => {
				setToken(token.toString());
				setIsLogin(true);
			})
			.catch(console.log);
	};

	const onLogout = async () => {
		removeToken();
		setIsLogin(false);
		setUserName(null);
	};

	useEffect(() => {
		if (isLogin) {
			fetchUserProfile()
				.then((user) => {
					setUserName(user.user_name);
				})
				.catch(console.error);
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
						<button onClick={onLogout}>Log out</button>
					</>
				) : (
					<button onClick={onLogin}>Login</button>
				)}
			</section>
		</>
	);
}

export default App;
