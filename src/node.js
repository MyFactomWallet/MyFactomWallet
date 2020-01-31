const fetch = require('node-fetch');
const data = {
	jsonrpc: '2.0',
	id: 0,
	method: 'directory-block-head',
};

const openNodeUrl = 'https://api.factomd.net/v2';

const getHeight = async () => {
	await fetch(openNodeUrl, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((response) => {
			console.log(`in getHeight(): ${response.result.keymr}`);
			return response.result.keymr;
		});
};

const result = getHeight();
console.log(`outside function: ${result}`);
