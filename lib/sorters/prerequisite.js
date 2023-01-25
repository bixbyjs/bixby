exports = module.exports = function(components) {
  var map = {}
    , c, i, len;
  for (i = 0, len = components.length; i < len; ++i) {
    c = components[i];
    map[c.id] = c;
  }
  
  return components.sort(function(a, b) {
    if (isPrerequisite(a, b, map)) {
      // component a is a prerequisite of component b, so component a will be
      // sorted before component b
      return -1;
    }
    if (isPrerequisite(b, a, map)) {
      // component b is a prerequisite of component a, so component a will be
      // sorted after component b
      return 1;
    }
    // neither component a nor component b is a prerequisite of the other, keep
    // original order
    return 0;
  });
};


function isPrerequisite(a, b, map) {
  var pr = b.a['@prerequisite'] || []
    , i, len, rv;
  if (!Array.isArray(pr)) {
    pr = [ pr ]
  }
  
  if (pr.indexOf(a.id) !== -1) {
    // component a is a prerequisite of component b
    return true;
  }
  // transitively check if component a is a prerequisite of component b's
  // prerequisites
  for (i = 0, len = pr.length; i < len; ++i) {
    if (isPrerequisite(a, map[pr[i]], map)) {
      return true;
    }
  }
  return false;
}
