
function dummyUnregister(req,res,doneCb){
	doneCb(null,false);
}

function dummyRegister(req,res,doneCb){
	doneCb(null,false);
}

/**
 * Creates a new strategy based on the givven behaviour.
 * The callback must be error-first
 * @param {function} check(req,res): This function must validate if the request is elegible for forwarding
 * @param {function} [register(req,res,doneCb)]: This function is used for registering proxy use, on certain conditions.
 * The callback has the signature doneCb(err,registered)
 * @param {function} [unregister(req,res,doneCb)]: This function is used for unregistering proxy use.
 * The callback has the signature doneCb(err,unregistered) 
 */
function ProxyStrategy(check, register, unregister){
	this.checkFunction = check;
	this.registerFunction = register || dummyRegister;	
	this.unregisterFunction = unregister || dummyUnregister;
}

var util = require('util');
ProxyStrategy.extendTo = function(target){
	util.inherits(target, ProxyStrategy);
}

module.exports = ProxyStrategy;