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
Lines 25-28 shows how to intercept HTTP requests by registering a listener or handler for the \onBeforeSendHeaders\ event. The extension intercepts all  (<code>&lt;all_urls&gt;</code>) headers (<code>requestHeaders</code>) of AJAX requests (type <code>xmlhttprequest</code>). The <code>requestListener</code> argument is a callback function or handler that will be invoked to manipulate the requests headers. Its definition is shown from Lines 32 to 46. 
In this function, we simply record the values of any CORS request header found in the cross-origin request (Lines 36-38).
The recorded request headers are then associated to the request unique identifier and saved in the global object <code>savedRequestsHeaders</code> (Line 41).

<h2>Intercepting HTTP responses</h2>
To safely modify HTTP response headers, one can do so by registering a listener for the <code>onHeadersReceived</code> event, as shown from Lines 50-53.
Headers of responses to AJAX requests will be provided to the <code>responseListener</code> callback function, which is defined from Lines 58-100.
If the request was a cross-origin request, it means that we have previously saved its CORS requests headers. So, we use the request identifier in the response object to link to the CORS request headers previously saved in a global variable (Line 59). 
Then, to make the CORS request successfull, we start by removing any CORS response headers returned by the web server (Lines 61-65), among those that will be modified or added. Then, for each recorded request header, we add its dual response header by setting the appropriate values: the <code>Access-Control-Allow-Origin</code> header is added and set the value the recorded <code>Origin</code> header (Lines 68-73); the <code>Access-Control-Allow-Headers</code> header is added and assigned the value of the recorded <code>Access-Control-Request-Headers</code> header (Lines 74-79); the <code>Access-Control-Allow-Method</code> is added and set the value of the recorded <code>Access-Control-Request-Method</code> request; finally we add the <code>Access-Control-Allow-Credentials</code> response header, assigning it the value <code>true</code> (Lines 90-93). 

After manipulating the response headers, we remove the recorded request headers from the global object <code>savedRequestsHeaders</code> (Line 95) and return the new response headers (Lines 97-99). (To be more precise, we could have removed the recorded request headers in the <code>onCompleted</code> (See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest ).


These modifications successfully authorize unauthorized CORS requests. % requests always successfull. 

One can download the extension, custom, deploy and test it (in developer mode).

One can also directly install the public version of <strong>CORSER</strong> available on Chrome ( https://chrome.google.com/webstore/detail/corser/elgclnafddmkhhnhlfgfahgbahkginga ), Firefox ( https://addons.mozilla.org/en-US/firefox/addon/corser-addon/ ) and Opera ( https://addons.opera.com/en/extensions/details/corser-authorize-cors-requests/ ). 

Use it for testing purposes only
