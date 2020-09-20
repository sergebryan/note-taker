const fs = require("fs")
var express = require("express")
var bodyParser = require("body-parser")

var app = express()

var PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
})

app.get("/notes", function(req, res) {
	res.sendFile(__dirname + "/public/notes.html")

})

app.get("/api/notes", function(req, res, next) {
	// read and return the contents of db.json
	var obj = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	res.end(JSON.stringify(obj))
	
})

app.post("/api/notes", function(req, res) {
	var data = req.body
	// reading all tasks
	var notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'))
	// add task at the end
	notes.push(data)
	// writing all the tasks back to db.json file
	fs.writeFileSync("db/db.json", JSON.stringify(notes))
	// returning the task pushed
	res.end(JSON.stringify(data))
})

// deleting the task at the index `id` in db.json
app.delete("/api/notes/:id", function(req, res) {
	// extracting id from url
	var id = req.params.id
	// reading all tasks
	var notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'))
	// removing element at id 
	notes.splice(id, 1)
	// writing remaining notes
	fs.writeFileSync("db/db.json", JSON.stringify(notes))
	res.send("Id- " + id + " deleted")

})

app.get('*',function (req, res) {
        res.redirect('/');
});

var server = app.listen(PORT, function() {
	var host = server.address().address
	var port = server.address().port
	console.log("App listening at http://%s:%s", host, port)
})

