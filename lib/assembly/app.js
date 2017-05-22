var path = require('path');
var fs = require('recur-fs');
var loader = require('electrolyte').dir;


module.exports = function(options) {
  if ('string' == typeof options) {
    options = { dirname: options }
  }
  options = options || {};
  var dirname = options.dirname || path.join(path.dirname(require.main.filename), 'app')
    , exts = options.extensions
    , comps = []
    , files, ext;
  
  if (!exts) {
    exts = Object.keys(require.extensions).map(function(ext) { return ext; });
  } else if ('string' == typeof exts) {
    exts = [ exts ];
  }
  
  var files = fs.readdir.sync(dirname, function(file, stat) {
    ext = path.extname(file);
    if (stat.isFile() && exts.indexOf(ext) != -1) {
      comps.push(path.relative(dirname, file).slice(0, 0 - ext.length));
    }
  });
  
  return {
    components: comps,
    load: loader(options)
  };
};
