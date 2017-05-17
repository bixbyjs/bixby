var path = require('path');

function loader(name, main) {
  
  return function(id) {
    var p = path.join(name, main || '.', id);
    
    try {
      return require.main.require(p);
    } catch (ex) {
      if (ex.code == 'MODULE_NOT_FOUND') { return; }
      throw ex;
    }
  }
}


module.exports = function(pkg) {
  var load;
  
  try {
    load = require.main.require(pkg.name);
  } catch(ex) {
    if (ex.code != 'MODULE_NOT_FOUND') {
      // An assembly distributed as a package consists of a suite of components
      // that are specifically designed to function in cooperation with each
      // other.  Because these objects are instantiated and injected by the IoC
      // container, it is typical for the package to not export a main module.
      // The package.json file contains the necessary assembly metadata needed
      // to locate components, so the exception is trapped and a default loader
      // will be supplied.
      throw ex;
    }
  }
  
  if (typeof load == 'object') {
    load = load.__load;
  }
  load = load || loader(pkg.name, pkg.main);
  
  
  return {
    load: load,
    components: pkg.assembly.components || []
  };
};
