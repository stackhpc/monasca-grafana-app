const DatabaseAPI = require('./database-api')

logCallback = output => console.log(output);
warnCallback = warning => console.warn(warning);

database_api = new DatabaseAPI("monasca-test-database.json")

function MonascaServer(database_filename){
    //Initialize parameters
    this.database_filename = database_filename;
    
    //Create express application
    this.express = require('express')
    this.app = this.express()

    var bodyParser = require('body-parser');
    this.app.use(bodyParser.json()); // for parsing mime type - application/json
    this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing mime type - application/x-www-form-urlencoded
}

MonascaServer.prototype.startServer = function(){

    var errHandler = res => err => res.status(400).json({ message: err});

    //Configure routes for metric resources
    metricResourceRouter = this.express.Router();
    metricResourceRouter.route("/")
        .get(function(req, res){
            database_api.view("/metrics", req.query)
            .then(data => {
                res.status(200).json(data);
                
            })
            .catch(errHandler(res))
        })
        .post(function(req, res){
            database_api.create("/metrics", req.body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(errHandler(res))
        })
    metricResourceRouter.get("/dimensions/names", function(req, res){
        database_api.view("/dimensions/names", req.query)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(errHandler(res))
    })
    metricResourceRouter.get("/dimensions/names/values", function(req, res){
        database_api.view("/dimensions/values", req.query)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(errHandler(res))
    })
    this.app.use("/v2.0/metrics", metricResourceRouter)
    this.app.get("/", (req,res) => res.send("Monasca server running!"));
    this.app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

module.exports = MonascaServer;


// database_api.view("/clusters")
//     .then(data => {
//         console.log(data)
//         console.log("================")
//         return database_api.view("/clusters/amount")
//     })
//     .then(data => {
//         console.log(data)
//         console.log("================")
//         return database_api.view("/clusters/1")
//     })
//     .then(data => {
//         console.log(data)
//         console.log("================")
//         return database_api.edit("/clusters/3", { name: "Special Cluster", newField: "newField" })
//     })
//     .then(resource_id => {
//         console.log(resource_id)
//         console.log("================")
//         return database_api.saveState("saved-test-database.json")
//     })
//     .catch(err => {
//         console.warn(err);
//         console.log("================")
//     })



