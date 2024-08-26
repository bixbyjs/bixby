var ImplementationNotFoundError = require('../errors/implementationnotfound');

exports = module.exports = function(C, comp) {
  
  var service = comp.a['@service'];
  var proto = comp.a['@protocol'] || 'tcp';
  var label = '_' + service + '._' + proto;
  
  return C.create('http://i.bixbyjs.org/ns/Resolver')
    .then(function(resolver) {
      return new Promise(function(resolve, reject) {
        resolver.resolve(label, 'URI', function(err, uris) {
          if (err) {
            return reject(err);
          }
          
          // TODO: weighting and prio
          var uri = uris[0].uri;
          return resolve(uri);
        });
      });
    }, function(error) {
      if (error.code == 'IMPLEMENTATION_NOT_FOUND' && error.interface == 'http://i.bixbyjs.org/ns/Resolver') {
        throw new ImplementationNotFoundError("Unable to resolve service '" + label + "' needed by '" + comp.id + "'. Did you forget to install 'bixby-ns'?", error.interface);
      }
      throw error;
    });
};
