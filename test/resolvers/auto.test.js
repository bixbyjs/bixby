/* global describe, it, expect */

var auto = require('../../lib/resolvers/auto');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('resolvers/auto', function() {
  
  it('should resolve interface to component ID', function() {
    var container = new Object();
    container.components = sinon.stub().returns([{
      id: 'example/object',
      implements: [ 'com.example.IObject' ]
    }]);
    
    var resolve = auto(container);
    var id = resolve('com.example.IObject');
    expect(id).to.equal('example/object');
  });
  
  it('should not resolve unknown interface', function() {
    var container = new Object();
    container.components = sinon.stub().returns([{
      id: 'example/object',
      implements: [ 'com.example.IObject' ]
    }]);
    
    var resolve = auto(container);
    var id = resolve('com.example.IUnknown');
    expect(id).to.be.undefined;
  });
  
  it('should throw when multiple components implement interface', function() {
    var container = new Object();
    container.components = sinon.stub().returns([{
      id: 'example/object1',
      implements: [ 'com.example.IObject' ]
    }, {
      id: 'example/object2',
      implements: [ 'com.example.IObject' ]
    }]);
    
    var resolve = auto(container);
    expect(function() {
      var id = resolve('com.example.IObject');
    }).to.throw('Multiple components provide interface "com.example.IObject" required by "unknown". Configure one of: example/object1, example/object2');
  });
  
});
