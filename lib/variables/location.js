var ImplementationNotFoundError = require('../errors/implementationnotfound');

exports = module.exports = function(service, opts) {
  var proto = 'tcp'
  
  var label = '_' + service + '._' + proto;
  
  // https://www.rfc-editor.org/rfc/rfc2782
  
  var whichResolver = 'http://i.bixbyjs.org/ns/Resolver';
  if (opts && opts.domain == 'localhost') {
    whichResolver = 'http://i.bixbyjs.org/ns/LocalResolver';
  }
  
  
  return this.create(whichResolver)
    .then(function(resolver) {
      return new Promise(function(resolve, reject) {
        // TODO: Should resolver.domain be here???  Or should it search domains if not specified?
        resolver.resolve(label + '.' + resolver.domain, 'SRV', function(err, addresses) {
          if (err) {
            return reject(err);
          }
          // TODO: weighting and prio
          var address = addresses[0];
          return resolve(address);
        });
      });
    }, function(error) {
      if (error.code == 'IMPLEMENTATION_NOT_FOUND' && error.interface == 'http://i.bixbyjs.org/ns/Resolver') {
        throw new ImplementationNotFoundError("Unable to resolve service '" + label + "' needed by '" + comp.id + "'. Did you forget to install 'bixby-ns'?", error.interface);
      }
      throw error;
    });
};
