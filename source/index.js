#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var forEachCombination = require('foreach-combination');

var FILES = ['bower.json', 'component.json', 'package.json'];

var errorsIn = function(root, checkModule) {
  var errors = [];

  // Read version properties from known metadata JSON files.
  var versions = FILES.reduce(function(versions, file) {
    var joinedPath = path.join(root, file);
    if (fs.existsSync(joinedPath)) {
      try {
        var json = require(joinedPath);
        if (json.hasOwnProperty('version')) {
          versions.push([file, json.version]);
        } else {
          errors.push(file + ' does not have a .version property.');
        }
      } catch (e) {
        errors.push(file + ' is not valid JSON.');
      }
    }
    return versions;
  }, []);

  // Read the version property from the node module, if requested.
  if (checkModule) {
    try {
      var nodeModule = require(root);
      if (nodeModule.hasOwnProperty('version')) {
        versions.unshift(['The module', nodeModule.version]);
      } else {
        errors.push('The module does not have a .version property.');
      }
    } catch (e) {
      errors.push('Could not require() the module.');
    }
  }

  // Compare version properties.
  if (versions.length === 0) {
    errors.push('No valid package metadata files found.');
  } else {
    forEachCombination(versions, 2, function(x, y) {
      if (x[1] !== y[1]) {
        errors.push(
          x[0] + '\'s version (' + x[1] + ') ' +
          'does not match ' +
          y[0] + '\'s (' + y[1] + ').'
        );
      }
    });
  }

  return errors;
};

/* istanbul ignore else */

// Module Interface
if (module.parent) {
  module.exports = errorsIn;

// Command-Line Interface
} else {
  var usage = fs.readFileSync(
    path.join(__dirname, 'usage.txt')
  ).toString();
  var packageJSON = require('../package.json');
  var options = require('docopt').docopt(usage, {
    help: true,
    version: packageJSON.name + ' version ' + packageJSON.version
  });
  var root = options.PACKAGE_ROOT || process.cwd();
  var results = errorsIn(
    fs.realpathSync(root),
    options['--check-module']
  );
  if (results.length === 0) {
    process.exit(0);
  } else {
    results.forEach(function(error) {
      process.stderr.write(error + '\n');
    });
    process.exit(1);
  }
}
