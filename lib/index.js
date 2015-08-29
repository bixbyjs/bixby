var path = require('path')
  , bundles = require('./bundles')
  , useIfAvailable = require('./utils/useifavailable');


function main() {
  var IoC = require('electrolyte');
  var dirname = path.dirname(require.main.filename);
  
  IoC.resolver(require('./resolvers/auto')(IoC));
  
  useIfAvailable(bundles.CORE, IoC);
  
  IoC.use(IoC.fs(path.join(dirname, 'app')));
  //IoC.use(require('bixby-common'));
  
  var app = IoC.create('app');
  
  if (typeof app == 'function') {
    app();
  } else {
    throw new Error('Unsupported type of application: ' + typeof app);
  }
}


exports.main = main;
