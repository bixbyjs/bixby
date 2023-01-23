exports = module.exports = function(candidate) {
  var env = process.env.NODE_ENV || 'production';
  
  var environment = candidate.a['@environment'];
  if (!environment) {
    return Promise.resolve(true);
  }
  
  if (env !== environment) {
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
};
