var path = require('path')
  , pkginfo = require('pkginfo');


exports = module.exports = function findAssemblies(options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  var app = pkginfo.find(require.main)
    , deps = Object.keys(app.dependencies || {})
    , nmdir = require.main.paths[0]
    , asms = []
    , dep, pkg;
  
  if (options.dev === true) {
    deps = deps.concat(Object.keys(app.devDependencies || {}));
  }
  
  var i, len;
  for (i = 0, len = deps.length; i < len; ++i) {
    dep = deps[i];
    pkg = pkginfo.find(null, path.join(nmdir, dep));
    
    // TODO: Remove pkg.assembly branch
    if (pkg.assembly || pkg.components) {
      asms.push({
        name: pkg.name,
        main: pkg.main, // FIXME: Don't overload "main" here
        namespace: pkg.namespace,
        components: pkg.components,
        assembly: pkg.assembly,
        directories: pkg.directories
      });
    }
  }
  
  process.nextTick(function() {
    cb(null, asms);
  });
  return;
};
