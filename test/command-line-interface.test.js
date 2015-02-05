/* jshint mocha: true */
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var fixtures = require('./fixtures/index.json');

var CLI = './source/index.js ';

describe('command line interface', function() {
  Object.keys(fixtures).forEach(function(name) {
    var fixture = fixtures[name];
    var dir = fs.realpathSync(
      path.join(__dirname, 'fixtures', fixture.path)
    );
    var message = fixture.errors.length > 0 ?
      'produces expected errors' :
      'succeeds without error';
    var flag = fixture.checkModule ? '--check-module ' : ' ';
    describe(name, function() {
      it(message, function(done) {
        exec(CLI + flag + dir, function(error, stdout, stderr) {
          if (fixture.code !== 0) {
            expect(error.code)
              .to.equal(fixture.code);
          }
          expect(stderr.toString())
            .to.eql(
              fixture.errors.length > 0 ?
                fixture.errors.join('\n') + '\n' : ''
            );
          done();
        });
      });
    });
  });

  ['-h', '--help'].forEach(function(flag) {
    describe(flag + ' flag', function() {
      it('shows usage', function(done) {
        exec(CLI + flag, function(error, stdout) {
          expect(stdout.toString())
            .to.equal(
              fs.readFileSync(
                path.join(__dirname, '..', 'source', 'usage.txt')
              ).toString() + '\n'
            );
          done();
        });
      });
    });
  });

  describe('--version flag', function() {
    var packageJSON = require('../package.json');
    var version = packageJSON.name + ' version ' + packageJSON.version;

    it('shows the module version', function(done) {
      exec(CLI + '--version', function(error, stdout) {
        expect(stdout.toString())
          .to.equal(version + '\n');
        done();
      });
    });
  });
});
