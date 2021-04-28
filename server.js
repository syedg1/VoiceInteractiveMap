// Required packages
var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
// Sends back whatever files are requested (wildcard)
app.get(/^(.+)$/, function(req,res){
  res.sendFile(__dirname + req.params[0]);
});

// Start the server
http.listen(port, function(){
  console.log('listening on *:' + port);
});

