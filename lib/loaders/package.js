var path = require('path');
var resolve = require('require-resolve')

module.exports = function(name, main) {
  return function(id) {
    var p = resolve(path.join(name, main || '.', id), require.main.filename)

    if (p != null) {
      module = require(p.src)
      module['@path'] = p.src
      return module
    }
  };
};
