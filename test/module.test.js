/* jshint mocha: true */
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var errorsIn = require('..');
var fixtures = require('./fixtures/index.json');

describe('module interface', function() {
  Object.keys(fixtures).forEach(function(name) {
    var fixture = fixtures[name];
    var dir = fs.realpathSync(
      path.join(__dirname, 'fixtures', fixture.path)
    );
    describe(name, function() {
      var message = fixture.errors.length > 0 ?
        'produces expected errors' :
        'succeeds without error';
      it(message, function() {
        expect(errorsIn(dir, fixture.checkModule))
          .to.eql(fixture.errors);
      });
    });
  });
});
