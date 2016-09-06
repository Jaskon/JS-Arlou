var http = require("http");
var fs = require("fs");

function urlToPath(url) {
	var path = require("url").parse(url).pathname;
	path = decodeURIComponent(path);
	path = path.replace(/\/\.\.\//, "/");
	path = path.replace(/\\\.\.\\/, "\\");
	return "." + path;
}

function MKCOL(path, ip, callback) {
	fs.stat(path, function(error, data) {
		if (error)
			if(error.code == "ENOENT") {
				console.log(ip + ": all is ok and ready to create a dir!");
				fs.mkdir(path, function() {
					console.log(ip + ": directory created: " + path + "\n");
					callback(200);
				});
			} else {
				console.log(ip + ": error: " + error.code + "\n");
				callback(400);
			}
		else if (data.isDirectory()) {
			console.log(ip + ": there already is a created folder\n");
			callback(204);
		} else {
			console.log(ip + ": there is a file with the same name\n");
			callback(400);
		}
	});
}

var server = http.createServer(function(req, res) {
	var path = urlToPath(req.url);

	if (/[/\\]favicon.ico$/i.test(path)) {
		res.writeHead(200);
		res.end();
		return;
	}


	var ip = req.connection.remoteAddress;
	console.log(ip + ": a request to " + path);

	MKCOL(path, ip, function(code) {
		res.writeHead(code);
		res.end()
	});
});

var _host = "localhost", _port = 3000;
server.listen(_port, _host, function() {
	console.log("Server listening on \"" + _host + "\" with port " + _port + "\n");
});