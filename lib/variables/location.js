var ImplementationNotFoundError = require('../errors/implementationnotfound');

exports = module.exports = function(C, comp) {
  console.log('GET LOCATION VARIABLE FOR COMP!');
  
  console.log('*** ATTEMPTING LOCATIION LOOKUP ****');
  console.log(comp)
  
  // https://www.rfc-editor.org/rfc/rfc2782
  
  var service = comp.a['@service'];
  var proto = comp.a['@protocol'] || 'tcp';
  var hostname = '_' + service + '._' + proto;
  
  return C.create('http://i.bixbyjs.org/ns/Resolver')
    .then(function(ns) {
      return new Promise(function(resolve, reject) {
        ns.resolve(hostname, 'SRV', function(err, addresses) {
          if (err) {
            console.log('LOCATION ERROR');
            console.log(err)
            console.log('----');
            return reject(err);
          }
          // TODO: weighting and prio
          var address = addresses[0];
          return resolve(address);
        });
      });
    }, function(error) {
      if (error.code == 'IMPLEMENTATION_NOT_FOUND' && error.interface == 'http://i.bixbyjs.org/ns/Resolver') {
        throw new ImplementationNotFoundError("Unable to resolve service '" + hostname + "' needed by '" + comp.id + "'. Did you forget to install 'bixby-ns'?", error.interface);
      }
      throw error;
    });
};
