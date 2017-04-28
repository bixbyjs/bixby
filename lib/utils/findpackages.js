var path = require('path')
  , pkginfo = require('pkginfo');


exports = module.exports = function findAssemblies(cb) {
  var app = pkginfo.find(require.main)
    , deps = Object.keys(app.dependencies || {})
    , nmdir = require.main.paths[0]
    , asms = []
    , dep, pkg;
  
  var i, len;
  for (i = 0, len = deps.length; i < len; ++i) {
    dep = deps[i];
    pkg = pkginfo.find(null, path.join(nmdir, dep));
    
    if (pkg.assembly) {
      asms.push({
        name: pkg.name,
        namespace: pkg.assembly.namespace,
        components: pkg.assembly.components
      });
    }
  }
  
  process.nextTick(function() {
    cb(null, asms);
  });
  return;
};
