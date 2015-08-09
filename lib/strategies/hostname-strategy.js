var strat = require('./proxy-strategy');
var util = require('util');

/**
 * Checks if the request host matches any of the hostnames provided. If so, indicates it shold be forwarded.
 * @param {array} hostArray: The array containin the host header names to match. 
 */
function HostHeaderNameStrategy(hostArray){
	if(!Array.isArray(hostArray) || hostArray.length==0)
		throw new TypeError('Parameter must be an array and contain at least one item.');
	
	function check(req,res,doneCb){
		var reqHost = req.headers.host.toLowerCase();
		for (var i=0; i<hostArray.length; i++){
			if(hostArray[i].toLowerCase() == reqHost)
				return doneCb(null, true);
		}
		return doneCb(null,false);
	}
	
	HostHeaderNameStrategy.super_.call(this, check);
}

strat.extendTo(HostHeaderNameStrategy);

module.exports = HostHeaderNameStrategy;