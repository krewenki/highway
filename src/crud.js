var Promise = require('promise');
var DB = function(uri) {

    if (!uri) {
        console.log('No URI provided. No database connection available');
    }
    this.uri = uri;




    function sanitizeURI(uri) {
        return uri.replace('mongodb://', '');
    }

}

DB.prototype.connect =  function(fulfill, reject) {
        return new Promise(function(fulfill, reject) {
          MongoClient.connect('mongodb://' + sanitizeURI(uri), function(err, db) {
            if(err) reject(err);
            else fulfill(db);
          });
        });
};

DB.prototype.fetchAllRecords = function(collection, search, callback) {
    callback = typeof callback == 'function' ? callback : function(err, docs) {};
    search = search || {};
    self.db.collection(collection).find(search, callback);
};

DB.prototype.createRecord = function(record, collection, callback) {
    callback = typeof callback == 'function' ? callback : function(err, docs) {};
    self.db.collection(collection).insert(record, callback);
};

DB.prototype.updateRecord = function(record, collection, callback) {
    var tosave = _.clone(record);
    delete tosave._id;
    callback = typeof callback == 'function' ? callback : function(err, docs) {};
    self.db.collection(collection).update({
        "_id": ObjectId(record._id)
    }, {
        $set: tosave
    }, callback)
};

DB.prototype.deleteRecord = function(_id, collection, callback) {
    callback = typeof callback == 'function' ? callback : function(err, docs) {};
    self.db.collection(collection).remove({
        "_id": ObjectId(_id)
    }, callback);
};

module.exports = DB;
