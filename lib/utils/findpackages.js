var fs = require('fs')
  , path = require('path');


exports = module.exports = function findPackages(cb) {
  
  var mdir = require.main.paths[0];
  fs.readdir(mdir, function(err, mods) {
    var pkgs = []
      , i = 0
      , mname, mdata;
    
    (function iter(err) {
      if (err) { return cb(err); }
      
      mname = mods[i++];
      if (!mname) {
        return cb(null, pkgs);
      }
      
      if (mname[0] == '.') { return iter(); }
      
      fs.readFile(path.join(mdir, mname, 'package.json'), 'utf8', function(err, data) {
        if (err && err.code == 'ENOENT') {
          return iter();
        } else if (err) {
          return iter(err);
        }
        
        mdata = JSON.parse(data);
        if (mdata.jsox) {
          // This package provides JavaScript Object Interconnect components.
          pkgs.push({
            name: mname,
            namespace: mdata.jsox.namespace,
            components: mdata.jsox.components
          });
        }
        
        iter();
      });
    })();
  });
  
};
