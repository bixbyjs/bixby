var path = require('path');

module.exports = function(name, main) {
  
  return function(id) {
    var p = path.join(name, main || '.', id);
    
    try {
      return require.main.require(p);
    } catch (ex) {
      if (ex.code == 'MODULE_NOT_FOUND') { return; }
      throw ex;
    }
  };
};
