const MonascaServer = require("./src/monasca_server")

var server = new MonascaServer("monasca-test-database.json")
server.startServer();