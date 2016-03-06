var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var clients = []

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {

  clients.push(ws);

  ws.onmessage = function (msg) {
    var dodo = JSON.parse(msg.data);
    updateDbase(dodo[0], dodo[1], function(response){
      downloadDbase(function(response){
        clients.forEach(function(client) {
          client.send(JSON.stringify(response));
        })
      })
    })
  }

  console.log("websocket connection open")

  downloadDbase(function(response){  
    ws.send(JSON.stringify(response));
  })


  ws.on("close", function() {
    console.log("websocket connection closed")
    clearInterval(id)
  })

})


function updateDbase(ticker, action, callback) {

  var pg = require("pg");

  var conString = "";
  var client = new pg.Client(conString);
  client.connect();

  if (action === "Add") {
    var query = client.query("INSERT INTO tickers VALUES ($1)", [ticker]);
  }

  if (action === "Delete") {
    var query = client.query('DELETE FROM tickers WHERE symbol = ($1)', [ticker]);
  }

  query.on("end", function (result) {
    return callback();
    client.end();
  });

}


function downloadDbase(callback) {

  var pg = require("pg");
  var tickerDB = "";

  var conString = "";
  var client = new pg.Client(conString);
  client.connect();

  var query = client.query("SELECT * FROM tickers");
  query.on("row", function (row, result) {
    result.addRow(row);
  });

  query.on("end", function (result) {
    return callback(result.rows);
    client.end();
  });

}