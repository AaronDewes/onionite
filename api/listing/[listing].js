const tor = require('../../lib/tor');

module.exports = (req, res) => {
  res.send(req.query)
};
