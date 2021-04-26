import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactElement, MouseEvent } from 'react';

interface Props {
	url: string;
}
const TestApiButton: FC<Props> = ({ url }): ReactElement => {
	const makeApiCall = async (url: string) => {
		console.log('calling api');
		let response = await fetch(url, {
			method: 'GET',
			credentials: 'include',
		});
		console.log(response.json());
	};
	return (
		<>
			<button onClick={(e) => makeApiCall(url)}>Test Api</button>
		</>
	);
};

export default TestApiButton;
