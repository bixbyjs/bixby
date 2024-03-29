var flatten = require('utils-flatten');


/**
 * Automatic interface resolver.
 *
 * Automatically resolves an interface to an object that implements that
 * interface.  Automatic resolution reduces the amount of configuration that
 * must be specified.
 *
 * For consistency and saftey in the development cycle, such resolution succeeds
 * if and only if there is one object within the container that implements the
 * interface.  If multiple objects implement the interface, automatic resolution
 * would be ambiguous, and is therefore not performed.  In such cases, the exact
 * object to resolve can be explicitly declared in configuration.
 *
 * @return {function}
 * @protected
 */
module.exports = function(container) {
  
  return function(iface, pid) {
    var components = container.components()
      , candidates = []
      , component, i, len;
    
    for (i = 0, len = components.length; i < len; ++i) {
      component = components[i];
      if (component.implements.indexOf(iface) !== -1) {
        //candidates.push(component.id);
        candidates.push(component);
      }
    }
    
    if (candidates.length == 0) {
      return;
    }
    if (candidates.length == 1) {
      return candidates[0];
    }
    return candidates;
    
    if (candidates.length == 1) {
      return candidates[0];
    } else if (candidates.length > 1) {
      // TODO: Make this error string to candidate ids
      throw new Error("Multiple components provide interface '" + iface + "' required by '" + (pid || 'unknown') + "'. Configure one of: " + candidates.map(function(c) { return c.id }).join(', '));
    }
  };
}
