var strat = require('./proxy-strategy');
var util = require('util');

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

/**
 * Options object defaults
 */
function setDefaultOptions(userOptn){
    if(typeof(userOptn)!='object')
        userOptn={};
    
    userOptn.cookieName || 'cookieName';
    userOptn.cookieValue || 'cookieValue';
    userOptn.registerUrl || '/register';
    userOptn.unregisterUrl || '/unregister';
    userOptn.cookiePath || '/';
}

/**
 * Gets the set cookie string
 * @Param {object} userOptn: The configuration object
 */
function getCookieString(userOptn, req){
    //If domain not set assumes the one from the request
    var cDomain = userOptn.cookieDomain || req.headers.host.split(':')[0];
            
    var str = util.format('%s=%s; Domain=%s; Path=%s; HttpOnly', userOptn.cookieName
        ,userOptn.cookieValue, cDomain, userOptn.cookiePath)
    
    if(userOptn.expires){
        var dt = new Date(userOptn.expires);
        if(!util.isDate(dt))
            throw new Error('Not a valid expiration date.');
        
        str+='; Expires=' + dt.toString();
    }
    
    return str;    
}

/**
 * Defines a new strategy based on a domain cookie
 * @param {object} userOptn: Object with the proxy configuration. Has the following keys
 *  - cookieName The name of the cookie to store
 *  - cookieValue The value for the validation process
 *  - registerUrl The URL used to register the cookie, must not be used on the destination app
 *  - unregisterUrl The URL used to delete the cookie, must not be used on the destination app
 *  - cookiePath The path for the cookie to be set
 *  - cookieDomain The domain where the cookie will be stored. If not set, assumes the host on the register process. For localhost set 127.0.0.1
 *  - redirectOnRegisterUrl If defined, returns 303 status and redirects to URL, else returns 200
 *  - redirectOnUnregisterUrl If defined, returns 303 status and redirects to URL, else returns 200
 *  - expires If defined, must be a string representation on a date for the cookie expiration, else the cookie is set for one session
 */
function CookieStrategy(userOptn){
    setDefaultOptions(userOptn);
    
    function check(req,res,doneCb){
    	if(req.cookieObj[userOptn.cookieName])
    		return doneCb(null, req.cookieObj[userOptn.cookieName] == userOptn.cookieValue);
        
        doneCb(null,false);
    }
    function register(req,res,doneCb){
        
        if(req.url.toLowerCase() == userOptn.registerUrl.toLowerCase())
    	{
    		var cookieval = getCookieString(userOptn, req);
    		
            var resStatus = userOptn.redirectOnRegisterUrl ? 303 : 200;
            var headers = {
    			'Set-Cookie': cookieval,
        		'Content-Type': 'text/plain'
    		}
            if(userOptn.redirectOnRegisterUrl)
                headers.Location = userOptn.redirectOnRegisterUrl;
            		
    		res.writeHead(resStatus,headers);
    		res.end('Setup complete');
            return doneCb(null,true);
    	}
        return doneCb(null,false);
    }
    function unregister(req,res,doneCb){
        req.cookieObj = parseCookies(req);
        
        if(!req.cookieObj[userOptn.cookieName])
            return doneCb(null,false);
        
        if(req.url.toLowerCase() == userOptn.unregisterUrl.toLowerCase()){
            var bu = userOptn.expires;
            userOptn.expires = 'Thu, 01-Jan-1970 00:00:01 GMT';
            var cookieval = getCookieString(userOptn, req);
            userOptn.expires = bu;
            
            
            var headers = {
    			'Set-Cookie': cookieval,
        		'Content-Type': 'text/plain'
    		}
            var resStatus = userOptn.redirectOnUnregisterUrl ? 303 : 200;
            if(userOptn.redirectOnUnregisterUrl)
                headers.Location = userOptn.redirectOnUnregisterUrl;
            
            res.writeHead(resStatus,headers);
    		res.end('Unregister complete');
            return doneCb(null,true);
        }
        return doneCb(null,false);
    }
    
    CookieStrategy.super_.call(this, check, register, unregister);
}

/**
 * Enforces prototyping for validation
 */
strat.extendTo(CookieStrategy);

module.exports = CookieStrategy;