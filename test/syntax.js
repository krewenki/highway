var expect = require('expect.js');

describe('syntax', function(){
  it('highway should be valid',function(){
	  var Highway = require( '../highway.js' );
	  expect(typeof Highway).to.equal('function');
  })

  it('crud should be valid',function(){
	  var DB = require( '../src/crud.js' );
	  expect(typeof DB).to.equal('function');
  })
  
  it('email should be valid',function(){
	  var Email = require( '../src/email.js' );
	  expect(typeof Email).to.equal('function');
  })

});

var Highway = require('../highway.js');

describe('Instantiating', function(){
	
	it('should fail when no config is passed', function(){
		var err = true;
		try {
			var hw = new Highway();
			err = false;
		} catch(x) {
			
		}
		expect(err).to.equal(true);

	})
})