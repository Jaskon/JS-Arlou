var http = require("http");
var fs = require("fs");

function urlToPath(url) {
	var path = require("url").parse(url).pathname;
	path = decodeURIComponent(path);
	path = path.replace(/\/\.\.\//, "/");
	path = path.replace(/\\\.\.\\/, "\\");
	if (path == "/")
		return path = "./index.html";
	else
		return "./Site" + (path == "/^" ? "/" : path);
}

var _functions = {

	get: function(path, callback) {
		fs.stat(path, function(error, stat) {
			if (error) {
				if (error.code == "ENOENT")
					return callback("File or directory is not exists");
				else
					return callback(error.code);
			}

			if (stat.isFile())
				fs.readFile(path, function(error, data) {
					if (error)
						callback(error.code);
					else
						callback(null, "file", data);
				});
			else if(stat.isDirectory())
				fs.readdir(path, function(error, data) {
					if (error)
						callback(error.code);
					else
						callback(null, "directory", data);
				});
			else
				callback("Unknown error");
		});
	},

	put: function(path, type, text, callback) {
		fs.stat(path, function(error, stat) {
			if (error) {
				if (error.code != "ENOENT")
					return callback(error.code);
			} else {
				if(stat.isDirectory())
					return callback("Here is a directory with the same name. Cannot be rewrited");
			}


			console.log(type);
			if (type == "directory") {
				fs.mkdir(path, function(error) {
					if (error)
						callback("Error while writing the file: " + error.code);
					else
						callback(null);
				});
			} else if (type == "file") {
				fs.writeFile(path, text, function(error) {
					if (error)
						callback("Error while writing the file: " + error.code);
					else
						callback(null);
				});
			}
		});
	},

	delete: function(path, callback) {
		fs.stat(path, function(error, stat) {
			if (error) {
				if (error.code == "ENOENT")
					return callback("There is no file with this name");
				else
					return callback(error.code);
			}

			if (stat.isFile())
				fs.unlink(path, callback(error));
			else if (stat.isDirectory()) {
				fs.rmdir(path, callback(error));
				//recursive delete?
			} else
				callback("Unknown error");
		});
	}
}

var server = http.createServer(function(req, res) {
	var path = urlToPath(req.url);

	if (/[/\\]favicon.ico$/i.test(path)) {
		res.writeHead(200);
		res.end();
		return;
	}

	var ip = req.connection.remoteAddress;
	console.log(ip + ": " + req.method + " request to " + path);


	if (path == "./index.html") {

		fs.readFile("./index.html", function(error, data) {
			if (error) {
				res.writeHead(403);
				return res.end(error.code);
			}

			res.writeHead(200);
			res.end(data);
		});

	} else {

		if (req.method == "GET") {
			_functions.get(path, function(error, type, data) {
				if (error) {
					res.writeHead(403);
					return res.end(error);
				}

				if (type == "file") {
					res.writeHead(200, {"Content-Type": "text/html"});
					res.end(data);
				} else {
					res.writeHead(200, {"Content-Type": "text/plain"});
					res.end(JSON.stringify(data));
				}
			});
		} else if (req.method == "PUT") {
			var text = [];
			req.on("data", function(chunk) {
				text.push(chunk);
			}).on("end", function() {
				text = text.join("");
			});

			var type = req.headers["_puttype"];

			_functions.put(path, type, text, function(error) {
				if (error) {
					res.writeHead(403);
					return res.end(error);
				}

				res.writeHead(200);
				res.end();
			});
		} else if (req.method == "DELETE") {
			_functions.delete(path, function(error) {
				if (error) {
					res.writeHead(404);
					return res.end(error);
				}

				res.writeHead(200);
				res.end();
			});
		}
	}
});

var _host = "localhost", _port = 3000;
server.listen(_port, _host, function() {
	console.log("Server listening on \"" + _host + "\" with port " + _port + "\n");
});