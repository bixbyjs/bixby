var path = require('path')
  , fs = require('fs')
  , TOML = require('toml')
  , bundles = require('./bundles')
  , useIfAvailable = require('./utils/useifavailable');


function main(pre, post) {
  var IoC;
  
  try {
    IoC = require('electrolyte');
  } catch (_) {
    // workaround when `npm link`'ed for development
    IoC = require('parent-require')('electrolyte');
  }
  
  
  var dirname = path.dirname(require.main.filename);
  
  // TODO: Make this more generic/configurable, use CLI args -C.
  var data = fs.readFileSync(path.join(dirname, 'manifest.toml'), 'utf8');
  var config = TOML.parse(data);
  
  // Add resolvers to the IoC container.
  IoC.resolver(require('./resolvers/auto')(IoC));
  
  // Utilize standard objects within the IoC container.
  useIfAvailable(bundles.CORE, IoC);
  useIfAvailable(bundles.SD, 'sd', IoC);
  useIfAvailable(bundles.WWW, 'www', IoC);
  pre && pre(IoC);
  IoC.use(IoC.fs(path.join(dirname, 'app')));
  IoC.use(require('./loaders/config')(config));
  
  // Lifecycle hooks for objects managed by the IoC container.
  var init = IoC.create('initializer');
  
  IoC.on('create', function(obj, spec) {
    var iids = spec.a['@initializer'] || spec.a['@initializers'] || []
      , phase, i, len;
    if (typeof iids == 'string') {
      iids = [ iids ]
    }
    for (i = 0, len = iids.length; i < len; ++i) {
      phase = this.create(iids[i], spec);
      init.phase(phase, obj);
    }
  });
  
  
  // Create the application.
  var app = IoC.create('app');
  post && post(IoC);
  
  // Run initializers and then execute the application's main function.
  init(function(err) {
    if (err) { throw err; }
    
    if (typeof app == 'function') {
      app();
    } else {
      throw new Error('Application is not runnable');
    }
  });
}


exports.main = main;
