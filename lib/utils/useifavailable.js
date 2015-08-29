module.exports = function useIfAvailable(packages, prefix, container) {
  if (!Array.isArray(packages)) {
    packages = [ packages ];
  }
  if (typeof prefix !== 'string') {
    container = prefix;
    prefix = '';
  }
  
  var bundle
    , i, len;
  for (i = 0, len = packages.length; i < len; ++i) {
    try {
      bundle = require(packages[i]);
      container.use(prefix, bundle);
    } catch (ex) {
      continue;
    }
  }
}