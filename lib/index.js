var path = require('path')
  , fs = require('fs')
  , TOML = require('toml')
  , bundles = require('./bundles')
  , useIfAvailable = require('./utils/useifavailable');


function main(pre, post) {
  var IoC = require('electrolyte');
  var dirname = path.dirname(require.main.filename);
  
  // TODO: Make this more generic/configurable, use CLI args -C.
  var data = fs.readFileSync(path.join(dirname, 'manifest.toml'), 'utf8');
  var config = TOML.parse(data);
  
  IoC.resolver(require('./resolvers/auto')(IoC));
  
  useIfAvailable(bundles.CORE, IoC);
  useIfAvailable(bundles.WWW, 'www', IoC);
  
  pre && pre(IoC);
  
  IoC.use(IoC.fs(path.join(dirname, 'app')));
  IoC.use(require('./loaders/config')(config));
  
  //IoC.use(require('bixby-common'));
  
  var app = IoC.create('app');
  
  if (typeof app == 'function') {
    app(function() {
      post && post(IoC);
    });
  } else {
    throw new Error('Unsupported type of application: ' + typeof app);
  }
}


exports.main = main;
