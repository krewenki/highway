var SocketServer = function (io, collection, db) {
	this.collection = collection;
	this.socket = io.of('/' + db.highway.settings.database + '/' + collection);
	this.socket.on('connection', function (socket) {


		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'init'   [description]
		 * @param  {[type]} function (             search [description]
		 * @return {[type]} [description]
		 */
		socket.on('init', function (options) {
			db.fetchAllRecords(collection, options)
				.then(function (docs) {
					socket.emit('all_records', docs);
				});
		});

		socket.on('search', function (options, fn) {
			db.fetchAllRecords(collection, options)
				.then(function (docs) {
					fn(docs);
				}, function (error) {
					fn(error);
				});
		});

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'update' [description]
		 * @param  {[type]} function (             record [description]
		 * @return {[type]} [description]
		 */
		socket.on('update', function (record) {
			db.updateRecord(record, collection)
				.then(function () {
					socket.broadcast.emit('child_changed', record);
				}, function (error) {
					console.log('error', error);
				});
		});

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'create' [description]
		 * @param  {[type]} function (             record, fn [description]
		 * @return {[type]} [description]
		 */
		socket.on('create', function (record, fn) {
			db.createRecord(record, collection)
				.then(function (docs) {
					fn(docs);
					socket.emit('child_added', docs[0]);
				});
		});

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'destroy' [description]
		 * @param  {[type]} function  (             record [description]
		 * @return {[type]} [description]
		 */
		socket.on('destroy', function (record) {
			var remove = record;
			if (typeof record == 'object')
				remove = record._id;
			db.deleteRecord(remove, collection)
				.then(function (doc) {
					socket.broadcast.emit('child_removed', doc);
				});
		});
	});
};

SocketServer.prototype.broadcast = function (message) {
	this.socket.emit(message);
};


module.exports = SocketServer;
