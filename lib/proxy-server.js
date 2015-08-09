
var http = require('http');
var emitter = new (require('events').EventEmitter)();

/**
 * Creates a server that will receive incoming request for forwarding
 * @param {number} port: A port for the server
 */
function ProxyServerAsync(port){
	var proxyList=[];
	/**
	 * Registers a proxy on the server
	 * @param {ProxyEntry} proxyEntry: The proxy to register.
	 */
    this.AddProxy = function(proxyEntry){
		
		var prot = require('./proxy-entry');
		if(!(proxyEntry instanceof prot))
			throw new Error('Parameter is not an instance of Proxy.');
		
		//Set an event emitter
		proxyEntry.proxy.on('error', function(proxyErr, req, res) {
			emitter.emit('error',proxyErr,req,res);
		});	
		
        proxyList.push(proxyEntry);
		console.log('Proxy added for destination host ' + proxyEntry.host + ' and port ' + proxyEntry.port);
    }
	
	/**
	 * Exposes the event emmiter for the server.
	 * The available events are
	 * - notFound(req, res): No suitable proxy was found for a request
	 * - error(err, req, res): An error was detected on the pipeline
	 * @param {string} event:
	 * @param {function} callback:
	 */
	this.on = function(event, callback){
		emitter.on(event, callback);
	}
	
	http.createServer(function(req, res) {
		var found=false;
		console.log('Request received for ' + req.headers.host + req.url);
		
		var idx=0;
		(function seqFind(proxyEntry){
			
			proxyEntry.strategy.unregisterFunction(req,res,function(unregErr,unregister){
				if(unregErr)
					return emitter.emit('error',unregErr,req,res);
				
				if(unregister)
					return found=true;
				
				proxyEntry.strategy.registerFunction(req,res,function(regErr,register){
					if(regErr)
						return emitter.emit('error',regErr,req,res);
					
					if(register)
						return found=true;
					
					proxyEntry.strategy.checkFunction(req,res,function(checkErr,check){
						if(checkErr)
							return emitter.emit('error',checkErr,req,res);
						
						if(check){
							//Proxy forwarding
							proxyEntry.proxy.proxyRequest(req, res);		
							
							return found=true;
						}
							
						//Next proxy
						if(++idx < proxyList.length)
							seqFind(proxyList[idx]);
					});
				});
			});
			
		})(proxyList[idx]);
		
		if(!found){
			emitter.emit('notFound',req,res);
		}
		
	}).listen(port);
	console.log('Server created on port ' + port);
}


module.exports = ProxyServerAsync