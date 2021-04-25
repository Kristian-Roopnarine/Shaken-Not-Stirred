import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
const { REACT_APP_GOOGLE_CLIENT_ID } = process.env;

async function sendTokenToBackend(url: string, token: string) {
	const data = {
		token,
	};
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	return response.json();
}

async function authTest(url: string) {
	const response = await fetch(url, { credentials: 'include', method: 'GET' });
}

function onSignin(googleUser: GoogleLoginResponse) {
	let id_token = googleUser.getAuthResponse().id_token;

	let response = sendTokenToBackend('http://localhost:5000/auth/login', id_token);
}
function GoogleLoginButton() {
	const successResponse = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		onSignin(res as GoogleLoginResponse);
	};

	const failureResponse = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		console.log(res);
	};

	return (
		<>
			<GoogleLogin
				clientId={REACT_APP_GOOGLE_CLIENT_ID!}
				buttonText="Signin with Google"
				onSuccess={successResponse}
				onFailure={failureResponse}
				cookiePolicy={'single_host_origin'}
			/>
			<button onClick={(e) => authTest('http://localhost:5000/auth/me')}>Test if you're logged in</button>
		</>
	);
}

export default GoogleLoginButton;
