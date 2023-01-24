exports = module.exports = function(components) {
  
  return components.sort(function(a, b) {
    var apr = a.a['@prerequisite'] || [];
    var bpr = b.a['@prerequisite'] || [];
    if (!Array.isArray(apr)) {
      apr = [ apr ]
    }
    if (!Array.isArray(bpr)) {
      bpr = [ bpr ]
    }
    
    
    if (bpr.indexOf(a.id) !== -1) {
      // component a is a prerequisite of component b, so component a will be
      // sorted before component b
      return -1;
    }
    if (apr.indexOf(b.id) !== -1) {
      // component b is a prerequisite of component a, so component a will be
      // sorted after component b
      return 1;
    }
    // neither component a or component b is a prerequisite of the other, keep
    // original order
    return 0;
  });
};
