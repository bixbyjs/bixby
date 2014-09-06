/* global describe, it, expect */

var bixby = require('..');

describe('bixby', function() {
  
  it('should export component suites', function() {
    expect(bixby.common).to.be.a('function');
  });
  
});
