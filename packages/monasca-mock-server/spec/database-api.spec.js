DatabaseAPI = require("../src/database-api")

//define a suite (group of specs)
describe("Database API", () => {

    var failHandler = function(done) {
        return err => done.fail(err);
    }
    var database_api;    
    beforeEach(() => {
        database_api = new DatabaseAPI("../data/test-database.json")
    })

    describe("GET/view", () => {

        it("/clusters", (done) => {
            database_api.view("/clusters")
            .then(data => {
                expect(data).toEqual({
                    "amount": 2,
                    "data": [
                        {
                            "id": 1,
                            "name": "Cluster 1",
                            "nodes": [1,2,3]
                        },
                        {
                            "id": 2,
                            "name": "Cluster 2",
                            "nodes": [2,3,4]
                        }
                    ]
                });
                done();
            })
            .catch(failHandler(done))
        })

        it("/cluters/1", (done) => {
            database_api.view("/clusters/1")
            .then(data => {
                expect(data).toEqual({
                    "id": 1,
                    "name": "Cluster 1",
                    "nodes": [1,2,3]
                });
                done();
            })
            .catch(failHandler(done))
        })

        it("/cluters/amount", (done) => {
            database_api.view("/clusters/amount")
            .then(data => {
                expect(data).toEqual(2);
                done();
            })
            .catch(failHandler(done))
        })
    })

    describe("POST/create", () => {

        it("/clusters (create new cluster resource)", (done) => {
            database_api.create("/clusters",{
                "name": "My Cluster",
                "nodes": [5,6,7]
            })
            .then(resource_id => {
                return database_api.view("/clusters/" + resource_id)
                .then(data => {
                    expect(data).toEqual({
                        "id": resource_id,
                        "name": "My Cluster",
                        "nodes": [5,6,7]
                    })
                    done()
                })
                
            })
            .catch(failHandler(done))
        })
    })

    describe("PUT/edit", () => {

        it("/clusters/5 (create new resource)", (done) => {
            database_api.edit("/clusters/5",{
                "name": "My Cluster",
                "nodes": [5,6,7]
            })
            .then(resource_id => {
                return database_api.view("/clusters/" + resource_id)
                .then(data => {
                    expect(data).toEqual({
                        "id": resource_id,
                        "name": "My Cluster",
                        "nodes": [5,6,7]
                    })
                    done()
                })
            }) 
            .catch(failHandler(done))
        })

        it("/clusters/1 (update existing resource)", (done) => {
            database_api.edit("/clusters/1",{
                "name": "My Cluster",
                "nodes": [5,6,7]
            })
            .then(resource_id => {
                return database_api.view("/clusters/1")
                .then(data => {
                    expect(data).toEqual({
                        "id": 1,
                        "name": "My Cluster",
                        "nodes": [5,6,7]
                    })
                    done()
                })
            })
            .catch(failHandler(done))
        })
    })

})