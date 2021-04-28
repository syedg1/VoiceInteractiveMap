// Required packages
var app = require('express')();
var http = require('http').Server(app);

// Sends back whatever files are requested (wildcard)
app.get(/^(.+)$/, function(req,res){
  res.sendFile(__dirname + req.params[0]);
});

// Start the server
http.listen(3000, function(){
  console.log('listening on *:3000');
});

