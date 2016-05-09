var github = require('octonode');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var Q = require('q');

var client = github.client('aa67f84d72bd5b641d166c9f810293f0494c06da');

var ghrepo = client.repo('golang/go');

function fetchPageCount(callback) {
  var deferred = Q.defer();
  var options = {
    uri: 'https://api.github.com/repos/golang/go/stargazers',
    headers: {
      'User-Agent': 'repo-stargazers'
    }
  };

  request(options, function (error, response) {
    var str = 'page=';
    var link = response.headers.link;
    var i = link.lastIndexOf(str);
    var text = '';
    for (var j = i + str.length; j < link.length; j++) {
      if (link.charAt(j) === '>') {
        break;
      }
      text += link.charAt(j);
    }
    deferred.resolve(text);
  }).on('error', function (error) {
    deferred.reject(error);
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

function fetchUserWithLocation(user, callback) {
  var deferred = Q.defer();
  var options = {
    uri: 'https://github.com/' + user.login
  };

  request(options, function (error, response, body) {
    var $ = cheerio.load(body);
    var location = $('li[itemprop=homeLocation]').attr('title');
    deferred.resolve(Object.assign(user, { location: location }));
  }).on('error', function (error) {
    deferred.reject(error);
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

function fetchStarGazers(task, callback) {
  ghrepo.stargazers(task.index, function (error, res) {
    if (error) {
      throw new Error(error);
    } else {
      res.map((user) => {
        fetchUserWithLocation(user)
          .then((userWithLocation) => {
            task.store(userWithLocation);
            callback();
          })
          .catch(function (error) {
            throw new Error(error);
          })
      });
    }
  });
}

exports.fetchPageCount = fetchPageCount;
exports.fetchUserWithLocation = fetchUserWithLocation;
exports.fetchStarGazers = fetchStarGazers;
