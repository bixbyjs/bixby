var ImplementationNotFoundError = require('../errors/implementationnotfound');

exports = module.exports = function(C, comp) {
  console.log('GET LOCATION VARIABLE FOR COMP!');
  
  console.log('*** ATTEMPTING LOCATIION LOOKUP ****');
  console.log(comp)
  
  var name = comp.a['@service'];
  
  return C.create('http://i.bixbyjs.org/ns')
    .then(function(ns) {
      return new Promise(function(resolve, reject) {
        var name = comp.a['@name'];
        ns.resolve(name, 'SRV', function(err, addresses) {
          // hardcoded success
          //return resolve({ name: 'localhost', port: 6379 });
        
          if (err) { return reject(err); }
          // TODO: weighting and prio
          var address = addresses[0];
          return resolve(address);
        });
      });
    }, function(error) {
      if (error.code == 'IMPLEMENTATION_NOT_FOUND' && error.interface == 'http://i.bixbyjs.org/ns') {
        throw new ImplementationNotFoundError("Unable to resolve service '" + name + "' needed by '" + comp.id + "'. Did you forget to install 'bixby-ns'?", error.interface);
      }
      throw error;
    });
};
