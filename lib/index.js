var path = require('path')
  , fs = require('fs')
  , TOML = require('toml')
  //, bundles = require('./bundles')
  , useIfAvailable = require('./utils/useifavailable')
  , findPackages = require('./utils/findpackages')
  , usePackages = require('./utils/usepackages')


function old_main(pre, post) {
  var IoC;
  
  try {
    IoC = require('electrolyte');
  } catch (_) {
    // workaround when `npm link`'ed for development
    IoC = require('parent-require')('electrolyte');
  }
  
  
  var dirname = path.dirname(require.main.filename);
  
  var mfile = path.join(dirname, 'etc/wiring.toml');
  if (fs.existsSync(mfile)) {
    var data = fs.readFileSync(mfile, 'utf8');
    var config = TOML.parse(data);
    IoC.resolver(require('./resolvers/manual')(config));
  }
  
  // Add resolvers to the IoC container.
  IoC.resolver(require('./resolvers/auto')(IoC));
  
  // Utilize standard objects within the IoC container.
  IoC.use(require('../app'));
  useIfAvailable(bundles.CORE, IoC);
  useIfAvailable(bundles.SD, 'sd', IoC);
  useIfAvailable(bundles.WWW, 'www', IoC);
  pre && pre(IoC);
  // TODO: Build this from main package.json
  IoC.use(IoC.fs(path.join(dirname, 'app')));
  
  // TODO: Make this more generic/configurable, use CLI args -C.
  var mfile = path.join(dirname, 'etc/manifest.toml');
  if (fs.existsSync(mfile)) {
    var data = fs.readFileSync(mfile, 'utf8');
    var config = TOML.parse(data);
  
    IoC.use(require('./loaders/config')(config));
  }
  
  
  // Lifecycle hooks for objects managed by the IoC container.
  IoC.on('create', function(obj, spec) {
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
  IoC.create('main')
    .then(function(main) {
      main();
    })
    .catch(function(err) {
      console.log(err.stack);
      process.exit(-1);
    });
}


//exports.main = main;

exports = module.exports = function(oe, options) {
  var a = 'app';
  if (typeof oe == 'string') {
    a = oe;
    oe = undefined;
  }
  options = options || {};
  
  // Load .env files.
  //
  // Matches how Next.js loads env variables
  //. https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#default-environment-variables
  //
  // TODO: support .env.local (for overrides)
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.' + process.env.NODE_ENV) });
  require('dotenv').config();
  
  function run(oe) {
    a = a || 'app'
    
    console.log('RUNNING APP: ' + a);
    
    oe.create(a)
      .catch(function(err) {
        console.log(err);
        
        return oe.create('http://i.bixbyjs.org/main')
      })
      .then(function(app) {
      })
      .catch(function(err) {
        console.log(err)
        
        if (err.code == 'INTERFACE_NOT_FOUND') {
          console.log(err.message);
          // TODO: Construct a helpful message of what package to install
          // based on err.interface.
          
          process.exit(1)
          return;
        }
        
        //console.log(err.stack);
        process.exit(1);
      });
  }
  
  function fail(err) {
    console.log(err.stack);
    process.exit(-1);
  }
  
  if (!oe) {
    oe = require('electrolyte');
    oe.variable('srv', require('./variables/location'))
    oe.variable('uri', require('./variables/uri'))
    oe.resolver(require('./resolvers/auto')(oe));
    oe.filter(require('./filters/environment'));
    oe.sorter(require('./sorters/prerequisite'));
    
    /*
    oe.on('create', function(obj, spec) {
      //console.log('**** CREATE A COMPONENT ******');
    });
    */
    
    findPackages(options, function(err, pkgs) {
      if (err) { return fail(err); }
      
      usePackages(oe, pkgs, function(err) {
        if (err) { return fail(err); }
        
        //oe.use(oe.fs(path.join(path.dirname(require.main.filename), 'app')));
        
        oe.use('app', require('./assembly/app')());
        
        run(oe);
      });
    });
  } else {
    //run(oe);
    
  a = a || 'app'
  
  return oe.create(a)
    .catch(function(err) {
      //console.log(err);
      
      return oe.create('http://i.bixbyjs.org/main')
    })
    .then(function(app) {
    })
    .catch(function(err) {
      console.log(err)
      
      if (err.code == 'INTERFACE_NOT_FOUND') {
        console.log(err.message);
        // TODO: Construct a helpful message of what package to install
        // based on err.interface.
        
        process.exit(1)
        return;
      }
      
      //console.log(err.stack);
      process.exit(1);
    });
    
  }
}
