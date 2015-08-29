module.exports = function useIfAvailable(names, prefix, container) {
  if (!Array.isArray(names)) {
    names = [ names ];
  }
  if (typeof prefix !== 'string') {
    container = prefix;
    prefix = '';
  }
  
  var bundle
    , i, len;
  for (i = 0, len = names.length; i < len; ++i) {
    try {
      bundle = require(names[i]);
      container.use(prefix, bundle);
    } catch (ex) {
      continue;
    }
  }
}