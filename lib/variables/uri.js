var parallel = require('run-parallel');
var ImplementationNotFoundError = require('../errors/implementationnotfound');

exports = module.exports = function(service, options) {
  var proto = 'tcp'
  var label = '_' + service + '._' + proto;
  
  //console.log('RESOLVING URI? ' + label);
  
  return this.create('http://i.bixbyjs.org/ns/Resolver')
    .then(function(resolver) {
      
      return new Promise(function(resolve, reject) {
        
        parallel([
          function(cb) {
            resolver.resolve(label, 'SRV', function(err, addresses) {
              if (err && err.code === 'ENOTFOUND') {
                // The hostname was not found.  None of the other parallel
                // queries will succeed, so error immediately.
                return cb(err);
              } else if (err) {
                // Ignore the error on the optimistic assumption that one of the
                // other parallel queries will succeed.  The typical error in
                // this case is caused by the resolver not supporting the `SRV`
                // record type.  Other record types may be supported, however.
                return cb(null, null);
              }
              return cb(null, addresses);
            });
          },
          function(cb) {
            resolver.resolve(label, 'URI', function(err, addresses) {
              if (err) { return cb(err); }
              return cb(null, addresses);
            });
          }
        ], function (err, results) {
          console.log('-----: ' + label);
          console.log(err);
          console.log(results);
          console.log('+++++')
          
          
          if (err) {
            return reject(err);
          }
          
          
          var ret = {}
            , record;
          
          if (results[0]) { // SRV
            // TODO: weighting and prio
            record = results[0][0];
            
            ret.host = record.name;
            ret.port = record.port;
          }
          
          if (results[1]) { // URI
            // TODO: weighting and prio
            record = results[1][0];
            
            ret.url = record.url;
          }
          return resolve(ret.url);
        });
        return;
        
        
        
        resolver.resolve(label, 'URI', function(err, uris) {
          //console.log('GOT!!!');
          //console.log(err);
          //console.log(uris)
          
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
