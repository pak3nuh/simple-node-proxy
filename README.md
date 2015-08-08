# simple-node-proxy
A proxy designed for redirecting http resquests for multiple standalone apps

As a NodeJs enthusiast I've made multiple apps using this technology. The problem came when I decided to publish this apps on my server and have only one entry point.

This node library allows for creating a first level server, listening to a specific port, and redirects the requests based on the defined strategies.

#Proxy server
This is the first level server, the actual proxy. It listen to the requests and forwards it to the destination host if it matches any of the strategies defined.

# Strategy
A strategy is the means of interpreting the request and forwar
