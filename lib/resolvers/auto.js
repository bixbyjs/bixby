var flatten = require('utils-flatten');


module.exports = function(container) {
  
  return function(iface, pid) {
    var specs = container.specs()
      , candidates = []
      , spec, impls
      , i, len;
    for (i = 0, len = specs.length; i < len; ++i) {
      spec = specs[i];
      impls = spec.implements || []
      if (impls.indexOf(iface) !== -1) {
        candidates.push(spec.id);
      }
    }
    
    if (candidates.length == 1) {
      return candidates[0];
    } else if (candidates.length > 1) {
      throw new Error('Multiple objects implement interface \"' + iface + '\" required by \"' + pid + '\". Configure one of: ' + candidates.join(', '));
    }
  };
}
