
var expt={}
expt.Server = require('./lib/proxy-server');
expt.Proxy = require('./lib/proxy-entry');
expt.Strategy = require('./lib/strategies/proxy-strategy');
expt.Strategy.Cookie = require('./lib/strategies/cookie-strategy')
expt.Strategy.HostName = require('./lib/strategies/hostname-strategy')
	

module.exports = expt;