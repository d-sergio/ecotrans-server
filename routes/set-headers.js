const checkOrigin = require('./check-origin');
const config = require('../config/config.json');

async function setHeaders(req, res, next) {
    const isAllowed = checkOrigin(req);

    /*Источник отсутствует в списке разрешённых? */
    if (!isAllowed) {
        res.status(403).end();

        return;
    }

    res.set(config.headers);

    next();
}

module.exports = setHeaders;