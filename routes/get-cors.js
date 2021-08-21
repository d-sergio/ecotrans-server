const config = require('../config/config.json');
const checkOrigin = require('./check-origin');

/**Допустимые origin */
function getCors(req, callback) {
    const isAllowed = checkOrigin(req);

    corsOptions = {
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        origin: isAllowed
    }

    callback(null, corsOptions)
}

module.exports = getCors;