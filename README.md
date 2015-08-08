# simple-node-proxy
A proxy designed for redirecting http resquests for multiple standalone apps

As a NodeJs enthusiast I've made multiple apps using this technology. The problem came when I decided to publish this apps on my server and have only one entry point.

This node library allows for creating a first level server, listening to a specific port, and redirects the requests based on the defined strategies.

#Proxy server
This is the first level server, the actual proxy. It listen to the requests and forwards it to the destination host if it matches any of the strategies defined.
```javascript
var snp = require('simple-node-proxy');
var server = new snp.Server(8080);
```

#Proxy Entry
An entry represents the forwarding information, the host and the port, as well as the strategy used for identifying the desired requests.
```javascript
var snp = require('simple-node-proxy');
var entry = new snp.Proxy(host, 8081, strategy);
```

# Strategy
A strategy is the means of interpreting the request and forwarding it if necessary. It relies on 3 functions, a mandatory `checkFunction` that verifies if it should redirect, and 2 optional `registerFunction` and `unregisterFunction` used for some strategies like cokkies.
```javascript
var snp = require('simple-node-proxy');
var strategy = new snp.Strategy.Cookie({
	cookieName:'MYAPPCOOKIE',
	cookieValue:'MYAPPVALUE',
	registerUrl:'/registerapp',
	unregisterUrl:'/unregisterapp',
	cookiePath:'/',
	//Redirects on successful register
	redirectOnRegisterUrl:'/'	
});
```

Strategies are modular meaning you can create your own strategies and have multiple different ones on the same server.

You can see a full example [here](https://github.com/pak3nuh/simple-node-proxy/blob/master/example/app.js)
