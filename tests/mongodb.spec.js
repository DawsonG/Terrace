describe("MongoDB", function() {
  var settings = null;
  beforeEach(function() {
    settings = require('../settings.json');
  });

  it("settings.json has a DATABASE_URL parameter defined", function(next) {
    expect(settings.DATABASE_URL).toBeDefined();
    next();
  });

  it("a mongo server is available", function(next) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(settings.DATABASE_URL, function(err, db) {
          expect(err).toBe(null);
          next();
      });
  });
});