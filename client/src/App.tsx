import GoogleLoginButton from './components/GoogleLoginButton';
import TestApiCall from './components/TestApiCall';

function App() {
	return (
		<div>
			<GoogleLoginButton />
			<TestApiCall url={'http://localhost:5000/matches/'} />
		</div>
	);
}

export default App;
