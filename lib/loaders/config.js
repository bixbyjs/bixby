/**
 * Module dependencies.
 */


module.exports = function(components) {


  return function(id) {
    var def = components[id];
    if (!def) { return; }
    
    if (def.package && def.class) {
      var mod = require(def.package);
      var constructor = mod[def.class];
      return constructor;
    }
    
    
    return;
  }
}
