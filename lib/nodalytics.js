var http = require('http')
	, url = require('url');

module.exports = function (options) {

	if (typeof options === 'string') {
		options = { property_id: options };
	}

	if (typeof options !== 'object' || typeof options.property_id !== 'string') {
		throw new Error('Google Analytics property ID must be specified as a parameter.');
	}

	return function (req, res, next) {

		if (typeof options.map === 'function' && options.map.length === 3)
			res.on('finish', hook);
		else
			hook();

		return next && next();

		function hook() {
			// Default google analytics event value.

			var u = url.parse(req.url);

		    var event = {
		    	v: 1,
		    	tid: options.property_id,
		    	t: 'event',
		    	cid: req.sessionID || 'N/A',
		    	ea: req.method,
		    	ec: u.pathname,
		    	el: u.query || ''
		    };

		    // Augment event if user-specified mapping function is present.

		    if (typeof options.map === 'function') {
		    	if (options.map.length === 3)
		    		event = options.map(req, res, event);
		    	else
		    		event = options.map(req, event);
		    }

		    // Form-url-encode the event data.

		    var data = url.format({ query: event }).substring(1);

		    // Set up request headers.

		    var headers = {
		    	'Content-Type': 'application/x-www-form-urlencoded'
		    };

		    // Promote select HTTP headers from the client request 
		    // to get IP, language, and device analytics.
		    
		    if (req) {
		        ['user-agent', 'x-forwarded-for', 'accept-language'].forEach(function (h) {
		            if (req.headers[h] !== undefined) {
		                headers[h] = req.headers[h];
		            }
		        });
		    }

		    // Send the Google Analytics request, do not wait for response.

		    var greq = http.request({
		    	hostname: 'www.google-analytics.com',
		    	port: 80,
		    	path: '/collect',
		    	method: 'POST',
		    	headers: headers
		    }, function (gres) {	
		    	if (gres.statusCode < 200 || gres.statusCode > 300) {
			    	if (typeof options.error === 'function') {
			    		options.error(new Error('Unexpected response from Google Analytics: HTTP ' + gres.statusCode), 
			    			event, headers, req, greq, gres);
			    	}	    	
		    	}
		    	else if (typeof options.success === 'function') {
		    		options.success(event, headers, req, greq, gres);
		    	}

		    	gres.on('data', function () {});
		    	gres.on('end', function () {});
		    });

		    greq.on('error', function (error) {
		    	if (typeof options.error === 'function') {
		    		options.error(error, event, headers, req, greq);
		    	}	    	
		    });

		    greq.write(data);
		    greq.end();
		}
	}
};
