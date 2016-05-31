module.exports = function(map) {
  
  return function(iface, pid) {
    var search = [ '*' ]
      , ns, id, i, len;
    for (i = 0, len = search.length; i < len; ++i) {
      ns = map[search[i]];
      id = ns && ns[iface];
      if (id) { return id; }
    }
  };
}
