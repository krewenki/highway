var SocketServer = function ( io, collection, db ) {
	this.collection = collection;
	this.socket = io.of( '/roadtrip/' + collection );
	this.socket.on( 'connection', function ( socket ) {


		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'init'   [description]
		 * @param  {[type]} function (             search [description]
		 * @return {[type]} [description]
		 */
		socket.on( 'init', function ( options ) {
			db.fetchAllRecords( collection, options )
				.then( function ( docs ) {
					socket.emit( 'all_records', docs );

					if ( options && options != {} ) {
						var secondOptions = {};
						if ( options.limit )
							secondOptions.skip = options.limit;
						db.fetchAllRecords( collection, secondOptions )
							.then( function ( docs ) {
								socket.emit( 'all_records', docs );
							} );
					}

				} );
		} );

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'update' [description]
		 * @param  {[type]} function (             record [description]
		 * @return {[type]} [description]
		 */
		socket.on( 'update', function ( record ) {
			db.updateRecord( record, collection )
				.then( function ( doc ) {
					socket.broadcast.emit( 'child_changed', record );
				} );
		} );

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'create' [description]
		 * @param  {[type]} function (             record, fn [description]
		 * @return {[type]} [description]
		 */
		socket.on( 'create', function ( record, fn ) {
			db.createRecord( record, collection )
				.then( function ( docs ) {
					fn( docs );
					socket.emit( 'child_added', docs[ 0 ] );
				} )
		} )

		/**
		 * [on description]
		 * @method on
		 * @param  {[type]} 'destroy' [description]
		 * @param  {[type]} function  (             record [description]
		 * @return {[type]} [description]
		 */
		socket.on( 'destroy', function ( record ) {
			db.deleteRecord( record._id, collection )
				.then( function ( doc ) {
					socket.broadcast.emit( 'child_changed', doc );
				} )
		} )
	} )
}

SocketServer.prototype.broadcast = function ( message ) {
	this.sockets.emit( message );
}


module.exports = SocketServer;
