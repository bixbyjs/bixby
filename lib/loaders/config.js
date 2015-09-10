/**
 * Module dependencies.
 */


module.exports = function(components) {


  function source(id) {
    var def = components[id];
    if (!def) { return; }
    
    if (def.module && def.ctor) {
      var mod = require(def.module);
      var constructor = mod[def.ctor];
      return constructor;
    }
    
    
    return;
  }
  
  source.used = function(container) {
    // Auto-register all configured specs, allowing for introspection.
    // Introspection is used, for example, when loading plugins such as Passport
    // strategies.
    var ids = Object.keys(components)
      , i, len;
    for (i = 0, len = ids.length; i < len; ++i) {
      container.register(ids[i]);
    }
  }
  
  return source;
}
