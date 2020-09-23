const tor = require('../../lib/tor');

module.exports = (req, res) => {
	let title = 'Top nodes by consensus weight';
	const query = {
		limit: 10
	};
	if (req.query.listing.startsWith("s")) {
		title = `Search results for "${req.query.listing.substr(1)}":`;
		query.search = req.query.listing.substr(1);
	} else {
		query.order = '-consensus_weight';
		query.running = true;
	}
	if (req.query.listing.startsWith("p")) {
		query.offset = (query.limit * req.query.listing.substr(1)) - query.limit;
	}

	tor.listNodes(query)
		.then(nodes => {
		res.send(nodes)
		}
		)
};
