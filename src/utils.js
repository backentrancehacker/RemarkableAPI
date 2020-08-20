const query = params => {
	const esc = encodeURIComponent;
	return Object.keys(params)
		.map(k => `${esc(k)}=${esc(params[k])}`)
		.join('&');
}

const resources = () => {
	return [
		'https://github.com/jmptable/remarkable-tablet-api',
		'https://my.remarkable.com/',
		'https://github.com/Ogdentrod/reMarkable-typescript',
		'https://github.com/splitbrain/ReMarkableAPI',
		'https://jackbergus.github.io/2017-11-09-hacking-reMarkable/',
		'https://github.com/canselcik/libremarkable',
		'https://github.com/reHackable/awesome-reMarkable'
	];
}

module.exports = {
	query,
	resources
}