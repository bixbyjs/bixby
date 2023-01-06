/* global describe, it, expect */

var bixby = require('..');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('bixby', function() {
  
  it('should export function', function() {
    expect(bixby).to.be.a('function');
  });
  
  it('should create app', function(done) {
    var container = new Object();
    container.create = sinon.stub().resolves();
    
    bixby(container)
      .then(function() {
        expect(container.create).to.have.been.calledOnceWith('app');
        done();
      })
      .catch(done);
  });
  
});
