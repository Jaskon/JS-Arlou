var http = require("http");
var fs = require("fs");

function urlToPath(url) {
	var path = require("url").parse(url).pathname;
	path = decodeURIComponent(path);
	path = path.replace(/\/\.\.\//, "/");
	path = path.replace(/\\\.\.\\/, "\\");
	return "." + path;
}

var server = http.createServer(function(req, res) {
	var path = urlToPath(req.url);
	fs.readFile(path, function(error, data) {
		if (!error) {
			res.writeHead(200);
			res.end(data);
		} else {
			res.end(error.toString());
		}
	});
	console.log(path);
});

var _host = "localhost", _port = 3000;
server.listen(_port, _host, function() {
	console.log("Server listening on \"" + _host + "\" with port " + _port);
});