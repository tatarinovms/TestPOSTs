var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

router.post('/', function(req, res, next) {
console.log('Listening on port 3012...');
logger.debug("Body params: "+JSON.stringify(req.body))
res.status(200);
res.end();
});

module.exports = router;
