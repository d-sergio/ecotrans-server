const config = require('../config/config.json');

/*Origin есть в списке? */
function checkOrigin(req) {
    const allowlist = config.cors.origin;

    const isAllowed = allowlist.indexOf(req.header('Origin')) !== -1;
    
    return isAllowed;
}

module.exports = checkOrigin;