Google Analytics for Node.js HTTP APIs
==========

Nodalytics hooks up Google Analytics to your server side HTTP APIs in Node.js. With one line of code you can capture and analyze statistical information about HTTP calls being made to your HTTP service: 

* What are the endpoints being called?
* What are the HTTP verbs?
* What are the query string parameters?
* What user agents are calling your APIs?
* Where are the calls originating from?
* How many new and repeated callers do you have?

The module uses Google Measurement Protocol to communicate directly with Google Analytics from your server side code. Unlike in the case of Google Analytics for web sites or mobile applications, you don't need to control the client side code.

# Getting started

First, create a Google Analytics account and a property under this account. When asked about the type of the property (*web* or *mobile*), choose *web*. Your property will be assigned a property ID of the form `UA-44126622-6`. 

Next, install the *nodalytics* module from NPM:

```
npm install nodalytics
```

Then use it as connect middleware in your minimalist express.js application:

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

You are done. Every time an HTTP call is received by your service, appropriate event will be logged against your Google Analytics property. To verify, open your Google Analytics dashboard, go to *Real Time | Events* report, then start your server and issue a few requests against it:

```
node app.js &
curl http://localhost:3000/foo?a=1
curl http://localhost:3000/bar?b=1
curl http://localhost:3000/baz -d somedata
```

You should see the Google Analytics events showing up in real time in the dashboard. Two for HTTP GET and one for HTTP POST. 

# What is logged

Concepts of Google Analytics Events are used to represent HTTP calls made to your service. By default, the mapping the HTTP concepts to Google Analytics Events concepts is as follows:

* HTTP request URL path is represented as Event Category
* HTTP request URL verb is represented as Event Action
* HTTP request URL query string is represented as Event Label

Using the standard features of the Google Analytics Dashboard, you can slice and pivot the collected data in any number of ways. 

# What is logged, continued

In addition to the basic path/verb/query information, nodalytics also supports tracking information about new and repeated callers (new and returning visitors in web site lingo). To use this feature, your service itself must have a first class notion of a unique caller. By default, express session id is used to discover repeated callers. As such, to track new and repeated callers, you must enable session support in your express application:

```javascript
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(nodalytics('UA-44126622-6'));
```

Note that this mechanism relies on cookies and as such is only as good as your client's intentions of preserving them. A much better mechanism of tracking new and repeated customers would rely on client authentication - see the section on customization below. 

# Customization

TODO. For now, check code. 