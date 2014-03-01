Analytics for Node.js HTTP APIs
==========
[Tweet](https://twitter.com/home?status=Google%20Analytics%20for%20Node.js%20HTTP%20APIs%20http://github.com/tjanczuk/nodalytics%20via%20@tjanczuk%20%23nodejs%20%23webapi%20%23http) [Google Plus](https://plus.google.com/share?url=http://github.com/tjanczuk/nodalytics) [Facebook](https://www.facebook.com/sharer/sharer.php?u=http://github.com/tjanczuk/nodalytics)

*Nodalytics* hooks up Google Analytics to your server side HTTP APIs in Node.js. With one line of code you can capture and analyze statistical information about HTTP calls being made to your HTTP service: 

* What endpoints are called?
* What HTTP verbs are used?
* What are the query string parameters?
* What user agents are calling your APIs?
* Where are the calls originating from?
* How many new and repeated callers do you have?

The *nodalytics* module uses [Google Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/) to communicate directly with Google Analytics from your server. Unlike with Google Analytics for web sites or mobile applications, this is useful when you wither can't or don't want to control the client side code.

## Getting started

First, create a Google Analytics account and a property under this account you will use to track calls to your HTTP APIs. When asked about the type of the property (*web* or *mobile*), choose *web*. Your property will be assigned a property ID, for example `UA-44126622-6`. 

Install the *nodalytics* module from NPM:

```
npm install nodalytics
```

Then use it as connect middleware in your minimalist express.js application, and specify the Google Analytics property id as a parameter:

```javascript
var express = require('express')
  , nodalytics = require('nodalytics')

var app = express();

app.use(nodalytics('UA-44126622-6'));

app.all('*', function (req, res) {
	res.send('Hello!');
});

app.listen(3000);
```

You are done. Every time an HTTP call is received by your service, appropriate event will be logged to your Google Analytics property. To verify, open your Google Analytics dashboard, go to *Real Time* | *Events* report, then start your server and issue a few requests against it:

```
node app.js &
curl http://localhost:3000/foo?a=1
curl http://localhost:3000/bar?b=1
curl http://localhost:3000/baz -d somedata
```

You should see the Google Analytics events showing up in real time in the dashboard (two for HTTP GET and one for HTTP POST). 

## Analytics for URL path, query string, and HTTP verb 

For analytics purposes, HTTP calls made to your service are mapped to the concepts of Google Analytics Events as follows:

* HTTP request URL path is represented as *Event Category*
* HTTP request URL verb is represented as *Event Action*
* HTTP request URL query string is represented as *Event Label*

Using the Google Analytics Dashboard, you can slice and pivot the collected data in a number of ways. 

## Analytics for new and repeated callers

In addition to the basic HTTP path/verb/query information, *nodalytics* also supports tracking information about new and repeated callers (new and returning visitors in web site lingo). To use this feature, your service must be built with a first class notion of a unique caller. By default, Express.js session id is used to identify repeated callers. As such, to track new and repeated callers, you must enable session support in your express application:

```javascript
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(nodalytics('UA-44126622-6'));
```

Note that this mechanism relies on cookies and as such is only as good as your client's intentions of preserving them. A much better mechanism of tracking new and repeated customers would rely on client authentication - see the section on customization below. 

## Customization

The connect middleware that *nodalytics* provides can be customized as follows (each property except *propopert_id* is optional):

```javascript
app.use(nodalytics({
	property_id: 'UA-44125682-6',
	map: function (req, event) {
		// This function is called to augment the default Google Analytics Event object
		// created by nodalitics for the specified request. 
		// Parameters:
		// - req - the Http request that triggered logging attempt
		// - event - an object representing default values of the Google Analytics Event
		//           created by nodalitics for the specified request
		// Return: a Google Analytics Event object to log.
		return event;
    },
	error: function (error, event, headers, req, grec, gres) {
	    // This function is called when an error occurs communicating with Google Analytics.
	    // Parameters:
	    // - error - the error
	    // - event - the Google Analytics Event logging of which failed
	    // - headers - HTTP request headers sent to Google Analytics
	    // - req - the HTTP request that triggered logging attempt
	    // - greq - the HTTP request sent to Google Analytics that failed
	    // - gres - the HTTP response from Google Analytics
	},
	success: function (event, headers, req, grec, gres) {
	    // This function is called after successful logging with Google Analytics.
	    // Parameters are the same as with the errors handler above.
	}
}));
```

For reference of Google Analytics Event parameters see [here](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters).

## Like it? Share it.

[Tweet](https://twitter.com/home?status=Google%20Analytics%20for%20Node.js%20HTTP%20APIs%20http://github.com/tjanczuk/nodalytics%20via%20@tjanczuk%20%23nodejs%20%23webapi%20%23http)
[Google Plus](https://plus.google.com/share?url=http://github.com/tjanczuk/nodalytics)
[Facebook](https://www.facebook.com/sharer/sharer.php?u=http://github.com/tjanczuk/nodalytics)