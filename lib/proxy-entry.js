var httpProxy = require('http-proxy')
var strat = require('./strategies/proxy-strategy');

/**
 * @param {string} name: Name of the entry
 * @param {string} uri: Detination URI
 * @param {number} port: Detination port
 * @param {strategy} strategy: Proxy strategy for proxy matching and registering
 */
function ProxyEntry(host, port, strategy) {
	if(!(strategy instanceof strat))
		throw new Error('Strategy paramenter must be an instance of ProxyStrategy');
	
	this.host=host;
	this.port=port;
	
	this.strategy = strategy;
	
	this.proxy = new httpProxy.createProxyServer({
		target: {
			host: host,
			port: port
		}
	});
}

module.exports=ProxyEntry;