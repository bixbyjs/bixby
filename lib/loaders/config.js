/**
 * Module dependencies.
 */


module.exports = function(components) {


  function config(id) {
    var def = components[id];
    if (!def) { return; }
    
    if (def.module && def.ctor) {
      var mod = require(def.module);
      var constructor = mod[def.ctor];
      
      constructor['@require'] = def.require;
      constructor['@implements'] = def.implements;
      
      // TODO: If module itself has annotations, merge them wiht the
      //       config, favoring the config in case of duplicates
      
      // preserve annotations
      var keys = Object.keys(def)
        , i, len;
      for (i = 0, len = keys.length; i < len; ++i) {
        if (keys[i].indexOf('@') == 0) {
          constructor[keys[i]] = def[keys[i]];
        }
      }
      
      return constructor;
    }
    
    
    return;
  }
  
  config.used = function(container) {
    // Auto-register all configured specs, allowing for introspection.
    // Introspection is used, for example, when loading plugins such as Passport
    // strategies.
    var ids = Object.keys(components)
      , i, len;
    for (i = 0, len = ids.length; i < len; ++i) {
      container.register(ids[i]);
    }
  }
  
  return config;
}
