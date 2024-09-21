var expect = require('chai').expect;
//var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../lib/variables/uri');
//var SessionManager = require('passport-multilogin').SessionManager;


describe('variables/uri', function() {
  
  it('should resolve using service annotation', function(done) {
    var resolver = new Object();
    resolver.resolve = sinon.stub();
    resolver.resolve.onCall(0).yieldsAsync(null, [
      { url: 'ftp://ftp1.example.com/public' }
    ]);
    resolver.resolve.onCall(1).yieldsAsync(null, [
      { url: 'ftp://ftp1.example.com/public' }
    ]);
    var C = new Object();
    C.create = sinon.stub().resolves(resolver);
    var comp = {
      a: {
        '@service': 'foo'
      }
    };
    
    factory.call(C, 'foo')
      .then(function(uri) {
        expect(C.create).to.have.been.calledOnceWith('http://i.bixbyjs.org/ns/Resolver');
        expect(resolver.resolve.getCall(0).args[0]).to.equal('_foo._tcp');
        expect(resolver.resolve.getCall(0).args[1]).to.equal('SRV');
        expect(resolver.resolve.getCall(1).args[0]).to.equal('_foo._tcp');
        expect(resolver.resolve.getCall(1).args[1]).to.equal('URI');
        expect(resolver.resolve.callCount).to.equal(2);
        expect(uri).to.equal('ftp://ftp1.example.com/public');
        done();
      })
      .catch(done);
    
  }); // should resolve using service annotation
  
});
