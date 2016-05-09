var uuid = require("uuid");
var db = require("../app").bucket;
var config = require("../config");
var N1qlQuery = require('couchbase').N1qlQuery;

function StarGazer() {}

StarGazer.save = function (data, callback) {
  var jsonObject = {
    login: data.login,
    avatar_url: data.avatar_url,
    gravatar_id: data.gravatar_id,
    url: data.url,
    html_url: data.html_url,
    followers_url: data.followers_url,
    following_url: data.following_url,
    gists_url: data.gists_url,
    starred_url: data.starred_url,
    subscriptions_url: data.subscriptions_url,
    organizations_url: data.organizations_url,
    repos_url: data.repos_url,
    events_url: data.events_url,
    received_events_url: data.received_events_url,
    type: data.type,
    site_admin: data.site_admin,
    location: data.location
  };
  var id = data.id ? data.id : uuid.v4();
  db.upsert(id.toString(), jsonObject, function (error, result) {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, { message: "success", data: result });
  });
};

StarGazer.getByLocation = function (location, callback) {
  var statement = "SELECT login, avatar_url, url, location " +
    "FROM `" + config.couchbase.bucket + "` AS users " +
    "WHERE META(users).location = $1";
  var query = N1qlQuery.fromString(statement);
  db.query(query, [location], function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};

StarGazer.getAll = function (callback) {
  var statement = "SELECT META(users).id, login, avatar_url, html_url, location " +
    "FROM `" + config.couchbase.bucket + "` AS users";
  var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  db.query(query, function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};

StarGazer.delete = function (id, callback) {
  db.remove(id, function (error, result) {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, { message: "success", data: result });
  });
};

StarGazer.getCount = function (callback) {
  var statement = "SELECT COUNT(users) FROM `" + config.couchbase.bucket + "` AS users";
  var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  db.query(query, function (error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};

module.exports = StarGazer;
