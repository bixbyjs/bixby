var flatten = require('utils-flatten');


module.exports = function(container) {
  
  return function(iface, pid) {
    var candidates = [];
    container.iterateOverSources(function(source, prefix) {
      var id;
      if (source.resolve) {
        id = source.resolve(iface);
        if (id) { candidates.push(prefix + id); }
      }
    });
    flatten(candidates);
    
    if (candidates.length == 1) {
      return candidates[0];
    } else if (candidates.length > 1) {
      throw new Error('Multiple components implement interface \"' + iface + '\" required by \"' + pid + '\". Configure one of: ' + candidates.join(', '));
    }
  };
}
