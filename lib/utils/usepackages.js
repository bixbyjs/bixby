var fs = require('fs')
  , path = require('path');


exports = module.exports = function usePackages(oe, pkgs, cb) {
  var pkg, i, len;
  for (i = 0, len = pkgs.length; i < len; ++i) {
    pkg = pkgs[i];
    oe.use(pkg.namespace, require.main.require(pkg.name));
  }
  
  process.nextTick(cb);
};
