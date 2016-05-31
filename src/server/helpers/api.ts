import * as request from 'request';
const cheerio = require('cheerio');
const github = require('octonode');
import * as Q from 'q';

const client = github.client('aa67f84d72bd5b641d166c9f810293f0494c06da');

const ghrepo = client.repo('golang/go');

export function fetchPageCount(callback?: any) {
  const deferred = Q.defer();
  const options = {
    uri: 'https://api.github.com/repos/golang/go/stargazers',
    headers: {
      'User-Agent': 'repo-stargazers'
    }
  };

  request(options, (error?: any, response?: any) => {
    const str = 'page=';
    const link = response.headers.link;
    const i = link.lastIndexOf(str);
    let text = '';
    for (let j = i + str.length; j < link.length; j++) {
      if (link.charAt(j) === '>') {
        break;
      }
      text += link.charAt(j);
    }
    deferred.resolve(text);
  }).on('error', (error) => {
    deferred.reject(error);
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

export function fetchUserWithLocation(user: any, callback?) {
  const deferred = Q.defer();
  const options = {
    uri: 'https://github.com/' + user.login
  };

  request(options, (error?: any, response?: any, body?: any) => {
    const $: Function = cheerio.load(body);
    const location = $('li[itemprop=homeLocation]').attr('title');
    deferred.resolve((<any>Object).assign(user, { location: location }));
  }).on('error', (error) => {
    deferred.reject(error);
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

export function fetchStarGazers(task?: any, callback?) {
  ghrepo.stargazers(task.index, (error?: any, res?: any) => {
    if (error) {
      throw new Error(error);
    } else {
      res.map((user) => {
        fetchUserWithLocation(user)
          .then((userWithLocation) => {
            task.store(userWithLocation);
            callback();
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
    }
  });
}
