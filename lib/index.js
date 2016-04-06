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
  
  // Add resolvers to the IoC container.
  IoC.resolver(require('./resolvers/auto')(IoC));
  
  // Utilize standard objects within the IoC container.
  useIfAvailable(bundles.CORE, IoC);
  useIfAvailable(bundles.SD, 'sd', IoC);
  useIfAvailable(bundles.WWW, 'www', IoC);
  pre && pre(IoC);
  IoC.use(IoC.fs(path.join(dirname, 'app')));
  
  // TODO: Make this more generic/configurable, use CLI args -C.
  var mfile = path.join(dirname, 'etc/manifest.toml');
  if (fs.existsSync(mfile)) {
    var data = fs.readFileSync(mfile, 'utf8');
    var config = TOML.parse(data);
  
    IoC.use(require('./loaders/config')(config));
  }
  
  IoC.special('$settings', function(source) {
    var settings = this.create('settings');
    return settings.isolate(source.namespace);
  });
  
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
  
  // This hook exposes singleton components to the REPL, where they can be used
  // to inspect and mutate the state of a running application.
  
  // TODO: This code was previously in bixby-common, `expose/repl`, and can be
  //       move to an on('create') hook
  /*
  return function(name, component, singleton) {
    if (!singleton) { return; }
    
    var repl = this.create('repl');
    repl.expose(name, component);
  };
  */
  
  
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
