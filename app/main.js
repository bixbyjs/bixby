exports = module.exports = function(__app__) {
  
  return function main() {
    console.log('BIXBY MAIN!');
  };
};

exports['@singleton'] = true;
exports['@require'] = [ 'app' ];
