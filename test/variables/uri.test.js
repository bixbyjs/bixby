var expect = require('chai').expect;
//var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../lib/variables/uri');
//var SessionManager = require('passport-multilogin').SessionManager;


describe('variables/uri', function() {
  
  it('should resolve using service annotation', function(done) {
    var resolver = new Object();
    resolver.resolve = sinon.stub().yieldsAsync(null, [
      { uri: 'ftp://ftp1.example.com/public' }
    ]);
    var C = new Object();
    C.create = sinon.stub().resolves(resolver);
    var comp = {
      a: {
        '@service': 'foo'
      }
    };
    
    factory(C, comp)
      .then(function(uri) {
        expect(C.create).to.have.been.calledOnceWith('http://i.bixbyjs.org/ns/Resolver');
        expect(resolver.resolve).to.have.been.calledOnceWith('_foo._tcp', 'URI');
        expect(uri).to.equal('ftp://ftp1.example.com/public');
        done();
      });
    
  }); // should resolve using service annotation
  
});
