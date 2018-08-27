# Corser
Cross-browser extension for authorizing cross-origin resource sharing (CORS) requests.
This extension can be installed on browsers supporting the WebExtensions API (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

It intercepts all CORS requests and responses headers, and records/adds/changes their values so as to authorized unauthorized CORS requests.
Use this extension only for testing purposes


Following are the main features of the <strong>CORSER</strong> extension. It starts with the definition of different objects, in particular the list of CORS requests that are recorded (Lines 6-10), and response headers that will be changed or added to make any CORS request successfull (Lines 13-18). Then we define a global object <code>savedRequestHeaders</code> in which intercepted CORS request headers will be saved (Line 21). 

To manipulate HTTP headers, one has to register handlers (listeners) for events triggered by HTTP communications between web pages and web servers. 
Each HTTP request that is intercepted in extensions go through a set of stages with dedicated events that can be listened, in order to take different actions on the HTTP headers ( https://developer.chrome.com/extensions/webRequest - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest ). The request is assigned a unique identifier (Line 41), that remains the same at the different stages of the request. The response to the request is also assigned the same identifier. This helps to link a request to its response. Even in the case of preflighted requests, the two sequential requests and their responses are considered a single request and thus assigned the same identifier. 

<h2>Intercepting HTTP requests</h2>
The handler of the <code>onBeforeSendHeaders</code> event is the right place where to intercept and modify HTTP requests.
Lines 25-28 shows how to intercept HTTP requests by registering a listener or handler for the \onBeforeSendHeaders\ event. The extension intercepts all  (<code>&lt;all_url&gt;</code>) headers (<code>requestHeaders</code>) of AJAX requests (type <code>xmlhttprequest</code>). The <code>requestListener</code> argument is a callback function or handler that will be invoked to manipulate the requests headers. Its definition is shown from Lines 32 to 46. 
