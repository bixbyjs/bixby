var path = require('path')
  , glob = require('glob')
  , fs = require('fs');

exports = module.exports = function findAssemblies(cb) {
  glob('**/package.json', {cwd: path.dirname(require.main.filename)}, function collectAssembles (err, deps) {
    var asms = [] 
      , pkg;

    var i, len;
    for (i = 0, len = deps.length; i < len; ++i) {
      pkg = JSON.parse(fs.readFileSync(deps[i]))
      if (pkg.assembly) {
        asms.push({
          name: pkg.name,
          main: pkg.main,
          assembly: pkg.assembly
        });
      }
    }
    cb(null, asms)
  })
  
  return;
};
