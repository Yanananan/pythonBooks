// requiring packages
var express = require('express');
var app 	= express();
var path 	= require("path");
var mysql   = require('mysql');

app.set('view engine','ejs');
//you need this to be able to process information sent to a POST route
	var bodyParser = require('body-parser');

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// parse application/json
	app.use(bodyParser.json());

var path = require("path");

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
// index.html in the public folder will over ride the root route
app.use(express.static("public"));

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "project2Practice"
});

var userAuthRoutes = require('./routes/userAuth.js');
var searchRoutes = require('./routes/search.js');
app.use('/', userAuthRoutes);
app.use('/', searchRoutes);

// since this is a practice file, i used create.html as the default route.
// path.join just joins the absolute path to this directory with the relative path that you input as the 2nd argument of .join()
app.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname, "public/create.html"));
	res.render("pages/home");
});


// when user submits the information in the create.html file, insert into the project2Practice database.
app.post('/create', function(req, res){
	console.log(req.body);

	// here i manually put in a user name because we have not yet created
	// any users. We may use this method again when we grab a user information from a 'users' table.
	req.body.user_name = 'Austin';

	// run query to insert into table getInput
	var query = connection.query(
	  	"INSERT INTO getInput SET ?",
	  	req.body,
	  	function(err, response) {
		  	if(err) console.log(err);
		    res.redirect('/');
	  	}
	);
});

// this is the api where we can grab information and use it in the 
// ajax requests.
app.get('/api', function(req, res){
	connection.query('SELECT * FROM getInput', function (error, results, fields) {
    	if (error) throw error;
    	res.json(results);
  	});
});

// here in postings route, we bring up the postings.html file.
// Then, in the postings.html file we specifiy we are using
// the post.js javascript file and request the api from our database.
app.get('/postings', function(req, res){
	res.sendFile(path.join(__dirname, "public/postings.html"));
});




app.listen(3000, function(){
	console.log('listening on 3000');
});