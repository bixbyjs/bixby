var path = require('path');
var flatten = require('utils-flatten');
var readPkg = require('read-pkg-up');
var resolve = require('require-resolve');
var pkgDir = require('pkg-dir');

/**
 * Automatic interface resolver.
 *
 * Automatically resolves an interface to an object that implements that
 * interface.  Automatic resolution reduces the amount of configuration that
 * must be specified.
 *
 * For consistency and saftey in the development cycle, such resolution succeeds
 * if and only if there is one object within the container that implements the
 * interface.  If multiple objects implement the interface, automatic resolution
 * is solved by selecting the least deep module. If two happen to be exactly 
 * identical in score, then the ambiguity will raise an error.
 *
 * @return {function}
 * @protected
 */

module.exports = function(container) {
  return function(iface, pid) {
    var specs = container.components()
      , candidates = []
      , spec, i, len;

    for (i = 0, len = specs.length; i < len; ++i) {
      spec = specs[i];
      if (spec.implements.indexOf(iface) !== -1) {
        candidates.push({
          id: spec.id, 
          moduleDepth: moduleDepth(spec.a['@path']), 
          pathDepth: pathDepth(spec.a['@path'])
        });
      }
    }

    candidates = candidates.sort(scoreCandidates);

    if ( candidates.length > 1 && equalCandidates(candidates[0], candidates[1]) ) {
      throw new Error('Multiple same rank objects implement interface \"' + iface + '\" required by \"' + (pid || 'unknown') + '\". Configure or remove one of: ' + candidates.map((ea)=>ea.id).join(', '));
    } else {
      return candidates[0].id;
    }
  };
}

/**
 * moduleDepth
 *
 * Version of npm after 2, node_modules
 * are no longer nested. This function
 * calculates the depth of a given 
 * dependency to compensate for the 
 * loss of information in the fs.
 *
 * It recurses up the _requiredBy field
 * provided by npm@3 and above
 *
 * @return {number}
 */
function moduleDepth (fPath) {
  var finalDepth = 0;

  if (fPath.match('node_modules') == -1) {
    return finalDepth;
  }

  function recurse (dir, depth) {
    //TODO: Remove sync
    var packageDir = pkgDir.sync(resolve(dir).src)
      , package = readPkg.sync({cwd: packageDir}).pkg;

    if (!package._requiredBy) {
      return false;
    } else if (package._requiredBy.indexOf('#USER') !== -1) {
      finalDepth = depth;
      return true;
    }
    package._requiredBy.map((package)=>recurse(package, depth+1));

  }

  recurse(fPath, 1)
  return finalDepth
}

function pathDepth (fPath) {
  return fPath.split(path.sep).length - require.main.filename.split(path.sep).length;
}

function scoreCandidates(a,b) {
  if (a.moduleDepth > b.moduleDepth) {
    return 1;
  } else if (a.moduleDepth < b.moduleDepth) {
    return -1;
  }
  return a.pathDepth - b.pathDepth;
}

function equalCandidates (a,b) {
  return a.pathDepth === b.pathDepth
    && a.moduleDepth === b.moduleDepth;
}

