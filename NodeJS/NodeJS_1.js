var http = require("http");

function readStreamAsString(stream, callback) {
	var data = "";
	stream.on("data", function(chunk) {
		data += chunk.toString();
	});
	stream.on("end", function() {
		callback(null, data);
	});
	stream.on("error", function(error) {
		callback(error);
	});
}

function req(type) {
	http.request({ "host": "eloquentjavascript.net", "path": "/author", "headers": { "Accept": type } }, function(res) {
		readStreamAsString(res, function(err, data) {
			if (err)
				console.log(error);
			else
				console.log("\n\n--------------\n\n" + type + ":\n\n--------------\n\n" + data);
		});
	}).end();
}


req("text/plain");
req("text/html");
req("application/json");


console.log("Hello, World!");
