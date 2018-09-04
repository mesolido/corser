
	// Cross-browser extension API
chrome = chrome != null ? chrome : browser;
	
	// HTTP requests headers to record
var corsRequestHeaders = {
	"origin": "",
	"access-control-request-method": "",
	"access-control-request-headers": ""
};
	
	// HTTP responses headers to modify
var corsResponseHeaders = {
	"access-control-allow-origin": "",
	"access-control-allow-method": "",
	"access-control-allow-headers": "",
	"access-control-allow-credentials": "true"
}
	
	// Global object to keep track of HTTP requests
var savedRequestsHeaders = {};


	// Intercepting HTTP requests headers
chrome.webRequest.onBeforeSendHeaders.addListener(requestListener, {
   urls: ["<all_urls>"],
   types: ["xmlhttprequest"]
}, ["blocking", "requestHeaders"]);

	
	// Manipulating HTTP request headers
var requestListener = function(details){
	var lcorsHeaders = {}
	var newRequestHeaders = []
	for (let header of details.requestHeaders) {
  		if (header.name.toLowerCase() in corsRequestHeaders) {
  			lcorsHeaders[header.name.toLowerCase()] = header.value;
  		}
	}
	if("origin" in lcorsHeaders){
		savedRequestsHeaders[details.requestId] = lcorsHeaders
	}
	return {
        requestHeaders: details.requestHeaders
    };
}


	// Intercepting HTTP response headers
chrome.webRequest.onHeadersReceived.addListener(responseListener, {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"]
}, ["blocking", "responseHeaders"]);


	
	// Manipulating HTTP response headers
var responseListener = function(details){
	if(details.requestId in savedRequestsHeaders){
		let newResponseHeaders = []
		for(let header of details.responseHeaders){
			if(!(header.name.toLowerCase() in corsResponseHeaders)){
				newResponseHeaders.push(header)
			}
		}
		for(let header in savedRequestsHeaders[details.requestId]){
			switch(header){
				case "origin":
					newResponseHeaders.push({
						name: "Access-Control-Allow-Origin", 
						value: savedRequestsHeaders[details.requestId][header]
					});
					break;
				case "access-control-request-method":
					newResponseHeaders.push({
						name: "Access-Control-Allow-Methods", 
						value: savedRequestsHeaders[details.requestId][header]
					});
					break;
				case "access-control-request-headers":
					newResponseHeaders.push({
						name: "Access-Control-Allow-Headers", 
						value: savedRequestsHeaders[details.requestId][header]
					});
					break;
				default:
					break;
			}
		}
		newResponseHeaders.push({
			name: "Access-Control-Allow-Credentials", 
			value: "true"
		});
		details.responseHeaders = newResponseHeaders
		delete savedRequestsHeaders[details.requestId]
	}
	return {
		responseHeaders: details.responseHeaders
	}
}
