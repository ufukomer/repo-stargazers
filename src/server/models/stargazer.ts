const uuid = require('uuid');
import { N1qlQuery } from 'couchbase';
const config = require('./../../config');
const db = require('../database/').bucket;

/**
 * StarGazer Interface.
 * 
 * @interface IStarGazer
 */
interface IStarGazer {
  save(data: Object, callback?: ICallback);
  getByLocation(location: string, callback?: ICallback);
  getAll(callback?: ICallback);
  delete(id: number, callback?: ICallback);
  getCount(callback?: ICallback);
}

/**
 * Data interface.
 * 
 * @interface IJsonObject
 */
interface IJsonObject {
  login: string;
  avatar_url?: string;
  gravatar_id?: string;
  url: string;
  html_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
  organizations_url?: string;
  repos_url?: string;
  events_url?: string;
  received_events_url?: string;
  type?: string;
  site_admin?: boolean;
  location?: string;
}

/**
 * Callback Interface.
 * 
 * @interface ICallback
 */
interface ICallback {
  (error?: any, result?: Object): any;
}

/**
 * StarGazer model class.
 * 
 * @class StarGazer
 */
class StarGazer implements IStarGazer {

  /**
   * Saves user to the database.
   *
   * @param data
   * @param callback
   */
  save(data: any, callback?: ICallback): void {
    const jsonObject: IJsonObject = {
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
    const id: number = data.id ? data.id : uuid.v4();
    db.upsert(id.toString(), jsonObject, (error: any, result: Object) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, { message: 'success', data: result });
    });
  }

  /**
   * Gets some of the user information by location.
   *
   * @param location
   * @param callback
     */
  getByLocation(location: string, callback?: ICallback): void {
    const statement = `SELECT login, avatar_url, url, location FROM ${config.couchbase.bucket} AS users WHERE META(users).location = $1`;
    const query = N1qlQuery.fromString(statement);
    db.query(query, [location], (error: any, result:  Object) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, result);
    });
  };

  /**
   * Gets all users.
   *
   * @param callback
   */
  getAll(callback?: ICallback): void {
    const statement = `SELECT META(users).id, login, avatar_url, html_url, location FROM ${config.couchbase.bucket} AS users`;
    const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, (error: any, result: Object) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, result);
    });
  };

  /**
   * Deletes user with given id.
   *
   * @param id
   * @param callback
   */
  delete(id: number, callback?: ICallback) {
    db.remove(id, (error: any, result: Object) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, { message: 'success', data: result });
    });
  };

  /**
   * Gets count of the stargazers table.
   *
   * @param callback
   */
  getCount(callback?: ICallback) {
    const statement = `SELECT COUNT(users) FROM ${config.couchbase.bucket} AS users`;
    const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, (error: any, result: Object) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, result);
    });
  };
}

export default new StarGazer();
