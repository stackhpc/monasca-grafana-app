const fs = require("fs")
const _ = require("lodash")
const bluebird = require("bluebird")

//TODO:
    //Lodash syntax to represent path

function DatabaseAPI(database_path){
    this.database_path = "data/" + database_path;
    this.data = JSON.parse(fs.readFileSync(this.database_path).toString())
    this.err_messages = [
        'collection/resource cannot be found (path invalid)',
        'collection/resource does not exist',
        'uri does not identify resource',
        'uri does not identify a collection',
    ];
}

DatabaseAPI.prototype.getProperty = function(uri) {
    var self = this;

    return new Promise(function(resolve, reject){
        var property_path = uri.toString().split("/").slice(1)
        // property_path[property_path.length - 1].split("?").split("&")
        var resource = property_path.reduce((object, property) => {
            if(object == undefined) reject(self.err_messages[0]);
            else if(!isNaN(parseInt(property))) {
                if(object["data"] != undefined && Array.isArray(object["data"])){
                    var sub_object = object["data"].filter(element => element.id == parseInt(property))[0];
                    return sub_object;
                }
                else reject(self.err_messages[0]);
            }
            else {
                return object[property];
            }
        }, self.data);
        if(resource == undefined) reject(self.err_messages[1]);
        resolve(resource)
    })
}

DatabaseAPI.prototype.identifiesResource = function(uri) {
    return new RegExp("^((/[A-Za-z]+)|(/[A-Za-z]+/\\d+))*(/[A-Za-z]+/\\d+)$").test(uri);
}

DatabaseAPI.prototype.identifiesCollection = function(uri) {
    return new RegExp("^((/[A-Za-z]+)|(/[A-Za-z]+/\\d+))*(/[A-Za-z]+)$").test(uri);
}

DatabaseAPI.prototype.view = function(uri, query_object){
    return this.getProperty(uri)
}

DatabaseAPI.prototype.create = function(collection_uri, new_resource_object, resource_id){
    var self = this;
    if(this.identifiesCollection(collection_uri)){
        return this.getProperty(collection_uri)
        .then(collection => {
            var collection_data = collection["data"];
            if(collection_data != undefined && Array.isArray(collection_data)){
                var max_id = collection_data.map((resource) => resource.id).reduce((acc, val) => Math.max(acc, val));
                id_object = resource_id == undefined ? { id: max_id + 1 } : { id: resource_id };
                collection_data.push(_.extend(new_resource_object, id_object))
                return id_object.id;
            }
            else throw self.err_messages[1];
        })
    }
    else {
        return Promise.reject(self.err_messages[3])
    }
}

DatabaseAPI.prototype.edit = function(resource_uri, update_resource_object){
    var self = this;

    if(this.identifiesResource(resource_uri)){
        return this.getProperty(resource_uri)
        .then(resource => {
            delete update_resource_object.id
            _.extend(resource, update_resource_object)
            return resource.id;
        })
        .catch(() => {
            var resource_id = parseInt(resource_uri.toString().split("/")[resource_uri.toString().split("/").length - 1]);
            var collection_uri = resource_uri.toString().split("/").slice(0, -1).join("/");
            return self.create(collection_uri, update_resource_object, resource_id);
        })
    }
    else {
        return Promise.reject(self.err_messages[2])
    }
}

DatabaseAPI.prototype.delete = function(resource_uri){
    var self = this;
    if(this.identifiesResource(resource_uri)){
        return new Promise(function(resolve, reject){
            var resource_id = parseInt(resource_uri.toString().split("/")[resource_uri.toString().split("/").length - 1]);
            var collection_uri = resource_uri.toString().split("/").slice(0, -1).join("/");
            self.getProperty(collection_uri)
            .then(collection => {
                var collection_data = collection["data"];
                if(collection_data != undefined && Array.isArray(collection_data)){
                    var resource_to_delete = collection_data.filter(resource => resource.id === resource_id)[0];
                    if(resource_to_delete == undefined) reject(self.err_messages[1])
                    collection_data.splice(collection_data.indexOf(resource_to_delete), 1);
                    resolve(resource_id)
                }
            })
        })
    }
    else {
        return Promise.reject(this.err_messages[2]);
    }
}

DatabaseAPI.prototype.saveState = function(file_name){
    var self = this;
    return new Promise(function(resolve, reject){
        fs.writeFile("data/" + file_name, JSON.stringify(self.data), "utf8", (err) => {
            if(err != undefined) reject(err)
        });
    })
}

module.exports = DatabaseAPI;



