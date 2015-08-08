var snp = require('simple-node-proxy');
var host = '127.0.0.1';

//Creates the server
var server = new snp.Server(8080),
	//Creates a strategy based on a cookie
	strat = new snp.Strategy.Cookie({
		cookieName:'MYAPPCOOKIE',
		cookieValue:'MYAPPVALUE',
		registerUrl:'/registerapp',
		unregisterUrl:'/unregisterapp',
		cookiePath:'/',
		//Redirects on successful register
		redirectOnRegisterUrl:'/'
	});
	
//Redirects for host 127.0.0.1 and port 8081
var entry = new snp.Proxy(host, 8081, strat);
//Adds the proxy to the server
server.AddProxy(entry);

//Sets the event listeners
server.on('notFound',function(req,res){
	res.writeHead(404);
	res.end('Not found');
});
server.on('error',function(err, req, res){
	if (err) console.log(err);
	res.writeHead(500);
	res.end('Oops, something went very wrong...');
});

